import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MobileMenu from '../../components/ui/MobileMenu';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingBar from '../../components/ui/LoadingBar';
import Button from '../../components/ui/Button';
import StatsCards from './components/StatsCards';
import SearchFilters from './components/SearchFilters';
import BulkActionsBar from './components/BulkActionsBar';
import ParticipantTable from './components/ParticipantTable';
import EditParticipantModal from './components/EditParticipantModal';
import type { Participant, FilterOptions, ParticipantStats } from './types';

const ParticipantManagement = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    statusFilter: 'all',
    companyFilter: '',
    dateRange: { start: null, end: null }
  });

  const [participants, setParticipants] = useState<Participant[]>([
  {
    id: 'P001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    company: 'TechCorp Solutions',
    phone: '+1 (555) 123-4567',
    registrationDate: new Date('2024-01-15'),
    checkInStatus: 'attended',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a931fc83-1764669837387.png",
    qrCode: 'QR001',
    notes: 'VIP attendee'
  },
  {
    id: 'P002',
    name: 'Michael Chen',
    email: 'michael.chen@innovate.io',
    company: 'Innovate Labs',
    phone: '+1 (555) 234-5678',
    registrationDate: new Date('2024-01-16'),
    checkInStatus: 'pending',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    qrCode: 'QR002'
  },
  {
    id: 'P003',
    name: 'Emily Rodriguez',
    email: 'emily.r@datastream.com',
    company: 'DataStream Inc',
    phone: '+1 (555) 345-6789',
    registrationDate: new Date('2024-01-17'),
    checkInStatus: 'attended',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    qrCode: 'QR003'
  },
  {
    id: 'P004',
    name: 'James Wilson',
    email: 'j.wilson@cloudnine.net',
    company: 'CloudNine Systems',
    phone: '+1 (555) 456-7890',
    registrationDate: new Date('2024-01-18'),
    checkInStatus: 'absent',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    qrCode: 'QR004'
  },
  {
    id: 'P005',
    name: 'Aisha Patel',
    email: 'aisha.patel@nexustech.com',
    company: 'Nexus Technologies',
    phone: '+1 (555) 567-8901',
    registrationDate: new Date('2024-01-19'),
    checkInStatus: 'pending',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1c7af4b8f-1765367028205.png",
    qrCode: 'QR005'
  },
  {
    id: 'P006',
    name: 'David Kim',
    email: 'david.kim@quantum.ai',
    company: 'Quantum AI',
    phone: '+1 (555) 678-9012',
    registrationDate: new Date('2024-01-20'),
    checkInStatus: 'attended',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    qrCode: 'QR006'
  },
  {
    id: 'P007',
    name: 'Lisa Anderson',
    email: 'lisa.a@futuresoft.com',
    company: 'FutureSoft',
    phone: '+1 (555) 789-0123',
    registrationDate: new Date('2024-01-21'),
    checkInStatus: 'pending',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    qrCode: 'QR007'
  },
  {
    id: 'P008',
    name: 'Robert Martinez',
    email: 'r.martinez@synergy.co',
    company: 'Synergy Corp',
    phone: '+1 (555) 890-1234',
    registrationDate: new Date('2024-01-22'),
    checkInStatus: 'attended',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    qrCode: 'QR008'
  },
  {
    id: 'P009',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@vertex.io',
    company: 'Vertex Solutions',
    phone: '+1 (555) 901-2345',
    registrationDate: new Date('2024-01-23'),
    checkInStatus: 'absent',
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
    qrCode: 'QR009'
  },
  {
    id: 'P010',
    name: 'Thomas Brown',
    email: 't.brown@pinnacle.net',
    company: 'Pinnacle Systems',
    phone: '+1 (555) 012-3456',
    registrationDate: new Date('2024-01-24'),
    checkInStatus: 'pending',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    qrCode: 'QR010'
  }]
  );

  const companies = useMemo(() => {
    return Array.from(new Set(participants.map((p) => p.company))).sort();
  }, [participants]);

  const filteredParticipants = useMemo(() => {
    return participants.filter((participant) => {
      const matchesSearch = !filters.searchQuery ||
      participant.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      participant.company.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const matchesStatus = filters.statusFilter === 'all' ||
      participant.checkInStatus === filters.statusFilter;

      const matchesCompany = !filters.companyFilter ||
      participant.company === filters.companyFilter;

      const matchesDateRange = (!filters.dateRange.start ||
      participant.registrationDate >= filters.dateRange.start) && (
      !filters.dateRange.end ||
      participant.registrationDate <= filters.dateRange.end);

      return matchesSearch && matchesStatus && matchesCompany && matchesDateRange;
    });
  }, [participants, filters]);

  const stats: ParticipantStats = useMemo(() => {
    return {
      total: participants.length,
      attended: participants.filter((p) => p.checkInStatus === 'attended').length,
      pending: participants.filter((p) => p.checkInStatus === 'pending').length,
      absent: participants.filter((p) => p.checkInStatus === 'absent').length
    };
  }, [participants]);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedParticipant: Participant) => {
    setParticipants((prev) =>
    prev.map((p) => p.id === updatedParticipant.id ? updatedParticipant : p)
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      setParticipants((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const handleStatusChange = (id: string, status: Participant['checkInStatus']) => {
    setParticipants((prev) =>
    prev.map((p) => p.id === id ? { ...p, checkInStatus: status } : p)
    );
  };

  const handleBulkMarkAttended = () => {
    setIsLoading(true);
    setTimeout(() => {
      setParticipants((prev) =>
      prev.map((p) => selectedIds.includes(p.id) ? { ...p, checkInStatus: 'attended' } : p)
      );
      setSelectedIds([]);
      setIsLoading(false);
    }, 1000);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} participants?`)) {
      setIsLoading(true);
      setTimeout(() => {
        setParticipants((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
        setSelectedIds([]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleBulkExport = () => {
    setIsLoading(true);
    setTimeout(() => {
      const selectedParticipants = participants.filter((p) => selectedIds.includes(p.id));
      const csvContent = [
      ['Name', 'Email', 'Company', 'Registration Date', 'Status'],
      ...selectedParticipants.map((p) => [
      p.name,
      p.email,
      p.company,
      p.registrationDate.toLocaleDateString(),
      p.checkInStatus]
      )].
      map((row) => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `participants-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
    }, 1000);
  };

  const handleBulkGenerateQR = () => {
    setIsLoading(true);
    setTimeout(() => {
      alert(`QR codes generated for ${selectedIds.length} participants`);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    document.title = 'Participant Management - Regiverse';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(true)}
        userName="Admin User"
        userRole="Event Manager"
        onLogout={handleLogout} />


      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)} />


      <LoadingBar isLoading={isLoading} />

      <main className="pt-16">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-6 py-6">
          <div className="mb-6">
            <Breadcrumb />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Participant Management
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and track all event participants
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  iconName="Upload"
                  iconPosition="left"
                  onClick={() => {}}>

                  Import CSV
                </Button>
                <Button
                  variant="default"
                  iconName="UserPlus"
                  iconPosition="left"
                  onClick={() => navigate('/event-registration')}>

                  Add Participant
                </Button>
              </div>
            </div>
          </div>

          <StatsCards stats={stats} />

          <SearchFilters
            filters={filters}
            onFilterChange={setFilters}
            companies={companies} />


          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredParticipants.length}</span> of{' '}
                <span className="font-medium text-foreground">{participants.length}</span> participants
              </p>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={handleBulkExport}>

                Export All
              </Button>
            </div>
          </div>

          <ParticipantTable
            participants={filteredParticipants}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange} />


          {filteredParticipants.length === 0 &&
          <div className="bg-card border border-border rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground">

                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No participants found</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
              variant="outline"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={() => setFilters({
                searchQuery: '',
                statusFilter: 'all',
                companyFilter: '',
                dateRange: { start: null, end: null }
              })}>

                Reset Filters
              </Button>
            </div>
          }
        </div>
      </main>

      <BulkActionsBar
        selectedCount={selectedIds.length}
        onMarkAttended={handleBulkMarkAttended}
        onDelete={handleBulkDelete}
        onExport={handleBulkExport}
        onGenerateQR={handleBulkGenerateQR}
        onClearSelection={() => setSelectedIds([])}
        isProcessing={isLoading} />


      <EditParticipantModal
        participant={editingParticipant}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingParticipant(null);
        }}
        onSave={handleSaveEdit} />

    </div>);

};

export default ParticipantManagement;