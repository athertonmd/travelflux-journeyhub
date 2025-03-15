
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Check, Info } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface GdsConfigFormProps {
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

const GdsConfigForm: React.FC<GdsConfigFormProps> = ({ gdsType, config, onUpdate }) => {
  const [integrationMethod, setIntegrationMethod] = useState('api');

  const handleChange = (field: string, value: string) => {
    onUpdate({
      ...config,
      [field]: value
    });
  };

  const renderSabreConfig = () => {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex">
            <Info className="h-6 w-6 text-blue-500 mr-2" />
            <div>
              <h3 className="font-medium text-blue-800">Sabre TMC Configuration</h3>
              <p className="text-sm text-blue-700">
                Follow these steps to set up a Branch Access with Sabre for PNR data access via Queue Placement (QP).
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">1. Branch Access Setup</h3>
          <p className="text-sm text-gray-600">
            The TMC will set up a Branch Access with Sabre for all required PCCs with the <span className="font-medium text-blue-600">Mantic Point</span> PCCs: 
            <span className="bg-yellow-200 px-1 font-medium">P4UH</span> and 
            <span className="bg-yellow-200 px-1 font-medium">P4SH</span> to allow access to read PNR data.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="pccList">PCC List</Label>
            <Textarea 
              id="pccList" 
              placeholder="List your PCCs here"
              value={config.pccList}
              onChange={(e) => handleChange('pccList', e.target.value)}
              className="min-h-[100px] bg-cyan-50"
            />
            <p className="text-xs text-gray-500">
              List all PCCs that need access to Mantic Point.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">2. Queue Assignment</h3>
          <p className="text-sm text-gray-600">
            After the process is completed, Mantic Point will assign a Tripscape queue for your PNRs.
          </p>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="sabreQueueAssignment">Tripscape Sabre Queue Assignment</Label>
              <Input 
                id="sabreQueueAssignment" 
                placeholder="e.g., Q5"
                value={config.sabreQueueAssignment}
                onChange={(e) => handleChange('sabreQueueAssignment', e.target.value)}
                className="bg-cyan-50"
              />
              <p className="text-xs text-gray-500">
                This will be provided by Mantic Point after access has been granted by Sabre.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="queueNumber">Queue Number for PCC P4UH</Label>
              <Input 
                id="queueNumber" 
                placeholder="e.g., Q7"
                value={config.queueNumber}
                onChange={(e) => handleChange('queueNumber', e.target.value)}
                className="bg-cyan-50"
              />
              <p className="text-xs text-gray-500">
                The TMC will queue all or certain PNRs to Mantic Point's PCC P4UH using this queue.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">3. FNBTS Entry (Optional)</h3>
          <div className="space-y-2">
            <Label htmlFor="fnbtsEntry">FNBTS Entry</Label>
            <Input 
              id="fnbtsEntry" 
              placeholder="e.g., FNBTS-P4UH/xxx/11-MANTIC POINT"
              value={config.fnbtsEntry}
              onChange={(e) => handleChange('fnbtsEntry', e.target.value)}
            />
            <p className="text-xs text-gray-500">
              You may consider entering an FNBTS entry to the agency level or specific company level profile, 
              so that all PNR's get queued to the Mantic Point PCC and queue at end transact.
            </p>
            <p className="text-xs text-gray-600 font-medium mt-1">
              Example entry: FNBTS-P4UH/xxx/11-MANTIC POINT
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
                <li>The TMC will advise Mantic Point once the process has been completed</li>
                <li>Mantic Point developer team will assign a Tripscape queue</li>
                <li>Mantic Point will advise the TMC once the access has been granted by Sabre</li>
                <li>The TMC will then queue PNRs to the Mantic Point PCC using the assigned queue</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderApiIntegration = () => {
    if (gdsType === 'Sabre') {
      return renderSabreConfig();
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
          {renderApiIntegration()}
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
