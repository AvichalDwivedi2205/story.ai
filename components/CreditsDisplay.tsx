import React from 'react';

interface CreditsDisplayProps {
  availableCredits: number;
  dailyCreditLimit: number;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ availableCredits, dailyCreditLimit }) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-white/20 p-4 rounded-lg shadow-lg border border-white/20">
      <div className="text-white text-sm text-center space-y-1">
        <p className="font-semibold">Daily Credits available: <span className="text-emerald-400">{availableCredits}/{dailyCreditLimit}</span></p>
      </div>
    </div>
  );
};

export default CreditsDisplay;
