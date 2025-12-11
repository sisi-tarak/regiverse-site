import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Scan QR Code',
      description: 'Quick check-in with camera',
      icon: 'ScanLine',
      variant: 'default' as const,
      onClick: () => navigate('/check-in-station'),
    },
    {
      label: 'Manual Check-In',
      description: 'Enter participant details',
      icon: 'UserPlus',
      variant: 'outline' as const,
      onClick: () => navigate('/check-in-station?mode=manual'),
    },
    {
      label: 'Generate QR Codes',
      description: 'Batch create participant codes',
      icon: 'QrCode',
      variant: 'outline' as const,
      onClick: () => navigate('/qr-code-generator'),
    },
    {
      label: 'New Registration',
      description: 'Add new participant',
      icon: 'ClipboardList',
      variant: 'outline' as const,
      onClick: () => navigate('/event-registration'),
    },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            size="lg"
            iconName={action.icon}
            iconPosition="left"
            onClick={action.onClick}
            className="justify-start h-auto py-4"
          >
            <div className="flex flex-col items-start gap-1">
              <span className="font-medium">{action.label}</span>
              <span className="text-xs text-muted-foreground font-normal">{action.description}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;