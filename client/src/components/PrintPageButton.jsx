import React from 'react';
import Button from './Button';

const PrintPageButton = ({ className, children = "Print", ...props }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      onClick={handlePrint}
      className={`py-2! text-sm! bg-[#1f2028]! rounded-lg border border-[#3e404a] text-gray-300 hover:text-white! hover:border-purple-500/50 ${className || ''}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PrintPageButton;
