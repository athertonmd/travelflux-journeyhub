
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import StepController from '@/components/onboarding/StepController';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ErrorBoundary from '@/components/ErrorBoundary';

const SettingsContent = () => {
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

  // Check if Mobile App is selected
  const isMobileAppEnabled = formData.products.mobile;
  
  // Check if Risk Management is selected
  const isRiskManagementEnabled = formData.products.riskManagement;

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Agency Settings">
      <Card className="max-w-5xl mx-auto">
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
              <TabsTrigger value="trips" disabled={!isMobileAppEnabled}>Mobile Settings</TabsTrigger>
              <TabsTrigger value="risk-alerts" disabled={!isRiskManagementEnabled}>Risk Alerts</TabsTrigger>
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

        <CardFooter className="flex justify-end">
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
    </DashboardLayout>
  );
};

const Settings = () => {
  return (
    <ErrorBoundary>
      <SettingsContent />
    </ErrorBoundary>
  );
};

export default Settings;
