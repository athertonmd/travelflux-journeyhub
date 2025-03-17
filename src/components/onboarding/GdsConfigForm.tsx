
import React from 'react';
import ApiIntegration from './gds-config/ApiIntegration';

interface GdsConfigFormProps {
  gdsType: string;
  config: {
    // Sabre config fields
    pccList: string;
    queueNumber: string;
    sabreQueueAssignment: string;
    fnbtsEntry: string;
    // Travelport config fields
    tmcPccList: string;
    tripscapeGwsQueue: string;
    manticPointPcc: string;
    manticPointQueue: string;
  };
  onUpdate: (config: any) => void;
}

const GdsConfigForm: React.FC<GdsConfigFormProps> = ({ gdsType, config, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-6">
        Please provide the necessary details to connect Tripscape with your {gdsType} account. 
        This will allow us to automatically process booking data.
      </div>

      <ApiIntegration
        gdsType={gdsType}
        config={config}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default GdsConfigForm;
