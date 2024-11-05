import React from 'react';

interface CreditsDisplayProps {
  availableCredits: number;
  dailyCreditLimit: number;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ availableCredits, dailyCreditLimit }) => {
  return (
    <div className="absolute top-4 right-4 backdrop-blur-md bg-white/10 p-4 rounded-lg">
      <div className="text-white text-sm">
        <p>Credits Available: {availableCredits}</p>
        <p>Daily Limit: {dailyCreditLimit}</p>
      </div>
    </div>
  );
};