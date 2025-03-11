
import React from 'react';
import { FileText, Mail, Send, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const DocumentDelivery = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Document Delivery
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Automate the creation and delivery of travel documents to enhance client experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
            <div className="bg-gray-100 p-8 rounded-xl flex justify-center order-2 md:order-1">
              <div className="relative w-full max-w-sm">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-4 transform rotate-[-5deg]">
                  <div className="h-6 w-24 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-24 w-full bg-gray-100 rounded mb-3"></div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 transform rotate-[3deg] absolute top-12 right-4">
                  <div className="h-6 w-24 bg-primary/20 rounded mb-4"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-semibold mb-4">Automated Document Generation</h2>
              <p className="text-gray-600 mb-6">
                Create professional travel documents in seconds, customize templates to match your brand, and deliver them to your clients via email or SMS.
              </p>
              <Button className="flex gap-2">
                <Send size={16} />
                Request Demo
              </Button>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">Document Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <FileText className="h-8 w-8" />,
                  title: "Custom Templates",
                  description: "Create branded templates for different types of travel documents."
                },
                {
                  icon: <Mail className="h-8 w-8" />,
                  title: "Automated Delivery",
                  description: "Schedule document delivery at key points in the travel journey."
                },
                {
                  icon: <Clock className="h-8 w-8" />,
                  title: "Real-time Updates",
                  description: "Automatically update and resend documents when travel details change."
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

export default DocumentDelivery;
