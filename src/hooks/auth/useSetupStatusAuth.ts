
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types/auth.types';

export const useSetupStatusAuth = (user: User | null, setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  // Update setup status function
  const updateSetupStatus = async (completed: boolean): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('agency_configurations')
        .update({ setup_completed: completed })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, setupCompleted: completed } : null);
      return true;
    } catch (error: any) {
      console.error('Error updating setup status:', error);
      toast({
        title: "Update failed",
        description: "Failed to update setup status",
        variant: "destructive",
      });
      return false;
    }
  };

  return { updateSetupStatus };
};
