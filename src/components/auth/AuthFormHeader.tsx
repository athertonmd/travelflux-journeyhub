
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthFormHeaderProps {
  mode: 'login' | 'signup';
}

const AuthFormHeader = ({ mode }: AuthFormHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="text-2xl font-display text-center">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </CardTitle>
      <CardDescription className="text-center">
        {mode === 'login'
          ? 'Enter your credentials to access your account'
          : 'Fill in the information to get started'
        }
      </CardDescription>
    </CardHeader>
  );
};

export default AuthFormHeader;
