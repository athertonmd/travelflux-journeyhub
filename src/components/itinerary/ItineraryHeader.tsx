
import React from 'react';

const ItineraryHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-8">
      <h1 className="text-3xl font-display font-bold">Itineraries</h1>
    </div>
  );
};

export default ItineraryHeader;
