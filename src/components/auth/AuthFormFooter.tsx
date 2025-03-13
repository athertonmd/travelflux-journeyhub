
import React from 'react';
import { Link } from 'react-router-dom';
import { CardFooter } from '@/components/ui/card';

interface AuthFormFooterProps {
  mode: 'login' | 'signup';
}

const AuthFormFooter = ({ mode }: AuthFormFooterProps) => {
  return (
    <CardFooter className="flex flex-col">
      <div className="text-sm text-gray-600 text-center mt-2">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </>
        )}
      </div>
    </CardFooter>
  );
};

export default AuthFormFooter;
