import { useState, useMemo } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import type { Participant, SortConfig } from '../types';

interface ParticipantTableProps {
  participants: Participant[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (participant: Participant) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Participant['checkInStatus']) => void;
}

const ParticipantTable = ({
  participants,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  onStatusChange
}: ParticipantTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'registrationDate',
    direction: 'desc'
  });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const sortedParticipants = useMemo(() => {
    const sorted = [...participants].sort((a, b) => {
      const aValue = a[sortConfig.column];
      const bValue = b[sortConfig.column];

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return sorted;
  }, [participants, sortConfig]);

  const handleSort = (column: keyof Participant) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(participants.map(p => p.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusBadge = (status: Participant['checkInStatus']) => {
    const styles = {
      attended: 'bg-success/10 text-success border-success/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      absent: 'bg-error/10 text-error border-error/20'
    };

    const icons = {
      attended: 'CheckCircle2',
      pending: 'Clock',
      absent: 'XCircle'
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        <Icon name={icons[status]} size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const SortIcon = ({ column }: { column: keyof Participant }) => {
    if (sortConfig.column !== column) {
      return <Icon name="ChevronsUpDown" size={16} className="text-muted-foreground" />;
    }
    return (
      <Icon 
        name={sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
        size={16} 
        className="text-primary" 
      />
    );
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={selectedIds.length === participants.length && participants.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-150"
                  >
                    Participant
                    <SortIcon column="name" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('company')}
                    className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-150"
                  >
                    Company
                    <SortIcon column="company" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('registrationDate')}
                    className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-150"
                  >
                    Registration Date
                    <SortIcon column="registrationDate" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort('checkInStatus')}
                    className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-150"
                  >
                    Status
                    <SortIcon column="checkInStatus" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <span className="text-sm font-medium text-foreground">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedParticipants.map((participant) => (
                <tr key={participant.id} className="hover:bg-muted/30 transition-colors duration-150">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedIds.includes(participant.id)}
                      onChange={(e) => handleSelectOne(participant.id, e.target.checked)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        {participant.avatar ? (
                          <Image
                            src={participant.avatar}
                            alt={`Profile photo of ${participant.name}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-medium">
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{participant.name}</p>
                        <p className="text-xs text-muted-foreground">{participant.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{participant.company}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {participant.registrationDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(participant.checkInStatus)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={() => onEdit(participant)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="QrCode"
                        onClick={() => {}}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => onDelete(participant.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {sortedParticipants.map((participant) => (
          <div key={participant.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <Checkbox
                  checked={selectedIds.includes(participant.id)}
                  onChange={(e) => handleSelectOne(participant.id, e.target.checked)}
                />
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  {participant.avatar ? (
                    <Image
                      src={participant.avatar}
                      alt={`Profile photo of ${participant.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-medium text-lg">
                      {participant.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate">{participant.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{participant.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">{participant.company}</p>
                </div>
                <button
                  onClick={() => toggleRowExpansion(participant.id)}
                  className="min-w-touch min-h-touch flex items-center justify-center -mr-2 text-muted-foreground"
                >
                  <Icon 
                    name={expandedRows.has(participant.id) ? 'ChevronUp' : 'ChevronDown'} 
                    size={20} 
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                {getStatusBadge(participant.checkInStatus)}
                <span className="text-xs text-muted-foreground">
                  {participant.registrationDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>

              {expandedRows.has(participant.id) && (
                <div className="mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Edit"
                      iconPosition="left"
                      onClick={() => onEdit(participant)}
                      fullWidth
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="QrCode"
                      onClick={() => {}}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => onDelete(participant.id)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ParticipantTable;