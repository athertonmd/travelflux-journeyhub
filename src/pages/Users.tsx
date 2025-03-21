
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  User, 
  Mail, 
  Smartphone, 
  Calendar, 
  Building
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
import { format } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  isMobileSubscriber: boolean;
  clientName: string;
  mobileRegistrationDate?: string;
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock user data
  const users: User[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      isMobileSubscriber: true,
      clientName: 'Acme Corp',
      mobileRegistrationDate: '2023-06-15T09:30:00Z',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      isMobileSubscriber: false,
      clientName: 'Tech Solutions Inc.',
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      isMobileSubscriber: true,
      clientName: 'Global Enterprises',
      mobileRegistrationDate: '2023-10-22T14:15:00Z',
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      isMobileSubscriber: false,
      clientName: 'Acme Corp',
    },
    {
      id: '5',
      name: 'Robert Wilson',
      email: 'robert.w@example.com',
      isMobileSubscriber: true,
      clientName: 'Digital Innovations',
      mobileRegistrationDate: '2024-01-05T11:20:00Z',
    },
    {
      id: '6',
      name: 'Jessica Anderson',
      email: 'jessica.a@example.com',
      isMobileSubscriber: true,
      clientName: 'Tech Solutions Inc.',
      mobileRegistrationDate: '2024-02-18T15:45:00Z',
    },
    {
      id: '7',
      name: 'Daniel Martinez',
      email: 'daniel.m@example.com',
      isMobileSubscriber: false,
      clientName: 'Global Enterprises',
    },
    {
      id: '8',
      name: 'Olivia Thompson',
      email: 'olivia.t@example.com',
      isMobileSubscriber: true,
      clientName: 'Acme Corp',
      mobileRegistrationDate: '2023-11-30T09:10:00Z',
    },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      </Card>
      
      <Card className="glass-card">
        <Table>
          <TableCaption>A list of travellers based on PNRs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Name
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
                  <Smartphone className="h-4 w-4" />
                  Mobile Registered
                </div>
              </TableHead>
              <TableHead className="text-left">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Registration Date
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No customers found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium text-left">{user.name}</TableCell>
                  <TableCell className="text-left">{user.email}</TableCell>
                  <TableCell className="text-left">{user.clientName}</TableCell>
                  <TableCell className="text-left">
                    <Badge 
                      variant={user.isMobileSubscriber ? "default" : "outline"}
                      className={user.isMobileSubscriber ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                    >
                      {user.isMobileSubscriber ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">{formatDate(user.mobileRegistrationDate)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
};

export default Users;
