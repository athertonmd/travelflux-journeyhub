
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

type User = {
  id: string;
  email: string;
  name: string;
  agencyName?: string;
  setupCompleted?: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, agencyName?: string) => Promise<void>;
  logout: () => void;
  checkSetupStatus: () => Promise<boolean>;
  updateSetupStatus: (completed: boolean) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          // Get user profile data
          const userData = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || '',
            agencyName: data.session.user.user_metadata?.agencyName
          };
          
          // Check setup status
          const { data: configData } = await supabase
            .from('agency_configurations')
            .select('setup_completed')
            .eq('user_id', userData.id)
            .single();
          
          setUser({
            ...userData,
            setupCompleted: configData?.setup_completed || false
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
          agencyName: session.user.user_metadata?.agencyName
        };
        
        // Check setup status
        const { data: configData } = await supabase
          .from('agency_configurations')
          .select('setup_completed')
          .eq('user_id', userData.id)
          .single();
        
        setUser({
          ...userData,
          setupCompleted: configData?.setup_completed || false
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
          agencyName: data.user.user_metadata?.agencyName
        };
        
        // Check setup status
        const { data: configData } = await supabase
          .from('agency_configurations')
          .select('setup_completed')
          .eq('user_id', userData.id)
          .single();
        
        setUser({
          ...userData,
          setupCompleted: configData?.setup_completed || false
        });
        
        toast({
          title: "Login successful",
          description: "Welcome back to Tripscape!",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, agencyName?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            agencyName
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
          agencyName: data.user.user_metadata?.agencyName,
          setupCompleted: false
        };
        
        setUser(userData);
        
        toast({
          title: "Account created",
          description: "Welcome to Tripscape!",
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const checkSetupStatus = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('agency_configurations')
        .select('setup_completed')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      return data?.setup_completed || false;
    } catch (error) {
      console.error('Error checking setup status:', error);
      return false;
    }
  };

  const updateSetupStatus = async (completed: boolean): Promise<void> => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('agency_configurations')
        .update({ setup_completed: completed })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setUser(prev => prev ? { ...prev, setupCompleted: completed } : null);
    } catch (error) {
      console.error('Error updating setup status:', error);
      toast({
        title: "Update failed",
        description: "Failed to update setup status.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    checkSetupStatus,
    updateSetupStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
