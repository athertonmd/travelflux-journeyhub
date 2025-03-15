
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface GdsSelectionProps {
  selected: string;
  onSelect: (gds: string) => void;
}

const GdsSelection: React.FC<GdsSelectionProps> = ({ selected, onSelect }) => {
  const gdsOptions = [
    {
      id: 'sabre',
      name: 'Sabre',
      description: 'Connect to Sabre to process your PNRs and itineraries.',
    },
    {
      id: 'amadeus',
      name: 'Amadeus',
      description: 'Integrate with Amadeus to manage bookings and travel data.',
    },
    {
      id: 'travelport',
      name: 'Travelport',
      description: 'Connect to Galileo, Apollo, or Worldspan with Travelport.',
    },
    {
      id: 'other',
      name: 'Other',
      description: 'Configure a different GDS or booking system.',
    },
  ];

  return (
    <RadioGroup 
      value={selected}
      onValueChange={onSelect}
      className="space-y-4"
    >
      {gdsOptions.map((gds) => (
        <div
          key={gds.id}
          className={`flex items-start space-x-3 cursor-pointer ${
            selected === gds.name ? 'border-primary' : 'border-border'
          }`}
          onClick={() => onSelect(gds.name)}
        >
          <RadioGroupItem value={gds.name} id={gds.id} className="mt-1" />
          <div className="flex-1">
            <Label
              htmlFor={gds.id}
              className="text-base font-medium cursor-pointer"
            >
              {gds.name}
            </Label>
            <p className="text-sm text-muted-foreground">{gds.description}</p>
          </div>
        </div>
      ))}
    </RadioGroup>
  );
};

export default GdsSelection;
