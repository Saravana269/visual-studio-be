
import React from 'react';

export const Logo = ({ className = '' }) => {
  return (
    <img 
      src="/lovable-uploads/b4f8b596-1ad4-4b81-a8d6-4623e1718688.png" 
      alt="Company Logo" 
      className={`h-10 w-10 ${className}`}
    />
  );
};
