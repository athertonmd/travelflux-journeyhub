import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const DocumentDeliveryPage = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Document Delivery</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Automate the delivery of professional travel documents to your clients with our advanced document generation system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 w-full h-full flex items-center justify-center">
                <img src="/placeholder.svg" alt="Document delivery showcase" className="object-cover" />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Streamlined document distribution</h2>
              <p className="text-gray-600">
                Save time and reduce manual effort with automatic document generation and distribution.
                Our system creates professionally branded documents and delivers them to your clients.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                  <span>Automatic PDF generation with your branding</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                  <span>Email delivery with tracking and analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                  <span>Custom templates for different types of travel</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                  <span>Secure document storage and retrieval</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Document Types</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2">Itineraries</h3>
                <p className="text-gray-600">Active and passive segments, remarks, quick links and optional ads</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2">E-Tickets</h3>
                <p className="text-gray-600">Electronic tickets for flights, trains, and other transportation.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2">Booking Confirmations</h3>
                <p className="text-gray-600">Hotel, car rental, and activity booking confirmations.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold mb-2">Integrated Invoice</h3>
                <p className="text-gray-600">The latest invoice information integrated with your itinerary</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="animated-border-button">
              <Link to="/contact">Learn about document delivery</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default DocumentDeliveryPage;