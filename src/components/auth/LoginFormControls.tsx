
import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface LoginFormControlsProps {
  formData: {
    email: string;
    password: string;
    remember: boolean;
  };
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<{
    email: string;
    password: string;
    remember: boolean;
  }>>;
}

const LoginFormControls: React.FC<LoginFormControlsProps> = ({
  formData,
  isLoading,
  handleChange,
  setFormData,
}) => {
  return (
    <>
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
          <Link 
            to="/forgot-password" 
            className="text-xs text-primary hover:underline"
          >
            Forgot password?
          </Link>
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
    </>
  );
};

export default LoginFormControls;
