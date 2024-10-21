import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../axiosInstance'; // Adjust the import path as needed
import Button from '../../Components/Button/Button'
import TextInput from '../../Components/TextInput/TextInput'
import useLib from '../../Hooks/useLib';

export default function CreateSale() {
  const location = useLocation(); // Get the current location
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
          <h1>Create Sale</h1>
          {
            lotDetails.map((lot) => {
              return (
                <div className='flex flex-col gap-2 justify-between w-full h-40 p-3 xl:flex-row xl:h-24'>
                  <div className='flex justify-start gap-2 h-1/3 xl:h-2/3'>
                    <div className='flex gap-1 w-68 items-center '>
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
                  {/* <div className='flex flex-col'>
                    <p className='text-bold'>{lot.condition.name}</p>
                    <p className='text-xs'>{lot.conditionDescription}</p>
                  </div> */}
                  <div className='flex gap-3 items-center'>
                    <div className='flex flex-col'>
                      <div className='flex justify-between'>
                        <span className='text-sm font-medium text-gray-700 mb-1'>Dimensions</span>
                        <span className='text-sm font-medium text-gray-700 mb-1'>Weight</span>
                      </div>
                      <div className='flex w-52'>
                        <TextInput placeholder={'L"'} className={'rounded-r-none'} />
                        <TextInput placeholder={'W"'} className={'rounded-r-none rounded-l-none z-2'} />
                        <TextInput placeholder={'H"'} className={'rounded-l-none'} style={{borderWidth: "0px"}} />
                        <TextInput placeholder={'LB'} className={"ml-3"} />
                      </div>
                    </div>
                    <div className='flex flex-col ml-3'>
                      <TextInput
                        label={"Fixed Price"}
                        // helpText={"sdf"}
                      />
                      {/* <p className='leading-tight text-xs text-gray-400'> Suggestion: <span className='underline' onClick={()=>{}}>$120.00</span></p> */}
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
        
      )}
      
    </div>
  );
}
