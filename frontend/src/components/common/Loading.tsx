import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text }) => {
  const sizeMap = {
    sm: 20,
    md: 40,
    lg: 60,
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="animate-spin text-blue-600" size={sizeMap[size]} />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
};
