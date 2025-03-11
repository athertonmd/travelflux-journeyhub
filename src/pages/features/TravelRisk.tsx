
import React from 'react';
import { ShieldAlert, MapPin, AlertTriangle, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const TravelRisk = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Travel Risk Management
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Keep your travelers safe with comprehensive risk management and real-time alerts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
            <div className="bg-gray-100 p-8 rounded-xl flex justify-center order-2 md:order-1">
              <div className="relative w-full max-w-sm">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Globe className="h-8 w-8 text-primary mr-3" />
                    <div className="h-6 w-32 bg-gray-300 rounded"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start p-3 bg-red-50 rounded-lg border border-red-100">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="h-4 w-full bg-red-100 rounded mb-2"></div>
                        <div className="h-3 w-3/4 bg-red-100 rounded"></div>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="h-4 w-full bg-amber-100 rounded mb-2"></div>
                        <div className="h-3 w-2/3 bg-amber-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-semibold mb-4">Proactive Risk Management</h2>
              <p className="text-gray-600 mb-6">
                Our travel risk management solution helps you identify potential risks before they impact your travelers. 
                Receive real-time alerts about safety, security, and health concerns at your travelers' destinations.
              </p>
              <Button className="flex gap-2">
                <ShieldAlert size={16} />
                Learn About Risk Features
              </Button>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">Risk Management Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <ShieldAlert className="h-8 w-8" />,
                  title: "Risk Assessment",
                  description: "Pre-trip risk assessments for all destinations with detailed safety information."
                },
                {
                  icon: <MapPin className="h-8 w-8" />,
                  title: "Location Monitoring",
                  description: "Real-time location tracking for travelers with check-in capabilities."
                },
                {
                  icon: <AlertTriangle className="h-8 w-8" />,
                  title: "Emergency Alerts",
                  description: "Instant notifications for emergencies and critical situations at destination."
                }
              ].map((feature, index) => (
                <div key={index} className="glass-card p-6 rounded-xl">
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TravelRisk;
