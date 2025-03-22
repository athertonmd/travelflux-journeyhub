
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CustomerFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  searchQuery,
  setSearchQuery,
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
        <Button>
          Export
        </Button>
      </div>
    </div>
  );
};

export default CustomerFilters;
