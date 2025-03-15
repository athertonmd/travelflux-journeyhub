
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SabreConfig from './SabreConfig';

interface ApiIntegrationProps {
  gdsType: string;
  config: {
    endpoint: string;
    apiKey: string;
    pcc: string;
    email: string;
    pccList: string;
    queueNumber: string;
    sabreQueueAssignment: string;
    fnbtsEntry: string;
  };
  onUpdate: (config: any) => void;
}

const ApiIntegration: React.FC<ApiIntegrationProps> = ({ gdsType, config, onUpdate }) => {
  const handleChange = (field: string, value: string) => {
    onUpdate({
      ...config,
      [field]: value
    });
  };

  if (gdsType === 'Sabre') {
    return <SabreConfig config={config} onUpdate={onUpdate} />;
  }

  return (
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
  );
};

export default ApiIntegration;
