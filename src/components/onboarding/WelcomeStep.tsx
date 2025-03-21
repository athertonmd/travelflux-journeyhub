
import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface WelcomeStepProps {
  userName: string;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ userName }) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to Tripscape!</CardTitle>
        <CardDescription>
          Let's get your agency set up with our platform. This wizard will guide you through the setup process.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Hello, {userName}! Thank you for choosing Tripscape for your travel management needs.</p>
        <p>During this setup process, you will:</p>
        <ul className="list-disc pl-5 text-left space-y-2">
          <li>Select which Tripscape products you want to activate</li>
          <li>Connect your Global Distribution System (GDS)</li>
          <li>Select trip tiles for your mobile app</li>
          <li>Customize the look and feel with your brand colors and logo</li>
        </ul>
        <p>Click "Next" to begin the setup process.</p>
      </CardContent>
    </>
  );
};

export default WelcomeStep;
