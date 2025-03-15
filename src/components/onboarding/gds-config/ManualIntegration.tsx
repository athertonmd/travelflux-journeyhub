
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ManualIntegrationProps {
  gdsType: string;
}

const ManualIntegration: React.FC<ManualIntegrationProps> = ({ gdsType }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm">
          <p className="font-medium">Manual PNR Upload</p>
          <p className="mt-2">
            With manual upload, you'll need to export PNRs from your {gdsType} system and upload them to Tripscape. 
            This can be done:
          </p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>One by one from the dashboard</li>
            <li>In batch through CSV upload</li>
            <li>Using the Tripscape desktop application</li>
          </ul>
          <p className="mt-2">
            This method requires more manual work but doesn't need API credentials or email configuration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualIntegration;
