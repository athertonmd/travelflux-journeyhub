
import React from 'react';
import { Smartphone, FileText, Users, ShieldAlert, Calendar, GlobeLock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FeatureSection = () => {
  const mainFeatures = [{
    id: 'mobile',
    title: 'Mobile',
    description: 'White-labeled mobile app for your clients to access their travel information on the go.',
    icon: <Smartphone className="h-10 w-10" />,
    path: '/features/mobile'
  }, {
    id: 'document-delivery',
    title: 'Document Delivery',
    description: 'Automatically generate and deliver travel documents to your clients via email or SMS.',
    icon: <FileText className="h-10 w-10" />,
    path: '/features/document-delivery'
  }, {
    id: 'microsoft-teams',
    title: 'Microsoft Teams',
    description: 'Integrate with Microsoft Teams for seamless communication and collaboration with your clients.',
    icon: <Users className="h-10 w-10" />,
    path: '/features/microsoft-teams'
  }, {
    id: 'travel-risk',
    title: 'Travel Risk',
    description: 'Keep your travelers safe with real-time risk alerts and comprehensive safety information.',
    icon: <ShieldAlert className="h-10 w-10" />,
    path: '/features/travel-risk'
  }];

  const additionalFeatures = [{
    title: 'Itinerary Management',
    description: 'Create and manage detailed travel itineraries with drag-and-drop simplicity.',
    icon: <Calendar className="h-10 w-10" />
  }, {
    title: 'Hybrid Itineraries',
    description: 'Secure client portal for accessing all travel information and documents.',
    icon: <GlobeLock className="h-10 w-10" />
  }];

  return (
    <section id="features" className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Everything your travel agency needs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your operations and impress your clients with our comprehensive suite of tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {mainFeatures.map((feature) => (
            <div 
              key={feature.id} 
              className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-md border border-gray-100 flex flex-col h-full"
            >
              <div className="text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{feature.description}</p>
              <Button variant="outline" asChild className="w-full mt-2">
                <Link to={feature.path}>Learn more</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-display font-semibold text-center mb-8">Additional Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-md border border-gray-100">
                <div className="text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
