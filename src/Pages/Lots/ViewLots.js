import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../axiosInstance';
import MUIDataTable from 'mui-datatables';
import Chip from '../../Components/Chip/Chip'
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { TextField, IconButton } from '@material-ui/core';
import { Search as SearchIcon, Clear as ClearIcon } from '@material-ui/icons';
import Loading from '../Loading/Loading';

export default function ViewLots() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Table state
  const [page, setPage] = useState(0); // Zero-based index
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchText, setSearchText] = useState(''); // State for search

  const navigate = useNavigate(); // Hook to programmatically navigate

  // Column definitions
  const columns = useMemo(
    () => [
      {
        name: 'thumbnail',
        label: 'Thumbnail',
        options: {
          filter: false,
          sort: false,
          setCellProps: () => ({ style: { width: '120px' } }),
          setCellHeaderProps: () => ({ style: { width: '120px' } }),
          customBodyRender: (value, tableMeta) => {
            const title = tableMeta.rowData[2];
            return (
              <div
                className="w-half flex m-2 items-center justify-center bg-gray-100 border border-gray-300 rounded overflow-hidden"
                style={{ aspectRatio: '1/1' }}
              >
                <img
                  src={
                    value
                      ? value.includes('gavelbase.s3')
                        ? value.replace('/images/', '/thumbnails/')
                        : value
                      : 'https://via.placeholder.com/96'
                  }
                  alt={`Thumbnail for ${title}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/96';
                  }}
                />
              </div>
            );
          },
        },
      },
      {
        name: 'lotNumber',
        label: 'Lot Number',
        options: {
          display: 'false', // Hide this column but keep it in rowData
        },
      },
      {
        name: 'title',
        label: 'Lot Number/Title',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta) => {
            const lotNumber = tableMeta.rowData[1]; // 'lotNumber' is at index 1
            return (
              <div
                style={{
                  overflowX: 'hidden',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              >
                <p className="leading-tight font-bold">{lotNumber}</p>
                <p className="leading-tight">{value}</p>
              </div>
            );
          },
        },
      },
      {
        name: 'description',
        label: 'Description',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => (
            <div
              style={{
                overflowX: 'hidden',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
            >
              <p className="text-xs leading-tight">{value}</p>
            </div>
          ),
        },
      },
      {
        name: 'brand',
        label: 'Brand',
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: 'model',
        label: 'Model',
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: 'condition',
        label: 'Condition',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (conditionObject) => {
            if (conditionObject && typeof conditionObject === 'object') {
              const condition =
                conditionObject.value && typeof conditionObject.value === 'object'
                  ? conditionObject.value
                  : conditionObject;

              return (
                <div className="flex flex-col">
                  <p className="font-bold">{condition.name || 'N/A'}</p>
                  <p>{condition.conditionDescription || 'No description'}</p>
                </div>
              );
            }
            return 'N/A';
          },
        },
      },
      {
        name: 'status',
        label: 'Status',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (status) => {
            switch (status) {
              case "Idle": return <Chip text={status} />
              case "Active": return <Chip text={status} color='green' />
              case "Completed": return <Chip text={status} color='blue' />
              default: return status;
            }
          }
        },
      },
      {
        name: 'location',
        label: 'Location',
        options: {
          filter: false,
          sort: false,
            customBodyRender: (location)=>{
                return <p className='font-bold'>{location}</p>
            }
        },
      },
      {
        name: 'createdAt',
        label: 'Created At',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => {
            return new Date(value).toLocaleString();
          },
        },
      },
    ],
    []
  );

  // Custom Search Component
  const CustomSearchRender = ({ searchText, onSearch, onHide }) => {
    const [text, setText] = useState(searchText || '');

    // Update local text state when searchText prop changes
    useEffect(() => {
      setText(searchText || '');
    }, [searchText]);

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        onSearch(text);
      }
    };

    const handleSearchClick = () => {
      onSearch(text);
    };

    const handleClear = () => {
      setText('');
      onSearch('');
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          variant="standard"
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSearchClick}>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <IconButton onClick={handleClear}>
          <ClearIcon />
        </IconButton>
      </div>
    );
  };

  // Fetch data from the server
  const fetchData = async () => {
    setLoading(true);

    const offset = page * rowsPerPage;
    const count = rowsPerPage;

    try {
      const response = await axiosInstance.post(
        '/v1/crew/lot/keyword-search',
        {
          keyword: searchText,
          offset: offset,
          count: count,
          sort: {createdAt: -1}
        }
      );

      if (response.status === 200) {
        const combinedLots = [
          ...response.data.results,
          ...response.data.similarResults,
        ];
        setData(
          combinedLots.map((lot) => ({
            id: lot._id,
            ...lot,
            brand: lot.details?.brand || 'N/A',
            model: lot.details?.model || 'N/A',
            location: lot.location?.label || 'Not Located',
            createdAt: lot.createdAt,
            condition: lot.condition || null, // Include the condition field
          }))
        );
        setTotalCount(response.data.totalSearchCount);
      } else {
        console.warn('Unexpected response status:', response.status);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching lots:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when page, rowsPerPage, or searchText change
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, searchText]);

  const options = {
    responsive: 'scrollMaxHeight',
    serverSide: true,
    sort: false, // Disable global sorting
    filter: false, // Disable filters
    count: totalCount,
    page: page,
    rowsPerPage: rowsPerPage,
    selectableRows: 'none',
    search: true, // Enable built-in search bar
    searchText: searchText, // Bind searchText state to table's search bar
    customSearchRender: (
      searchTextValue,
      handleSearch,
      hideSearch,
      options
    ) => {
      return (
        <CustomSearchRender
          searchText={searchTextValue}
          onSearch={handleSearch}
          onHide={hideSearch}
        />
      );
    },
    onRowClick: (rowData, rowMeta) => {
      const lotId = data[rowMeta.dataIndex].id; // Get lotId from the data array
      navigate(`./Edit/${lotId}`); // Navigate to the Edit page with lotId in the URL
    },
    onTableChange: (action, tableState) => {
      switch (action) {
        case 'changePage':
          setPage(tableState.page);
          break;
        case 'changeRowsPerPage':
          setRowsPerPage(tableState.rowsPerPage);
          setPage(0); // Reset to first page when rows per page change
          break;
        case 'search':
          if (searchText !== tableState.searchText) {
            setSearchText(tableState.searchText);
          }
          break;
        default:
          break;
      }
    },
    textLabels: {
      body: {
        noMatch: loading
          ? <Loading />
          : 'Sorry, no matching records found',
      },
      toolbar: {
        search: 'Search',
      },
      pagination: {
        next: 'Next Page',
        previous: 'Previous Page',
        rowsPerPage: 'Rows per page:',
        displayRows: 'of',
      },
    },
    rowsPerPageOptions: [10, 20, 30, 40, 50],
    download: true, // Enable download option
    print: true, // Enable print option
    selectableRowsHeader: false,
  };

  return (
    <div className="flex flex-col h-full">
      <MUIDataTable
        title={'Lots'}
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  );
}
