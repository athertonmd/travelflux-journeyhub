
import { useState, useEffect } from 'react';
import { Itinerary } from '@/types/itinerary.types';

// Sample data - in a real app, this would come from an API
const sampleItineraries: Itinerary[] = [
  {
    id: '1',
    title: 'Paris Summer Getaway',
    customer: 'Sarah & Michael Johnson',
    customerEmail: 'sarah.johnson@example.com',
    recordLocator: 'ABC123',
    startDate: '2023-07-15',
    endDate: '2023-07-22',
    dateReceived: '2023-05-20',
    status: 'active',
    destination: 'Paris, France',
    events: [
      {
        id: 'event1',
        title: 'Flight to Paris',
        date: '2023-07-15',
        time: '10:30 AM',
        location: 'JFK International Airport',
        type: 'flight',
        description: 'Air France AF123',
      },
      {
        id: 'event2',
        title: 'Hotel Check-in',
        date: '2023-07-15',
        time: '3:00 PM',
        location: 'Grand Hotel Paris',
        type: 'hotel',
        description: 'Confirmation #HDG123456',
      },
      {
        id: 'event3',
        title: 'Eiffel Tower Tour',
        date: '2023-07-16',
        time: '10:00 AM',
        location: 'Eiffel Tower, Paris',
        type: 'activity',
        description: 'Guided tour with skip-the-line access',
      },
      {
        id: 'event4',
        title: 'Seine River Cruise',
        date: '2023-07-16',
        time: '6:00 PM',
        location: 'Seine River',
        type: 'activity',
        description: 'Evening dinner cruise',
      },
      {
        id: 'event5',
        title: 'Louvre Museum Visit',
        date: '2023-07-17',
        time: '9:00 AM',
        location: 'Louvre Museum',
        type: 'activity',
        description: 'Private guided tour',
      },
      {
        id: 'event6',
        title: 'Return Flight',
        date: '2023-07-22',
        time: '2:00 PM',
        location: 'Charles de Gaulle Airport',
        type: 'flight',
        description: 'Air France AF456',
      },
    ],
  },
  {
    id: '2',
    title: 'Tokyo Business Trip',
    customer: 'David Thompson',
    customerEmail: 'david.thompson@example.com',
    recordLocator: 'DEF456',
    startDate: '2023-08-05',
    endDate: '2023-08-12',
    dateReceived: '2023-06-15',
    status: 'upcoming',
    destination: 'Tokyo, Japan',
    events: [
      {
        id: 'event7',
        title: 'Flight to Tokyo',
        date: '2023-08-05',
        time: '1:30 PM',
        location: 'LAX International Airport',
        type: 'flight',
        description: 'JAL Airlines JL123',
      },
      {
        id: 'event8',
        title: 'Hotel Check-in',
        date: '2023-08-06',
        time: '10:00 AM',
        location: 'Imperial Hotel Tokyo',
        type: 'hotel',
        description: 'Confirmation #HDG789012',
      },
      {
        id: 'event9',
        title: 'Business Meeting',
        date: '2023-08-07',
        time: '9:00 AM',
        location: 'Tokyo Business Center',
        type: 'activity',
        description: 'Meeting with Nakamura Corp',
      },
      {
        id: 'event10',
        title: 'Tokyo Tower Visit',
        date: '2023-08-09',
        time: '4:00 PM',
        location: 'Tokyo Tower',
        type: 'activity',
        description: 'Sightseeing',
      },
      {
        id: 'event11',
        title: 'Return Flight',
        date: '2023-08-12',
        time: '11:00 AM',
        location: 'Narita International Airport',
        type: 'flight',
        description: 'JAL Airlines JL456',
      },
    ],
  },
  {
    id: '3',
    title: 'Rome Family Vacation',
    customer: 'Emma Wilson & Family',
    customerEmail: 'emma.wilson@example.com',
    recordLocator: 'GHI789',
    startDate: '2023-06-10',
    endDate: '2023-06-17',
    dateReceived: '2023-04-05',
    status: 'completed',
    destination: 'Rome, Italy',
    events: [
      {
        id: 'event12',
        title: 'Flight to Rome',
        date: '2023-06-10',
        time: '9:00 AM',
        location: 'O\'Hare International Airport',
        type: 'flight',
        description: 'Alitalia AZ789',
        completed: true,
      },
      {
        id: 'event13',
        title: 'Hotel Check-in',
        date: '2023-06-10',
        time: '2:00 PM',
        location: 'Hotel Artemide',
        type: 'hotel',
        description: 'Confirmation #HDG345678',
        completed: true,
      },
      {
        id: 'event14',
        title: 'Colosseum Tour',
        date: '2023-06-11',
        time: '10:00 AM',
        location: 'Colosseum',
        type: 'activity',
        description: 'Family guided tour',
        completed: true,
      },
      {
        id: 'event15',
        title: 'Vatican Museums',
        date: '2023-06-12',
        time: '9:00 AM',
        location: 'Vatican City',
        type: 'activity',
        description: 'Skip-the-line access',
        completed: true,
      },
      {
        id: 'event16',
        title: 'Return Flight',
        date: '2023-06-17',
        time: '3:00 PM',
        location: 'Leonardo da Vinci International Airport',
        type: 'flight',
        description: 'Alitalia AZ321',
        completed: true,
      },
    ],
  },
];

export const useItineraries = () => {
  const [itineraries] = useState<Itinerary[]>(sampleItineraries);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [filteredItineraries, setFilteredItineraries] = useState<Itinerary[]>(sampleItineraries);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    let filtered = itineraries;
    
    // Apply status filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(itinerary => itinerary.status === activeTab);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        itinerary => 
          itinerary.title.toLowerCase().includes(query) ||
          itinerary.customer.toLowerCase().includes(query) ||
          itinerary.destination.toLowerCase().includes(query) ||
          (itinerary.customerEmail && itinerary.customerEmail.toLowerCase().includes(query)) ||
          itinerary.recordLocator.toLowerCase().includes(query)
      );
    }
    
    setFilteredItineraries(filtered);
    
    // Set first itinerary as selected if available
    if (filtered.length > 0 && (!selectedItinerary || !filtered.some(i => i.id === selectedItinerary.id))) {
      setSelectedItinerary(filtered[0]);
    }
    
  }, [searchQuery, activeTab, itineraries, selectedItinerary]);
  
  const handleSearch = () => {
    // The filtering is already handled by the useEffect
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
    handleSearch,
    handleSearchChange,
    handleTabChange,
    handleItinerarySelect,
  };
};
