
import React from 'react';
import { Itinerary } from '@/types/itinerary.types';
import ItineraryTable from './ItineraryTable';
import ItineraryDetail from './ItineraryDetail';
import EmptyItineraryState from './EmptyItineraryState';

interface ItineraryTabContentProps {
  filteredItineraries: Itinerary[];
  selectedItinerary: Itinerary | null;
  handleItinerarySelect: (itinerary: Itinerary) => void;
  searchQuery: string;
}

const ItineraryTabContent: React.FC<ItineraryTabContentProps> = ({
  filteredItineraries,
  selectedItinerary,
  handleItinerarySelect,
  searchQuery,
}) => {
  return (
    <>
      {filteredItineraries.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          <ItineraryTable 
            itineraries={filteredItineraries}
            onSelectItinerary={handleItinerarySelect}
            selectedItineraryId={selectedItinerary?.id}
          />
          
          {selectedItinerary && (
            <ItineraryDetail itinerary={selectedItinerary} />
          )}
        </div>
      ) : (
        <EmptyItineraryState searchQuery={searchQuery} />
      )}
    </>
  );
};

export default ItineraryTabContent;
