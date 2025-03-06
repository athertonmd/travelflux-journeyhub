import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, GlobeLock, FileSearch, Smartphone, Users, LineChart, UtilityPole, ArrowRight, CheckCircle2 } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    title: 'Client Portal',
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

  const pricingPlans = [{
    name: 'Starter',
    price: 29,
    description: 'Perfect for small agencies just getting started.',
    features: ['Up to 50 customers', 'Basic itinerary management', 'PDF document generation', 'Client web portal', 'Email support'],
    cta: 'Start free trial',
    popular: false
  }, {
    name: 'Professional',
    price: 79,
    description: 'Everything you need for a growing travel agency.',
    features: ['Up to 500 customers', 'Advanced itinerary management', 'Custom document templates', 'White-labeled mobile app', 'Customer management', 'Analytics dashboard', 'Priority support'],
    cta: 'Start free trial',
    popular: true
  }, {
    name: 'Enterprise',
    price: 199,
    description: 'Comprehensive solution for established agencies.',
    features: ['Unlimited customers', 'Advanced itinerary management', 'Custom document templates', 'White-labeled mobile app', 'Advanced customer management', 'Comprehensive analytics', 'API access', 'Dedicated account manager'],
    cta: 'Contact sales',
    popular: false
  }];

  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-slide-down">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Modernize Your Travel Agency
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              Beautiful travel itineraries, documents, and mobile apps for your clients. All in one platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="animated-border-button">
                <Link to="/signup">Start free trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/#features">Learn more</Link>
              </Button>
            </div>
          </div>
          
          <div className="mt-16 mb-8 relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-primary/5 rounded-xl transform rotate-1"></div>
            <Card className="glass-card border-primary/10 overflow-hidden shadow-xl">
              <CardContent className="p-0">
                <img src="https://placehold.co/1200x600/f5f9ff/4287f5?text=Dashboard+Preview" alt="TravelFlux Dashboard Preview" className="w-full h-auto object-cover" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
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
            {features.map((feature, index) => <div key={index} className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-md border border-gray-100">
                <div className="text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 skew-y-3 transform -translate-y-20"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="glass-card rounded-xl p-8 md:p-12 shadow-lg border border-primary/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Transform the way you serve your clients
                </h2>
                <p className="text-lg text-gray-600 mb-6">Join hundreds of travel agencies already using Tripscape to streamline their operations and enhance client satisfaction.</p>
                <Button asChild size="lg" className="animated-border-button">
                  <Link to="/signup">
                    Get started today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex justify-center">
                <img src="https://placehold.co/600x400/f5f9ff/4287f5?text=App+Preview" alt="TravelFlux Mobile App" className="rounded-lg shadow-lg max-w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 px-4 bg-gradient-to-b from-gray-50 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your travel agency.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => <div key={index} className={`
                  glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-md 
                  ${plan.popular ? 'border-2 border-primary relative' : 'border border-gray-100'} 
                `}>
                {plan.popular && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </div>}
                <h3 className="text-xl font-semibold mb-2">
                  {plan.name === "Professional" ? "GDS Connectivity" : plan.name}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>)}
                </ul>
                <Button asChild className={`w-full ${plan.popular ? 'animated-border-button' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                  <Link to={plan.cta === 'Contact sales' ? '/contact' : '/signup'}>
                    {plan.cta}
                  </Link>
                </Button>
              </div>)}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-xl p-8 md:p-12 shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Have questions?
                </h2>
                <p className="text-lg text-gray-600 mb-6">Our team is ready to help you get started with Tripscape. Contact us for a personalized demo or to learn more about our platform.</p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <UtilityPole className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email Us</h4>
                      <p className="text-gray-600">info@manticpoint.com.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Call Us</h4>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <Button asChild size="lg" className="animated-border-button">
                  <Link to="/contact">Schedule a demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>;
};

export default Index;
