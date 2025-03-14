
import React from 'react';
import { Clock, MapPin, Plane, Hotel, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ItineraryEvent } from '../ItineraryTimeline';

interface ItineraryEventCardProps {
  event: ItineraryEvent;
}

export const getEventIcon = (type: ItineraryEvent['type']) => {
  switch (type) {
    case 'flight':
      return <Plane className="h-4 w-4" />;
    case 'hotel':
      return <Hotel className="h-4 w-4" />;
    case 'activity':
      return <MapPin className="h-4 w-4" />;
    case 'transfer':
      return <Plane className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

const ItineraryEventCard: React.FC<ItineraryEventCardProps> = ({ event }) => {
  return (
    <div 
      className={cn(
        "relative pl-6 transition-all duration-200",
        event.completed ? "opacity-60" : "opacity-100"
      )}
    >
      <div 
        className={cn(
          "absolute left-0 top-1.5 h-3 w-3 rounded-full border-2",
          event.completed 
            ? "bg-gray-200 border-gray-300" 
            : "bg-primary border-primary"
        )}
        style={{ left: '-19px' }}
      ></div>
      
      <div 
        className={cn(
          "bg-white/60 backdrop-blur-sm border rounded-lg p-3 hover:shadow-sm transition-all",
          event.completed ? "border-gray-200" : "border-primary/20"
        )}
      >
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "p-1.5 rounded",
              event.completed ? "bg-gray-100" : "bg-primary/10"
            )}>
              {getEventIcon(event.type)}
            </div>
            <h4 className="font-medium text-sm">
              {event.title}
            </h4>
          </div>
          {event.time && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {event.time}
            </div>
          )}
        </div>
        
        {event.description && (
          <p className="text-xs text-gray-600 mt-1">
            {event.description}
          </p>
        )}
        
        {event.location && (
          <div className="flex items-center text-xs text-gray-500 mt-2">
            <MapPin className="h-3 w-3 mr-1" />
            {event.location}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryEventCard;
