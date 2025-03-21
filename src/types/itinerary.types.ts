
export interface ItineraryEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  type: 'flight' | 'hotel' | 'activity' | 'transfer' | 'other';
  description?: string;
  completed?: boolean;
}

export interface Itinerary {
  id: string;
  title: string;
  customer: string;
  customerEmail?: string;
  recordLocator: string;
  startDate: string;
  endDate: string;
  dateReceived: string;
  status: 'active' | 'upcoming' | 'completed';
  destination: string;
  events: ItineraryEvent[];
}
