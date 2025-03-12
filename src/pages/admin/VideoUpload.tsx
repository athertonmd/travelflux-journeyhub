
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import VideoUploadForm from '@/components/admin/VideoUploadForm';
import VideoList from '@/components/admin/VideoList';

const VideoUpload = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({
        title: 'Error fetching videos',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    
    setVideos(data || []);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Video Management</h1>
      
      <VideoUploadForm onUploadSuccess={fetchVideos} />
      
      <h2 className="text-2xl font-bold mb-4">Your Videos</h2>
      
      <VideoList videos={videos} onVideoAction={fetchVideos} />
    </div>
  );
};

export default VideoUpload;
