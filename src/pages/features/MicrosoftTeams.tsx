
import React from 'react';
import { Users, MessageSquare, Computer, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const MicrosoftTeams = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Microsoft Teams Integration
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seamlessly connect your travel services with Microsoft Teams for better collaboration and communication.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Bring Travel to Teams</h2>
              <p className="text-gray-600 mb-6">
                With our Microsoft Teams integration, your clients can access their travel information, 
                communicate with your agency, and collaborate on trip planning without leaving Teams.
              </p>
              <Button className="flex gap-2">
                <Computer size={16} />
                See Integration Demo
              </Button>
            </div>
            <div className="bg-gray-100 p-8 rounded-xl flex justify-center">
              <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center mb-4 pb-2 border-b">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Users size={18} />
                  </div>
                  <span className="ml-2 font-medium">Tripscape Teams App</span>
                </div>
                <div className="space-y-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <div className="text-sm text-gray-600">Your upcoming trip to San Francisco</div>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg ml-8">
                    <div className="text-sm text-gray-700">Flight details updated: Departure at 10:15 AM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">Teams Integration Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <MessageSquare className="h-8 w-8" />,
                  title: "Chat Support",
                  description: "Provide travel support directly through Teams chat interface."
                },
                {
                  icon: <Share2 className="h-8 w-8" />,
                  title: "Document Sharing",
                  description: "Share and collaborate on travel plans and documents in Teams."
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Group Travel Planning",
                  description: "Simplify group travel coordination through dedicated Teams channels."
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

export default MicrosoftTeams;
