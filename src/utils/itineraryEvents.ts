
import { Itinerary, ItineraryEvent } from '@/types/itinerary.types';

/**
 * Extract all events from itineraries or a selected itinerary
 */
export const extractEvents = (
  itineraries: Itinerary[] | undefined, 
  selectedItinerary: Itinerary | null
): ItineraryEvent[] => {
  if (!itineraries || itineraries.length === 0) {
    return [];
  }
  
  if (selectedItinerary) {
    return selectedItinerary.events || [];
  }
  
  return itineraries.flatMap(itinerary => itinerary.events || []);
};
