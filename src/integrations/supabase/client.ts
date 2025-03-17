
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yiunhkcbqdbhxjrdwgaq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdW5oa2NicWRiaHhqcmR3Z2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2OTA1NjAsImV4cCI6MjA1NzI2NjU2MH0.PBvJvi-zF6dy8kIous7X_qw5LAAOv4ie8S4BMuStR10";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true, // Enable auto refresh for tokens
      persistSession: true,
      storageKey: 'tripscape-auth-token',
      detectSessionInUrl: true, // Enable URL detection to handle redirects properly
      flowType: 'pkce',
      debug: process.env.NODE_ENV === 'development' // Only enable debug in development
    },
    global: {
      headers: {
        'X-Client-Info': 'tripscape-app'
      }
    },
    // Set reasonable timeout to prevent hanging requests
    realtime: {
      timeout: 10000 // 10 seconds
    }
  }
);

// Enhanced helper function to completely clear auth data
export const clearAuthData = () => {
  console.log('Clearing all auth data with enhanced cleanup');
  
  try {
    // First, try to sign out of Supabase to invalidate any server-side tokens
    supabase.auth.signOut({ scope: 'global' }).catch(err => {
      console.error('Error during forced signout:', err);
    });
    
    // Clear ALL localStorage items related to auth
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('supabase') || 
        key.includes('auth') || 
        key.includes('token') || 
        key.includes('tripscape') ||
        key.includes('sb-')
      )) {
        console.log(`Removing localStorage key: ${key}`);
        localStorage.removeItem(key);
      }
    }
    
    // Clear ALL sessionStorage similarly
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (
        key.includes('supabase') || 
        key.includes('auth') || 
        key.includes('token') || 
        key.includes('tripscape') ||
        key.includes('sb-')
      )) {
        console.log(`Removing sessionStorage key: ${key}`);
        sessionStorage.removeItem(key);
      }
    }
    
    // Clear all cookies including hidden ones
    document.cookie.split(";").forEach(function(c) {
      const cookieName = c.trim().split("=")[0];
      if (cookieName) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      }
    });
    
    // Force a complete refresh of the Supabase client's internal state
    (supabase.auth as any).initialize();
    
    console.log('Enhanced auth data cleanup complete');
  } catch (error) {
    console.error('Error during enhanced auth data clearing:', error);
  }
};

// Add a helper to check token validity without triggering auto-refresh
export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return true;
    
    // Get expiry time from session
    const expiresAt = data.session.expires_at;
    if (!expiresAt) return true;
    
    // Add buffer time (5 minutes) to avoid edge cases
    const bufferTime = 5 * 60; // 5 minutes in seconds
    const currentTime = Math.floor(Date.now() / 1000);
    
    return currentTime > expiresAt - bufferTime;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true; // Assume expired if we can't check
  }
};
