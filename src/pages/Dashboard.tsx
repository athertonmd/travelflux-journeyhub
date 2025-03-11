
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardCard from '@/components/DashboardCard';
import { ArrowRight, BarChart3, Users, Calendar, Globe, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    } else if (user && !user.setupCompleted) {
      navigate('/welcome');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Bookings"
              value="0"
              description="Bookings in the last 30 days"
              icon={<Calendar className="h-6 w-6 text-blue-500" />}
              trend={{
                value: 0,
                isPositive: true,
                text: "from last period"
              }}
            />
            <DashboardCard
              title="Travelers"
              value="0"
              description="Active travelers"
              icon={<Users className="h-6 w-6 text-green-500" />}
              trend={{
                value: 0,
                isPositive: true,
                text: "from last period"
              }}
            />
            <DashboardCard
              title="Destinations"
              value="0"
              description="Unique destinations booked"
              icon={<Globe className="h-6 w-6 text-purple-500" />}
              trend={{
                value: 0,
                isPositive: true,
                text: "from last period"
              }}
            />
            <DashboardCard
              title="Credits Used"
              value="0/10"
              description="Free credits used this month"
              icon={<BarChart3 className="h-6 w-6 text-amber-500" />}
              trend={{
                value: 0,
                isPositive: true,
                text: "remaining this month"
              }}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Import your first booking</CardTitle>
                <CardDescription>
                  Start by importing your first booking from your GDS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Connect to your GDS and import your first booking to see it in Tripscape.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Import Booking
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Set up your mobile app</CardTitle>
                <CardDescription>
                  Customize the mobile app for your travelers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Configure your mobile app branding, notifications, and features.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Configure App
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invite team members</CardTitle>
                <CardDescription>
                  Add colleagues to help manage your Tripscape account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Invite team members to collaborate on managing travel for your organization.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Invite Team
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
