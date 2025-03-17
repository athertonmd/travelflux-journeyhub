
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { toast } from '@/hooks/use-toast';

export type ProductType = 'mobile' | 'documentDelivery' | 'riskManagement';

export function useProductCredits() {
  const { user } = useAuth();
  const { creditInfo, fetchCreditInfo } = useCredits();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Check if the user has enough credits to use a product
   */
  const hasEnoughCredits = () => {
    if (!creditInfo) return false;
    return creditInfo.remainingCredits > 0;
  };

  /**
   * Use a credit for a specific product and PNR
   */
  const useCredit = async (product: ProductType, pnrId: string) => {
    if (!user || !creditInfo) {
      toast({
        title: "Error",
        description: "You must be logged in to use credits",
        variant: "destructive",
      });
      return false;
    }

    if (creditInfo.remainingCredits <= 0) {
      toast({
        title: "Insufficient Credits",
        description: "You don't have enough credits. Please purchase more.",
        variant: "destructive",
      });
      return false;
    }

    setIsProcessing(true);
    try {
      // Increment used credits
      const { error } = await supabase
        .from('credits')
        .update({ 
          used_credits: creditInfo.usedCredits + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', creditInfo.id);
      
      if (error) {
        console.error('Error using credit:', error);
        throw error;
      }
      
      // Record the credit usage (in a real app, you might want a separate table for this)
      console.log(`Credit used for ${product} on PNR ${pnrId}`);
      
      // Refresh credit info
      await fetchCreditInfo();
      
      toast({
        title: "Credit Used",
        description: `You've used 1 credit for ${product}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error in useCredit:', error);
      toast({
        title: "Error using credit",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    hasEnoughCredits,
    useCredit,
    isProcessing,
    creditInfo
  };
}
