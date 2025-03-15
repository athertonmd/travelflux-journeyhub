
import React, { useState } from 'react';
import IntegrationTabs from './gds-config/IntegrationTabs';

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

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-6">
        Please provide the necessary details to connect Tripscape with your {gdsType} account. 
        This will allow us to automatically process booking data.
      </div>

      <IntegrationTabs
        integrationMethod={integrationMethod}
        setIntegrationMethod={setIntegrationMethod}
        gdsType={gdsType}
        config={config}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default GdsConfigForm;
