
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  User, 
  Mail, 
  Building,
  Phone,
  Calendar, 
  Smartphone, 
  FileText,
  Eye,
  ChevronDown,
  FilterX
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Traveler, TravelerFilters } from '@/types/customer.types';
import CustomerPagination from './CustomerPagination';
import CustomerDetailModal from './CustomerDetailModal';

interface CustomerTableProps {
  currentTravelers: Traveler[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  activeFilters: TravelerFilters;
  handleFilterChange: (filter: string, value: string) => void;
  clearFilters: () => void;
  uniqueClients: string[];
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  currentTravelers,
  currentPage,
  totalPages,
  setCurrentPage,
  activeFilters,
  handleFilterChange,
  clearFilters,
  uniqueClients,
}) => {
  const [selectedTraveler, setSelectedTraveler] = useState<Traveler | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const handleRowClick = (traveler: Traveler) => {
    setSelectedTraveler(traveler);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Table>
        <TableCaption>A list of travelers based on PNRs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Traveler Name
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium">Filter by Name</h4>
                      <Input
                        placeholder="Filter name..."
                        value={activeFilters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium">Filter by Email</h4>
                      <Input
                        placeholder="Filter email..."
                        value={activeFilters.email}
                        onChange={(e) => handleFilterChange('email', e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Client
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium">Filter by Client</h4>
                      <Select 
                        value={activeFilters.clientName}
                        onValueChange={(value) => handleFilterChange('clientName', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All clients" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All clients</SelectItem>
                          {uniqueClients.map(client => (
                            <SelectItem key={client} value={client}>{client}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telephone Number
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium">Filter by Phone</h4>
                      <Input
                        placeholder="Filter phone..."
                        value={activeFilters.phoneNumber}
                        onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="text-left">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Enrolled Date
              </div>
            </TableHead>
            <TableHead className="text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Mobile User
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium">Filter by Mobile User</h4>
                      <Select
                        value={activeFilters.isMobileUser}
                        onValueChange={(value) => handleFilterChange('isMobileUser', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All users" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Record Locator
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium">Filter by Record Locator</h4>
                      <Input
                        placeholder="Filter PNR..."
                        value={activeFilters.recordLocator}
                        onChange={(e) => handleFilterChange('recordLocator', e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TableHead>
            <TableHead className="w-[50px]">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearFilters}
                className="h-7 w-7"
                title="Clear all filters"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTravelers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No customers found matching your search.
              </TableCell>
            </TableRow>
          ) : (
            currentTravelers.map((traveler) => (
              <TableRow 
                key={traveler.id} 
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium text-left" onClick={() => handleRowClick(traveler)}>{traveler.name}</TableCell>
                <TableCell className="text-left" onClick={() => handleRowClick(traveler)}>{traveler.email}</TableCell>
                <TableCell className="text-left" onClick={() => handleRowClick(traveler)}>{traveler.clientName}</TableCell>
                <TableCell className="text-left" onClick={() => handleRowClick(traveler)}>{traveler.phoneNumber}</TableCell>
                <TableCell className="text-left" onClick={() => handleRowClick(traveler)}>{formatDate(traveler.enrolledDate)}</TableCell>
                <TableCell className="text-left" onClick={() => handleRowClick(traveler)}>
                  <Badge 
                    variant={traveler.isMobileUser ? "default" : "outline"}
                    className={traveler.isMobileUser ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                  >
                    {traveler.isMobileUser ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell className="text-left" onClick={() => handleRowClick(traveler)}>{traveler.recordLocator}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleRowClick(traveler)}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <CustomerPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <CustomerDetailModal 
        traveler={selectedTraveler}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default CustomerTable;
