
import React from 'react';
import ApiIntegration from './gds-config/ApiIntegration';
import { OnboardingFormData } from '@/hooks/useOnboardingForm';

interface GdsConfigFormProps {
  gdsType: string;
  config: OnboardingFormData['gdsConfig'];
  onUpdate: (config: OnboardingFormData['gdsConfig']) => void;
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
