
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ItineraryEvent } from '../ItineraryTimeline';
import ItineraryDateGroup from './ItineraryDateGroup';

interface ItinerarySearchResultsProps {
  showNoResults: boolean;
  searchQuery: string;
  searchResults: ItineraryEvent[] | null;
  hasSearched: boolean;
  eventsByDate: Record<string, ItineraryEvent[]>;
  sortedDates: string[];
  formatDate: (dateString: string) => string;
}

const ItinerarySearchResults: React.FC<ItinerarySearchResultsProps> = ({
  showNoResults,
  searchQuery,
  searchResults,
  hasSearched,
  eventsByDate,
  sortedDates,
  formatDate
}) => {
  return (
    <>
      {showNoResults && (
        <Alert variant="default" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No itineraries found matching "{searchQuery}". Try a different record locator.
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
      
      {!hasSearched && (
        <div className="py-8 text-center text-muted-foreground">
          <p>Enter a record locator to search for itineraries.</p>
        </div>
      )}
      
      {hasSearched && sortedDates.length > 0 ? (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <ItineraryDateGroup 
              key={date} 
              date={date} 
              events={eventsByDate[date]} 
              formatDate={formatDate} 
            />
          ))}
        </div>
      ) : (
        hasSearched && !showNoResults && (
          <div className="py-8 text-center text-muted-foreground">
            <p>No upcoming itineraries found.</p>
          </div>
        )
      )}
    </>
  );
};

export default ItinerarySearchResults;
