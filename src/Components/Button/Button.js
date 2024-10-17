import React from 'react';
import * as Spinners from 'react-spinners'; // Import all spinners from react-spinners

const Button = ({
  size = 'md',
  iconPosition = 'left',
  Icon, // Capitalized to indicate it's a component
  text = 'Button text',
  className = '',
  spinner = null, // Spinner prop that takes the name of the spinner component as a string
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

  // Dynamically select the correct spinner based on the `spinner` prop
  const SpinnerComponent = spinner ? Spinners[spinner] : null;

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-x-1.5 rounded-md bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${sizes[size]} ${className}`}
      {...rest}
    >
      {Icon && iconPosition === 'left' && !SpinnerComponent && (
        <Icon
          className={`${iconPositions[iconPosition]} h-5 w-5`}
          aria-hidden="true"
        />
      )}

      {/* Render the spinner if the spinner prop is provided, otherwise show text */}
      {SpinnerComponent ? (
        <SpinnerComponent color="white" size={20} /> // Customize spinner color/size as needed
      ) : (
        <span>{text}</span>
      )}

      {Icon && iconPosition === 'right' && !SpinnerComponent && (
        <Icon
          className={`${iconPositions[iconPosition]} h-5 w-5`}
          aria-hidden="true"
        />
      )}
    </button>
  );
};

export default Button;
