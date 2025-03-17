import React from 'react';
import SabreConfig from './SabreConfig';
import TravelportConfig from './TravelportConfig';
import { OnboardingFormData } from '@/types/onboarding.types';

interface ApiIntegrationProps {
  gdsType: string;
  config: OnboardingFormData['gdsConfig'];
  onUpdate: (config: OnboardingFormData['gdsConfig']) => void;
}

const ApiIntegration: React.FC<ApiIntegrationProps> = ({ gdsType, config, onUpdate }) => {
  // Render the appropriate config form based on the selected GDS
  if (gdsType === 'Sabre') {
    return (
      <SabreConfig 
        config={config} 
        onUpdate={onUpdate} 
      />
    );
  } else if (gdsType === 'Travelport') {
    return (
      <TravelportConfig 
        config={config} 
        onUpdate={onUpdate} 
      />
    );
  }

  // Fallback for unknown GDS type
  return (
    <div className="text-amber-600 p-4 border border-amber-300 rounded-md">
      Please select a supported GDS provider.
    </div>
  );
};

export default ApiIntegration;
