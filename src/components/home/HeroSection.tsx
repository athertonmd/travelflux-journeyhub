
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HeroSection = () => {
  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
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
            <Button size="lg" className="animated-border-button" onClick={scrollToPricing}>
              Start free trial
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#features">Learn more</a>
            </Button>
          </div>
        </div>
        
        <div className="mt-16 mb-8 relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-primary/5 rounded-xl transform rotate-1"></div>
          <Card className="glass-card border-primary/10 overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                {/* Using direct embed script from Synthesia */}
                <div 
                  id="synthesia-player" 
                  className="w-full h-full"
                  data-video-id="4fe30803-dd2d-4564-861d-35dbb3e25b71"
                >
                  <img 
                    src="/lovable-uploads/d6fadef4-f3df-4f27-93f8-a01123582118.png" 
                    alt="Tripscape SaaS Demo" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a 
                      href="https://share.synthesia.io/4fe30803-dd2d-4564-861d-35dbb3e25b71" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-primary/90 hover:bg-primary text-white rounded-full px-6 py-3 font-medium flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      Watch Video
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
