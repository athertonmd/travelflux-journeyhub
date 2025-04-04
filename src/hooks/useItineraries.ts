
import { useState, useEffect, ChangeEvent } from 'react';
import { Itinerary } from '@/types/itinerary.types';
import { sampleItineraries } from '@/data/sampleItineraries';
import { filterByStatus, filterBySearchQuery } from '@/utils/itineraryFilters';

export const useItineraries = () => {
  // State
  const [itineraries, setItineraries] = useState<Itinerary[]>(sampleItineraries);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [filteredItineraries, setFilteredItineraries] = useState<Itinerary[]>(sampleItineraries);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Filter itineraries based on status and search query
  useEffect(() => {
    try {
      let filtered = itineraries;
      
      if (!filtered || filtered.length === 0) {
        setFilteredItineraries([]);
        return;
      }
      
      // Apply status filter
      filtered = filterByStatus(filtered, activeTab);
      
      // Apply search filter
      filtered = filterBySearchQuery(filtered, searchQuery);
      
      setFilteredItineraries(filtered);
      
      // Set first itinerary as selected if available
      if (filtered.length > 0 && (!selectedItinerary || !filtered.some(i => i.id === selectedItinerary.id))) {
        setSelectedItinerary(filtered[0]);
      }
    } catch (err) {
      console.error("Error filtering itineraries:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [searchQuery, activeTab, itineraries, selectedItinerary]);
  
  // Event handlers
  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleItinerarySelect = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary);
  };
  
  return {
    searchQuery,
    activeTab,
    filteredItineraries,
    selectedItinerary,
    isLoading,
    error,
    handleSearch,
    handleSearchChange,
    handleTabChange,
    handleItinerarySelect,
  };
};
