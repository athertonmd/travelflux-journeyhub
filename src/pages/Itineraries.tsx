
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ItineraryTimeline, { ItineraryEvent } from '@/components/ItineraryTimeline';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Plus, 
  Calendar, 
  User, 
  Clock, 
  Filter, 
  ChevronDown,
  MapPin,
  Globe
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Sample data
const sampleItineraries = [
  {
    id: '1',
    title: 'Paris Summer Getaway',
    customer: 'Sarah & Michael Johnson',
    startDate: '2023-07-15',
    endDate: '2023-07-22',
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
    startDate: '2023-08-05',
    endDate: '2023-08-12',
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
    startDate: '2023-06-10',
    endDate: '2023-06-17',
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

const Itineraries = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState(sampleItineraries);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItinerary, setSelectedItinerary] = useState<typeof sampleItineraries[0]>(sampleItineraries[0]);
  const [filteredItineraries, setFilteredItineraries] = useState(sampleItineraries);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
          itinerary.destination.toLowerCase().includes(query)
      );
    }
    
    setFilteredItineraries(filtered);
    
    // Set first itinerary as selected if available
    if (filtered.length > 0 && (!selectedItinerary || !filtered.some(i => i.id === selectedItinerary.id))) {
      setSelectedItinerary(filtered[0]);
    }
    
  }, [searchQuery, activeTab, itineraries, selectedItinerary]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleItinerarySelect = (itinerary: typeof sampleItineraries[0]) => {
    setSelectedItinerary(itinerary);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-8">
            <h1 className="text-3xl font-display font-bold">Itineraries</h1>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search itineraries..."
                  className="pl-8 bg-white"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem>All Destinations</DropdownMenuItem>
                  <DropdownMenuItem>Europe</DropdownMenuItem>
                  <DropdownMenuItem>Asia</DropdownMenuItem>
                  <DropdownMenuItem>North America</DropdownMenuItem>
                  <DropdownMenuItem>South America</DropdownMenuItem>
                  <DropdownMenuItem>Africa</DropdownMenuItem>
                  <DropdownMenuItem>Australia</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                onClick={() => navigate('/itineraries/create')}
                className="animated-border-button"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Itinerary
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TabsContent value="all" className="mt-0">
                  <div className="space-y-3">
                    {filteredItineraries.length > 0 ? (
                      filteredItineraries.map(itinerary => (
                        <div
                          key={itinerary.id}
                          className={`
                            glass-card p-4 rounded-lg cursor-pointer transition-all duration-200
                            ${selectedItinerary?.id === itinerary.id 
                              ? 'border-primary ring-1 ring-primary/30 shadow-md' 
                              : 'border-gray-100 hover:border-primary/30'}
                            ${itinerary.status === 'completed' ? 'opacity-70' : 'opacity-100'}
                          `}
                          onClick={() => handleItinerarySelect(itinerary)}
                        >
                          <div className="flex justify-between">
                            <h3 className="font-medium">{itinerary.title}</h3>
                            <div className={`
                              px-2 py-1 rounded-full text-xs
                              ${itinerary.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : itinerary.status === 'upcoming'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }
                            `}>
                              {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mt-2">
                            <User className="h-3 w-3 mr-1" />
                            <span className="truncate">{itinerary.customer}</span>
                          </div>
                          
                          <div className="flex justify-between mt-2 text-sm">
                            <div className="flex items-center text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>
                                {new Date(itinerary.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(itinerary.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{itinerary.destination}</span>
                          </div>
                        </div>
                      ))
                    ) : (
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
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="active" className="mt-0">
                  {/* Content for active tab - already handled by filtering */}
                  <div className="space-y-3">
                    {filteredItineraries.length === 0 && (
                      <div className="glass-card p-8 rounded-lg text-center">
                        <Clock className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900">No active itineraries</h3>
                        <p className="text-gray-500">
                          You don't have any active itineraries at the moment
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="upcoming" className="mt-0">
                  {/* Content for upcoming tab - already handled by filtering */}
                  <div className="space-y-3">
                    {filteredItineraries.length === 0 && (
                      <div className="glass-card p-8 rounded-lg text-center">
                        <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900">No upcoming itineraries</h3>
                        <p className="text-gray-500">
                          You don't have any upcoming itineraries
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="completed" className="mt-0">
                  {/* Content for completed tab - already handled by filtering */}
                  <div className="space-y-3">
                    {filteredItineraries.length === 0 && (
                      <div className="glass-card p-8 rounded-lg text-center">
                        <Clock className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900">No completed itineraries</h3>
                        <p className="text-gray-500">
                          You don't have any completed itineraries
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
              
              {/* Itinerary Details */}
              <div className="lg:col-span-2">
                {selectedItinerary ? (
                  <div className="space-y-6">
                    <Card className="glass-card">
                      <CardHeader>
                        <div className="flex justify-between">
                          <div>
                            <CardTitle>{selectedItinerary.title}</CardTitle>
                            <CardDescription>
                              {selectedItinerary.customer} • {selectedItinerary.destination}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Share</Button>
                            <Button size="sm">Documents</Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-1.5 text-primary" />
                            <div>
                              <span className="text-gray-500 mr-1">Dates:</span>
                              <span>
                                {new Date(selectedItinerary.startDate).toLocaleDateString()} - {new Date(selectedItinerary.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1.5 text-primary" />
                            <div>
                              <span className="text-gray-500 mr-1">Duration:</span>
                              <span>
                                {Math.round((new Date(selectedItinerary.endDate).getTime() - new Date(selectedItinerary.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-1.5 text-primary" />
                            <div>
                              <span className="text-gray-500 mr-1">Destination:</span>
                              <span>{selectedItinerary.destination}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <ItineraryTimeline events={selectedItinerary.events as ItineraryEvent[]} />
                  </div>
                ) : (
                  <div className="glass-card p-8 rounded-lg text-center h-full flex items-center justify-center">
                    <div>
                      <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                      <h3 className="text-lg font-medium text-gray-900">No itinerary selected</h3>
                      <p className="text-gray-500">
                        Select an itinerary from the list to view details
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Itineraries;
