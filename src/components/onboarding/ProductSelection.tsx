
import React from 'react';
import { Smartphone, FileText, Shield } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ProductSelectionProps {
  selected: {
    mobile: boolean;
    documentDelivery: boolean;
    riskManagement: boolean;
  };
  onUpdate: (products: {
    mobile: boolean;
    documentDelivery: boolean;
    riskManagement: boolean;
  }) => void;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({ selected, onUpdate }) => {
  const handleChange = (product: keyof typeof selected) => {
    onUpdate({
      ...selected,
      [product]: !selected[product]
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        Please select the Tripscape products you'd like to use. You can always modify these selections later.
      </div>
      
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        <div className={`border rounded-lg p-6 ${selected.mobile ? 'border-primary bg-primary/5' : 'border-border'}`}>
          <div className="mb-4">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Mobile App</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Provide travelers with a branded mobile app for itineraries, documents, and real-time updates.
          </p>
          <div className="flex items-center space-x-2 mt-auto">
            <Checkbox 
              id="mobile" 
              checked={selected.mobile} 
              onCheckedChange={() => handleChange('mobile')}
            />
            <Label htmlFor="mobile" className="cursor-pointer">Select Mobile App</Label>
          </div>
        </div>

        <div className={`border rounded-lg p-6 ${selected.documentDelivery ? 'border-primary bg-primary/5' : 'border-border'}`}>
          <div className="mb-4">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Document Delivery</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Automatically send travel documents to travelers via email or make them available in the mobile app.
          </p>
          <div className="flex items-center space-x-2 mt-auto">
            <Checkbox 
              id="documentDelivery" 
              checked={selected.documentDelivery} 
              onCheckedChange={() => handleChange('documentDelivery')}
            />
            <Label htmlFor="documentDelivery" className="cursor-pointer">Select Document Delivery</Label>
          </div>
        </div>

        <div className={`border rounded-lg p-6 ${selected.riskManagement ? 'border-primary bg-primary/5' : 'border-border'}`}>
          <div className="mb-4">
            <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Risk Management</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Keep travelers informed about safety risks and provide emergency assistance features.
          </p>
          <div className="flex items-center space-x-2 mt-auto">
            <Checkbox 
              id="riskManagement" 
              checked={selected.riskManagement} 
              onCheckedChange={() => handleChange('riskManagement')}
            />
            <Label htmlFor="riskManagement" className="cursor-pointer">Select Risk Management</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSelection;
