
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
  Eye
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
import { Traveler } from '@/types/customer.types';
import CustomerPagination from './CustomerPagination';
import CustomerDetailModal from './CustomerDetailModal';

interface CustomerTableProps {
  currentTravelers: Traveler[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  currentTravelers,
  currentPage,
  totalPages,
  setCurrentPage,
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
            <TableHead className="w-[50px]"></TableHead>
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
