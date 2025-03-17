import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isTokenExpired } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User, AuthContextType } from '@/types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error.message);
          setAuthError(error.message);
          return;
        }
        
        if (data.session?.user) {
          await updateUserState(data.session.user);
        }
        setSessionChecked(true);
      } catch (error: any) {
        console.error('Error checking session:', error);
        setAuthError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          return;
        }
        
        if (session?.user) {
          await updateUserState(session.user);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const updateUserState = async (supabaseUser: any) => {
    try {
      const { data, error } = await supabase
        .from('agency_configurations')
        .select('setup_completed')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user configuration:', error.message);
      }
      
      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        agencyName: supabaseUser.user_metadata?.agencyName,
        setupCompleted: data?.setup_completed || false
      };
      
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error updating user state:', error);
      return null;
    }
  };
  
  const refreshSession = async (): Promise<User | null> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error.message);
        setAuthError(error.message);
        setIsLoading(false);
        return null;
      }
      
      if (data.session?.user) {
        const userData = await updateUserState(data.session.user);
        setIsLoading(false);
        return userData;
      }
      
      setIsLoading(false);
      return null;
    } catch (error: any) {
      console.error('Error refreshing session:', error);
      setAuthError(error.message);
      setIsLoading(false);
      return null;
    }
  };
  
  const signUp = async (
    name: string,
    email: string,
    password: string,
    agencyName?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
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
      
      if (error) {
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }
      
      if (data.user) {
        toast({
          title: 'Account created',
          description: 'Your account has been created successfully.'
        });
        return true;
      }
      
      toast({
        title: 'Signup error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } catch (error: any) {
      toast({
        title: 'Signup error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }
      
      if (data.user) {
        toast({
          title: 'Login successful',
          description: 'Welcome back!'
        });
        return true;
      }
      
      toast({
        title: 'Login error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } catch (error: any) {
      toast({
        title: 'Login error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logIn = async (email: string, password: string): Promise<boolean> => {
    return signIn(email, password);
  };
  
  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (error: any) {
      toast({
        title: 'Logout error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const logOut = async (): Promise<void> => {
    return signOut();
  };
  
  const updateSetupStatus = async (completed: boolean): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('agency_configurations')
        .update({ setup_completed: completed })
        .eq('user_id', user.id);
      
      if (error) {
        toast({
          title: 'Update failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }
      
      setUser(prev => prev ? { ...prev, setupCompleted: completed } : null);
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Update error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        authError,
        signUp,
        signIn,
        signOut,
        logIn,
        logOut,
        updateSetupStatus,
        refreshSession,
        sessionChecked
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export type { User };
