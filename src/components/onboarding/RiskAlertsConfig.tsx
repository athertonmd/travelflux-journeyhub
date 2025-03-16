
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// List of countries for selection
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad',
  'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
  'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany',
  'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos',
  'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway',
  'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
  'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia',
  'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Uruguay', '  Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

interface RiskAlertsConfigProps {
  selectedCountries: string[];
  onUpdate: (countries: string[]) => void;
  tripBriefsEnabled?: boolean;
  onTripBriefsChange?: (enabled: boolean) => void;
}

const RiskAlertsConfig: React.FC<RiskAlertsConfigProps> = ({
  selectedCountries,
  onUpdate,
  tripBriefsEnabled = false,
  onTripBriefsChange = () => {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = COUNTRIES.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCountry = (country: string) => {
    const newSelected = selectedCountries.includes(country)
      ? selectedCountries.filter(c => c !== country)
      : [...selectedCountries, country];
    onUpdate(newSelected);
  };

  const removeCountry = (country: string) => {
    onUpdate(selectedCountries.filter(c => c !== country));
  };

  const selectAll = () => {
    if (selectedCountries.length === COUNTRIES.length) {
      // If all countries are selected, deselect all
      onUpdate([]);
    } else {
      // Otherwise, select all countries
      onUpdate([...COUNTRIES]);
    }
  };

  const isAllSelected = selectedCountries.length === COUNTRIES.length;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Selected Countries</h3>
        <div className="flex flex-wrap gap-2">
          {selectedCountries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No countries selected</p>
          ) : (
            selectedCountries.map(country => (
              <Badge key={country} variant="secondary" className="px-3 py-1">
                {country}
                <button
                  onClick={() => removeCountry(country)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <Checkbox
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={selectAll}
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select All Countries
          </label>
        </div>

        <ScrollArea className="h-[300px] border rounded-md">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {filteredCountries.map(country => (
                <div key={country} className="flex items-center space-x-2">
                  <Checkbox
                    id={`country-${country}`}
                    checked={selectedCountries.includes(country)}
                    onCheckedChange={() => toggleCountry(country)}
                  />
                  <label
                    htmlFor={`country-${country}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {country}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="trip-briefs"
            checked={tripBriefsEnabled}
            onCheckedChange={(checked) => onTripBriefsChange(checked === true)}
          />
          <div>
            <label
              htmlFor="trip-briefs"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable Trip Briefs
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Send risk assessment documents to travelers before their trip to provide the latest risk assessment for their destination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAlertsConfig;
