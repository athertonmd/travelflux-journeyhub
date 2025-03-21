
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ItineraryHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-8">
      <h1 className="text-3xl font-display font-bold">Itineraries</h1>
      
      <Button
        onClick={() => navigate('/itineraries/create')}
        className="animated-border-button"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Itinerary
      </Button>
    </div>
  );
};

export default ItineraryHeader;
