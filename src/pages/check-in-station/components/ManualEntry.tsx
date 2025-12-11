import { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import type { Participant } from '../types';

interface ManualEntryProps {
  participants: Participant[];
  onCheckIn: (participantId: string) => void;
  isProcessing: boolean;
}

const ManualEntry = ({ participants, onCheckIn, isProcessing }: ManualEntryProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return participants
      .filter(p => p.status !== 'attended')
      .filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.company.toLowerCase().includes(query) ||
        p.registrationId.toLowerCase().includes(query)
      )
      .slice(0, 10);
  }, [searchQuery, participants]);

  const handleSelectParticipant = (participant: Participant) => {
    setSelectedParticipant(participant);
    setSearchQuery('');
  };

  const handleCheckIn = () => {
    if (selectedParticipant) {
      onCheckIn(selectedParticipant.id);
      setSelectedParticipant(null);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Icon name="Search" size={20} className="text-secondary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Manual Entry</h2>
          <p className="text-sm text-muted-foreground">Search and check-in participants manually</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search by name, email, company, or registration ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Icon
            name="Search"
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>

        {searchQuery && filteredParticipants.length > 0 && (
          <div className="bg-muted rounded-lg border border-border max-h-80 overflow-y-auto">
            {filteredParticipants.map((participant) => (
              <button
                key={participant.id}
                onClick={() => handleSelectParticipant(participant)}
                className="w-full flex items-center gap-4 p-4 hover:bg-background transition-colors duration-150 border-b border-border last:border-0"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {participant.photo ? (
                    <Image
                      src={participant.photo}
                      alt={participant.photoAlt || `Profile photo of ${participant.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-primary">
                      {participant.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{participant.name}</p>
                  <p className="text-sm text-muted-foreground">{participant.company}</p>
                  <p className="text-xs text-muted-foreground mt-1">{participant.registrationId}</p>
                </div>
                <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        )}

        {searchQuery && filteredParticipants.length === 0 && (
          <div className="bg-muted rounded-lg border border-border p-8 text-center">
            <Icon name="SearchX" size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No participants found matching your search</p>
          </div>
        )}

        {selectedParticipant && (
          <div className="bg-primary/5 rounded-lg border border-primary/20 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {selectedParticipant.photo ? (
                  <Image
                    src={selectedParticipant.photo}
                    alt={selectedParticipant.photoAlt || `Profile photo of ${selectedParticipant.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-primary">
                    {selectedParticipant.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {selectedParticipant.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{selectedParticipant.company}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Icon name="Mail" size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">{selectedParticipant.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon name="Hash" size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">{selectedParticipant.registrationId}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedParticipant(null)}
                iconName="X"
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleCheckIn}
                iconName="Check"
                fullWidth
                disabled={isProcessing}
                loading={isProcessing}
              >
                Check In
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualEntry;