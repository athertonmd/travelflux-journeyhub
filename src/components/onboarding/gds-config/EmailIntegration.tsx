
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailIntegrationProps {
  gdsType: string;
  config: {
    email: string;
  };
  onUpdate: (config: any) => void;
}

const EmailIntegration: React.FC<EmailIntegrationProps> = ({ gdsType, config, onUpdate }) => {
  const handleChange = (field: string, value: string) => {
    onUpdate({
      ...config,
      [field]: value
    });
  };

  return (
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
  );
};

export default EmailIntegration;
