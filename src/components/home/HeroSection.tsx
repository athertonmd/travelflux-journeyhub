
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSupabaseVideo } from '@/hooks/useSupabaseVideo';
import { useToast } from '@/hooks/use-toast';

const HeroSection = () => {
  const { videoUrl, isLoading, error, hasVideo } = useSupabaseVideo();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { toast } = useToast();

  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle video loading errors
  useEffect(() => {
    if (error) {
      console.error('Video loading error:', error);
      toast({
        title: "Video Error",
        description: "There was a problem loading the demo video.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Handle video element events
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    const handleLoaded = () => {
      console.log('Video loaded and ready to play');
      setVideoLoaded(true);
      
      // Attempt to play the video
      try {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log('Autoplay prevented:', err);
            // We don't need to show an error as this is expected on some browsers
          });
        }
      } catch (e) {
        console.error('Error playing video:', e);
      }
    };

    const handleError = (e: Event) => {
      console.error('Video error event:', e);
      setVideoLoaded(false);
      toast({
        title: "Video Playback Error",
        description: "There was a problem playing the demo video.",
        variant: "destructive",
      });
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleLoaded);
    video.addEventListener('error', handleError);

    // Preload the video
    video.load();

    // Clean up event listeners
    return () => {
      video.removeEventListener('loadeddata', handleLoaded);
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl, toast]);

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
                {isLoading && (
                  <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                    <span className="text-gray-400">Loading demo video...</span>
                  </div>
                )}
                
                {!isLoading && videoUrl && (
                  <video 
                    ref={videoRef}
                    className={`w-full h-full object-cover ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    poster="/placeholder.svg"
                    preload="auto"
                    style={{ transition: 'opacity 0.3s ease-in-out' }}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                
                {!isLoading && !videoUrl && (
                  <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">No demo video available</span>
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
