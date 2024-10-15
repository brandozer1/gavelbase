import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../axiosInstance';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import CreateListing from './CreateAuction';
import { Route, Routes } from 'react-router-dom';

import ebayIcon from '../../Assets/Images/ebay_icon.svg';
import facebookIcon from '../../Assets/Images/facebook_icon.svg';
import { Link } from 'react-router-dom';

export default function ViewListings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const columnDefs = useMemo(() => [
        {
            headerName: 'Thumbnail',
            field: 'thumbnail',
            suppressSizeToFit: true,
            cellRenderer: params => (
                <div className="w-half flex m-2 items-center justify-center bg-gray-100 border border-gray-300 rounded overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <img 
                        src={params.value} 
                        alt={`Thumbnail for ${params.data.title}`} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = 'https://via.placeholder.com/96'; 
                        }}
                    />
                </div>
            ),
            sortable: false,
            filter: false,
            width: 120,
            autoHeight: true
        },
        { 
            headerName: 'Lot Number', 
            field: 'lotNumber', 
            sortable: true, 
            filter: 'agNumberColumnFilter', 
            width: 120 
        },
        { 
            headerName: 'Title', 
            field: 'title', 
            sortable: true, 
            filter: 'agTextColumnFilter', 
            flex: 1,
            wrapText: true,
            cellRenderer: params => <div className="leading-tight">{params.value}</div>
        },
        { 
            headerName: 'Description', 
            field: 'description', 
            sortable: true, 
            filter: 'agTextColumnFilter', 
            flex: 2,
            wrapText: true,
            cellRenderer: params => <div className="leading-tight">{params.value}</div>
        },
        {
            headerName: 'Platforms',
            field: 'listings',
            sortable: false,
            filter: false,
            flex: 1.5,
            cellRenderer: params => {
                if (params.value && params.value.length > 0) {
                    return (
                        <div className='h-full flex gap-3'>
                            {params.value.map((listing, index) => (
                                <div key={index} className='flex flex-col items-center justify-evenly h-full leading-tight'>
                                    <p className='font-bold text-lg'>
                                        ${(listing.currentPrice / 100).toFixed(2)}
                                    </p>
                                    {listing.platform === 'Ebay' && (
                                        <a href={`https://www.ebay.com/itm/${listing.ebayItemId}`} target='_blank' rel='noreferrer'>
                                            <img src={ebayIcon} className='h-5 mt-0' alt='Ebay Icon' />
                                        </a>
                                    )}
                                    {listing.platform === 'Facebook' && (
                                        <a href='https://www.facebook.com/marketplace/item/1440212746657615' target='_blank' rel='noreferrer'>
                                            <img src={facebookIcon} className='h-4' alt='Facebook Icon' />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                }
                return 'N/A';
            }
        },
        {
            headerName: 'Location',
            field: 'location.label',
            sortable: true,
            filter: 'agTextColumnFilter',
            valueGetter: params => params.data.location?.label || 'N/A'
        },
        { 
            headerName: 'Status', 
            field: 'status', 
            sortable: true, 
            filter: 'agTextColumnFilter', 
            width: 100 
        },
    ], []);

    const defaultColDef = useMemo(() => ({
        resizable: true,
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 100,
    }), []);

    useEffect(() => {
        document.title = 'Listings - Gavelbase';
        
        const fetchListings = async () => {
            try {
                const response = await axiosInstance.post('/v1/crew/listing/keyword-search', {
                    keyword: '',
                    offset: 0,
                    limit: 10,
                    sort: { createdAt: -1 }
                });
                
                if (response.status === 200) {
                    const combinedListings = [...response.data.results, ...response.data.similarResults];
                    setListings(combinedListings);
                } else {
                    console.warn('Unexpected response status:', response.status);
                }
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const getRowId = params => params.data._id;

    return (
        <div className="h-full flex flex-col justify-end">
            <Link to='./Create' className='bg-blue-500 text-white py-2 px-4 rounded mb-4 w-1/4 self-end text-center'>Create Listing</Link>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="ag-theme-material" style={{ height: "80vh", width: '100%' }}>
                    <AgGridReact
                        rowData={listings}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                        getRowId={getRowId}
                        animateRows={true}
                        suppressRowClickSelection={true}
                        enableRangeSelection={true}
                        enableClipboard={true}
                        clipboardDelimiter=","
                        processHeaderCallback={params => params.column.getColDef().headerName}
                    />
                </div>
            )}
        </div>
    );
}