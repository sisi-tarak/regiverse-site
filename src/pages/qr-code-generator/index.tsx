import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MobileMenu from '../../components/ui/MobileMenu';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingBar from '../../components/ui/LoadingBar';
import Icon from '../../components/AppIcon';

import GenerationOptions from './components/GenerationOptions';
import ProgressTracker from './components/ProgressTracker';
import QRCodePreview from './components/QRCodePreview';
import ParticipantSelector from './components/ParticipantSelector';
import TemplateSelector from './components/TemplateSelector';
import BatchHistory from './components/BatchHistory';
import {
  Participant,
  QRCodeTemplate,
  GenerationOptions as GenerationOptionsType,
  GenerationProgress,
  GeneratedQRCode,
  BatchOperation
} from './types';

const QRCodeGenerator = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('template-1');
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedQRCode[]>([]);
  const [progress, setProgress] = useState<GenerationProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    percentage: 0,
    status: 'idle',
    estimatedTimeRemaining: 0
  });

  const mockParticipants: Participant[] = [
    {
      id: 'P001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      company: 'TechCorp Solutions',
      registrationDate: '2024-01-15',
      status: 'pending'
    },
    {
      id: 'P002',
      name: 'Michael Chen',
      email: 'michael.chen@innovate.io',
      company: 'Innovate Labs',
      registrationDate: '2024-01-16',
      status: 'attended'
    },
    {
      id: 'P003',
      name: 'Emily Rodriguez',
      email: 'emily.r@digitalwave.com',
      company: 'Digital Wave Inc',
      registrationDate: '2024-01-17',
      status: 'pending'
    },
    {
      id: 'P004',
      name: 'James Wilson',
      email: 'j.wilson@cloudtech.net',
      company: 'CloudTech Systems',
      registrationDate: '2024-01-18',
      status: 'absent'
    },
    {
      id: 'P005',
      name: 'Priya Patel',
      email: 'priya.patel@nexusgroup.com',
      company: 'Nexus Group',
      registrationDate: '2024-01-19',
      status: 'pending'
    },
    {
      id: 'P006',
      name: 'David Kim',
      email: 'david.kim@futuresoft.io',
      company: 'FutureSoft Technologies',
      registrationDate: '2024-01-20',
      status: 'attended'
    },
    {
      id: 'P007',
      name: 'Lisa Anderson',
      email: 'lisa.a@quantumdata.com',
      company: 'Quantum Data Corp',
      registrationDate: '2024-01-21',
      status: 'pending'
    },
    {
      id: 'P008',
      name: 'Robert Martinez',
      email: 'r.martinez@alphaventures.com',
      company: 'Alpha Ventures',
      registrationDate: '2024-01-22',
      status: 'pending'
    }
  ];

  const mockTemplates: QRCodeTemplate[] = [
    {
      id: 'template-1',
      name: 'Standard QR Code',
      description: 'Simple QR code with participant information below',
      layout: 'standard',
      includePhoto: false,
      includeLogo: true
    },
    {
      id: 'template-2',
      name: 'Event Badge',
      description: 'Professional badge layout with photo and QR code',
      layout: 'badge',
      includePhoto: true,
      includeLogo: true
    },
    {
      id: 'template-3',
      name: 'Entry Ticket',
      description: 'Ticket-style design with QR code and event details',
      layout: 'ticket',
      includePhoto: false,
      includeLogo: true
    }
  ];

  const mockBatches: BatchOperation[] = [
    {
      id: 'BATCH001',
      timestamp: '2024-01-23T10:30:00',
      totalCodes: 150,
      status: 'completed',
      downloadUrl: 'https://example.com/batch001.zip'
    },
    {
      id: 'BATCH002',
      timestamp: '2024-01-22T15:45:00',
      totalCodes: 200,
      status: 'completed',
      downloadUrl: 'https://example.com/batch002.zip'
    },
    {
      id: 'BATCH003',
      timestamp: '2024-01-21T09:15:00',
      totalCodes: 75,
      status: 'completed',
      downloadUrl: 'https://example.com/batch003.zip'
    }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const handleGenerate = (options: GenerationOptionsType) => {
    if (selectedParticipants.length === 0) {
      alert('Please select at least one participant to generate QR codes.');
      return;
    }

    setIsLoading(true);
    setProgress({
      total: selectedParticipants.length,
      completed: 0,
      failed: 0,
      percentage: 0,
      status: 'generating',
      estimatedTimeRemaining: selectedParticipants.length * 2
    });

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newCompleted = Math.min(prev.completed + 1, prev.total);
        const newPercentage = Math.round((newCompleted / prev.total) * 100);
        const newEstimatedTime = Math.max(0, (prev.total - newCompleted) * 2);

        if (newCompleted === prev.total) {
          clearInterval(interval);
          setIsLoading(false);

          const codes: GeneratedQRCode[] = selectedParticipants.map((participantId) => {
            const participant = mockParticipants.find((p) => p.id === participantId);
            return {
              participantId,
              participantName: participant?.name || 'Unknown',
              qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=${options.size}x${options.size}&data=${participantId}`,
              timestamp: new Date().toISOString(),
              format: options.format
            };
          });

          setGeneratedCodes(codes);

          return {
            ...prev,
            completed: newCompleted,
            percentage: newPercentage,
            status: 'completed',
            estimatedTimeRemaining: 0
          };
        }

        return {
          ...prev,
          completed: newCompleted,
          percentage: newPercentage,
          estimatedTimeRemaining: newEstimatedTime
        };
      });
    }, 500);
  };

  const handleDownloadSingle = (code: GeneratedQRCode) => {
    const link = document.createElement('a');
    link.href = code.qrCodeUrl;
    link.download = `qr-code-${code.participantId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    generatedCodes.forEach((code, index) => {
      setTimeout(() => {
        handleDownloadSingle(code);
      }, index * 100);
    });
  };

  const handleDownloadBatch = (batchId: string) => {
    const batch = mockBatches.find((b) => b.id === batchId);
    if (batch?.downloadUrl) {
      window.open(batch.downloadUrl, '_blank');
    }
  };

  useEffect(() => {
    document.title = 'QR Code Generator - Regiverse';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(true)}
        userName="Admin User"
        userRole="Event Manager"
        onLogout={handleLogout}
      />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <LoadingBar isLoading={isLoading} />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Breadcrumb />
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon name="QrCode" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">QR Code Generator</h1>
                <p className="text-muted-foreground">
                  Generate and manage QR codes for event participants
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 space-y-6">
              <ParticipantSelector
                participants={mockParticipants}
                selectedParticipants={selectedParticipants}
                onSelectionChange={setSelectedParticipants}
              />

              <TemplateSelector
                templates={mockTemplates}
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />

              <GenerationOptions
                templates={mockTemplates}
                onGenerate={handleGenerate}
                isGenerating={isLoading}
              />

              {progress.status !== 'idle' && <ProgressTracker progress={progress} />}

              {generatedCodes.length > 0 && (
                <QRCodePreview
                  codes={generatedCodes}
                  onDownloadSingle={handleDownloadSingle}
                  onDownloadAll={handleDownloadAll}
                />
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="Info" size={20} className="text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Quick Guide</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Select Participants</p>
                      <p className="text-xs text-muted-foreground">
                        Choose participants for QR code generation
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Choose Template</p>
                      <p className="text-xs text-muted-foreground">
                        Select a design template for your codes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Configure Options</p>
                      <p className="text-xs text-muted-foreground">
                        Set format, size, and batch preferences
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">4</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Generate & Download</p>
                      <p className="text-xs text-muted-foreground">
                        Create codes and download in your preferred format
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Icon name="Sparkles" size={20} className="text-success" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Features</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Icon name="Check" size={16} className="text-success" />
                    <span>Multiple export formats (PNG, PDF, ZIP)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Icon name="Check" size={16} className="text-success" />
                    <span>Customizable QR code sizes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Icon name="Check" size={16} className="text-success" />
                    <span>Professional badge templates</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Icon name="Check" size={16} className="text-success" />
                    <span>Batch processing with progress tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Icon name="Check" size={16} className="text-success" />
                    <span>Individual and bulk downloads</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Icon name="Check" size={16} className="text-success" />
                    <span>Print-ready badge generation</span>
                  </div>
                </div>
              </div>

              <BatchHistory batches={mockBatches} onDownload={handleDownloadBatch} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QRCodeGenerator;