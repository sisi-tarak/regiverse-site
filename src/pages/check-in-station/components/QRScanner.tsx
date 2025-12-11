import { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import type { ScannerState } from '../types';

interface QRScannerProps {
  onScan: (qrCode: string) => void;
  isProcessing: boolean;
}

const QRScanner = ({ onScan, isProcessing }: QRScannerProps) => {
  const [scannerState, setScannerState] = useState<ScannerState>({
    isScanning: false,
    hasPermission: false,
    error: null
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      setScannerState({
        isScanning: true,
        hasPermission: true,
        error: null
      });
    } catch (error) {
      setScannerState({
        isScanning: false,
        hasPermission: false,
        error: 'Camera access denied. Please enable camera permissions to scan QR codes.'
      });
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setScannerState({
      isScanning: false,
      hasPermission: scannerState.hasPermission,
      error: null
    });
  };

  const simulateScan = () => {
    const mockQRCodes = ['REG-2024-001', 'REG-2024-002', 'REG-2024-003'];
    const randomCode = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
    onScan(randomCode);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="ScanLine" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">QR Code Scanner</h2>
            <p className="text-sm text-muted-foreground">Scan participant QR codes for check-in</p>
          </div>
        </div>
        {scannerState.isScanning && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-success">Scanning Active</span>
          </div>
        )}
      </div>

      <div className="relative bg-muted rounded-lg overflow-hidden" style={{ height: '400px' }}>
        {!scannerState.isScanning ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            {scannerState.error ? (
              <>
                <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
                  <Icon name="AlertCircle" size={32} className="text-error" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Camera Access Required</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">{scannerState.error}</p>
                <Button variant="default" onClick={startScanning} iconName="Camera">
                  Try Again
                </Button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon name="QrCode" size={40} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Scan</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                  Click the button below to activate the camera and start scanning participant QR codes
                </p>
                <Button variant="default" onClick={startScanning} iconName="Camera" size="lg">
                  Start Scanning
                </Button>
              </>
            )}
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 border-2 border-primary rounded-lg" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-primary/50 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full">
              <p className="text-sm font-medium text-foreground">Position QR code within frame</p>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 mt-6">
        {scannerState.isScanning ? (
          <>
            <Button
              variant="outline"
              onClick={stopScanning}
              iconName="Square"
              fullWidth
              disabled={isProcessing}
            >
              Stop Scanning
            </Button>
            <Button
              variant="default"
              onClick={simulateScan}
              iconName="Scan"
              fullWidth
              disabled={isProcessing}
              loading={isProcessing}
            >
              Simulate Scan
            </Button>
          </>
        ) : (
          <Button
            variant="default"
            onClick={startScanning}
            iconName="Camera"
            fullWidth
            disabled={isProcessing}
          >
            Start Camera
          </Button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;