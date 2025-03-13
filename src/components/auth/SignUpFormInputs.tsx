
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agencyName: string;
}

interface FormErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpFormInputsProps {
  formData: FormData;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
}

const SignUpFormInputs = ({ formData, errors, handleChange, isDisabled }: SignUpFormInputsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isDisabled}
          className={`transition-all duration-200 focus:ring-2 focus:ring-primary/30 ${
            errors.name ? 'border-red-500' : ''
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="agencyName">Agency Name (Optional)</Label>
        <Input
          id="agencyName"
          name="agencyName"
          type="text"
          placeholder="Your Travel Agency"
          value={formData.agencyName}
          onChange={handleChange}
          disabled={isDisabled}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
        />
      </div>

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
          disabled={isDisabled}
          className={`transition-all duration-200 focus:ring-2 focus:ring-primary/30 ${
            errors.email ? 'border-red-500' : ''
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isDisabled}
          className={`transition-all duration-200 focus:ring-2 focus:ring-primary/30 ${
            errors.password ? 'border-red-500' : ''
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={isDisabled}
          className={`transition-all duration-200 focus:ring-2 focus:ring-primary/30 ${
            errors.confirmPassword ? 'border-red-500' : ''
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>
    </>
  );
};

export default SignUpFormInputs;
