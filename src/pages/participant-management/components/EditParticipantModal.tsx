import { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import type { Participant } from '../types';

interface EditParticipantModalProps {
  participant: Participant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (participant: Participant) => void;
}

const EditParticipantModal = ({ participant, isOpen, onClose, onSave }: EditParticipantModalProps) => {
  const [formData, setFormData] = useState<Partial<Participant>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (participant) {
      setFormData(participant);
      setErrors({});
    }
  }, [participant]);

  const statusOptions = [
    { value: 'attended', label: 'Attended' },
    { value: 'pending', label: 'Pending' },
    { value: 'absent', label: 'Absent' }
  ];

  const handleChange = (field: keyof Participant, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.company?.trim()) {
      newErrors.company = 'Company is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && participant) {
      onSave({ ...participant, ...formData } as Participant);
      onClose();
    }
  };

  if (!isOpen || !participant) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-foreground/20 z-[1100] animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto animate-in zoom-in-95 duration-200">
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Edit Participant</h2>
            <button
              onClick={onClose}
              className="min-w-touch min-h-touch flex items-center justify-center -mr-2 text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
            />

            <Input
              label="Company"
              type="text"
              value={formData.company || ''}
              onChange={(e) => handleChange('company', e.target.value)}
              error={errors.company}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
            />

            <Select
              label="Check-In Status"
              options={statusOptions}
              value={formData.checkInStatus || 'pending'}
              onChange={(value) => handleChange('checkInStatus', value)}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                iconName="Save"
                iconPosition="left"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditParticipantModal;