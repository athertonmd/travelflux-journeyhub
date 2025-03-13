
import React from 'react';
import { CardContent } from '@/components/ui/card';
import SignUpFormInputs from './SignUpFormInputs';
import SubmitButton from './SubmitButton';
import { useSignUpForm } from './useSignUpForm';

interface SignUpFormProps {
  isLoading: boolean;
  onSignUp: (name: string, email: string, password: string, agencyName?: string) => Promise<void>;
}

const SignUpForm = ({ isLoading, onSignUp }: SignUpFormProps) => {
  const { formData, errors, handleChange, handleSubmit } = useSignUpForm(onSignUp);

  return (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SignUpFormInputs 
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          isDisabled={isLoading}
        />
        
        <SubmitButton 
          isLoading={isLoading}
          text="Create account"
          loadingText="Creating account..."
        />
      </form>
    </CardContent>
  );
};

export default SignUpForm;
