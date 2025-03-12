
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseVideo = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const fetchDemoVideo = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching demo video from Supabase...');
        
        const { data, error: storageError } = supabase.storage
          .from('videos')
          .getPublicUrl('demo-video.mp4');

        if (storageError) {
          console.error('Supabase storage error:', storageError);
          setError(new Error(`Supabase storage error: ${storageError.message}`));
          setIsLoading(false);
          return;
        }

        if (data?.publicUrl) {
          console.log('Video URL received:', data.publicUrl);
          
          // Check if the URL is accessible
          setIsPending(true);
          fetch(data.publicUrl, { method: 'HEAD' })
            .then(response => {
              if (response.ok) {
                console.log('Video URL is accessible');
                setVideoUrl(data.publicUrl);
              } else {
                console.error('Video URL is not accessible:', response.status);
                setError(new Error(`Video not accessible: ${response.status}`));
              }
            })
            .catch(fetchError => {
              console.error('Error checking video URL:', fetchError);
              setError(fetchError instanceof Error ? fetchError : new Error('Failed to access video'));
            })
            .finally(() => {
              setIsPending(false);
              setIsLoading(false);
            });
        } else {
          console.log('No video URL received from Supabase');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error in useSupabaseVideo hook:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch video'));
        setIsLoading(false);
      }
    };

    fetchDemoVideo();
  }, []);

  return { 
    videoUrl, 
    isLoading: isLoading || isPending, 
    error,
    hasVideo: !!videoUrl 
  };
};
