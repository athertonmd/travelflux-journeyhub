
import { useState, useEffect } from 'react';

export const useSupabaseVideo = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const fetchDemoVideo = async () => {
      try {
        setIsLoading(true);
        console.log('Setting up video URL...');
        
        // Use the new direct URL
        const directVideoUrl = 'https://www.manticpoint.com/hubfs/AI-Generated%20Media/Video/Tripscape%20Overview.mp4';
        
        // Check if the URL is accessible
        setIsPending(true);
        fetch(directVideoUrl, { method: 'HEAD' })
          .then(response => {
            if (response.ok) {
              console.log('Video URL is accessible');
              setVideoUrl(directVideoUrl);
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
