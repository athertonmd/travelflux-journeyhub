
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ManualIntegrationProps {
  gdsType: string;
}

const ManualIntegration: React.FC<ManualIntegrationProps> = ({ gdsType }) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="text-sm text-gray-600">
          <p>
            You can manually upload PNR data from your {gdsType} system via CSV or XML files.
            This is useful for agencies who don't have automated PNR forwarding set up.
          </p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-4 text-center">Drag and drop PNR files here, or click to select files</p>
          <Button variant="outline">Select Files</Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
          <p className="font-medium">Supported file formats:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>CSV exports from {gdsType}</li>
            <li>XML PNR data</li>
            <li>Direct PNR screen captures (text format)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualIntegration;
