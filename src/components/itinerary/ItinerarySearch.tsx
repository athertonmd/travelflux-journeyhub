
import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ItinerarySearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  clearSearch: () => void;
}

const ItinerarySearch: React.FC<ItinerarySearchProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  clearSearch
}) => {
  return (
    <div className="mt-4 space-y-2">
      <Label htmlFor="record-locator">Record locator</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="record-locator"
            placeholder="Enter record locator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pr-8"
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button 
          onClick={handleSearch} 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default ItinerarySearch;
