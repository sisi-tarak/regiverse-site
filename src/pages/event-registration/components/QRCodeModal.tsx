import React, { useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { QRCodeModalProps } from '../types';

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, registrationData }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !registrationData) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = registrationData.qrCode;
    link.download = `qr-code-${registrationData.registrationId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEmailQR = () => {
    alert(`QR code will be sent to your registered email address`);
  };

  const handleAddToCalendar = () => {
    alert(`Event added to your calendar`);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-foreground/50 z-[2000] animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-success" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Registration Successful!</h2>
                <p className="text-sm text-muted-foreground">ID: {registrationData.registrationId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="min-w-touch min-h-touch flex items-center justify-center -mr-2 text-muted-foreground hover:text-foreground transition-colors duration-150"
              aria-label="Close modal"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-foreground">
                Welcome, <span className="font-semibold">{registrationData.participantName}</span>!
              </p>
              <p className="text-sm text-muted-foreground">
                You're registered for {registrationData.eventTitle}
              </p>
            </div>

            <div className="flex justify-center" ref={qrCodeRef}>
              <div className="p-6 bg-white rounded-lg border-2 border-border">
                <img
                  src={registrationData.qrCode}
                  alt={`QR code for ${registrationData.participantName} registration to ${registrationData.eventTitle}`}
                  className="w-64 h-64"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="default"
                size="lg"
                fullWidth
                iconName="Download"
                iconPosition="left"
                onClick={handleDownload}
              >
                Download QR Code
              </Button>

              <Button
                variant="outline"
                size="lg"
                fullWidth
                iconName="Mail"
                iconPosition="left"
                onClick={handleEmailQR}
              >
                Email QR Code
              </Button>

              <Button
                variant="outline"
                size="lg"
                fullWidth
                iconName="Calendar"
                iconPosition="left"
                onClick={handleAddToCalendar}
              >
                Add to Calendar
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-primary mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Next Steps:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Save or print your QR code</li>
                    <li>Bring it to the event for quick check-in</li>
                    <li>Check your email for confirmation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-success/10 border border-success rounded-lg">
              <Icon name="Shield" size={18} className="text-success" />
              <p className="text-sm text-success">
                Your registration is confirmed and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QRCodeModal;