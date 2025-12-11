import { useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import type { ParticipantStats } from '../types';

interface StatsCardsProps {
  stats: ParticipantStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = useMemo(() => [
    {
      title: 'Total Participants',
      value: stats.total,
      icon: 'Users',
      color: 'bg-primary',
      textColor: 'text-primary',
      bgLight: 'bg-primary/10'
    },
    {
      title: 'Attended',
      value: stats.attended,
      icon: 'CheckCircle2',
      color: 'bg-success',
      textColor: 'text-success',
      bgLight: 'bg-success/10'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: 'Clock',
      color: 'bg-warning',
      textColor: 'text-warning',
      bgLight: 'bg-warning/10'
    },
    {
      title: 'Absent',
      value: stats.absent,
      icon: 'XCircle',
      color: 'bg-error',
      textColor: 'text-error',
      bgLight: 'bg-error/10'
    }
  ], [stats]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-150"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.bgLight} p-3 rounded-lg`}>
              <Icon name={card.icon} size={24} className={card.textColor} />
            </div>
            <span className={`text-3xl font-bold ${card.textColor}`}>
              {card.value.toLocaleString()}
            </span>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;