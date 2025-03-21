
import React from 'react';
import { Calendar } from 'lucide-react';
import { Itinerary } from '@/types/itinerary.types';
import ItineraryTimeline from '@/components/ItineraryTimeline';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ItineraryDetailProps {
  itinerary: Itinerary;
}

const ItineraryDetail: React.FC<ItineraryDetailProps> = ({ itinerary }) => {
  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>{itinerary.title}</CardTitle>
              <CardDescription>
                {itinerary.customer} • {itinerary.destination}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm">Share</Button>
              <Button size="sm">Documents</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-1.5 text-primary" />
              <div>
                <span className="text-gray-500 mr-1">Dates:</span>
                <span>
                  {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ItineraryTimeline events={itinerary.events} />
    </div>
  );
};

export default ItineraryDetail;
