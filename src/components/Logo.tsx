
import React from 'react';

export const Logo = ({ className = '' }) => {
  return (
    <img 
      src="/lovable-uploads/65aed5f5-71ec-45f1-9ac9-13ce05b39c46.png" 
      alt="Company Logo" 
      className={`h-10 w-10 ${className}`}
    />
  );
};
