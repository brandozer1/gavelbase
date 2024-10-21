import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../axiosInstance'; // Adjust the import path as needed
import Button from '../../Components/Button/Button'
import TextInput from '../../Components/TextInput/TextInput'
import useLib from '../../Hooks/useLib';

export default function CreateAuction() {
  const location = useLocation(); // Get the current location
  const [manualExportStatus, setManualExportStatus] = useState("Loading");
  const [lotDetails, setLotDetails] = useState([]); // State to store the fetched lot details
  const [loading, setLoading] = useState(true); // Optional: Loading state
  const [error, setError] = useState(null); // Optional: Error state

  useEffect(() => {
    // Function to fetch lot details
    const fetchLotDetails = async (lotIds) => {
      try {
        // Send GET request to /info with lotId as query parameters
        const response = await axiosInstance.get('/v1/crew/lot/info', {
          params: { lotId: lotIds },
        });

        // Check if the response contains 'lots' (multiple lots) or 'lot' (single lot)
        if (response.data.lots) {
          setLotDetails(response.data.lots); // Set state with array of lots
        } else if (response.data.lot) {
          setLotDetails([response.data.lot]); // Set state with single lot in an array
        } else {
          setLotDetails([]); // No lots found
        }
      } catch (err) {
        console.log(err)
        console.error('Error fetching lot info:', err);
        setError(err); // Set error state
      } finally {
        setLoading(false); // Set loading to false after request completes
      }
    };

    // Parse query parameters to get the 'lots' parameter
    const queryParams = new URLSearchParams(location.search);
    const lotsParam = queryParams.get('lots');

    // Check if the 'lots' parameter exists
    if (lotsParam) {
      try {
        // Parse the 'lots' parameter as JSON (expecting an array of lot IDs)
        const lotIds = JSON.parse(lotsParam);

        // Validate that lotIds is an array and contains at least one ID
        if (Array.isArray(lotIds) && lotIds.length > 0) {
          fetchLotDetails(lotIds); // Fetch details for multiple lots
        } else if (typeof lotIds === 'string' && lotIds.trim() !== '') {
          fetchLotDetails([lotIds]); // Fetch details for a single lot
        } else {
          console.warn('Invalid format for lots parameter.');
          setLotDetails([]); // Reset lotDetails state
          setLoading(false); // Set loading to false
        }
      } catch (err) {
        console.error('Failed to parse lots from query parameters:', err);
        setError(err); // Set error state
        setLoading(false); // Set loading to false
      }
    } else {
      console.warn('No lots parameter found in query.');
      setLotDetails([]); // Reset lotDetails state
      setLoading(false); // Set loading to false
    }
  }, [location.search]); // Run the effect whenever the location's search changes

  return (
    <div>
      {/* Optional: Display loading or error states */}
      {loading && <p>Loading lot details...</p>}
      {error && <p>Error fetching lot details. Please try again later.</p>}

      {/* Optional: Display the fetched lot details for verification */}
      {!loading && !error && (
        <div>
          <h1>Create Auction</h1>
          {
            lotDetails.map((lot) => {
              return (
                <div className='flex gap-2 justify-between w-full h-16 p-3'>
                  <div className='flex justify-between gap-2'>
                    <div className='flex gap-1 w-68'>
                      {
                        lot.images.map((src, index)=>{
                          
                          return (
                            <>
                              {
                                index < 4 &&
                                <div className='h-full flex justify-center bg-gray-200' style={{aspectRatio: "1/1"}}>
                                  <img className='object-contain h-full' src={src.includes("gavelbase.s3") && src.replace("/images/", "/thumbnails/")}/>
                                </div>
                              }
                            </>
                          )
                        })
                      }
                      <div className='h-full flex justify-center bg-gray-200' style={{aspectRatio: "1/1"}}>
                        edit
                      </div>
                    </div>
                    <div className='flex flex-col'>
                      <p className='text-bold'>{lot.lotNumber}</p>
                      <p className='text-xs'>{lot.title}</p>
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <p className='text-bold'>{lot.condition.name}</p>
                    <p className='text-xs'>{lot.conditionDescription}</p>
                  </div>
                  <TextInput></TextInput>
                </div>
              )
            })
          }
        </div>
        
      )}
      <Button
      text='Export Listings'
      spinner={manualExportStatus}
      onClick={async () => {
        const lotsParam = new URLSearchParams(location.search).get('lots');
        let lotIds;
    
        try {
          lotIds = JSON.parse(lotsParam);
          if (!Array.isArray(lotIds)) {
            lotIds = [lotIds];
          }
          console.log('Parsed lotIds:', lotIds);
        } catch (e) {
          console.error('Error parsing lots parameter:', e);
          alert('Invalid lots parameter format.');
          return;
        }
    
        // Update status to indicate the process is starting
        setManualExportStatus('BarLoader');
    
        // Call the downloadAuctionData function and handle the promise
        useLib.downloadAuctionData(lotIds)
          .then((message) => {
            setManualExportStatus(null); // Update status on success
          })
          .catch((error) => {
            setManualExportStatus(null); // Update status on error
          });
      }}
      disabled={false} // Optionally manage disabled state based on loading
    />
    <Button
      text='Mark Items as Completed'
      spinner={manualExportStatus}
      onClick={async () => {
        const lotsParam = new URLSearchParams(location.search).get('lots');
        let lotIds;
    
        try {
          lotIds = JSON.parse(lotsParam);
          if (!Array.isArray(lotIds)) {
            lotIds = [lotIds];
          }
          console.log('Parsed lotIds:', lotIds);
        } catch (e) {
          console.error('Error parsing lots parameter:', e);
          alert('Invalid lots parameter format.');
          return;
        }
    
        // Update status to indicate the process is starting
        setManualExportStatus('BarLoader');
    
        // Call the downloadAuctionData function and handle the promise
        axiosInstance.post('/v1/crew/lot/bulk-status-update', {lotIds: lotIds, status: "Completed"})
          .then((response) => {
            console.log(response)
          })
          .catch((error) => {
            console.log(error)
          });
      }}
      disabled={false} // Optionally manage disabled state based on loading
    />
    </div>
  );
}
