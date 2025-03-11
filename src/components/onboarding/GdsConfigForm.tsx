
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GdsConfigFormProps {
  gdsType: string;
  config: {
    endpoint: string;
    apiKey: string;
    pcc: string;
    email: string;
  };
  onUpdate: (config: {
    endpoint: string;
    apiKey: string;
    pcc: string;
    email: string;
  }) => void;
}

const GdsConfigForm: React.FC<GdsConfigFormProps> = ({ gdsType, config, onUpdate }) => {
  const [integrationMethod, setIntegrationMethod] = useState('api');

  const handleChange = (field: keyof typeof config, value: string) => {
    onUpdate({
      ...config,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-6">
        Please provide the necessary details to connect Tripscape with your {gdsType} account. 
        This will allow us to automatically process booking data.
      </div>

      <Tabs value={integrationMethod} onValueChange={setIntegrationMethod}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="api">API Integration</TabsTrigger>
          <TabsTrigger value="email">Email Forwarding</TabsTrigger>
          <TabsTrigger value="manual">Manual Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="endpoint">API Endpoint URL</Label>
                <Input 
                  id="endpoint" 
                  placeholder={`${gdsType} API Endpoint`}
                  value={config.endpoint}
                  onChange={(e) => handleChange('endpoint', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  The endpoint URL provided by {gdsType} for API access.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input 
                  id="apiKey" 
                  type="password"
                  placeholder="Your API Key"
                  value={config.apiKey}
                  onChange={(e) => handleChange('apiKey', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Your unique API key generated in your {gdsType} developer portal.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pcc">PCC/SID/LNIATA</Label>
                <Input 
                  id="pcc" 
                  placeholder="e.g., 2F3K"
                  value={config.pcc}
                  onChange={(e) => handleChange('pcc', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Your Pseudo City Code (Sabre) or SID/LNIATA (Travelport).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="pnr@youragency.com"
                  value={config.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  The email address where PNR data will be sent from your GDS.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
                <p className="font-medium">Next steps for email integration:</p>
                <ol className="list-decimal ml-5 mt-2 space-y-1">
                  <li>Configure your {gdsType} system to forward PNRs to our processing email: <strong>pnr@tripscape.io</strong></li>
                  <li>Add this email address to your approved senders list</li>
                  <li>Set up forwarding rules based on your agency's workflow</li>
                </ol>
                <p className="mt-2">Our team will verify the connection and notify you when it's active.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GdsConfigForm;
