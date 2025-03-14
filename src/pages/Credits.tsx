
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, History } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import PurchaseCreditsModal from '@/components/PurchaseCreditsModal';
import { Skeleton } from '@/components/ui/skeleton';
import LoadingSpinner from '@/components/auth/LoadingSpinner';

const Credits = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { creditInfo, isLoading, purchaseCredits } = useCredits();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handlePurchaseClick = () => {
    setIsPurchaseModalOpen(true);
  };

  const handlePurchaseConfirm = async (amount: number) => {
    await purchaseCredits(amount);
    setIsPurchaseModalOpen(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Credit Management</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
                <p className="ml-2">Loading credit information...</p>
              </div>
            ) : creditInfo ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Your Credit Balance
                    </CardTitle>
                    <CardDescription>
                      {creditInfo.isFreeTier 
                        ? 'You are currently using free trial credits' 
                        : 'Your purchased credit balance'
                      }
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Credits Used</p>
                        <p className="text-3xl font-bold">{creditInfo.usedCredits}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Credits Remaining</p>
                        <p className="text-3xl font-bold">{creditInfo.remainingCredits}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Total Credits</p>
                        <p className="text-3xl font-bold">{creditInfo.totalCredits}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Usage: {creditInfo.usagePercentage}%</span>
                      </div>
                      <Progress value={creditInfo.usagePercentage} className="h-2" />
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      onClick={handlePurchaseClick} 
                      className="w-full"
                    >
                      {creditInfo.isFreeTier ? 'Upgrade to Paid Plan' : 'Purchase More Credits'}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5 text-primary" />
                      How Credits Work
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Credit Usage</h3>
                      <p className="text-muted-foreground">
                        1 credit is consumed per product per PNR. For example, if you use mobile, document delivery, 
                        and risk management features for a single PNR, that will consume 3 credits.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Free Tier</h3>
                      <p className="text-muted-foreground">
                        Your free trial includes {creditInfo.isFreeTier ? creditInfo.totalCredits : '30'} credits. 
                        Once depleted, you'll need to purchase additional credits to continue using premium features.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Credit Expiration</h3>
                      <p className="text-muted-foreground">
                        Credits do not expire and can be used at any time. Purchased credits are non-refundable.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Credit Information Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>There was an error loading your credit information. Please try refreshing the page.</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => window.location.reload()}>Refresh Page</Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </main>
      
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
  );
};

export default Credits;
