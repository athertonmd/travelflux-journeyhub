
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const PricingSection = () => {
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

  return (
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
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`
                glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-md 
                ${plan.popular ? 'border-2 border-primary relative' : 'border border-gray-100'} 
              `}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">
                {plan.name === "Professional" ? "GDS Connectivity" : plan.name}
              </h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                asChild 
                className={`w-full ${plan.popular ? 'animated-border-button' : ''}`} 
                variant={plan.popular ? 'default' : 'outline'}
              >
                <Link to={plan.cta === 'Contact sales' ? '/contact' : '/signup'}>
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
