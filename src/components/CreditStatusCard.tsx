
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CreditInfo } from '@/hooks/useCredits';
import { AlertTriangle, CreditCard, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface CreditStatusCardProps {
  creditInfo: CreditInfo;
  onPurchaseClick: () => void;
  isLoading?: boolean;
}

const CreditStatusCard: React.FC<CreditStatusCardProps> = ({
  creditInfo,
  onPurchaseClick,
  isLoading = false
}) => {
  const isLowOnCredits = creditInfo.usagePercentage >= 80;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Credit Balance
        </CardTitle>
        <CardDescription>
          {creditInfo.isFreeTier ? 'Free Trial Credits' : 'Purchased Credits'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Used: {creditInfo.usedCredits} credits</span>
            <span>Total: {creditInfo.totalCredits} credits</span>
          </div>
          <Progress value={creditInfo.usagePercentage} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium">
            {creditInfo.remainingCredits} credits remaining
          </div>
          {isLowOnCredits && (
            <div className="flex items-center text-amber-500 text-sm">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span>Low credits</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onPurchaseClick} 
          className="w-full"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          {creditInfo.isFreeTier ? 'Upgrade to Paid Plan' : 'Purchase More Credits'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreditStatusCard;
