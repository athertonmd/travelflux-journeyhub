import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check if file is a video
      if (!file.type.startsWith('video/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a video file',
          variant: 'destructive',
        });
        return;
      }
      setVideoFile(file);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a video file to upload',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Upload file to Supabase Storage
      const fileName = `${Date.now()}-${videoFile.name}`;
      const filePath = fileName;

      // Upload the file and manually update progress
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(100); // Set to 100% when complete

      // 2. Get the public URL of the uploaded video
      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      // 3. Store metadata in the videos table
      const { error: insertError } = await supabase.from('videos').insert({
        title: videoFile.name.split('.')[0],
        description: 'Uploaded from admin panel',
        storage_path: filePath,
        thumbnail_path: null,
      });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: 'Upload successful',
        description: 'Your video has been uploaded and is now available',
      });

      // Refresh the video list
      fetchVideos();
      
      // Reset state
      setVideoFile(null);
      setUploadProgress(0);
      
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

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
        fetchVideos();
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
        .eq('id', videoId);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: 'Video deleted',
        description: 'The video has been removed',
      });

      // Refresh the video list
      fetchVideos();
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Video Management</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload New Video</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="video-upload" className="block text-sm font-medium mb-2">
                Select Video File
              </label>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="block w-full text-sm border border-gray-300 rounded-md cursor-pointer"
              />
              {videoFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>
            
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
              </div>
            )}
            
            <Button 
              onClick={handleUpload} 
              disabled={!videoFile || isUploading}
              className="w-full md:w-auto"
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mb-4">Your Videos</h2>
      
      {videos.length > 0 ? (
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
      ) : (
        <p className="text-gray-500">No videos found. Upload your first video above.</p>
      )}
    </div>
  );
};

export default VideoUpload;
