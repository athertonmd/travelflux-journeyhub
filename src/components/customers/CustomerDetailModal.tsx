
import React from 'react';
import { format } from 'date-fns';
import { 
  User, 
  Mail, 
  Building,
  Phone,
  Calendar, 
  Smartphone, 
  FileText,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Traveler } from '@/types/customer.types';

interface CustomerDetailModalProps {
  traveler: Traveler | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  traveler,
  isOpen,
  onClose
}) => {
  if (!traveler) return null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy h:mm a');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Customer Details</DialogTitle>
          <DialogDescription>
            Detailed information about the customer.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 mt-1 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Traveler Name</h3>
                <p className="text-base font-semibold">{traveler.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 mt-1 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
                <p className="text-base">{traveler.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 mt-1 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                <p className="text-base">{traveler.clientName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 mt-1 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Telephone Number</h3>
                <p className="text-base">{traveler.phoneNumber}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 mt-1 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Enrolled Date</h3>
                <p className="text-base">{formatDate(traveler.enrolledDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 mt-1 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Mobile User</h3>
                <Badge 
                  variant={traveler.isMobileUser ? "default" : "outline"}
                  className={traveler.isMobileUser ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                >
                  {traveler.isMobileUser ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 mt-1 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Record Locator</h3>
                <p className="text-base">{traveler.recordLocator}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailModal;
