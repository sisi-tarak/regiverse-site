import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import type { RecentActivity } from '../types';

interface ActivityFeedProps {
  activities: RecentActivity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    return type === 'check-in' ? 'CheckCircle2' : 'UserPlus';
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    return type === 'check-in' ? 'text-success' : 'text-primary';
  };

  const getActivityText = (type: RecentActivity['type']) => {
    return type === 'check-in' ? 'checked in' : 'registered';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full flex items-center gap-1">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          Live
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-150"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={activity.avatar}
                alt={activity.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.participantName}</span>
                  {' '}
                  <span className="text-muted-foreground">{getActivityText(activity.type)}</span>
                </p>
                <Icon
                  name={getActivityIcon(activity.type)}
                  size={16}
                  className={getActivityColor(activity.type)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;