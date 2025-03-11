
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StepController from '@/components/onboarding/StepController';
import { Card, CardFooter } from '@/components/ui/card';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
            <StepController 
              currentStep="products"
              formData={formData}
              updateFormData={updateFormData}
            />

            <CardFooter>
              <div className="flex justify-end w-full">
                <Button 
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  Save Changes
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
