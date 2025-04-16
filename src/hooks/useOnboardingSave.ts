import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { OnboardingFormData } from './useOnboardingForm';
import { Json } from '@/integrations/supabase/types';

export const useOnboardingSave = (userId: string | undefined, setIsLoading: (loading: boolean) => void) => {
  const saveConfiguration = async (formData: OnboardingFormData) => {
    if (!userId) return false;
    
    setIsLoading(true);
    
    try {
      // Handle logo upload if a new file was selected
      let logoUrl = formData.branding.logoUrl;
      
      if (formData.branding.logo) {
        const file = formData.branding.logo;
        const fileExt = file.name.split('.').pop();
        const filePath = `${userId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('agency_logos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) {
          throw new Error(`Error uploading logo: ${uploadError.message}`);
        }
        
        logoUrl = filePath;
      }
      
      // Ensure categories are properly ordered before saving
      const orderedGuide = {
        ...formData.agencyGuide,
        categories: formData.agencyGuide.categories.map((cat, index) => ({
          ...cat,
          position: index + 1
        }))
      };
      
      // Convert the form data to the expected database structure
      const configData = {
        products: formData.products as unknown as Json,
        gds_provider: formData.gdsProvider,
        gds_config: formData.gdsConfig as unknown as Json,
        selected_trip_tiles: formData.selectedTripTiles,
        branding: {
          primaryColor: formData.branding.primaryColor,
          secondaryColor: formData.branding.secondaryColor,
          logoUrl: logoUrl
        } as unknown as Json,
        contact_info: formData.contactInfo as unknown as Json,
        alert_countries: formData.alertCountries,
        trip_briefs_enabled: formData.tripBriefsEnabled,
        alert_email: formData.alertEmail,
        agency_guide: orderedGuide as unknown as Json
      } as any;
      
      console.log('Saving agency guide data with ordered categories:', orderedGuide);
      
      const { error } = await supabase
        .from('agency_configurations')
        .update(configData)
        .eq('user_id', userId as any);
      
      if (error) throw error;
      
      toast({
        title: "Changes Saved",
        description: "Your configuration has been updated successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your configuration.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const completeSetup = async (formData: OnboardingFormData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const saveResult = await saveConfiguration(formData);
      if (!saveResult) return false;
      
      const { error } = await supabase
        .from('agency_configurations')
        .update({ setup_completed: true } as any)
        .eq('user_id', userId as any);
      
      if (error) throw error;
      
      toast({
        title: "Setup Complete!",
        description: "Your account has been successfully configured.",
      });
      
      return true;
    } catch (error) {
      console.error('Error completing setup:', error);
      toast({
        title: "Setup Failed",
        description: "There was an error completing your setup. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveConfiguration,
    completeSetup
  };
};
