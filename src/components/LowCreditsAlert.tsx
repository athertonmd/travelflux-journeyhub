
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreditInfo } from '@/hooks/useCredits';

interface LowCreditsAlertProps {
  creditInfo: CreditInfo;
  onPurchaseClick: () => void;
}

const LowCreditsAlert: React.FC<LowCreditsAlertProps> = ({ creditInfo, onPurchaseClick }) => {
  // Only show if credits are low (less than 20% remaining)
  if (!creditInfo || creditInfo.usagePercentage < 80) {
    return null;
  }

  return (
    <Alert variant="warning" className="bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-800">Low Credits</AlertTitle>
      <AlertDescription className="text-amber-700">
        <p>You only have {creditInfo.remainingCredits} credits remaining.</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPurchaseClick}
          className="mt-2 bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
        >
          Purchase More Credits
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default LowCreditsAlert;
