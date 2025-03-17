import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Info } from 'lucide-react';
import { OnboardingFormData } from '@/hooks/useOnboardingForm';

interface SabreConfigProps {
  config: OnboardingFormData['gdsConfig'];
  onUpdate: (config: OnboardingFormData['gdsConfig']) => void;
}

const SabreConfig: React.FC<SabreConfigProps> = ({ config, onUpdate }) => {
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

export default SabreConfig;
