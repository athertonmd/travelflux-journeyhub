
import { User } from '@/types/auth.types';
import { useLogin } from './auth/useLogin';
import { useSignup } from './auth/useSignup';
import { useLogout } from './auth/useLogout';
import { useSetupStatus } from './auth/useSetupStatus';
import { useState } from 'react';

export const useAuthActions = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const loginFn = useLogin();
  const signupFn = useSignup();
  const logout = useLogout(setUser);
  const { checkSetupStatus, updateSetupStatus } = useSetupStatus(setUser);

  // Wrapper function for login to manage global loading state
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await loginFn(email, password);
      // Let the auth state listener handle setting the user
      return result;
    } finally {
      // Don't set isLoading to false here - let the auth state change handle it
      // This prevents race conditions with redirection
    }
  };

  // Wrapper function for signup to manage global loading state
  const signup = async (name: string, email: string, password: string, agencyName?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await signupFn(name, email, password, agencyName);
      // Let the auth state listener handle setting the user
      return result;
    } finally {
      // Don't set isLoading to false here - let the auth state change handle it
      // This prevents race conditions with redirection
    }
  };

  return {
    login,
    signup,
    logout,
    checkSetupStatus,
    updateSetupStatus
  };
};
