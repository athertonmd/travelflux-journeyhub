
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { User } from '@/types/auth.types';

export const useSetupStatus = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const checkSetupStatus = async (): Promise<boolean> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return false;
    
    try {
      const { data, error } = await supabase
        .from('agency_configurations')
        .select('setup_completed')
        .eq('user_id', session.session.user.id)
        .single();
      
      if (error) throw error;
      
      return data?.setup_completed || false;
    } catch (error) {
      console.error('Error checking setup status:', error);
      return false;
    }
  };

  const updateSetupStatus = async (completed: boolean): Promise<boolean> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return false;
    
    try {
      const { error } = await supabase
        .from('agency_configurations')
        .update({ setup_completed: completed })
        .eq('user_id', session.session.user.id);
      
      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, setupCompleted: completed } : null);
      return true;
    } catch (error) {
      console.error('Error updating setup status:', error);
      toast({
        title: "Update failed",
        description: "Failed to update setup status.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    checkSetupStatus,
    updateSetupStatus
  };
};
