
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardCard from '@/components/DashboardCard';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Users,
  Calendar,
  FileText,
  ArrowUp,
  Activity,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data
const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4000 },
  { name: 'May', value: 7000 },
  { name: 'Jun', value: 6000 },
  { name: 'Jul', value: 8000 },
];

const recentActivities = [
  { id: 1, type: 'New Booking', client: 'Sarah Johnson', description: 'Booked Paris vacation', time: '2 hours ago' },
  { id: 2, type: 'Document Generated', client: 'Michael Chen', description: 'Flight tickets PDF', time: '4 hours ago' },
  { id: 3, type: 'Itinerary Updated', client: 'Emma Wilson', description: 'Added museum tour', time: '1 day ago' },
  { id: 4, type: 'New Customer', client: 'David Thompson', description: 'Added contact details', time: '1 day ago' },
  { id: 5, type: 'Payment Received', client: 'Alex Rivera', description: 'For Italy package', time: '2 days ago' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-3xl font-display font-bold mt-8">Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard 
              title="Total Customers"
              icon={<Users size={18} />}
              value="128"
              trend={{ value: 12, isPositive: true }}
            />
            <DashboardCard 
              title="Active Itineraries"
              icon={<Calendar size={18} />}
              value="24"
              trend={{ value: 8, isPositive: true }}
            />
            <DashboardCard 
              title="Documents Generated"
              icon={<FileText size={18} />}
              value="156"
              trend={{ value: 5, isPositive: true }}
            />
            <DashboardCard 
              title="App Usage"
              icon={<Activity size={18} />}
              value="87%"
              trend={{ value: 3, isPositive: true }}
            />
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <Card className="lg:col-span-2 glass-card">
              <CardHeader>
                <CardTitle>Booking Overview</CardTitle>
                <CardDescription>Number of bookings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={false}
                        axisLine={{ stroke: '#f0f0f0' }}
                      />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={false}
                        axisLine={{ stroke: '#f0f0f0' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates in your agency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[300px] overflow-y-auto subtle-scrollbar pr-2">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex space-x-3 items-start border-b border-gray-100 pb-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium">{activity.type}</p>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-sm text-primary">{activity.client}</p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-2 border-t border-gray-100">
                  <Button asChild variant="ghost" className="w-full justify-between">
                    <div>
                      View all activity
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => navigate('/itineraries/create')}
              className="glass-card justify-start space-x-2 h-auto py-4 px-6 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20"
            >
              <Plus size={16} />
              <div className="text-left">
                <div className="font-medium">New Itinerary</div>
                <div className="text-xs text-primary/70">Create a new travel itinerary</div>
              </div>
            </Button>
            <Button 
              onClick={() => navigate('/customers/add')}
              className="glass-card justify-start space-x-2 h-auto py-4 px-6 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20"
            >
              <Plus size={16} />
              <div className="text-left">
                <div className="font-medium">Add Customer</div>
                <div className="text-xs text-primary/70">Add a new customer to your system</div>
              </div>
            </Button>
            <Button 
              onClick={() => navigate('/documents/generate')}
              className="glass-card justify-start space-x-2 h-auto py-4 px-6 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20"
            >
              <Plus size={16} />
              <div className="text-left">
                <div className="font-medium">Generate Document</div>
                <div className="text-xs text-primary/70">Create travel documents for clients</div>
              </div>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
