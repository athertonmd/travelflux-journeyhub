
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CustomerFilters from '@/components/customers/CustomerFilters';
import CustomerTable from '@/components/customers/CustomerTable';
import { useCustomers } from '@/hooks/useCustomers';
import { mockTravelers } from '@/data/mockCustomers';

const Users: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    activeFilters,
    handleFilterChange,
    clearFilters,
    currentTravelers,
    totalPages,
    uniqueClients
  } = useCustomers(mockTravelers);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Customers</h1>
      </div>
      
      <Card className="mb-6 p-4">
        <CustomerFilters
          searchQuery={searchQuery}
          setSearchQuery={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
        />
      </Card>
      
      <Card className="glass-card">
        <CustomerTable
          currentTravelers={currentTravelers}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          activeFilters={activeFilters}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
          uniqueClients={uniqueClients}
        />
      </Card>
    </div>
  );
};

export default Users;
