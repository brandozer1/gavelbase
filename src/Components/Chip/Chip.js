import React from 'react';

const Chip = ({ text, color = 'gray', size = 'md' }) => {
  // Define size variations
  const sizeClasses = {
    sm: 'px-1 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  // Define color variations
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-600 fill-gray-400',
    red: 'bg-red-100 text-red-700 fill-red-500',
    yellow: 'bg-yellow-100 text-yellow-800 fill-yellow-500',
    green: 'bg-green-100 text-green-700 fill-green-500',
    blue: 'bg-blue-100 text-blue-700 fill-blue-500',
    indigo: 'bg-indigo-100 text-indigo-700 fill-indigo-500',
    purple: 'bg-purple-100 text-purple-700 fill-purple-500',
    pink: 'bg-pink-100 text-pink-700 fill-pink-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-x-1.5 rounded-full font-medium ${sizeClasses[size]} ${colorClasses[color]}`}
    >
      <svg viewBox="0 0 6 6" aria-hidden="true" className={`h-1.5 w-1.5`}>
        <circle r={3} cx={3} cy={3} />
      </svg>
      {text}
    </span>
  );
};

export default Chip;
