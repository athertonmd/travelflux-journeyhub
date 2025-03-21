
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { Itinerary } from '@/types/itinerary.types';

interface ItineraryTableProps {
  itineraries: Itinerary[];
  onSelectItinerary: (itinerary: Itinerary) => void;
  selectedItineraryId?: string;
}

const ItineraryTable: React.FC<ItineraryTableProps> = ({
  itineraries,
  onSelectItinerary,
  selectedItineraryId
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <div className="rounded-md border glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-left">Record Locator</TableHead>
            <TableHead className="text-left">Traveler</TableHead>
            <TableHead className="text-left">Travel Dates</TableHead>
            <TableHead className="text-left">Date Received</TableHead>
            <TableHead className="text-left">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itineraries.map((itinerary) => (
            <TableRow 
              key={itinerary.id}
              className={`cursor-pointer ${selectedItineraryId === itinerary.id ? 'bg-muted' : ''}`}
              onClick={() => onSelectItinerary(itinerary)}
            >
              <TableCell className="font-medium text-left">{itinerary.recordLocator}</TableCell>
              <TableCell className="text-left">
                <div className="font-medium">{itinerary.customer}</div>
                {itinerary.customerEmail && (
                  <div className="text-xs text-muted-foreground">{itinerary.customerEmail}</div>
                )}
              </TableCell>
              <TableCell className="text-left">{formatDateRange(itinerary.startDate, itinerary.endDate)}</TableCell>
              <TableCell className="text-left">
                <div>{new Date(itinerary.dateReceived).toLocaleDateString()}</div>
                <div className="text-xs text-muted-foreground">{getTimeAgo(itinerary.dateReceived)}</div>
              </TableCell>
              <TableCell className="text-left">
                <Badge className={`${getStatusColor(itinerary.status)}`}>
                  {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ItineraryTable;
