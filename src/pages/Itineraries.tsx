
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ItinerarySearchBar from '@/components/itinerary/ItinerarySearchBar';
import ItineraryHeader from '@/components/itinerary/ItineraryHeader';
import ItineraryTabContent from '@/components/itinerary/ItineraryTabContent';
import { useItineraries } from '@/hooks/useItineraries';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Itineraries = () => {
  const {
    searchQuery,
    activeTab,
    filteredItineraries,
    selectedItinerary,
    handleSearch,
    handleSearchChange,
    handleTabChange,
    handleItinerarySelect,
  } = useItineraries();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
          <ItineraryHeader />
          
          <ItinerarySearchBar 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSearch={handleSearch}
          />
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <ItineraryTabContent 
                filteredItineraries={filteredItineraries}
                selectedItinerary={selectedItinerary}
                handleItinerarySelect={handleItinerarySelect}
                searchQuery={searchQuery}
              />
            </TabsContent>
            
            {/* Content for other tabs - already handled by filtering */}
            {['active', 'upcoming', 'completed'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                {filteredItineraries.length === 0 ? (
                  <div className="glass-card p-8 rounded-lg text-center">
                    <h3 className="text-lg font-medium text-gray-900">No {tab} itineraries</h3>
                    <p className="text-gray-500">
                      You don't have any {tab} itineraries at the moment
                    </p>
                  </div>
                ) : (
                  <ItineraryTabContent 
                    filteredItineraries={filteredItineraries}
                    selectedItinerary={selectedItinerary}
                    handleItinerarySelect={handleItinerarySelect}
                    searchQuery={searchQuery}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Itineraries;
