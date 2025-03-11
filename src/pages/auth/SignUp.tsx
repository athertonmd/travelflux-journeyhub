
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agencyName: '',
  });
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log('User already authenticated:', user);
      if (!user.setupCompleted) {
        navigate('/welcome');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { password: '', confirmPassword: '' };

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

  const verifyUserConfiguration = async (userId: string) => {
    try {
      // Verify if the user has a configuration record
      const { data, error } = await supabase
        .from('agency_configurations')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error checking user configuration:', error);
        
        // If no configuration exists, create one manually
        if (error.code === 'PGRST116') { // No rows returned error
          console.log('No configuration found, creating one manually...');
          const { error: insertError } = await supabase
            .from('agency_configurations')
            .insert([{ user_id: userId, setup_completed: false }]);
            
          if (insertError) {
            console.error('Error creating user configuration:', insertError);
            throw insertError;
          }
          console.log('Manual configuration created successfully');
        } else {
          throw error;
        }
      } else {
        console.log('User configuration verified:', data);
      }
    } catch (error) {
      console.error('Failed to verify user configuration:', error);
      // Continue the flow even if this fails, the trigger should handle it
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      console.log('Attempting signup with:', formData.name, formData.email, formData.agencyName);
      const { user: newUser, error } = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.agencyName
      );
      
      if (error) {
        throw error;
      }
      
      if (newUser?.id) {
        console.log('Signup successful, verifying user configuration...');
        await verifyUserConfiguration(newUser.id);
      }
      
      // Navigation will be handled by the useEffect
      console.log('Signup process completed, redirecting soon...');
      toast({
        title: "Account created",
        description: "You will be redirected to complete your setup.",
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Failed",
        description: error?.message || "Failed to create account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-display text-center">
                Create your account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your details to sign up for Tripscape
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                  />
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
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                  />
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
                    className={`transition-all duration-200 focus:ring-2 focus:ring-primary/30 ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full animated-border-button mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <span>Sign Up</span>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-sm text-gray-600 text-center mt-2">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
