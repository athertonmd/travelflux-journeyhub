
import React, { useState } from 'react';
import RecentActivitySection from '@/components/dashboard/RecentActivitySection';
import CreditStatusCard from '@/components/CreditStatusCard';
import PurchaseCreditsModal from '@/components/PurchaseCreditsModal';
import { useCredits } from '@/hooks/useCredits';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import LowCreditsAlert from '@/components/LowCreditsAlert';

const DashboardContent = () => {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const { creditInfo, isLoading, error, purchaseCredits } = useCredits();

  const handlePurchaseClick = () => {
    setIsPurchaseModalOpen(true);
  };

  const handlePurchaseConfirm = async (amount: number) => {
    await purchaseCredits(amount);
    setIsPurchaseModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <RecentActivitySection />
      </div>
      
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error loading your credit information.
            </AlertDescription>
          </Alert>
        )}
        
        {creditInfo && (
          <>
            <LowCreditsAlert 
              creditInfo={creditInfo}
              onPurchaseClick={handlePurchaseClick}
            />
            <CreditStatusCard 
              creditInfo={creditInfo}
              onPurchaseClick={handlePurchaseClick}
              isLoading={isLoading}
            />
          </>
        )}
        
        {isPurchaseModalOpen && creditInfo && (
          <PurchaseCreditsModal
            isOpen={isPurchaseModalOpen}
            onClose={() => setIsPurchaseModalOpen(false)}
            onPurchase={handlePurchaseConfirm}
            creditInfo={creditInfo}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
