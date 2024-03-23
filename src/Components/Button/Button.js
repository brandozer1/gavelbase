import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

const Button = ({
  size = 'md',
  iconPosition = 'left',
  icon,
  text = 'Button text',
  className = '',
  ...rest
}) => {
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-3 py-2',
  };

  const iconPositions = {
    left: '-ml-0.5',
    right: '-mr-0.5',
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${sizes[size]} ${className}`}
      {...rest}
    >
      {icon && iconPosition === 'left' && (
        <CheckCircleIcon
          className={`${iconPositions[iconPosition]} h-5 w-5`}
          aria-hidden="true"
        />
      )}
      <span>{text}</span>
      {icon && iconPosition === 'right' && (
        <CheckCircleIcon
          className={`${iconPositions[iconPosition]} h-5 w-5`}
          aria-hidden="true"
        />
      )}
    </button>
  );
};

export default Button;
