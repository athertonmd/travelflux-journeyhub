
import React from 'react';
import { Itinerary } from '@/types/itinerary.types';
import ItineraryTimeline from '@/components/ItineraryTimeline';

interface ItineraryDetailProps {
  itinerary: Itinerary;
}

const ItineraryDetail: React.FC<ItineraryDetailProps> = ({ itinerary }) => {
  return (
    <div className="space-y-6">
      <ItineraryTimeline events={itinerary.events} />
    </div>
  );
};

export default ItineraryDetail;
