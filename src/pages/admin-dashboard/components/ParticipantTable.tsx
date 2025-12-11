import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import type { Participant } from '../types';

interface ParticipantTableProps {
  participants: Participant[];
  onStatusChange: (id: string, status: Participant['status']) => void;
}

const ParticipantTable = ({ participants, onStatusChange }: ParticipantTableProps) => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(participants.map(p => p.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const getStatusBadge = (status: Participant['status']) => {
    const styles = {
      attended: 'bg-success/10 text-success border-success/20',
      absent: 'bg-error/10 text-error border-error/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
    };

    const icons = {
      attended: 'CheckCircle2',
      absent: 'XCircle',
      pending: 'Clock',
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        <Icon name={icons[status]} size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-foreground">Recent Participants</h3>
          <span className="px-2 py-1 bg-muted rounded-md text-sm text-muted-foreground">
            {participants.length} total
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Users"
          iconPosition="left"
          onClick={() => navigate('/participant-management')}
        >
          View All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === participants.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Select all participants"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Participant</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Company</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Check-In Time</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {participants.map((participant) => (
              <tr key={participant.id} className="hover:bg-muted/30 transition-colors duration-150">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(participant.id)}
                    onChange={(e) => handleSelectRow(participant.id, e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={`Select ${participant.name}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={participant.avatar}
                        alt={participant.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{participant.name}</p>
                      <p className="text-xs text-muted-foreground">{participant.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-foreground">{participant.company}</p>
                </td>
                <td className="px-4 py-3">{getStatusBadge(participant.status)}</td>
                <td className="px-4 py-3">
                  <p className="text-sm text-foreground">{formatDate(participant.checkInTime)}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/participant-management?id=${participant.id}`)}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors duration-150"
                      aria-label={`View ${participant.name} details`}
                    >
                      <Icon name="Eye" size={16} className="text-muted-foreground" />
                    </button>
                    {participant.status === 'pending' && (
                      <button
                        onClick={() => onStatusChange(participant.id, 'attended')}
                        className="p-1.5 hover:bg-success/10 rounded-md transition-colors duration-150"
                        aria-label={`Mark ${participant.name} as attended`}
                      >
                        <Icon name="CheckCircle2" size={16} className="text-success" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRows.size > 0 && (
        <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
          <p className="text-sm text-foreground">
            {selectedRows.size} participant{selectedRows.size > 1 ? 's' : ''} selected
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
              Export
            </Button>
            <Button variant="outline" size="sm" iconName="CheckCircle2" iconPosition="left">
              Mark Attended
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantTable;