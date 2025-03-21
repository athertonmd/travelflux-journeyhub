
import React from 'react';
import { Itinerary } from '@/types/itinerary.types';
import ItineraryTimeline from '@/components/ItineraryTimeline';
import { Button } from '@/components/ui/button';

interface ItineraryDetailProps {
  itinerary: Itinerary;
}

const ItineraryDetail: React.FC<ItineraryDetailProps> = ({ itinerary }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm">Edit</Button>
        <Button variant="outline" size="sm">Share</Button>
        <Button size="sm">Documents</Button>
      </div>
      
      <ItineraryTimeline events={itinerary.events} />
    </div>
  );
};

export default ItineraryDetail;
