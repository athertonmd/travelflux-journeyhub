
import React from 'react';
import { Check } from 'lucide-react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CompleteStepProps {
  products: {
    mobile: boolean;
    documentDelivery: boolean;
    riskManagement: boolean;
  };
  gdsProvider: string;
  selectedTripTiles: string[];
  branding: {
    primaryColor: string;
    secondaryColor: string;
  };
}

const CompleteStep: React.FC<CompleteStepProps> = ({ 
  products, 
  gdsProvider, 
  selectedTripTiles, 
  branding 
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Setup Complete!</CardTitle>
        <CardDescription>
          You've successfully configured your Tripscape account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 text-green-700 rounded-md p-4 flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p className="font-semibold">Your account is ready!</p>
            <p className="text-sm mt-1">You can now start using Tripscape for your travel management needs.</p>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mt-4">Summary of your configuration:</h3>
        
        <div className="space-y-3">
          <div>
            <p className="font-medium">Products selected:</p>
            <ul className="list-disc pl-5 mt-1">
              {products.mobile && <li>Mobile App</li>}
              {products.documentDelivery && <li>Document Delivery</li>}
              {products.riskManagement && <li>Risk Management</li>}
            </ul>
          </div>
          
          <div>
            <p className="font-medium">GDS Provider:</p>
            <p className="mt-1">{gdsProvider}</p>
          </div>
          
          <div>
            <p className="font-medium">Trip Tiles Selected:</p>
            <p className="mt-1">{selectedTripTiles.length} tiles selected</p>
          </div>
          
          <div>
            <p className="font-medium">Branding:</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: branding.primaryColor }}></div>
              <span>Primary Color</span>
              
              <div className="h-4 w-4 rounded-full ml-4" style={{ backgroundColor: branding.secondaryColor }}></div>
              <span>Secondary Color</span>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default CompleteStep;
