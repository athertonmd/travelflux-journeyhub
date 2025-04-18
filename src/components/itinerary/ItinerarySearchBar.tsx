
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ItinerarySearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  searchPlaceholder?: string;
}

const ItinerarySearchBar: React.FC<ItinerarySearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  searchPlaceholder = "Search by traveler name, email, or record locator..."
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          className="pl-8 bg-white w-full"
          value={searchQuery}
          onChange={onSearchChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button onClick={onSearch} className="whitespace-nowrap">
        Search
      </Button>
    </div>
  );
};

export default ItinerarySearchBar;
