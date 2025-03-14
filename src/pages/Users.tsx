
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface User {
  id: string;
  name: string;
  email: string;
  isMobileSubscriber: boolean;
  clientName: string;
}

const Users: React.FC = () => {
  const navigate = useNavigate();

  // Mock user data
  const users: User[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      isMobileSubscriber: true,
      clientName: 'Acme Corp',
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
    },
  ];

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
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <Table>
          <TableCaption>A list of unique travellers based on PNRs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Mobile Subscriber</TableHead>
              <TableHead>Client Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isMobileSubscriber ? 'Yes' : 'No'}</TableCell>
                <TableCell>{user.clientName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
