
import React from 'react';
import { Calendar, GlobeLock, FileSearch, Smartphone, Users, LineChart } from 'lucide-react';

const FeatureSection = () => {
  const features = [{
    title: 'Itinerary Management',
    description: 'Create and manage detailed travel itineraries with drag-and-drop simplicity.',
    icon: <Calendar className="h-10 w-10" />
  }, {
    title: 'Document Generation',
    description: 'Automatically generate and deliver travel documents to your clients.',
    icon: <FileSearch className="h-10 w-10" />
  }, {
    title: 'Mobile Travel App',
    description: 'White-labeled mobile app for your clients to access their travel information.',
    icon: <Smartphone className="h-10 w-10" />
  }, {
    title: 'Hybrid Itineraries',
    description: 'Secure client portal for accessing all travel information and documents.',
    icon: <GlobeLock className="h-10 w-10" />
  }, {
    title: 'Customer Management',
    description: 'Organize and manage your customer database with ease.',
    icon: <Users className="h-10 w-10" />
  }, {
    title: 'Analytics Dashboard',
    description: 'Visualize your business performance with comprehensive analytics.',
    icon: <LineChart className="h-10 w-10" />
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
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
    </section>
  );
};

export default FeatureSection;
