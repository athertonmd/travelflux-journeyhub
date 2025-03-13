
import React from 'react';
import DashboardCard from '@/components/DashboardCard';
import { Map, Clock, AlertTriangle } from 'lucide-react';

const DashboardMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <DashboardCard 
        title="Active Trips" 
        value={12} 
        isPositive={true} 
        changeValue={4}
        icon={<Map className="h-8 w-8 text-primary" />} 
      />
      
      <DashboardCard 
        title="Upcoming Bookings" 
        value={8} 
        isPositive={true} 
        changeValue={2}
        icon={<Clock className="h-8 w-8 text-primary" />} 
      />
      
      <DashboardCard 
        title="Travel Alerts" 
        value={3} 
        isPositive={false} 
        changeValue={1}
        icon={<AlertTriangle className="h-8 w-8 text-primary" />} 
      />
    </div>
  );
};

export default DashboardMetrics;
