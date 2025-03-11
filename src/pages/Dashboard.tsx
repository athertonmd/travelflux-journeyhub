import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardCard from '@/components/DashboardCard';
import { 
  CreditCard, 
  Users, 
  BookOpen,
  Map,
  Clock,
  AlertTriangle,
  Settings,
  HelpCircle,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCredits } from '@/hooks/useCredits';
import CreditStatusCard from '@/components/CreditStatusCard';
import PurchaseCreditsModal from '@/components/PurchaseCreditsModal';
import LoadingSpinner from '@/components/auth/LoadingSpinner';

const Dashboard = () => {
  console.log('Dashboard component rendering');
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { creditInfo, isLoading: isCreditsLoading, purchaseCredits } = useCredits();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  console.log('Auth state:', { user, isAuthLoading });
  console.log('Credits state:', { creditInfo, isCreditsLoading });

  useEffect(() => {
    console.log('Dashboard useEffect - checking auth state');
    if (!isAuthLoading && !user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
    } else if (!isAuthLoading && user && !user.setupCompleted) {
      console.log('Setup not completed, redirecting to welcome');
      navigate('/welcome');
    }
  }, [user, isAuthLoading, navigate]);

  // If we're still loading auth, show loading spinner
  if (isAuthLoading) {
    console.log('Auth is still loading, showing spinner');
    return <LoadingSpinner />;
  }

  // If no user and not loading, redirect (the useEffect will handle this)
  if (!user) {
    console.log('No user found and not loading');
    return null;
  }

  // Now we know we have a user and auth is not loading
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Agency Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user.name || user.email}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {creditInfo ? (
            <CreditStatusCard 
              creditInfo={creditInfo}
              onPurchaseClick={() => setIsPurchaseModalOpen(true)}
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
            </div>
          )}

          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 pb-4 border-b border-border">
                <div className="bg-primary/10 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">New booking processed</p>
                  <p className="text-sm text-muted-foreground">NYC to SFO - John Smith</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </li>
              <li className="flex items-start gap-4 pb-4 border-b border-border">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Credits purchased</p>
                  <p className="text-sm text-muted-foreground">100 booking credits added</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">New traveler added</p>
                  <p className="text-sm text-muted-foreground">Sarah Johnson added to your company</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {creditInfo && (
          <PurchaseCreditsModal
            isOpen={isPurchaseModalOpen}
            onClose={() => setIsPurchaseModalOpen(false)}
            onPurchase={purchaseCredits}
            creditInfo={creditInfo}
            isLoading={isCreditsLoading}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
