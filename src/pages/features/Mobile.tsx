
import React from 'react';
import { Smartphone, Tablet, Download, RotateCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Mobile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Mobile Travel App
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Provide your clients with a seamless mobile experience to access their travel plans anywhere.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Brand, Your App</h2>
              <p className="text-gray-600 mb-6">
                Our white-labeled mobile app allows you to provide a branded experience to your clients. 
                Your logo, your colors, your app – all without the cost of custom development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex gap-2">
                  <Download size={16} />
                  See Demo
                </Button>
                <Button variant="outline">Contact Sales</Button>
              </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-xl flex justify-center">
              <div className="relative">
                <Smartphone className="h-64 w-auto text-gray-800" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-40 bg-primary/10 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Smartphone className="h-8 w-8" />,
                  title: "Itinerary Access",
                  description: "Travelers can access their full itinerary details including flights, hotels, and activities."
                },
                {
                  icon: <RotateCw className="h-8 w-8" />,
                  title: "Real-time Updates",
                  description: "Push notifications for flight changes, gate updates, and other critical travel information."
                },
                {
                  icon: <Tablet className="h-8 w-8" />,
                  title: "Cross-device Sync",
                  description: "Seamless experience across mobile, tablet, and web interfaces."
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

export default Mobile;
