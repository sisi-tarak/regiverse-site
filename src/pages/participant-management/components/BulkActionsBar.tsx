import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

interface BulkActionsBarProps {
  selectedCount: number;
  onMarkAttended: () => void;
  onDelete: () => void;
  onExport: () => void;
  onGenerateQR: () => void;
  onClearSelection: () => void;
  isProcessing: boolean;
}

const BulkActionsBar = ({
  selectedCount,
  onMarkAttended,
  onDelete,
  onExport,
  onGenerateQR,
  onClearSelection,
  isProcessing
}: BulkActionsBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-200">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-md">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedCount} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="success"
              size="sm"
              iconName="CheckCircle2"
              iconPosition="left"
              onClick={onMarkAttended}
              disabled={isProcessing}
            >
              Mark Attended
            </Button>

            <Button
              variant="outline"
              size="sm"
              iconName="QrCode"
              iconPosition="left"
              onClick={onGenerateQR}
              disabled={isProcessing}
            >
              Generate QR
            </Button>

            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={onExport}
              disabled={isProcessing}
            >
              Export
            </Button>

            <Button
              variant="destructive"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              onClick={onDelete}
              disabled={isProcessing}
            >
              Delete
            </Button>

            <div className="w-px h-6 bg-border mx-2" />

            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClearSelection}
              disabled={isProcessing}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;