
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Plane, 
  Hotel, 
  MapPin, 
  Calendar, 
  Clock, 
  Search, 
  X,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ItineraryEvent[] | null>(null);
  const [showNoResults, setShowNoResults] = useState(false);
  
  // Group events by date
  const groupEventsByDate = (eventsToGroup: ItineraryEvent[]) => {
    return eventsToGroup.reduce((acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    }, {} as Record<string, ItineraryEvent[]>);
  };
  
  const eventsToDisplay = searchResults || events;
  const eventsByDate = groupEventsByDate(eventsToDisplay);
  
  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );
  
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setShowNoResults(false);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filteredEvents = events.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query)
    );
    
    setSearchResults(filteredEvents);
    setShowNoResults(filteredEvents.length === 0);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setShowNoResults(false);
  };
  
  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader>
        <CardTitle>Travel Itinerary</CardTitle>
        <CardDescription>Your complete travel schedule</CardDescription>
        
        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search itineraries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pr-8"
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button 
            onClick={handleSearch} 
            size="sm" 
            className="flex items-center gap-1"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="px-2">
        {showNoResults && (
          <Alert variant="default" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No itineraries found matching "{searchQuery}". Try a different search term.
            </AlertDescription>
          </Alert>
        )}
        
        {searchResults && searchResults.length > 0 && (
          <div className="mb-4 bg-muted/50 p-3 rounded-md">
            <p className="text-sm font-medium">
              Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
            </p>
          </div>
        )}
        
        {sortedDates.length > 0 ? (
          <div className="space-y-6">
            {sortedDates.map((date, dateIndex) => (
              <div key={date} className="pl-6">
                <div className="font-medium text-sm text-gray-500 mb-3">
                  {formatDate(date)}
                </div>
                <div className="relative">
                  {/* Timeline line */}
                  <div 
                    className="absolute top-0 left-0 h-full w-px bg-primary/20"
                    style={{ left: '-12px' }}
                  ></div>
                  
                  <div className="space-y-4">
                    {eventsByDate[date].map((event, eventIndex) => (
                      <div 
                        key={event.id} 
                        className={cn(
                          "relative pl-6 transition-all duration-200",
                          event.completed ? "opacity-60" : "opacity-100"
                        )}
                      >
                        {/* Timeline dot */}
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
        ) : !showNoResults && (
          <div className="py-8 text-center text-muted-foreground">
            <p>No upcoming itineraries found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ItineraryTimeline;
