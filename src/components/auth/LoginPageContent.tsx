
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';

interface LoginPageContentProps {
  isLoading: boolean;
  onLogin: (email: string, password: string, remember: boolean) => Promise<boolean>;
}

const LoginPageContent: React.FC<LoginPageContentProps> = ({ isLoading, onLogin }) => {
  return (
    <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        <Card className="glass-card animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <LoginForm 
            isLoading={isLoading}
            onLogin={onLogin}
          />
        </Card>
      </div>
    </div>
  );
};

export default LoginPageContent;
