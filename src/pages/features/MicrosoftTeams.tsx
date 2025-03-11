
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MessageSquare, Users, Calendar, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MicrosoftTeamsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Microsoft Teams Integration</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhance your corporate travel management with seamless Microsoft Teams integration.
            </p>
          </div>

          <div className="mb-16">
            <div className="bg-[#444791]/10 rounded-xl p-8 border border-[#444791]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Bring travel into your workspace</h2>
                  <p className="text-gray-600 mb-6">
                    Integrate Tripscape directly into Microsoft Teams to streamline corporate travel management without leaving your communication platform.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="mr-3 bg-[#444791]/10 rounded-full p-2">
                        <Users className="h-5 w-5 text-[#444791]" />
                      </div>
                      <span>Book and manage travel within Teams channels</span>
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 bg-[#444791]/10 rounded-full p-2">
                        <Calendar className="h-5 w-5 text-[#444791]" />
                      </div>
                      <span>Automatic calendar integration for travel events</span>
                    </li>
                    <li className="flex items-center">
                      <div className="mr-3 bg-[#444791]/10 rounded-full p-2">
                        <Globe className="h-5 w-5 text-[#444791]" />
                      </div>
                      <span>Travel approval workflows in Teams</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <img 
                    src="/placeholder.svg" 
                    alt="Microsoft Teams integration" 
                    className="w-full rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Travel Bot</h3>
              <p className="text-gray-600 mb-4">
                AI-powered chatbot that helps employees find and book travel options directly in Teams.
              </p>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• Natural language processing</li>
                <li>• Policy-compliant suggestions</li>
                <li>• Quick booking confirmations</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Approval Workflows</h3>
              <p className="text-gray-600 mb-4">
                Streamline travel approvals with automated workflows that notify managers and track status.
              </p>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• Custom approval chains</li>
                <li>• Real-time notifications</li>
                <li>• Audit trail and reporting</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
              <p className="text-gray-600 mb-4">
                Enhanced collaboration for team travel with shared itineraries and group booking management.
              </p>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>• Group travel coordination</li>
                <li>• Shared documents and itineraries</li>
                <li>• Team expense tracking</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="animated-border-button">
              <Link to="/contact">Get Microsoft Teams integration</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MicrosoftTeamsPage;
