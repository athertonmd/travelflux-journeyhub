
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { HomeIcon } from 'lucide-react';

const ItineraryHeader: React.FC = () => {
  return (
    <div className="space-y-2">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard" className="flex items-center gap-1">
                <HomeIcon className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Itineraries</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <h1 className="text-3xl font-display font-bold">Itineraries</h1>
    </div>
  );
};

export default ItineraryHeader;
