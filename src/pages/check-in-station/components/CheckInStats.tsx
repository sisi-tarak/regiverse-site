import { useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import type { CheckInStats } from '../types';

interface CheckInStatsProps {
  stats: CheckInStats;
}

const CheckInStats = ({ stats }: CheckInStatsProps) => {
  const checkInPercentage = useMemo(() => {
    if (stats.totalRegistered === 0) return 0;
    return Math.round((stats.checkedIn / stats.totalRegistered) * 100);
  }, [stats.checkedIn, stats.totalRegistered]);

  const capacityPercentage = useMemo(() => {
    if (stats.capacity === 0) return 0;
    return Math.round((stats.checkedIn / stats.capacity) * 100);
  }, [stats.checkedIn, stats.capacity]);

  const statsCards = [
    {
      label: 'Total Registered',
      value: stats.totalRegistered,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Checked In',
      value: stats.checkedIn,
      icon: 'CheckCircle2',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Capacity',
      value: stats.capacity,
      icon: 'Building2',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Check-In Statistics</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
          <Icon name="TrendingUp" size={16} className="text-success" />
          <span className="text-sm font-medium text-foreground">{checkInPercentage}% Complete</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((card) => (
          <div key={card.label} className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                <Icon name={card.icon} size={20} className={card.color} />
              </div>
              <span className={`text-2xl font-bold ${card.color}`}>{card.value}</span>
            </div>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Check-In Progress</span>
            <span className="text-sm text-muted-foreground">
              {stats.checkedIn} / {stats.totalRegistered}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-success transition-all duration-500"
              style={{ width: `${checkInPercentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Venue Capacity</span>
            <span className="text-sm text-muted-foreground">
              {stats.checkedIn} / {stats.capacity}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                capacityPercentage >= 90 ? 'bg-error' : capacityPercentage >= 75 ? 'bg-warning' : 'bg-secondary'
              }`}
              style={{ width: `${capacityPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInStats;