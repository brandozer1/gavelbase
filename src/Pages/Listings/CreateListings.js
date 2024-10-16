import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../axiosInstance';
import MUIDataTable from 'mui-datatables';
import { TextField, IconButton } from '@material-ui/core';
import { Search as SearchIcon, Clear as ClearIcon } from '@material-ui/icons';
import Loading from '../Loading/Loading';

export default function CreateListings() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Table state
  const [page, setPage] = useState(0); // Zero-based index
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchText, setSearchText] = useState(''); // State for search

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
        name: 'condition',
        label: 'Condition',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (conditionObject) => {
            console.log('conditionObject:', conditionObject);
            if (conditionObject && typeof conditionObject === 'object') {
              // Access the condition data correctly
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
          sort: { createdAt: -1 },
          filters: { status: 'Idle' },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchText]);

  const options = {
    responsive: 'scroll',
    serverSide: true,
    sort: false, // Disable global sorting
    filter: false, // Disable filters
    count: totalCount,
    page: page,
    rowsPerPage: rowsPerPage,
    selectableRows: 'multiple', // Enable row selection
    fixedHeader: false, // Keep the header fixed during scroll
    fixedSelectColumn: false, // Allow the select column to scroll
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
            // Do not reset page here to maintain page number when searching
          }
          break;
        default:
          break;
      }
    },
    textLabels: {
      body: {
        noMatch: loading ? <Loading /> : 'Sorry, no matching records found',
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
    rowsPerPageOptions: [10, 25, 50, 100],
    download: true, // Enable download option
    print: true, // Enable print option
    selectableRowsHeader: true, // Show select all checkbox
    tableBodyHeight: 'calc(100vh - 200px)', // Adjust the offset as needed
    maxBodyHeight: 'calc(100vh - 200px)', // Adjust the offset as needed
  };

  return (
    <div style={{ height: '100%' }}>
      <MUIDataTable
        title={'Lots'}
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  );
}
