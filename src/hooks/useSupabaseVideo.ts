
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseVideo = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDemoVideo = async () => {
      try {
        const { data } = supabase.storage
          .from('videos')
          .getPublicUrl('demo-video.mp4');

        if (data?.publicUrl) {
          // Create a new Image object to preload the video thumbnail
          const videoElement = document.createElement('video');
          videoElement.src = data.publicUrl;
          videoElement.onloadeddata = () => {
            setVideoUrl(data.publicUrl);
            setIsLoading(false);
          };
          videoElement.onerror = () => {
            setError(new Error('Failed to load video'));
            setIsLoading(false);
          };
          
          // Set a timeout to ensure we don't wait forever
          setTimeout(() => {
            if (isLoading) {
              setVideoUrl(data.publicUrl);
              setIsLoading(false);
            }
          }, 3000);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch video'));
        setIsLoading(false);
      }
    };

    fetchDemoVideo();
  }, []);

  return { videoUrl, isLoading, error };
};
