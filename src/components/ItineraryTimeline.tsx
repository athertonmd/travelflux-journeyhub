
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Clock, MapPin, Plane, Hotel, Calendar } from 'lucide-react';

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
      <CardContent className="px-2 pt-6">
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="pl-6">
              <div className="font-medium text-sm text-gray-500 mb-3">
                {formatDate(date)}
              </div>
              <div className="relative">
                <div 
                  className="absolute top-0 left-0 h-full w-px bg-primary/20"
                  style={{ left: '-12px' }}
                ></div>
                
                <div className="space-y-4">
                  {eventsByDate[date].map((event) => (
                    <div 
                      key={event.id}
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
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const getEventIcon = (type: ItineraryEvent['type']) => {
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

export default ItineraryTimeline;
