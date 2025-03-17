
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Info } from 'lucide-react';

interface TravelportConfigProps {
  config: {
    endpoint: string;
    apiKey: string;
    pcc: string;
    email: string;
  };
  onUpdate: (config: any) => void;
}

const TravelportConfig: React.FC<TravelportConfigProps> = ({ config, onUpdate }) => {
  const handleChange = (field: string, value: string) => {
    onUpdate({
      ...config,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex">
          <Info className="h-6 w-6 text-blue-500 mr-2" />
          <div>
            <h3 className="font-medium text-blue-800">Travelport Configuration</h3>
            <p className="text-sm text-blue-700">
              Follow these steps to set up Travelport access for PNR data processing via Galileo, Apollo, or Worldspan.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">1. Travelport API Setup</h3>
        <p className="text-sm text-gray-600">
          Configure your Travelport access to connect with <span className="font-medium text-blue-600">Tripscape</span> for seamless PNR data integration.
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="endpoint">API Endpoint</Label>
          <Input 
            id="endpoint" 
            placeholder="e.g., https://api.travelport.com/B2BGateway/connect/uAPI"
            value={config.endpoint}
            onChange={(e) => handleChange('endpoint', e.target.value)}
            className="bg-cyan-50"
          />
          <p className="text-xs text-gray-500">
            Enter your Travelport API endpoint URL.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input 
            id="apiKey" 
            placeholder="Your Travelport API key"
            value={config.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            className="bg-cyan-50"
            type="password"
          />
          <p className="text-xs text-gray-500">
            Enter your Travelport API key for authentication.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">2. PCC Configuration</h3>
        <div className="space-y-2">
          <Label htmlFor="pcc">Pseudo City Code (PCC)</Label>
          <Input 
            id="pcc" 
            placeholder="e.g., AB12"
            value={config.pcc}
            onChange={(e) => handleChange('pcc', e.target.value)}
            className="bg-cyan-50"
          />
          <p className="text-xs text-gray-500">
            Enter your agency's Pseudo City Code (PCC).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">3. Notification Settings</h3>
        <div className="space-y-2">
          <Label htmlFor="email">Notification Email</Label>
          <Input 
            id="email" 
            placeholder="e.g., notifications@youragency.com"
            value={config.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="bg-cyan-50"
            type="email"
          />
          <p className="text-xs text-gray-500">
            Enter an email address to receive PNR processing notifications.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
          <div>
            <p className="font-medium">Important Note:</p>
            <p className="mt-1">After completing this configuration:</p>
            <ol className="list-decimal ml-5 mt-2 space-y-1">
              <li>Tripscape will validate your Travelport API credentials</li>
              <li>You'll receive a confirmation email once the connection is established</li>
              <li>PNR data will start flowing automatically through the configured API</li>
              <li>You can test the connection using the "Test Connection" button in Settings</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelportConfig;
