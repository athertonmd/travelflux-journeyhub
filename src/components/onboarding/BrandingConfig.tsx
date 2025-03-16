
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface BrandingConfigProps {
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: File | null;
  };
  onUpdate: (branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: File | null;
  }) => void;
}

const BrandingConfig: React.FC<BrandingConfigProps> = ({ branding, onUpdate }) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (key: 'primaryColor' | 'secondaryColor', value: string) => {
    onUpdate({
      ...branding,
      [key]: value
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onUpdate({
        ...branding,
        logo: file
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-sm text-gray-600 mb-4">
        Customize the appearance of your Tripscape experience with your brand colors and logo.
        These elements will be used throughout the mobile app and document delivery.
      </div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-md border" 
                style={{ backgroundColor: branding.primaryColor }}
              ></div>
              <Input 
                id="primaryColor" 
                type="color" 
                value={branding.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input 
                type="text" 
                value={branding.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Your main brand color, used for buttons, links, and highlights.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-md border" 
                style={{ backgroundColor: branding.secondaryColor }}
              ></div>
              <Input 
                id="secondaryColor" 
                type="color" 
                value={branding.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input 
                type="text" 
                value={branding.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Complementary color, used for accents and secondary elements.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="logo">Company Logo</Label>
            <div 
              className="mt-2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                id="logo"
                type="file" 
                accept="image/png, image/jpeg" 
                className="hidden"
                onChange={handleLogoChange}
              />
              
              {logoPreview ? (
                <div className="space-y-4 text-center">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="max-h-32 max-w-full mx-auto"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    Change Logo
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium">Click to upload logo</p>
                  <p className="text-xs text-gray-500 mt-1">PNG or JPG (max. 2MB)</p>
                </>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-3">Preview</h3>
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex flex-col items-center">
                <div className="w-full h-12 rounded-md mb-3" style={{ backgroundColor: branding.primaryColor }}></div>
                
                <div className="flex items-center mb-2">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="h-8 mr-2" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                  )}
                  <span className="font-medium">{branding.logo?.name || "Your Agency"}</span>
                </div>
                
                <div className="space-y-2 w-full mt-2">
                  <div className="h-4 w-3/4 rounded-full bg-gray-200"></div>
                  <div className="h-4 w-5/6 rounded-full bg-gray-200"></div>
                  <div 
                    className="h-8 rounded-md w-1/2 mx-auto mt-3 text-white flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    Primary Button
                  </div>
                  <div 
                    className="h-2 w-full rounded-full mt-3"
                    style={{ backgroundColor: branding.secondaryColor }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingConfig;
