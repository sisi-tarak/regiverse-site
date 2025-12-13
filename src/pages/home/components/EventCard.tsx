import React from 'react';

interface EventCardProps {
  title: string;
  date: string;
  imageUrl: string;
  participantCount: number;
}

const EventCard: React.FC<EventCardProps> = ({ title, date, imageUrl, participantCount }) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{date}</p>
        <p className="text-sm text-muted-foreground mt-2">{participantCount} participants</p>
      </div>
    </div>
  );
};

export default EventCard;
