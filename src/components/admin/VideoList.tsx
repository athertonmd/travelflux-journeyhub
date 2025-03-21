
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Video {
  id: string;
  title: string;
  storage_path: string;
  created_at: string;
}

interface VideoListProps {
  videos: Video[];
  onVideoAction: () => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onVideoAction }) => {
  const { toast } = useToast();

  const handleSetAsDemo = async (videoId: string, storagePath: string) => {
    try {
      // Get the public URL of the selected video
      const { data } = supabase.storage
        .from('videos')
        .getPublicUrl(storagePath);

      if (data?.publicUrl) {
        // In a real app, you might store this in a settings table or similar
        toast({
          title: 'Demo video updated',
          description: 'This video is now set as the demo video on the homepage',
        });

        // For now, we'll just rename it to make it easier to find
        const { error: renameError } = await supabase.storage
          .from('videos')
          .move(storagePath, 'demo-video.mp4');

        if (renameError) {
          throw renameError;
        }

        // Refresh the video list after setting demo
        onVideoAction();
      }
    } catch (error: any) {
      toast({
        title: 'Failed to set demo video',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (videoId: string, storagePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('videos')
        .remove([storagePath]);

      if (storageError) {
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId as any);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: 'Video deleted',
        description: 'The video has been removed',
      });

      // Refresh the video list
      onVideoAction();
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (videos.length === 0) {
    return <p className="text-gray-500">No videos found. Upload your first video above.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden">
          <CardContent className="p-0">
            <video 
              className="w-full h-48 object-cover"
              controls
            >
              <source 
                src={supabase.storage.from('videos').getPublicUrl(video.storage_path).data.publicUrl} 
                type="video/mp4" 
              />
            </video>
            <div className="p-4">
              <h3 className="font-bold truncate">{video.title}</h3>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(video.created_at).toLocaleDateString()}
              </p>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSetAsDemo(video.id, video.storage_path)}
                >
                  Set as Demo
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(video.id, video.storage_path)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VideoList;
