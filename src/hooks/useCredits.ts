
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export type CreditInfo = {
  id: string;
  totalCredits: number;
  usedCredits: number;
  isFreeTier: boolean;
  remainingCredits: number;
  usagePercentage: number;
};

export const useCredits = () => {
  const { user } = useAuth();
  const [creditInfo, setCreditInfo] = useState<CreditInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCreditInfo = useCallback(async () => {
    console.log('Fetching credit info, user:', user?.id);
    if (!user) {
      console.log('No user, skipping credit fetch');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Making Supabase query for credits');
      const { data, error } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', user.id as any)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching credit info:', error);
        setError(error);
        throw error;
      }
      
      console.log('Credit data received:', data);
      if (data) {
        // Check if data has the expected properties
        if ('total_credits' in data && 'used_credits' in data && 'is_free_tier' in data && 'id' in data) {
          const remaining = Math.max(0, data.total_credits - data.used_credits);
          const percentage = data.total_credits > 0 
            ? Math.min(Math.round((data.used_credits / data.total_credits) * 100), 100)
            : 0;
          
          setCreditInfo({
            id: data.id,
            totalCredits: data.total_credits,
            usedCredits: data.used_credits,
            isFreeTier: data.is_free_tier,
            remainingCredits: remaining,
            usagePercentage: percentage
          });
        } else {
          throw new Error('Invalid credit data structure');
        }
      } else {
        console.log('No credit data found, checking if user exists:', user.id);
        // If no credit record exists, create a new one
        try {
          const { data: newCreditData, error: insertError } = await supabase
            .from('credits')
            .insert({
              user_id: user.id,
              total_credits: 30,
              used_credits: 0,
              is_free_tier: true
            } as any)
            .select()
            .single();
          
          if (insertError) {
            console.error('Error creating credit record:', insertError);
            setError(insertError);
            throw insertError;
          }

          if (newCreditData && 'total_credits' in newCreditData) {
            console.log('New credit record created:', newCreditData);
            setCreditInfo({
              id: newCreditData.id,
              totalCredits: newCreditData.total_credits,
              usedCredits: newCreditData.used_credits,
              isFreeTier: newCreditData.is_free_tier,
              remainingCredits: newCreditData.total_credits,
              usagePercentage: 0
            });
          }
        } catch (err) {
          console.error('Failed to create credit record:', err);
          setError(err instanceof Error ? err : new Error('Failed to create credit record'));
        }
      }
    } catch (error) {
      console.error('Error in fetchCreditInfo:', error);
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Unknown error occurred'));
      }
      
      toast({
        title: "Error fetching credit info",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      console.log('Finished fetching credit info, setting isLoading to false');
      setIsLoading(false);
    }
  }, [user]);

  const purchaseCredits = async (amount: number) => {
    if (!user || !creditInfo) {
      toast({
        title: "Error",
        description: "User not authenticated or credit information not available",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would involve a payment process
    // For now, we'll just simulate purchasing credits
    setIsLoading(true);
    try {
      console.log(`Purchasing ${amount} credits for user: ${user.id}`);
      const { error } = await supabase
        .from('credits')
        .update({ 
          total_credits: creditInfo.totalCredits + amount,
          is_free_tier: false,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', creditInfo.id as any);
      
      if (error) {
        console.error('Error purchasing credits:', error);
        throw error;
      }
      
      toast({
        title: "Credits purchased",
        description: `You've successfully purchased ${amount} credits.`,
      });
      
      await fetchCreditInfo();
    } catch (error) {
      console.error('Error in purchaseCredits:', error);
      toast({
        title: "Error purchasing credits",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useCredits useEffect triggered, user:', user?.id);
    if (user) {
      fetchCreditInfo();
    } else {
      console.log('useCredits: No user available, resetting state');
      setIsLoading(false);
      setCreditInfo(null);
    }
  }, [user, fetchCreditInfo]);

  return {
    creditInfo,
    isLoading,
    error,
    fetchCreditInfo,
    purchaseCredits
  };
};
