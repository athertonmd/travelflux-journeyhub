
import React from 'react';
import { Globe, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyItineraryStateProps {
  searchQuery?: string;
}

const EmptyItineraryState: React.FC<EmptyItineraryStateProps> = ({ searchQuery }) => {
  const navigate = useNavigate();
  
  return (
    <div className="glass-card p-8 rounded-lg text-center">
      <Globe className="mx-auto h-12 w-12 text-gray-300 mb-2" />
      <h3 className="text-lg font-medium text-gray-900">No itineraries found</h3>
      <p className="text-gray-500 mb-4">
        {searchQuery 
          ? `No results for "${searchQuery}"` 
          : "You don't have any itineraries yet"}
      </p>
      <Button
        onClick={() => navigate('/itineraries/create')}
        className="animated-border-button"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create New Itinerary
      </Button>
    </div>
  );
};

export default EmptyItineraryState;
