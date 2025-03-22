
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Clock, MapPin, Plane, Hotel, Calendar, Car, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  
  if (events.length === 0) {
    return (
      <Card className={cn("glass-card", className)}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No events to display</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("glass-card", className)}>
      <CardContent className="p-6">
        {sortedDates.map((date, dateIndex) => (
          <div key={date} className="mb-8 last:mb-0">
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-lg font-medium">{formatDate(date)}</h3>
            </div>
            
            <div className="ml-6 space-y-4">
              {eventsByDate[date].map((event, eventIndex) => (
                <div 
                  key={event.id}
                  className={cn(
                    "relative pl-6 pb-4",
                    eventIndex !== eventsByDate[date].length - 1 && "border-l-2 border-border"
                  )}
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    {getEventIcon(event.type, "h-2.5 w-2.5 text-white")}
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 border shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-1.5 rounded-full mr-3">
                          {getEventIcon(event.type, "h-4 w-4 text-primary")}
                        </div>
                        <h4 className="font-medium">{event.title}</h4>
                      </div>
                      
                      {event.completed !== undefined && (
                        <Badge variant={event.completed ? "success" : "outline"} className="ml-2">
                          {event.completed ? "Completed" : "Pending"}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="ml-9 space-y-1">
                      {event.time && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mr-1.5" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      {event.description && (
                        <p className="text-sm mt-2">{event.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const getEventIcon = (type: ItineraryEvent['type'], className?: string) => {
  switch (type) {
    case 'flight':
      return <Plane className={className} />;
    case 'hotel':
      return <Hotel className={className} />;
    case 'activity':
      return <Globe className={className} />;
    case 'transfer':
      return <Car className={className} />;
    default:
      return <Calendar className={className} />;
  }
};

export default ItineraryTimeline;
