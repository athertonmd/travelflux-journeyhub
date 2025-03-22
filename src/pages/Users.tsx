
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  User, 
  Mail, 
  Smartphone, 
  Calendar, 
  Building,
  Phone,
  FileText
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

interface Traveler {
  id: string;
  name: string;
  email: string;
  clientName: string;
  phoneNumber: string;
  enrolledDate: string;
  isMobileUser: boolean;
  recordLocator: string;
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    name: '',
    email: '',
    clientName: '',
    phoneNumber: '',
    isMobileUser: '',
    recordLocator: ''
  });
  
  const itemsPerPage = 8;

  // Mock traveler data
  const travelers: Traveler[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      clientName: 'Acme Corp',
      phoneNumber: '+1 (555) 123-4567',
      enrolledDate: '2023-06-15T09:30:00Z',
      isMobileUser: true,
      recordLocator: 'ABC123',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      clientName: 'Tech Solutions Inc.',
      phoneNumber: '+1 (555) 987-6543',
      enrolledDate: '2023-08-22T14:15:00Z',
      isMobileUser: false,
      recordLocator: 'XYZ789',
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      clientName: 'Global Enterprises',
      phoneNumber: '+1 (555) 456-7890',
      enrolledDate: '2023-10-22T14:15:00Z',
      isMobileUser: true,
      recordLocator: 'DEF456',
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      clientName: 'Acme Corp',
      phoneNumber: '+1 (555) 234-5678',
      enrolledDate: '2023-09-05T10:45:00Z',
      isMobileUser: false,
      recordLocator: 'GHI789',
    },
    {
      id: '5',
      name: 'Robert Wilson',
      email: 'robert.w@example.com',
      clientName: 'Digital Innovations',
      phoneNumber: '+1 (555) 345-6789',
      enrolledDate: '2024-01-05T11:20:00Z',
      isMobileUser: true,
      recordLocator: 'JKL012',
    },
    {
      id: '6',
      name: 'Jessica Anderson',
      email: 'jessica.a@example.com',
      clientName: 'Tech Solutions Inc.',
      phoneNumber: '+1 (555) 567-8901',
      enrolledDate: '2024-02-18T15:45:00Z',
      isMobileUser: true,
      recordLocator: 'MNO345',
    },
    {
      id: '7',
      name: 'Daniel Martinez',
      email: 'daniel.m@example.com',
      clientName: 'Global Enterprises',
      phoneNumber: '+1 (555) 678-9012',
      enrolledDate: '2023-11-10T13:30:00Z',
      isMobileUser: false,
      recordLocator: 'PQR678',
    },
    {
      id: '8',
      name: 'Olivia Thompson',
      email: 'olivia.t@example.com',
      clientName: 'Acme Corp',
      phoneNumber: '+1 (555) 789-0123',
      enrolledDate: '2023-11-30T09:10:00Z',
      isMobileUser: true,
      recordLocator: 'STU901',
    },
    {
      id: '9',
      name: 'William Taylor',
      email: 'william.t@example.com',
      clientName: 'Tech Solutions Inc.',
      phoneNumber: '+1 (555) 890-1234',
      enrolledDate: '2024-03-01T14:00:00Z',
      isMobileUser: true,
      recordLocator: 'VWX234',
    },
    {
      id: '10',
      name: 'Sophia Garcia',
      email: 'sophia.g@example.com',
      clientName: 'Digital Innovations',
      phoneNumber: '+1 (555) 901-2345',
      enrolledDate: '2024-03-12T10:30:00Z',
      isMobileUser: false,
      recordLocator: 'YZA567',
    },
  ];

  // Sort travelers by enrollment date (most recent first)
  const sortedTravelers = useMemo(() => {
    return [...travelers].sort((a, b) => 
      new Date(b.enrolledDate).getTime() - new Date(a.enrolledDate).getTime()
    );
  }, [travelers]);

  // Filter travelers based on search query and active filters
  const filteredTravelers = useMemo(() => {
    return sortedTravelers.filter(traveler => {
      // Check if traveler matches the search query
      const matchesSearch = searchQuery === '' || 
        traveler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        traveler.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        traveler.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        traveler.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        traveler.recordLocator.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Check if traveler matches all active filters
      const matchesFilters = 
        (activeFilters.name === '' || traveler.name.toLowerCase().includes(activeFilters.name.toLowerCase())) &&
        (activeFilters.email === '' || traveler.email.toLowerCase().includes(activeFilters.email.toLowerCase())) &&
        (activeFilters.clientName === '' || traveler.clientName === activeFilters.clientName) &&
        (activeFilters.phoneNumber === '' || traveler.phoneNumber.includes(activeFilters.phoneNumber)) &&
        (activeFilters.isMobileUser === '' || 
          (activeFilters.isMobileUser === 'yes' && traveler.isMobileUser) || 
          (activeFilters.isMobileUser === 'no' && !traveler.isMobileUser)
        ) &&
        (activeFilters.recordLocator === '' || traveler.recordLocator.toLowerCase().includes(activeFilters.recordLocator.toLowerCase()));
      
      return matchesSearch && matchesFilters;
    });
  }, [sortedTravelers, searchQuery, activeFilters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTravelers.length / itemsPerPage);
  const currentTravelers = filteredTravelers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle filter change
  const handleFilterChange = (filter: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({
      name: '',
      email: '',
      clientName: '',
      phoneNumber: '',
      isMobileUser: '',
      recordLocator: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Get unique client names for filter dropdown
  const uniqueClients = useMemo(() => {
    const clients = new Set(travelers.map(traveler => traveler.clientName));
    return Array.from(clients);
  }, [travelers]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

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
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
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
      </Card>
      
      <Card className="glass-card">
        <Table>
          <TableCaption>A list of travelers based on PNRs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Traveler Name
                </div>
              </TableHead>
              <TableHead className="text-left">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
              </TableHead>
              <TableHead className="text-left">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Client
                </div>
              </TableHead>
              <TableHead className="text-left">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telephone Number
                </div>
              </TableHead>
              <TableHead className="text-left">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Enrolled Date
                </div>
              </TableHead>
              <TableHead className="text-left">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Mobile User
                </div>
              </TableHead>
              <TableHead className="text-left">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Record Locator
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTravelers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No customers found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              currentTravelers.map((traveler) => (
                <TableRow key={traveler.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium text-left">{traveler.name}</TableCell>
                  <TableCell className="text-left">{traveler.email}</TableCell>
                  <TableCell className="text-left">{traveler.clientName}</TableCell>
                  <TableCell className="text-left">{traveler.phoneNumber}</TableCell>
                  <TableCell className="text-left">{formatDate(traveler.enrolledDate)}</TableCell>
                  <TableCell className="text-left">
                    <Badge 
                      variant={traveler.isMobileUser ? "default" : "outline"}
                      className={traveler.isMobileUser ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                    >
                      {traveler.isMobileUser ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">{traveler.recordLocator}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Users;
