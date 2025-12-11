import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import type { Event } from '../types';

interface EventSelectorProps {
  events: Event[];
  selectedEvent: Event;
  onEventChange: (event: Event) => void;
}

const EventSelector = ({ events, selectedEvent, onEventChange }: EventSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <label className="text-sm font-medium text-muted-foreground mb-2 block">Current Event</label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:border-primary transition-colors duration-150 min-h-touch"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name="Calendar" size={20} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{selectedEvent.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(selectedEvent.date)} • {selectedEvent.location}
              </p>
            </div>
          </div>
          <Icon
            name="ChevronDown"
            size={20}
            className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => {
                    onEventChange(event);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors duration-150 min-h-touch ${
                    event.id === selectedEvent.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="Calendar" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">{event.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(event.date)} • {event.location}
                    </p>
                  </div>
                  {event.id === selectedEvent.id && (
                    <Icon name="Check" size={18} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventSelector;