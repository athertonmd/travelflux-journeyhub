
import React from 'react';
import { Globe } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface GdsSelectionProps {
  selected: string;
  onSelect: (gds: string) => void;
}

const GdsSelection: React.FC<GdsSelectionProps> = ({ selected, onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        Select the Global Distribution System (GDS) that your agency uses. This will allow Tripscape to receive booking data.
      </div>

      <RadioGroup 
        value={selected} 
        onValueChange={onSelect}
        className="space-y-4"
      >
        <div className={`border rounded-lg p-6 ${selected === 'Sabre' ? 'border-primary bg-primary/5' : 'border-border'}`}>
          <div className="flex items-start">
            <RadioGroupItem value="Sabre" id="sabre" className="mt-1" />
            <div className="ml-3 flex-1">
              <Label htmlFor="sabre" className="text-lg font-semibold block cursor-pointer">Sabre</Label>
              <p className="text-sm text-gray-600 mt-1">
                Connect with Sabre GDS for real-time booking data and traveler information.
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Globe className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className={`border rounded-lg p-6 ${selected === 'Travelport' ? 'border-primary bg-primary/5' : 'border-border'}`}>
          <div className="flex items-start">
            <RadioGroupItem value="Travelport" id="travelport" className="mt-1" />
            <div className="ml-3 flex-1">
              <Label htmlFor="travelport" className="text-lg font-semibold block cursor-pointer">Travelport</Label>
              <p className="text-sm text-gray-600 mt-1">
                Connect with Travelport GDS (Galileo, Apollo, Worldspan) for real-time booking data.
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Globe className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default GdsSelection;
