
import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface FormData {
  email: string;
  password: string;
  name: string;
  agencyName: string;
  remember: boolean;
  acceptTerms: boolean;
}

interface AuthFormInputsProps {
  mode: 'login' | 'signup';
  formData: FormData;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const AuthFormInputs = ({ 
  mode, 
  formData, 
  isLoading, 
  handleChange,
  setFormData 
}: AuthFormInputsProps) => {
  return (
    <>
      {mode === 'signup' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agencyName">Agency Name</Label>
            <Input
              id="agencyName"
              name="agencyName"
              placeholder="Acme Travel"
              value={formData.agencyName}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
          autoComplete="email"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {mode === 'login' && (
            <Link 
              to="/forgot-password" 
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          )}
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
          autoComplete="current-password"
        />
      </div>
      
      {mode === 'login' ? (
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            name="remember"
            checked={formData.remember}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, remember: checked === true }))
            }
            disabled={isLoading}
          />
          <Label htmlFor="remember" className="text-sm">Remember me</Label>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="acceptTerms" 
            name="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, acceptTerms: checked === true }))
            }
            disabled={isLoading}
            required
          />
          <Label htmlFor="acceptTerms" className="text-sm">
            I agree to the{' '}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>
      )}
    </>
  );
};

export default AuthFormInputs;
