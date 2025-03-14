
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

interface Trip {
  id: string;
  recordLocator: string;
  travellerName: string;
  clientName: string;
  dateBooked: string;
}

const TripLog: React.FC = () => {
  const navigate = useNavigate();

  // Mock trip data
  const trips: Trip[] = [
    {
      id: '1',
      recordLocator: 'ABC123',
      travellerName: 'John Smith',
      clientName: 'Acme Corp',
      dateBooked: '2023-09-15',
    },
    {
      id: '2',
      recordLocator: 'DEF456',
      travellerName: 'Sarah Johnson',
      clientName: 'Tech Solutions Inc.',
      dateBooked: '2023-09-18',
    },
    {
      id: '3',
      recordLocator: 'GHI789',
      travellerName: 'Michael Brown',
      clientName: 'Global Enterprises',
      dateBooked: '2023-09-22',
    },
    {
      id: '4',
      recordLocator: 'JKL012',
      travellerName: 'Emily Davis',
      clientName: 'Acme Corp',
      dateBooked: '2023-09-25',
    },
    {
      id: '5',
      recordLocator: 'MNO345',
      travellerName: 'Robert Wilson',
      clientName: 'Digital Innovations',
      dateBooked: '2023-09-28',
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
        <h1 className="text-2xl font-bold">Trip Log</h1>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <Table>
          <TableCaption>A list of your recent trips</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Record Locator</TableHead>
              <TableHead>Traveller Name</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Date Booked</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell className="font-medium">{trip.recordLocator}</TableCell>
                <TableCell>{trip.travellerName}</TableCell>
                <TableCell>{trip.clientName}</TableCell>
                <TableCell>{trip.dateBooked}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TripLog;
