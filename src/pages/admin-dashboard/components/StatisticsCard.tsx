import { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

interface StatisticsCardProps {
  title: string;
  value: number;
  total?: number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'primary' | 'success' | 'warning' | 'secondary';
}

const StatisticsCard = ({ title, value, total, icon, trend, color }: StatisticsCardProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setAnimatedValue(value);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    secondary: 'bg-secondary/10 text-secondary',
  };

  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-foreground">{animatedValue.toLocaleString()}</h3>
            {total && (
              <span className="text-sm text-muted-foreground">/ {total.toLocaleString()}</span>
            )}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon name={icon} size={24} />
        </div>
      </div>

      {total && (
        <div className="mb-3">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${color === 'primary' ? 'bg-primary' : color === 'success' ? 'bg-success' : color === 'warning' ? 'bg-warning' : 'bg-secondary'} transition-all duration-1000 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      {trend && (
        <div className="flex items-center gap-1">
          <Icon
            name={trend.isPositive ? 'TrendingUp' : 'TrendingDown'}
            size={16}
            className={trend.isPositive ? 'text-success' : 'text-error'}
          />
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-error'}`}>
            {trend.value}%
          </span>
          <span className="text-sm text-muted-foreground ml-1">vs last event</span>
        </div>
      )}
    </div>
  );
};

export default StatisticsCard;