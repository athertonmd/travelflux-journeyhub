
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

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

export const useSignUpForm = (
  onSignUp: (name: string, email: string, password: string, agencyName?: string) => Promise<void>
) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agencyName: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '' 
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      console.log('Submitting form with data:', {
        name: formData.name,
        email: formData.email,
        agencyName: formData.agencyName
      });
      
      // Only pass agencyName if it's not empty
      const agencyNameParam = formData.agencyName.trim() || undefined;
      
      await onSignUp(
        formData.name,
        formData.email,
        formData.password,
        agencyNameParam
      );
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: "Signup Failed",
        description: error?.message || "Failed to create account. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit
  };
};
