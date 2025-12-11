import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MobileMenu from '../../components/ui/MobileMenu';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingBar from '../../components/ui/LoadingBar';
import StatisticsCard from './components/StatisticsCard';
import ParticipantTable from './components/ParticipantTable';
import QuickActions from './components/QuickActions';
import EventSelector from './components/EventSelector';
import ActivityFeed from './components/ActivityFeed';
import type { Participant, EventStats, RecentActivity, Event } from './types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event>({
    id: 'evt-001',
    name: 'Tech Conference 2024',
    date: new Date('2024-03-15'),
    location: 'San Francisco Convention Center',
    capacity: 500
  });

  const events: Event[] = [
  {
    id: 'evt-001',
    name: 'Tech Conference 2024',
    date: new Date('2024-03-15'),
    location: 'San Francisco Convention Center',
    capacity: 500
  },
  {
    id: 'evt-002',
    name: 'Product Launch Event',
    date: new Date('2024-04-20'),
    location: 'New York Expo Center',
    capacity: 300
  },
  {
    id: 'evt-003',
    name: 'Annual Summit 2024',
    date: new Date('2024-05-10'),
    location: 'Chicago Grand Hall',
    capacity: 750
  }];


  const [stats, setStats] = useState<EventStats>({
    totalParticipants: 342,
    checkedIn: 287,
    pending: 55,
    capacity: 500,
    checkInRate: 83.9
  });

  const [participants, setParticipants] = useState<Participant[]>([
  {
    id: 'p-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    company: 'TechCorp Solutions',
    status: 'attended',
    checkInTime: new Date(Date.now() - 3600000),
    registrationDate: new Date('2024-02-15'),
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_10df5a971-1765003957966.png",
    alt: 'Professional woman with brown hair in business attire smiling at camera',
    qrCode: 'QR-P001-2024'
  },
  {
    id: 'p-002',
    name: 'Michael Chen',
    email: 'michael.chen@innovate.io',
    company: 'Innovate Labs',
    status: 'attended',
    checkInTime: new Date(Date.now() - 7200000),
    registrationDate: new Date('2024-02-18'),
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1e8963640-1763296514949.png",
    alt: 'Asian man with glasses in blue shirt smiling professionally',
    qrCode: 'QR-P002-2024'
  },
  {
    id: 'p-003',
    name: 'Emily Rodriguez',
    email: 'emily.r@startup.com',
    company: 'StartUp Ventures',
    status: 'pending',
    checkInTime: null,
    registrationDate: new Date('2024-02-20'),
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1fcb58993-1763301360595.png",
    alt: 'Hispanic woman with long dark hair in professional blazer',
    qrCode: 'QR-P003-2024'
  },
  {
    id: 'p-004',
    name: 'David Thompson',
    email: 'david.t@enterprise.com',
    company: 'Enterprise Systems',
    status: 'attended',
    checkInTime: new Date(Date.now() - 10800000),
    registrationDate: new Date('2024-02-12'),
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1751a578f-1763295174209.png",
    alt: 'Caucasian man with short blonde hair in formal suit',
    qrCode: 'QR-P004-2024'
  },
  {
    id: 'p-005',
    name: 'Priya Patel',
    email: 'priya.patel@global.tech',
    company: 'Global Tech Inc',
    status: 'pending',
    checkInTime: null,
    registrationDate: new Date('2024-02-22'),
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_110842b84-1763293329006.png",
    alt: 'Indian woman with black hair wearing traditional business attire',
    qrCode: 'QR-P005-2024'
  }]
  );

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
  {
    id: 'act-001',
    type: 'check-in',
    participantName: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 300000),
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_10df5a971-1765003957966.png",
    alt: 'Professional woman with brown hair in business attire smiling at camera'
  },
  {
    id: 'act-002',
    type: 'registration',
    participantName: 'James Wilson',
    timestamp: new Date(Date.now() - 600000),
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_131b58687-1763291716240.png",
    alt: 'African American man with short hair in business casual attire'
  },
  {
    id: 'act-003',
    type: 'check-in',
    participantName: 'Michael Chen',
    timestamp: new Date(Date.now() - 900000),
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1e8963640-1763296514949.png",
    alt: 'Asian man with glasses in blue shirt smiling professionally'
  },
  {
    id: 'act-004',
    type: 'registration',
    participantName: 'Lisa Anderson',
    timestamp: new Date(Date.now() - 1200000),
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1c1be53b7-1763295352081.png",
    alt: 'Blonde woman in red blazer with professional makeup'
  },
  {
    id: 'act-005',
    type: 'check-in',
    participantName: 'David Thompson',
    timestamp: new Date(Date.now() - 1500000),
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1751a578f-1763295174209.png",
    alt: 'Caucasian man with short blonde hair in formal suit'
  }]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: RecentActivity = {
        id: `act-${Date.now()}`,
        type: Math.random() > 0.5 ? 'check-in' : 'registration',
        participantName: `Participant ${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date(),
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 50)}.jpg`,
        alt: 'Event participant profile photo'
      };

      setRecentActivities((prev) => [newActivity, ...prev.slice(0, 9)]);

      if (newActivity.type === 'check-in') {
        setStats((prev) => ({
          ...prev,
          checkedIn: prev.checkedIn + 1,
          pending: Math.max(0, prev.pending - 1),
          checkInRate: (prev.checkedIn + 1) / prev.totalParticipants * 100
        }));
      } else {
        setStats((prev) => ({
          ...prev,
          totalParticipants: prev.totalParticipants + 1,
          pending: prev.pending + 1
        }));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (id: string, status: Participant['status']) => {
    setParticipants((prev) =>
    prev.map((p) =>
    p.id === id ?
    {
      ...p,
      status,
      checkInTime: status === 'attended' ? new Date() : null
    } :
    p
    )
    );

    if (status === 'attended') {
      setStats((prev) => ({
        ...prev,
        checkedIn: prev.checkedIn + 1,
        pending: Math.max(0, prev.pending - 1),
        checkInRate: (prev.checkedIn + 1) / prev.totalParticipants * 100
      }));
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(true)}
        userName="Admin User"
        userRole="Event Administrator"
        onLogout={handleLogout} />

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <LoadingBar isLoading={isLoading} />

      <main className="pt-16">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mb-6">
            <Breadcrumb />
            <h1 className="text-3xl font-bold text-foreground mt-2">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">
              Monitor your event performance and manage participants in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatisticsCard
                  title="Total Participants"
                  value={stats.totalParticipants}
                  total={stats.capacity}
                  icon="Users"
                  color="primary"
                  trend={{ value: 12, isPositive: true }} />

                <StatisticsCard
                  title="Checked In"
                  value={stats.checkedIn}
                  total={stats.totalParticipants}
                  icon="CheckCircle2"
                  color="success"
                  trend={{ value: 8, isPositive: true }} />

                <StatisticsCard
                  title="Pending"
                  value={stats.pending}
                  total={stats.totalParticipants}
                  icon="Clock"
                  color="warning"
                  trend={{ value: 0, isPositive: true }} />

                <StatisticsCard
                  title="Check-In Rate"
                  value={Math.round(stats.checkInRate)}
                  total={100}
                  icon="TrendingUp"
                  color="secondary"
                  trend={{ value: 5, isPositive: true }} />

              </div>

              <ParticipantTable participants={participants} onStatusChange={handleStatusChange} />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <EventSelector
                events={events}
                selectedEvent={selectedEvent}
                onEventChange={setSelectedEvent} />

              <QuickActions />
              <ActivityFeed activities={recentActivities} />
            </div>
          </div>
        </div>
      </main>
    </div>);

};

export default AdminDashboard;