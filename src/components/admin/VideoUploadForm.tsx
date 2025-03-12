
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface VideoUploadFormProps {
  onUploadSuccess: () => void;
}

const VideoUploadForm: React.FC<VideoUploadFormProps> = ({ onUploadSuccess }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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

      // Call the callback function to refresh the video list
      onUploadSuccess();
      
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

  return (
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
  );
};

export default VideoUploadForm;
