
import React from 'react';
import { Globe } from 'lucide-react';

interface EmptyItineraryStateProps {
  searchQuery?: string;
}

const EmptyItineraryState: React.FC<EmptyItineraryStateProps> = ({ searchQuery }) => {
  return (
    <div className="glass-card p-8 rounded-lg text-center">
      <Globe className="mx-auto h-12 w-12 text-gray-300 mb-2" />
      <h3 className="text-lg font-medium text-gray-900">No itineraries found</h3>
      <p className="text-gray-500 mb-4">
        {searchQuery 
          ? `No results for "${searchQuery}"` 
          : "You don't have any itineraries yet"}
      </p>
    </div>
  );
};

export default EmptyItineraryState;
