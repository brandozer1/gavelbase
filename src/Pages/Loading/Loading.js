import React, { useState, useEffect } from 'react';
import { HashLoader } from 'react-spinners';

const loadingMessages = [
  'Loading your data...',
  'Hang tight, we are preparing things for you...',
  'Just a moment, almost there...',
];

export default function Loading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Cycle through loading messages every 3 seconds
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center px-6 py-12 lg:px-8">
    
      <div className="flex flex-col items-center justify-center mt-40 gap-5">
        <HashLoader color={'#5045E6'} />
        <h1 className="text-xl text-center font-bold leading-6 text-gray-900 sm:text-2xl md:text-3xl">
          {loadingMessages[messageIndex]}
        </h1>
      </div>
    </div>
  );
}

