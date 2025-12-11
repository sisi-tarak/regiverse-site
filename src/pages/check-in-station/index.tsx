import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MobileMenu from '../../components/ui/MobileMenu';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingBar from '../../components/ui/LoadingBar';
import Icon from '../../components/AppIcon';
import QRScanner from './components/QRScanner';
import ManualEntry from './components/ManualEntry';
import CheckInStats from './components/CheckInStats';
import RecentCheckIns from './components/RecentCheckIns';
import CheckInConfirmation from './components/CheckInConfirmation';
import type { Participant, CheckInResult, CheckInStats as StatsType, RecentCheckIn } from './types';

const CheckInStation = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'scanner' | 'manual'>('scanner');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(null);

  const [participants, setParticipants] = useState<Participant[]>([
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    company: 'TechCorp Solutions',
    registrationId: 'REG-2024-001',
    status: 'pending',
    qrCode: 'REG-2024-001',
    photo: "https://img.rocket.new/generatedImages/rocket_gen_img_10df5a971-1765003957966.png",
    photoAlt: 'Professional woman with brown hair wearing blue blazer smiling at camera'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@innovate.io',
    company: 'Innovate Labs',
    registrationId: 'REG-2024-002',
    status: 'pending',
    qrCode: 'REG-2024-002',
    photo: "https://img.rocket.new/generatedImages/rocket_gen_img_117a166f1-1765307672463.png",
    photoAlt: 'Asian man with glasses wearing gray suit in office setting'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@datastream.com',
    company: 'DataStream Inc',
    registrationId: 'REG-2024-003',
    status: 'attended',
    checkInTime: new Date(Date.now() - 1800000),
    qrCode: 'REG-2024-003',
    photo: "https://img.rocket.new/generatedImages/rocket_gen_img_11f73fd9f-1763294414259.png",
    photoAlt: 'Hispanic woman with long dark hair wearing white blouse smiling'
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david.park@cloudtech.com',
    company: 'CloudTech Systems',
    registrationId: 'REG-2024-004',
    status: 'pending',
    qrCode: 'REG-2024-004'
  },
  {
    id: '5',
    name: 'Jessica Williams',
    email: 'j.williams@nexus.com',
    company: 'Nexus Digital',
    registrationId: 'REG-2024-005',
    status: 'attended',
    checkInTime: new Date(Date.now() - 3600000),
    qrCode: 'REG-2024-005',
    photo: "https://images.unsplash.com/photo-1660078445215-de85e9fc73f2",
    photoAlt: 'Young woman with blonde hair wearing red dress in professional setting'
  }]
  );

  const [recentCheckIns, setRecentCheckIns] = useState<RecentCheckIn[]>([
  {
    id: 'ci-1',
    participantId: '3',
    participantName: 'Emily Rodriguez',
    timestamp: new Date(Date.now() - 1800000),
    canUndo: true
  },
  {
    id: 'ci-2',
    participantId: '5',
    participantName: 'Jessica Williams',
    timestamp: new Date(Date.now() - 3600000),
    canUndo: false
  }]
  );

  const stats: StatsType = {
    totalRegistered: participants.length,
    checkedIn: participants.filter((p) => p.status === 'attended').length,
    pending: participants.filter((p) => p.status === 'pending').length,
    capacity: 500
  };

  const handleScan = (qrCode: string) => {
    setIsProcessing(true);

    setTimeout(() => {
      const participant = participants.find((p) => p.qrCode === qrCode);

      if (!participant) {
        setCheckInResult({
          success: false,
          message: 'Invalid QR code. Participant not found in the system.',
          timestamp: new Date()
        });
        setIsProcessing(false);
        return;
      }

      if (participant.status === 'attended') {
        setCheckInResult({
          success: false,
          message: `${participant.name} has already been checked in at ${new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }).format(participant.checkInTime!)}.`,
          timestamp: new Date()
        });
        setIsProcessing(false);
        return;
      }

      const updatedParticipant = {
        ...participant,
        status: 'attended' as const,
        checkInTime: new Date()
      };

      setParticipants((prev) =>
      prev.map((p) => p.id === participant.id ? updatedParticipant : p)
      );

      const newCheckIn: RecentCheckIn = {
        id: `ci-${Date.now()}`,
        participantId: participant.id,
        participantName: participant.name,
        timestamp: new Date(),
        canUndo: true
      };

      setRecentCheckIns((prev) => [newCheckIn, ...prev.slice(0, 9)]);

      setCheckInResult({
        success: true,
        participant: updatedParticipant,
        message: `Successfully checked in ${participant.name}`,
        timestamp: new Date()
      });

      setIsProcessing(false);
    }, 1500);
  };

  const handleManualCheckIn = (participantId: string) => {
    const participant = participants.find((p) => p.id === participantId);
    if (participant) {
      handleScan(participant.qrCode);
    }
  };

  const handleUndo = (checkInId: string) => {
    const checkIn = recentCheckIns.find((ci) => ci.id === checkInId);
    if (!checkIn) return;

    setParticipants((prev) =>
    prev.map((p) =>
    p.id === checkIn.participantId ?
    { ...p, status: 'pending' as const, checkInTime: undefined } :
    p
    )
    );

    setRecentCheckIns((prev) => prev.filter((ci) => ci.id !== checkInId));
  };

  const handleLogout = () => {
    navigate('/login');
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(true)}
        userName="Event Staff"
        userRole="Check-In Operator"
        onLogout={handleLogout} />

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <LoadingBar isLoading={isLoading} />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Breadcrumb />
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Check-In Station</h1>
              <p className="text-muted-foreground">
                Scan QR codes or manually check-in participants for the event
              </p>
            </div>
          </div>

          <div className="mb-6">
            <CheckInStats stats={stats} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-lg border border-border">
                <div className="border-b border-border">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab('scanner')}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors duration-150 ${
                      activeTab === 'scanner' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`
                      }>

                      <Icon name="ScanLine" size={20} />
                      <span>QR Scanner</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('manual')}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors duration-150 ${
                      activeTab === 'manual' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`
                      }>

                      <Icon name="Search" size={20} />
                      <span>Manual Entry</span>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {activeTab === 'scanner' ?
                  <QRScanner onScan={handleScan} isProcessing={isProcessing} /> :

                  <ManualEntry
                    participants={participants}
                    onCheckIn={handleManualCheckIn}
                    isProcessing={isProcessing} />

                  }
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <RecentCheckIns checkIns={recentCheckIns} onUndo={handleUndo} />
            </div>
          </div>
        </div>
      </main>

      <CheckInConfirmation result={checkInResult} onClose={() => setCheckInResult(null)} />
    </div>);

};

export default CheckInStation;