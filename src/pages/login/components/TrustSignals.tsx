import Icon from '../../../components/AppIcon';
import type { TrustSignal } from '../types';

interface TrustSignalsProps {
  signals: TrustSignal[];
}

const TrustSignals = ({ signals }: TrustSignalsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
      {signals.map((signal) => (
        <div
          key={signal.id}
          className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name={signal.icon} size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {signal.label}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {signal.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustSignals;