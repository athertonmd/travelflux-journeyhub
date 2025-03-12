
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const HeroSection = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Default demo video path in Supabase storage
    const videoPath = 'demo-video.mp4';
    
    // Get the public URL for the video
    const { data } = supabase.storage.from('videos').getPublicUrl(videoPath);
    
    if (data?.publicUrl) {
      setVideoUrl(data.publicUrl);
    }
  }, []);

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
                {videoUrl ? (
                  <video 
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    muted
                    playsInline
                    poster="/placeholder.svg"
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p>Loading video...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
