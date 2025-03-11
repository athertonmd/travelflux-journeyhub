
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Smartphone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MobilePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Mobile Travel Solutions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empower your clients with a branded mobile experience for seamless travel management on the go.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">White-labeled mobile app</h2>
              <p className="text-gray-600">
                Provide your clients with a customized mobile app experience that reflects your brand. 
                Your clients can access their travel itineraries, documents, and receive real-time notifications.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 rounded-full p-1">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  <span>Customized branding with your logo and colors</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 rounded-full p-1">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  <span>Available for both iOS and Android devices</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 rounded-full p-1">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  <span>Offline access to travel documents and itineraries</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 w-full h-full flex items-center justify-center">
                <img 
                  src="/placeholder.svg" 
                  alt="Mobile app showcase" 
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Key Mobile Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2">Real-time updates</h3>
                <p className="text-gray-600">Instantly notify travelers about flight changes, gate updates, and other critical information.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2">Travel documents access</h3>
                <p className="text-gray-600">All travel documents, e-tickets, and booking confirmations available in one place.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2">Interactive itineraries</h3>
                <p className="text-gray-600">Dynamic, day-by-day itineraries with maps, directions, and activity details.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="animated-border-button">
              <Link to="/contact">Get started with mobile</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MobilePage;
