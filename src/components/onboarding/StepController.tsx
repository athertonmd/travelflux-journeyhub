
import React from 'react';
import ProductSelection from '@/components/onboarding/ProductSelection';
import GdsSelection from '@/components/onboarding/GdsSelection';
import GdsConfigForm from '@/components/onboarding/GdsConfigForm';
import TripTileSelection from '@/components/onboarding/TripTileSelection';
import BrandingConfig from '@/components/onboarding/BrandingConfig';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import CompleteStep from '@/components/onboarding/CompleteStep';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { OnboardingFormData } from '@/hooks/useOnboardingForm';

interface StepControllerProps {
  currentStep: string;
  formData: OnboardingFormData;
  updateFormData: (key: keyof OnboardingFormData, value: any) => void;
}

const StepController: React.FC<StepControllerProps> = ({
  currentStep,
  formData,
  updateFormData,
}) => {
  switch (currentStep) {
    case 'welcome':
      return <WelcomeStep userName={formData.userName || 'there'} />;

    case 'products':
      return (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Select Your Products</CardTitle>
            <CardDescription>
              Choose which Tripscape products you want to activate for your agency.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductSelection 
              selected={formData.products} 
              onUpdate={(products) => updateFormData('products', products)} 
            />
          </CardContent>
        </>
      );

    case 'gds':
      return (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Connect Your GDS</CardTitle>
            <CardDescription>
              Select the Global Distribution System (GDS) your agency uses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GdsSelection 
              selected={formData.gdsProvider} 
              onSelect={(gds) => updateFormData('gdsProvider', gds)} 
            />
          </CardContent>
        </>
      );

    case 'config':
      return (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">GDS Configuration</CardTitle>
            <CardDescription>
              Please provide the necessary details to connect to your {formData.gdsProvider} account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GdsConfigForm 
              gdsType={formData.gdsProvider}
              config={formData.gdsConfig}
              onUpdate={(config) => updateFormData('gdsConfig', config)}
            />
          </CardContent>
        </>
      );

    case 'trips':
      return (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Trip Tiles</CardTitle>
            <CardDescription>
              Select up to 4 trip tiles that will appear on your mobile app home screen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TripTileSelection 
              selected={formData.selectedTripTiles}
              onUpdate={(tiles) => updateFormData('selectedTripTiles', tiles)}
            />
          </CardContent>
        </>
      );

    case 'branding':
      return (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Branding</CardTitle>
            <CardDescription>
              Customize the look of your Tripscape experience with your brand colors and logo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BrandingConfig
              branding={formData.branding}
              onUpdate={(branding) => updateFormData('branding', branding)}
            />
          </CardContent>
        </>
      );

    case 'complete':
      return (
        <CompleteStep 
          products={formData.products}
          gdsProvider={formData.gdsProvider}
          selectedTripTiles={formData.selectedTripTiles}
          branding={formData.branding}
        />
      );

    default:
      return <WelcomeStep userName={formData.userName || 'there'} />;
  }
};

export default StepController;
