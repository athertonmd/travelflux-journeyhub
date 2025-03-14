
import React from 'react';
import ItineraryEventCard from './ItineraryEventCard';
import { ItineraryEvent } from '../ItineraryTimeline';

interface ItineraryDateGroupProps {
  date: string;
  events: ItineraryEvent[];
  formatDate: (dateString: string) => string;
}

const ItineraryDateGroup: React.FC<ItineraryDateGroupProps> = ({ 
  date, 
  events, 
  formatDate 
}) => {
  return (
    <div className="pl-6">
      <div className="font-medium text-sm text-gray-500 mb-3">
        {formatDate(date)}
      </div>
      <div className="relative">
        <div 
          className="absolute top-0 left-0 h-full w-px bg-primary/20"
          style={{ left: '-12px' }}
        ></div>
        
        <div className="space-y-4">
          {events.map((event) => (
            <ItineraryEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDateGroup;
