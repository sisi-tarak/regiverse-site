export interface Participant {
  id: string;
  name: string;
  email: string;
  company: string;
  registrationId: string;
  status: 'attended' | 'absent' | 'pending';
  checkInTime?: Date;
  photo?: string;
  photoAlt?: string;
  qrCode: string;
}

export interface CheckInResult {
  success: boolean;
  participant?: Participant;
  message: string;
  timestamp: Date;
}

export interface ScannerState {
  isScanning: boolean;
  hasPermission: boolean;
  error: string | null;
}

export interface CheckInStats {
  totalRegistered: number;
  checkedIn: number;
  pending: number;
  capacity: number;
}

export interface RecentCheckIn {
  id: string;
  participantId: string;
  participantName: string;
  timestamp: Date;
  canUndo: boolean;
}