
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yiunhkcbqdbhxjrdwgaq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdW5oa2NicWRiaHhqcmR3Z2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2OTA1NjAsImV4cCI6MjA1NzI2NjU2MH0.PBvJvi-zF6dy8kIous7X_qw5LAAOv4ie8S4BMuStR10";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'tripscape-auth',
      storage: localStorage,
      detectSessionInUrl: false, // Disable automatic detection to prevent loops
      flowType: 'implicit', // Use implicit flow for more reliable auth
    },
    global: {
      headers: {
        'x-application-name': 'tripscape',
      },
      // Fix the fetch typing
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        // Add timeout to all fetch requests
        return new Promise<Response>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Request timeout'));
          }, 15000); // Increased timeout from 10s to 15s for better reliability
          
          fetch(input, init)
            .then(response => {
              clearTimeout(timeoutId);
              resolve(response);
            })
            .catch(error => {
              clearTimeout(timeoutId);
              reject(error);
            });
        });
      }
    }
  }
);

// Check if the current session token is expired
export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      return true;
    }
    
    // Check if the session has an expiry timestamp
    if (data.session.expires_at) {
      // Convert expires_at to milliseconds (it's in seconds)
      const expiresAt = data.session.expires_at * 1000;
      const now = Date.now();
      
      // Return true if current time is past expiry or within 5 minutes of expiring
      // This gives us a buffer to refresh before it actually expires
      return now >= (expiresAt - 5 * 60 * 1000);
    }
    
    return false;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true; // Assume expired if we can't check
  }
};

// Enhanced helper to clear auth data
export const clearAuthData = () => {
  try {
    console.log('Clearing all auth data for a fresh login');
    
    // Clear session flag first
    sessionStorage.removeItem('manual-clear-in-progress');
    
    // Sign out from Supabase first (don't await to avoid hanging)
    supabase.auth.signOut().catch(err => {
      console.error('Error signing out from Supabase:', err);
    });
    
    // Then clear all local storage items related to auth
    const storageKeys = [
      'tripscape-auth',
      'sb-' + SUPABASE_URL.replace(/^(https?:\/\/)/, '').replace(/\./g, '-') + '-auth-token',
      // Add any other potential storage keys used by Supabase
      localStorage.getItem('supabase.auth.token')
    ];
    
    storageKeys.forEach(key => {
      if (key) {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.error(`Error removing ${key} from localStorage:`, e);
        }
      }
    });
    
    // Clear all Supabase-related items with a wildcard approach
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.error(`Error removing ${key} from localStorage:`, e);
        }
      }
    });
    
    console.log('Auth data cleared successfully');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};
