
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiIntegration from './ApiIntegration';
import EmailIntegration from './EmailIntegration';
import ManualIntegration from './ManualIntegration';
import { OnboardingFormData } from '@/hooks/useOnboardingForm';

interface IntegrationTabsProps {
  integrationMethod: string;
  setIntegrationMethod: (method: string) => void;
  gdsType: string;
  config: OnboardingFormData['gdsConfig'];
  onUpdate: (config: OnboardingFormData['gdsConfig']) => void;
}

const IntegrationTabs: React.FC<IntegrationTabsProps> = ({
  integrationMethod,
  setIntegrationMethod,
  gdsType,
  config,
  onUpdate
}) => {
  return (
    <Tabs value={integrationMethod} onValueChange={setIntegrationMethod}>
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="api">API Integration</TabsTrigger>
        <TabsTrigger value="email">Email Forwarding</TabsTrigger>
        <TabsTrigger value="manual">Manual Upload</TabsTrigger>
      </TabsList>

      <TabsContent value="api" className="space-y-6">
        <ApiIntegration 
          gdsType={gdsType} 
          config={config} 
          onUpdate={onUpdate} 
        />
      </TabsContent>

      <TabsContent value="email" className="space-y-6">
        <EmailIntegration 
          gdsType={gdsType} 
          config={config} 
          onUpdate={onUpdate} 
        />
      </TabsContent>

      <TabsContent value="manual" className="space-y-6">
        <ManualIntegration gdsType={gdsType} />
      </TabsContent>
    </Tabs>
  );
};

export default IntegrationTabs;
