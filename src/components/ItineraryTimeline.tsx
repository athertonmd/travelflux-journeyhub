
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ItinerarySearchResults from './itinerary/ItinerarySearchResults';

export interface ItineraryEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  type: 'flight' | 'hotel' | 'activity' | 'transfer' | 'other';
  description?: string;
  completed?: boolean;
}

interface ItineraryTimelineProps {
  events: ItineraryEvent[];
  className?: string;
}

const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ events, className }) => {
  const groupEventsByDate = (eventsToGroup: ItineraryEvent[]) => {
    return eventsToGroup.reduce((acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    }, {} as Record<string, ItineraryEvent[]>);
  };
  
  const eventsByDate = groupEventsByDate(events);
  const sortedDates = Object.keys(eventsByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader>
        <CardTitle>Travel Itinerary</CardTitle>
        <CardDescription>Your upcoming travel details</CardDescription>
      </CardHeader>
      
      <CardContent className="px-2">
        <ItinerarySearchResults
          showNoResults={false}
          searchQuery=""
          searchResults={null}
          hasSearched={false}
          eventsByDate={eventsByDate}
          sortedDates={sortedDates}
          formatDate={formatDate}
        />
      </CardContent>
    </Card>
  );
};

export default ItineraryTimeline;
