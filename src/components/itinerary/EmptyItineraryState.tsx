
import React from 'react';
import { FileSearch } from 'lucide-react';

interface EmptyItineraryStateProps {
  searchQuery?: string;
}

const EmptyItineraryState: React.FC<EmptyItineraryStateProps> = ({ searchQuery }) => {
  return (
    <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
      <FileSearch className="mx-auto h-12 w-12 text-gray-300 mb-3" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">No itineraries found</h3>
      <p className="text-gray-500">
        {searchQuery 
          ? `No results matching "${searchQuery}"`
          : "Enter a traveler name, email, or record locator to search"}
      </p>
    </div>
  );
};

export default EmptyItineraryState;
