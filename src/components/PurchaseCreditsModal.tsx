
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditInfo } from '@/hooks/useCredits';
import { CreditCard, Package } from 'lucide-react';

interface CreditPackage {
  id: string;
  amount: number;
  price: number;
  recommended?: boolean;
}

interface PurchaseCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (amount: number) => Promise<void>;
  creditInfo: CreditInfo;
  isLoading: boolean;
}

const creditPackages: CreditPackage[] = [
  { id: 'basic', amount: 100, price: 100 },
  { id: 'standard', amount: 300, price: 270, recommended: true },
  { id: 'premium', amount: 500, price: 400 }
];

const PurchaseCreditsModal: React.FC<PurchaseCreditsModalProps> = ({
  isOpen,
  onClose,
  onPurchase,
  creditInfo,
  isLoading
}) => {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(
    creditPackages.find(pkg => pkg.recommended) || null
  );

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    await onPurchase(selectedPackage.amount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {creditInfo.isFreeTier ? 'Upgrade to Paid Plan' : 'Purchase More Credits'}
          </DialogTitle>
          <DialogDescription>
            {creditInfo.isFreeTier 
              ? 'Upgrade from your free trial to a paid plan with more credits.'
              : 'Select a credit package to purchase additional booking credits.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {creditPackages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                selectedPackage?.id === pkg.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/30'
              }`}
              onClick={() => setSelectedPackage(pkg)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${selectedPackage?.id === pkg.id ? 'bg-primary/10' : 'bg-muted'}`}>
                  <Package className={`h-5 w-5 ${selectedPackage?.id === pkg.id ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="font-medium">{pkg.amount} Credits</h3>
                  <p className="text-sm text-muted-foreground">${pkg.price.toFixed(2)}</p>
                </div>
              </div>
              {pkg.recommended && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Recommended
                </span>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handlePurchase} 
            disabled={!selectedPackage || isLoading}
          >
            {isLoading ? 'Processing...' : `Purchase for $${selectedPackage?.price.toFixed(2) || '0.00'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseCreditsModal;
