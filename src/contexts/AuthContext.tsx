
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

type User = {
  id: string;
  email: string;
  name: string;
  agencyName?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, agencyName?: string) => Promise<void>;
  logout: () => void;
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
    const storedUser = localStorage.getItem('tripscape_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock implementation - in a real app, you'd call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll create a mock user
      if (email && password) {
        const newUser = {
          id: 'user-' + Date.now(),
          email,
          name: email.split('@')[0],
        };
        
        setUser(newUser);
        localStorage.setItem('tripscape_user', JSON.stringify(newUser));
        
        toast({
          title: "Login successful",
          description: "Welcome back to Tripscape!",
        });
      } else {
        throw new Error('Invalid credentials');
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
      // This is a mock implementation - in a real app, you'd call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!name || !email || !password) {
        throw new Error('Missing required fields');
      }
      
      // For demo purposes, we'll create a mock user
      const newUser = {
        id: 'user-' + Date.now(),
        email,
        name,
        agencyName,
      };
      
      setUser(newUser);
      localStorage.setItem('tripscape_user', JSON.stringify(newUser));
      
      toast({
        title: "Account created",
        description: "Welcome to Tripscape!",
      });
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tripscape_user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
