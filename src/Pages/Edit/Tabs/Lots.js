import React, {useEffect, useState} from 'react';

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

import Loading from '../../../Pages/Loading/Loading'; // Loading component

import placeholderImage from '../../../Assets/Images/image_missing.jpg'; // Placeholder image for the thumbnail container

import axios from 'axios';
import useLib from '../../../Hooks/useLib';

import ThumbnailContainer from '../../../Components/ThumbnailContainer/ThumbnailContainer';

// renderer so that I can use custom JSX in the cell
const conditionCellRenderer = (condition) => {
  
  return (
    <div className='flex flex-col h-full justify-content-start'>
      <div>{condition.note}</div>
      <div>{condition.name}</div>
    </div>
  )
}

export default function Lots() {

  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [colDefs, setColDefs] = useState([
    // image column checks that the images array in a lot is undamaged before loading the images
    // custom cell renderer to display the image in a thumbnail container
    { field: "Image", sortable:false, width:135, minWidth:80, cellRenderer: (e)=>{
      return (
        <div className='w-full h-full flex justify-center py-1'>
          {
            (typeof e.data.images == "object" && e.data.images.length > 0 && typeof e.data.images[0] == "string") ? 
              <ThumbnailContainer className={"h-full "} src={e.data.images[0]} /> 
            : 
              <ThumbnailContainer className={"h-full"} src={placeholderImage} />
          }
        </div>
      )
    }},
    { field: "lotNumber", headerName: "#",  checkboxSelection: true, headerCheckboxSelection: true },
    { field: "location", headerName: "Location", editable: false, filter: 'agTextColumnFilter', sortable: true, flex: 1},
    { field: "title",  headerName: "Title", editable: true, filter: 'agTextColumnFilter', sortable: true, flex: 1 },
    { field: "description", headerName: "Description", editable: true, filter: 'agTextColumnFilter', flex: 2},
    { field: "status", headerName: "Status", flex: 1, minWidth: 110},
    // use rows data to populate the condition column
    { field: "condition.note", headerName: "Condition", cellStyle: { display: 'flex', flexDirection: 'column', justifyContent: 'start', height: '100%'}},
  ]);

  const [rowData, setRowData] = useState([
    { "lotNumber": 0, Title: "Model Y", Location: "AB012", Status: "Active", description: "This is a description", condition: { name: "Good", notes: "This is a good condition" } },
  ]);


  useEffect(() => {
    axios.get(useLib.createServerUrl('/api/v1/lot/'+JSON.stringify({})), {
      withCredentials: true
    })
    .then((response) => {
      if (response.status === 200) {
        setRowData(response.data);
        console.log(response.data);
        setLoading(false);
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }, [])

    
  return (
    <>
      {
        loading ?
          <Loading />
        :
      

        <div
          className="ag-theme-quartz" // applying the grid theme
          style={{ height: "100%" }} // the grid will fill the size of the parent container
        >
          {/* add make column */}
            <AgGridReact
                
                rowData={rowData}
                columnDefs={colDefs}
                pagination={true}
                paginationPageSize={10}
                rowSelection='multiple'
                gridOptions={{
                  autoRowHeight: true,
                }}

            />
        </div>
      }
    </>
  );
}
