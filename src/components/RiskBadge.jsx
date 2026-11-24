import React from 'react';

const RiskBadge = ({ risk, onClick, clickable = false }) => {
  const styles = {
    HIGH: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:shadow-lg",
    MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 hover:shadow-lg",
    LOW: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:shadow-lg",
  };

  return (
    <span 
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${styles[risk] || styles.LOW} ${clickable ? 'cursor-pointer' : ''}`}
    >
      {risk}
    </span>
  );
};

export default RiskBadge;
