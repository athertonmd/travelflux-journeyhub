
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardCard from '@/components/DashboardCard';
import { 
  CreditCard, 
  Users, 
  BookOpen,
  BarChart as BarChartIcon, 
  Map,
  Clock,
  AlertTriangle,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.setupCompleted) {
      navigate('/welcome');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          
          <DashboardCard 
            title="Completed Trips" 
            value={24} 
            isPositive={true} 
            changeValue={6}
            icon={<BarChartIcon className="h-8 w-8 text-primary" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-6">Credit Usage</h2>
            <div className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground">Chart visualization coming soon</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
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
      </main>
    </div>
  );
};

export default Dashboard;
