
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldAlert, Map, AlertTriangle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RiskManagementPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Travel Risk Management</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Protect your travelers with comprehensive risk assessment, real-time alerts, and duty of care solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Comprehensive duty of care</h2>
              <p className="text-gray-600">
                Our risk management solution helps travel agencies meet their duty of care obligations by providing real-time monitoring, alerts, and support for travelers worldwide.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <Map className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Traveler tracking</h3>
                    <p className="text-sm text-gray-600">Real-time location tracking of all travelers on a global map.</p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Risk intelligence</h3>
                    <p className="text-sm text-gray-600">Data-driven risk assessments for destinations worldwide.</p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <Bell className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Alert system</h3>
                    <p className="text-sm text-gray-600">Instant notifications about emerging risks and incidents.</p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <ShieldAlert className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Emergency support</h3>
                    <p className="text-sm text-gray-600">24/7 assistance for travelers facing emergencies.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="aspect-w-4 aspect-h-3 w-full h-full flex items-center justify-center">
                <img 
                  src="/placeholder.svg" 
                  alt="Risk management dashboard" 
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl p-8 mb-16 border border-red-100">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Risk Management Matters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2 text-red-700">Legal compliance</h3>
                <p className="text-gray-600">Meet legal duty of care requirements and reduce corporate liability.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2 text-red-700">Traveler confidence</h3>
                <p className="text-gray-600">Increase traveler peace of mind with proactive safety measures.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2 text-red-700">Crisis management</h3>
                <p className="text-gray-600">Effectively respond to incidents and emergencies with established protocols.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="animated-border-button">
              <Link to="/contact">Enhance your risk management</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RiskManagementPage;
