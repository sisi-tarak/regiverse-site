export interface Participant {
  id: string;
  name: string;
  email: string;
  company: string;
  registrationDate: Date;
  checkInStatus: 'attended' | 'absent' | 'pending';
  phone?: string;
  qrCode?: string;
  avatar?: string;
  notes?: string;
}

export interface FilterOptions {
  searchQuery: string;
  statusFilter: 'all' | 'attended' | 'absent' | 'pending';
  companyFilter: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface BulkOperation {
  type: 'mark-attended' | 'delete' | 'export' | 'generate-qr';
  selectedIds: string[];
  progress: number;
  isProcessing: boolean;
}

export interface SortConfig {
  column: keyof Participant;
  direction: 'asc' | 'desc';
}

export interface ParticipantStats {
  total: number;
  attended: number;
  absent: number;
  pending: number;
}