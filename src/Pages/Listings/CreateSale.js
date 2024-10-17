import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function CreateSale() {
  const location = useLocation(); // Get the current location
  const [selectedLots, setSelectedLots] = useState([]); // State to store the selected lots

  useEffect(() => {
    // Parse query parameters to get the lots
    const queryParams = new URLSearchParams(location.search);
    const lotsParam = queryParams.get('lots');
    
    // Check if the lots parameter exists and is a valid JSON string
    if (lotsParam) {
      try {
        const lots = JSON.parse(lotsParam);
        setSelectedLots(lots); // Store the parsed lots in the state
      } catch (error) {
        console.error('Failed to parse lots from query parameters:', error);
      }
    }
  }, [location.search]); // Run the effect whenever the location's search changes

  return (
    <div>
      <h1>Create Sale</h1>
      <h2>Selected Lots:</h2>
      <pre>{JSON.stringify(selectedLots, null, 2)}</pre> {/* Display the selected lots */}
    </div>
  );
}
