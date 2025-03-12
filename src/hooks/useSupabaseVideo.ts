
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
          setVideoUrl(data.publicUrl);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch video'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemoVideo();
  }, []);

  return { videoUrl, isLoading, error };
};
