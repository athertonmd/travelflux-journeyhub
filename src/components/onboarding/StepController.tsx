
import React from 'react';
import ProductSelection from '@/components/onboarding/ProductSelection';
import GdsSelection from '@/components/onboarding/GdsSelection';
import GdsConfigForm from '@/components/onboarding/GdsConfigForm';
import TripTileSelection from '@/components/onboarding/TripTileSelection';
import ContactInfoForm from '@/components/onboarding/ContactInfoForm';
import BrandingConfig from '@/components/onboarding/BrandingConfig';
import RiskAlertsConfig from '@/components/onboarding/RiskAlertsConfig';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import CompleteStep from '@/components/onboarding/CompleteStep';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { OnboardingFormData } from '@/hooks/useOnboardingForm';
import { AgencyGuideManager } from '@/components/onboarding/AgencyGuideManager';

interface StepControllerProps {
  currentStep: string;
  formData: OnboardingFormData;
  updateFormData: (key: keyof OnboardingFormData, value: any) => void;
}

const StepController: React.FC<StepControllerProps> = ({
  currentStep,
  formData,
  updateFormData
}) => {
  switch (currentStep) {
    case 'welcome':
      return <WelcomeStep userName={formData.userName || 'there'} />;
    case 'products':
      return <>
          <CardHeader>
            <CardTitle className="text-2xl">Select Your Products</CardTitle>
            <CardDescription>
              Choose which Tripscape products you want to activate for your agency.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductSelection selected={formData.products} onUpdate={products => updateFormData('products', products)} />
          </CardContent>
        </>;
    case 'gds':
      return <>
          <CardHeader>
            <CardTitle className="text-2xl">Connect Your GDS</CardTitle>
            <CardDescription>
              Select the Global Distribution System (GDS) your agency uses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GdsSelection selected={formData.gdsProvider} onSelect={gds => updateFormData('gdsProvider', gds)} />
          </CardContent>
        </>;
    case 'config':
      return <>
          <CardHeader>
            <CardTitle className="text-2xl">GDS Configuration</CardTitle>
            <CardDescription>
              Please provide the necessary details to connect to your {formData.gdsProvider} account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GdsConfigForm gdsType={formData.gdsProvider} config={formData.gdsConfig} onUpdate={config => updateFormData('gdsConfig', config)} />
          </CardContent>
        </>;
    case 'trips':
      return <>
        <CardHeader>
          <CardTitle className="text-2xl">Mobile Settings</CardTitle>
          <CardDescription>
            Configure the mobile experience for your travelers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Trip Tiles</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select up to 4 trip tiles that will appear on your travelers' mobile app home screen.
              </p>
              <TripTileSelection selected={formData.selectedTripTiles} onUpdate={tiles => updateFormData('selectedTripTiles', tiles)} />
            </div>
            
            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-medium mb-4">Contact Information</h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure the contact information that will be displayed to your travelers in the mobile app.
              </p>
              <ContactInfoForm 
                blurb={formData.contactInfo.blurb} 
                contacts={formData.contactInfo.contacts}
                onUpdate={(key, value) => {
                  updateFormData('contactInfo', {
                    ...formData.contactInfo,
                    [key]: value
                  });
                }}
              />
            </div>

            <div className="pt-6 border-t border-border">
              <AgencyGuideManager
                categories={formData.agencyGuide.categories}
                onUpdate={(categories) => {
                  updateFormData('agencyGuide', {
                    ...formData.agencyGuide,
                    categories
                  });
                }}
              />
            </div>
          </div>
        </CardContent>
      </>;
    case 'risk-alerts':
      return <>
        <CardHeader>
          <CardTitle className="text-2xl">Risk Alerts</CardTitle>
          <CardDescription>
            Select countries for which you want to receive risk alerts when travelers visit them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RiskAlertsConfig
            selectedCountries={formData.alertCountries || []}
            onUpdate={countries => updateFormData('alertCountries', countries)}
            tripBriefsEnabled={formData.tripBriefsEnabled || false}
            onTripBriefsChange={(enabled) => updateFormData('tripBriefsEnabled', enabled)}
            alertEmail={formData.alertEmail || ''}
            onAlertEmailChange={(email) => updateFormData('alertEmail', email)}
          />
        </CardContent>
      </>;
    case 'branding':
      return <>
          <CardHeader>
            <CardTitle className="text-2xl">Branding</CardTitle>
            <CardDescription>
              Customize the look of your Tripscape experience with your brand colors and logo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BrandingConfig branding={formData.branding} onUpdate={branding => updateFormData('branding', branding)} />
          </CardContent>
        </>;
    case 'complete':
      return <CompleteStep products={formData.products} gdsProvider={formData.gdsProvider} selectedTripTiles={formData.selectedTripTiles} branding={formData.branding} />;
    default:
      return <WelcomeStep userName={formData.userName || 'there'} />;
  }
};

export default StepController;
