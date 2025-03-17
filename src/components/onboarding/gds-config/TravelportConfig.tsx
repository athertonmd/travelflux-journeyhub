
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Info } from 'lucide-react';

interface TravelportConfigProps {
  config: {
    tmcPccList: string;
    tripscapeGwsQueue: string;
    manticPointPcc: string;
    manticPointQueue: string;
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
            <h3 className="font-medium text-blue-800">Travelport – Galileo Configuration</h3>
            <p className="text-sm text-blue-700">
              Follow these steps to set up a process sharing agreement with Travelport for PNR data access.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">1. Travelport Access Setup</h3>
        <p className="text-sm text-gray-600">
          The TMC will set up a process sharing agreement with Travelport for all required PCCs with the <span className="font-medium text-blue-600">Mantic Point</span> PCC: 
          <span className="bg-yellow-200 px-1 font-medium">RI7</span> (Roger-India-Seven) to allow access to read PNR data (suggested level 404).
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="tmcPccList">TMC PCC List</Label>
          <Textarea 
            id="tmcPccList" 
            placeholder="List your PCCs here"
            value={config.tmcPccList}
            onChange={(e) => handleChange('tmcPccList', e.target.value)}
            className="min-h-[100px] bg-cyan-50"
          />
          <p className="text-xs text-gray-500">
            List all PCCs that need access to Mantic Point.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">2. Queue Assignment</h3>
        <p className="text-sm text-gray-600">
          After the process is completed, Mantic Point will assign a Tripscape queue for your PNRs.
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="tripscapeGwsQueue">Tripscape GWS Queue Assignment</Label>
          <Input 
            id="tripscapeGwsQueue" 
            placeholder="Will be provided by Mantic Point after setup"
            value={config.tripscapeGwsQueue}
            onChange={(e) => handleChange('tripscapeGwsQueue', e.target.value)}
            className="bg-cyan-50"
          />
          <p className="text-xs text-gray-500">
            This will be provided by Mantic Point after access has been granted by Travelport.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">3. Mantic Point PCC Configuration</h3>
        <div className="space-y-2">
          <Label htmlFor="manticPointPcc">Mantic Point's PCC</Label>
          <Input 
            id="manticPointPcc" 
            value="RI7"
            readOnly
            className="bg-gray-100"
          />
          <p className="text-xs text-gray-500">
            Mantic Point's PCC for Galileo (Roger-India-Seven).
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="manticPointQueue">Queue for Mantic Point's PCC</Label>
          <Input 
            id="manticPointQueue" 
            placeholder="e.g., Q5"
            value={config.manticPointQueue}
            onChange={(e) => handleChange('manticPointQueue', e.target.value)}
            className="bg-cyan-50"
          />
          <p className="text-xs text-gray-500">
            The TMC will queue all or specific client PNRs to this queue.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
          <div>
            <p className="font-medium">Important Process Steps:</p>
            <ol className="list-decimal ml-5 mt-2 space-y-1">
              <li>The TMC will set up a process sharing agreement with Travelport</li>
              <li>The TMC will advise Mantic Point once the sharing agreement is set up</li>
              <li>Mantic Point will submit request to Travelport via email</li>
              <li>Mantic Point will assign a Tripscape queue and advise the TMC</li>
              <li>The TMC will queue PNRs to Mantic Point's PCC (RI7) using the assigned queue</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelportConfig;
