
import { Itinerary } from '@/types/itinerary.types';

/**
 * Filter itineraries based on status
 */
export const filterByStatus = (itineraries: Itinerary[], status: string): Itinerary[] => {
  if (!itineraries || itineraries.length === 0) {
    return [];
  }
  
  if (status === 'all') {
    return itineraries;
  }
  
  return itineraries.filter(itinerary => itinerary.status === status);
};

/**
 * Filter itineraries based on search query
 */
export const filterBySearchQuery = (itineraries: Itinerary[], query: string): Itinerary[] => {
  if (!itineraries || itineraries.length === 0) {
    return [];
  }
  
  if (!query) {
    return itineraries;
  }
  
  const lowercaseQuery = query.toLowerCase();
  return itineraries.filter(
    itinerary => 
      itinerary.title.toLowerCase().includes(lowercaseQuery) ||
      itinerary.customer.toLowerCase().includes(lowercaseQuery) ||
      itinerary.destination.toLowerCase().includes(lowercaseQuery) ||
      (itinerary.customerEmail && itinerary.customerEmail.toLowerCase().includes(lowercaseQuery)) ||
      itinerary.recordLocator.toLowerCase().includes(lowercaseQuery)
  );
};
