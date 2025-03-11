
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CtaSection = () => {
  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
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
              <Button size="lg" className="animated-border-button" onClick={scrollToPricing}>
                Get started today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-center">
              <img src="https://placehold.co/600x400/f5f9ff/4287f5?text=App+Preview" alt="TravelFlux Mobile App" className="rounded-lg shadow-lg max-w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
