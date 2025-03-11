
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StepController from '@/components/onboarding/StepController';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const {
    formData,
    isLoading,
    updateFormData,
    handleComplete
  } = useOnboarding();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSave = async () => {
    const success = await handleComplete();
    if (success) {
      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully.",
      });
    }
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-2xl font-semibold">Agency Settings</h1>
        </div>
      </header>
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Configuration Settings
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="gds">GDS</TabsTrigger>
                  <TabsTrigger value="config">GDS Config</TabsTrigger>
                  <TabsTrigger value="trips">Trip Tiles</TabsTrigger>
                  <TabsTrigger value="branding">Branding</TabsTrigger>
                </TabsList>
                
                <TabsContent value="products">
                  <StepController 
                    currentStep="products"
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                </TabsContent>
                
                <TabsContent value="gds">
                  <StepController 
                    currentStep="gds"
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                </TabsContent>
                
                <TabsContent value="config">
                  <StepController 
                    currentStep="config"
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                </TabsContent>
                
                <TabsContent value="trips">
                  <StepController 
                    currentStep="trips"
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                </TabsContent>
                
                <TabsContent value="branding">
                  <StepController 
                    currentStep="branding"
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter>
              <div className="flex justify-end w-full">
                <Button 
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : "Save Changes"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
