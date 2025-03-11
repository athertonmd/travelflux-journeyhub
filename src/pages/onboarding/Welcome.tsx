
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ChevronRight, ChevronLeft, Check, Smartphone, FileText, Shield, Globe } from 'lucide-react';
import ProductSelection from '@/components/onboarding/ProductSelection';
import GdsSelection from '@/components/onboarding/GdsSelection';
import GdsConfigForm from '@/components/onboarding/GdsConfigForm';
import TripTileSelection from '@/components/onboarding/TripTileSelection';
import BrandingConfig from '@/components/onboarding/BrandingConfig';

const steps = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'products', title: 'Products' },
  { id: 'gds', title: 'GDS' },
  { id: 'config', title: 'Configuration' },
  { id: 'trips', title: 'Trip Tiles' },
  { id: 'branding', title: 'Branding' },
  { id: 'complete', title: 'Complete' }
];

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('welcome');
  const [formData, setFormData] = useState({
    products: {
      mobile: false,
      documentDelivery: false,
      riskManagement: false
    },
    gdsProvider: '',
    gdsConfig: {
      endpoint: '',
      apiKey: '',
      pcc: '',
      email: ''
    },
    selectedTripTiles: [],
    branding: {
      primaryColor: '#1EAEDB',
      secondaryColor: '#0FA0CE',
      logo: null
    }
  });

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof data === 'function' ? data(prev[section]) : data
    }));
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleComplete = async () => {
    try {
      // Here you would typically save all the collected data to your backend
      console.log('Submitting form data:', formData);
      
      toast({
        title: "Setup Complete!",
        description: "Your account has been successfully configured.",
      });
      
      // Navigate to dashboard or another appropriate page
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing setup:', error);
      toast({
        title: "Setup Failed",
        description: "There was an error completing your setup. Please try again.",
        variant: "destructive",
      });
    }
  };

  // If user is not logged in, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-2xl font-semibold">Tripscape Setup</h1>
        </div>
      </header>
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div 
                    className={`flex items-center justify-center rounded-full w-10 h-10 
                      ${currentStep === step.id 
                        ? 'bg-primary text-white' 
                        : steps.findIndex(s => s.id === currentStep) > index 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-gray-200 text-gray-500'}`}
                  >
                    {steps.findIndex(s => s.id === currentStep) > index ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div 
                      className={`h-1 w-12 
                        ${steps.findIndex(s => s.id === currentStep) > index 
                          ? 'bg-primary/20' 
                          : 'bg-gray-200'}`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-center mt-2">
              <p className="text-sm font-medium">{steps.find(step => step.id === currentStep)?.title}</p>
            </div>
          </div>

          <Card className="max-w-4xl mx-auto">
            {currentStep === 'welcome' && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome to Tripscape!</CardTitle>
                  <CardDescription>
                    Let's get your agency set up with our platform. This wizard will guide you through the setup process.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Hello, {user.name || user.email}! Thank you for choosing Tripscape for your travel management needs.</p>
                  <p>During this setup process, you will:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Select which Tripscape products you want to activate</li>
                    <li>Connect your Global Distribution System (GDS)</li>
                    <li>Configure your GDS settings</li>
                    <li>Select trip tiles for your mobile app</li>
                    <li>Customize the look and feel with your brand colors and logo</li>
                  </ul>
                  <p>Click "Next" to begin the setup process.</p>
                </CardContent>
              </>
            )}

            {currentStep === 'products' && (
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
            )}

            {currentStep === 'gds' && (
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
            )}

            {currentStep === 'config' && (
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
            )}

            {currentStep === 'trips' && (
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
            )}

            {currentStep === 'branding' && (
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
            )}

            {currentStep === 'complete' && (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl">Setup Complete!</CardTitle>
                  <CardDescription>
                    You've successfully configured your Tripscape account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 text-green-700 rounded-md p-4 flex items-start">
                    <Check className="h-5 w-5 mr-2 mt-0.5" />
                    <div>
                      <p className="font-semibold">Your account is ready!</p>
                      <p className="text-sm mt-1">You can now start using Tripscape for your travel management needs.</p>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mt-4">Summary of your configuration:</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">Products selected:</p>
                      <ul className="list-disc pl-5 mt-1">
                        {formData.products.mobile && <li>Mobile App</li>}
                        {formData.products.documentDelivery && <li>Document Delivery</li>}
                        {formData.products.riskManagement && <li>Risk Management</li>}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">GDS Provider:</p>
                      <p className="mt-1">{formData.gdsProvider}</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Trip Tiles Selected:</p>
                      <p className="mt-1">{formData.selectedTripTiles.length} tiles selected</p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Branding:</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: formData.branding.primaryColor }}></div>
                        <span>Primary Color</span>
                        
                        <div className="h-4 w-4 rounded-full ml-4" style={{ backgroundColor: formData.branding.secondaryColor }}></div>
                        <span>Secondary Color</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            <CardFooter className="flex justify-between pt-6">
              {currentStep !== 'welcome' && (
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              {currentStep === 'welcome' && <div></div>}
              
              {currentStep !== 'complete' ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete}>
                  Go to Dashboard
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
