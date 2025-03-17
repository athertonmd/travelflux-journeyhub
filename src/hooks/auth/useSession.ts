
import { useState, useCallback } from 'react';
import { supabase, isTokenExpired } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export type SessionStatus = {
  sessionChecked: boolean;
  setSessionChecked: (value: boolean) => void;
}

export const useSession = () => {
  const [sessionChecked, setSessionChecked] = useState(false);
  
  // Update user state with Supabase user data
  const updateUserState = useCallback(async (supabaseUser: any) => {
    if (!supabaseUser) {
      console.log('No user data available, clearing user state');
      return null;
    }

    try {
      console.log('Updating user state for:', supabaseUser.email);
      
      // Check setup status
      const { data, error } = await supabase
        .from('agency_configurations')
        .select('setup_completed')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user configuration:', error.message);
        throw error;
      }
      
      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        agencyName: supabaseUser.user_metadata?.agencyName,
        setupCompleted: data?.setup_completed || false
      };
      
      return userData;
    } catch (error: any) {
      console.error('Error updating user state:', error.message);
      throw error;
    }
  }, []);

  // Check if session needs refresh
  const checkSessionExpiry = async (): Promise<boolean> => {
    try {
      return await isTokenExpired();
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true; // Assume expired if we can't check
    }
  };

  // Get current session
  const getCurrentSession = async (signal?: AbortSignal) => {
    try {
      console.log('Checking current session');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error fetching session:', error.message);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Session fetch error:', error);
      throw error;
    }
  };

  return {
    sessionChecked,
    setSessionChecked,
    updateUserState,
    checkSessionExpiry,
    getCurrentSession
  };
};
