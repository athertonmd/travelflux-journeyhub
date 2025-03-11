
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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

  const fetchCreditInfo = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const remaining = data.total_credits - data.used_credits;
        const percentage = Math.min(Math.round((data.used_credits / data.total_credits) * 100), 100);
        
        setCreditInfo({
          id: data.id,
          totalCredits: data.total_credits,
          usedCredits: data.used_credits,
          isFreeTier: data.is_free_tier,
          remainingCredits: remaining,
          usagePercentage: percentage
        });
      }
    } catch (error) {
      console.error('Error fetching credit info:', error);
      toast({
        title: "Error fetching credit info",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseCredits = async (amount: number) => {
    if (!user || !creditInfo) return;
    
    // In a real app, this would involve a payment process
    // For now, we'll just simulate purchasing credits
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('credits')
        .update({ 
          total_credits: creditInfo.totalCredits + amount,
          is_free_tier: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', creditInfo.id);
      
      if (error) throw error;
      
      toast({
        title: "Credits purchased",
        description: `You've successfully purchased ${amount} credits.`,
      });
      
      await fetchCreditInfo();
    } catch (error) {
      console.error('Error purchasing credits:', error);
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
    fetchCreditInfo();
  }, [user]);

  return {
    creditInfo,
    isLoading,
    fetchCreditInfo,
    purchaseCredits
  };
};
