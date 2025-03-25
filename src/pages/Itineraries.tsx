
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';
import DashboardErrorState from '@/components/dashboard/DashboardErrorState';
import { useItineraries } from '@/hooks/useItineraries';
import ItinerarySearchBar from '@/components/itinerary/ItinerarySearchBar';
import ItineraryTable from '@/components/itinerary/ItineraryTable';
import { Button } from '@/components/ui/button';
import EmptyItineraryState from '@/components/itinerary/EmptyItineraryState';

const Itineraries = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, refreshSession, sessionChecked } = useAuth();
  const { 
    searchQuery,
    filteredItineraries,
    handleSearch,
    handleSearchChange,
    handleItinerarySelect,
    selectedItinerary,
    isLoading: itinerariesLoading,
    error: itinerariesError
  } = useItineraries();
  
  const [isRecovering, setIsRecovering] = useState(false);
  const [timeSinceMount, setTimeSinceMount] = useState(0);
  const [sessionCheckAttempts, setSessionCheckAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Handle manual refresh 
  const handleRefreshConnection = async () => {
    setIsRecovering(true);
    setError(null);
    
    try {
      await refreshSession();
      setSessionCheckAttempts(prev => prev + 1);
      setIsRecovering(false);
    } catch (err) {
      setError('Failed to refresh session');
      setIsRecovering(false);
    }
  };

  // Handle clear storage and reload
  const handleClearAndReload = () => {
    sessionStorage.setItem('manual-clear-in-progress', 'true');
    window.location.href = '/login?cleared=true&t=' + Date.now();
  };

  // If still loading after auth check, show loading state
  if (authLoading || itinerariesLoading) {
    return (
      <DashboardLoadingState
        timeSinceMount={timeSinceMount}
        sessionCheckAttempts={sessionCheckAttempts}
        onClearAndReload={handleClearAndReload}
      />
    );
  }

  // If there's an error or loading timeout reached, show error state
  if (itinerariesError || !sessionChecked || !user) {
    return (
      <DashboardErrorState
        isRecovering={isRecovering}
        sessionChecked={sessionChecked}
        sessionCheckAttempts={sessionCheckAttempts}
        timeSinceMount={timeSinceMount}
        onRefreshConnection={handleRefreshConnection}
      />
    );
  }

  return (
    <DashboardLayout title="Itineraries">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Itineraries</h1>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefreshConnection}
          disabled={isRecovering}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRecovering ? 'animate-spin' : ''}`} />
          {isRecovering ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
      
      <Card className="p-6">
        <ItinerarySearchBar 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          searchPlaceholder="Search by traveler name, email, or record locator..."
        />
        
        {filteredItineraries.length > 0 ? (
          <ItineraryTable 
            itineraries={filteredItineraries}
            onSelectItinerary={handleItinerarySelect}
            selectedItineraryId={selectedItinerary?.id}
          />
        ) : (
          <EmptyItineraryState searchQuery={searchQuery} />
        )}
      </Card>
    </DashboardLayout>
  );
};

export default Itineraries;
