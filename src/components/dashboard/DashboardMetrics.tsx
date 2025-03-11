
import React from 'react';
import DashboardCard from '@/components/DashboardCard';
import { Wallet, Map, Clock, AlertTriangle } from 'lucide-react';
import { CreditInfo } from '@/hooks/useCredits';

interface DashboardMetricsProps {
  creditInfo: CreditInfo | null;
  isCreditsLoading: boolean;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  creditInfo,
  isCreditsLoading
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {creditInfo ? (
        <DashboardCard 
          title="Credit Balance" 
          value={`${creditInfo.remainingCredits} / ${creditInfo.totalCredits}`} 
          icon={<Wallet className="h-8 w-8 text-primary" />}
          trend={{
            value: creditInfo.usagePercentage,
            isPositive: creditInfo.usagePercentage < 80
          }}
        />
      ) : isCreditsLoading ? (
        <div className="bg-card rounded-lg border border-border p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DashboardCard 
          title="Credit Balance" 
          value="Error loading credits" 
          icon={<Wallet className="h-8 w-8 text-primary" />}
        />
      )}
      
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
