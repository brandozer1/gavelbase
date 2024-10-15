import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../axiosInstance';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';

import 'ag-grid-community/styles/ag-theme-material.css';


export default function Lot() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Column definitions for Ag-Grid
  const columnDefs = useMemo(() => [
    { headerName: 'Lot Number', field: 'lotNumber', sortable: true, filter: 'agNumberColumnFilter', width: 120 },
    { headerName: 'Title', field: 'title', sortable: true, filter: 'agTextColumnFilter', flex: 1 },
    { headerName: 'Description', field: 'description', sortable: true, filter: 'agTextColumnFilter', flex: 2 },
    {
      headerName: 'Brand',
      field: 'details.brand',
      sortable: true,
      filter: 'agTextColumnFilter',
      valueGetter: params => params.data.details?.brand || 'N/A'
    },
    {
      headerName: 'Model',
      field: 'details.model',
      sortable: true,
      filter: 'agTextColumnFilter',
      valueGetter: params => params.data.details?.model || 'N/A'
    },
    {
      headerName: 'Location',
      field: 'location.label',
      sortable: true,
      filter: 'agTextColumnFilter',
      valueGetter: params => params.data.location?.label || 'Not Located'
    },
    { headerName: 'Status', field: 'status', sortable: true, filter: 'agTextColumnFilter', width: 100 },
    {
      headerName: 'Thumbnail',
      field: 'thumbnail',
      cellRenderer: params => <img src={params.value} alt="thumbnail" style={{ width: '100px', height: 'auto' }} />,
      sortable: false,
      filter: false,
      width: 120
    }
  ], []);

  // Default column properties
  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
  }), []);

  useEffect(() => {
    document.title = 'Lots - Gavelbase';
    
    const fetchLots = async () => {
      try {
        const response = await axiosInstance.post('/v1/crew/lot/keyword-search', {
          keyword: '',
          offset: 0,
          limit: 10,
          sort: {"createdAt": -1}
        });
        
        console.log('API Response:', response);
        
        if (response.status === 200) {
          const combinedLots = [...response.data.results, ...response.data.similarResults];
          setLots(combinedLots);
          console.log('Combined Lots:', combinedLots);
        } else {
          console.warn('Unexpected response status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching lots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLots();
  }, []);

  // Define getRowId to use _id as the unique identifier
  const getRowId = params => params.data._id;

  return (
    <div className="flex flex-col justify-end h-full">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="ag-theme-material" style={{ height: "80%", width: '100%' }}>
          <AgGridReact
            rowData={lots}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            rowSelection="multiple"
            getRowId={getRowId}
            enableCellTextSelection={true}
            animateRows={true}
            gridOptions={{
              cellSelection: false,
              sendToClipboard: ()=>alert('Data copied to clipboard!'),
            }}
            
          />
        </div>
      )}
    </div>
  );
}
