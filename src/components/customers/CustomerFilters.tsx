
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TravelerFilters } from '@/types/customer.types';

interface CustomerFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilters: TravelerFilters;
  handleFilterChange: (filter: string, value: string) => void;
  clearFilters: () => void;
  uniqueClients: string[];
}

const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  activeFilters,
  handleFilterChange,
  clearFilters,
  uniqueClients,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
        <Button>
          Export
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nameFilter">Name</Label>
          <Input
            id="nameFilter"
            value={activeFilters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            placeholder="Filter by name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emailFilter">Email</Label>
          <Input
            id="emailFilter"
            value={activeFilters.email}
            onChange={(e) => handleFilterChange('email', e.target.value)}
            placeholder="Filter by email"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clientFilter">Client</Label>
          <Select 
            value={activeFilters.clientName}
            onValueChange={(value) => handleFilterChange('clientName', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All clients</SelectItem>
              {uniqueClients.map(client => (
                <SelectItem key={client} value={client}>{client}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneFilter">Phone</Label>
          <Input
            id="phoneFilter"
            value={activeFilters.phoneNumber}
            onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
            placeholder="Filter by phone"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mobileUserFilter">Mobile User</Label>
          <Select
            value={activeFilters.isMobileUser}
            onValueChange={(value) => handleFilterChange('isMobileUser', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="recordLocatorFilter">Record Locator</Label>
          <Input
            id="recordLocatorFilter"
            value={activeFilters.recordLocator}
            onChange={(e) => handleFilterChange('recordLocator', e.target.value)}
            placeholder="Filter by PNR"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerFilters;
