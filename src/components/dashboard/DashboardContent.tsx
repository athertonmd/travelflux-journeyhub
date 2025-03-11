
import React from 'react';
import { Button } from '@/components/ui/button';
import CreditStatusCard from '@/components/CreditStatusCard';
import { CreditInfo } from '@/hooks/useCredits';
import RecentActivitySection from '@/components/dashboard/RecentActivitySection';

interface DashboardContentProps {
  creditInfo: CreditInfo | null;
  isCreditsLoading: boolean;
  onPurchaseClick: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  creditInfo,
  isCreditsLoading,
  onPurchaseClick
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {creditInfo ? (
        <CreditStatusCard 
          creditInfo={creditInfo}
          onPurchaseClick={onPurchaseClick}
          isLoading={isCreditsLoading}
        />
      ) : isCreditsLoading ? (
        <div className="bg-card rounded-lg border border-border p-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-medium mb-2">Credit Status</h3>
          <p>Unable to load credit information. Please try again later.</p>
          <Button 
            variant="outline"
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      <RecentActivitySection />
    </div>
  );
};

export default DashboardContent;
