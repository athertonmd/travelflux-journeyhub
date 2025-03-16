import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StepController from '@/components/onboarding/StepController';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, ArrowLeft, Save } from 'lucide-react';

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

  const handleBackToDashboard = () => {
    navigate('/dashboard');
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
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Agency Settings</h1>
          <Button 
            variant="outline" 
            onClick={handleBackToDashboard}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Configuration Settings
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-6 mb-6">
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="gds">GDS</TabsTrigger>
                  <TabsTrigger value="config">GDS Config</TabsTrigger>
                  <TabsTrigger value="trips">Mobile Settings</TabsTrigger>
                  <TabsTrigger value="risk-alerts">Risk Alerts</TabsTrigger>
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
                
                <TabsContent value="risk-alerts">
                  <StepController 
                    currentStep="risk-alerts"
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

            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBackToDashboard}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
