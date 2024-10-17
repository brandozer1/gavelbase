import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../axiosInstance';
import MUIDataTable from 'mui-datatables';
import { TextField, IconButton, Button } from '@material-ui/core';
import { Search as SearchIcon, Clear as ClearIcon } from '@material-ui/icons';
import Loading from '../Loading/Loading';
import { Link } from 'react-router-dom';

export default function CreateListings() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Table state
  const [page, setPage] = useState(0); // Zero-based index
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchText, setSearchText] = useState(''); // State for search

  // Selected lot IDs state
  const [selectedLots, setSelectedLots] = useState([]);

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
            condition: lot.condition || null,
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

  // Handle selection change from the table and merge with previous selections
  const handleRowsSelect = (currentRowsSelected, allRowsSelected) => {
    setSelectedLots((prevSelected) => {
      const selectedSet = new Set(prevSelected);

      currentRowsSelected.forEach((row) => {
        const lotId = data[row.index]?.id;
        if (lotId) {
          if (selectedSet.has(lotId)) {
            selectedSet.delete(lotId); // Deselect
          } else {
            selectedSet.add(lotId); // Select
          }
        }
      });

      return Array.from(selectedSet);
    });
  };

  // Create query parameters from selectedLots array
  const queryString = selectedLots.length
    ? `?lots=${encodeURIComponent(JSON.stringify(selectedLots))}`
    : '';

  const options = {
    responsive: 'scroll',
    serverSide: true,
    sort: false,
    filter: false,
    count: totalCount,
    page: page,
    rowsPerPage: rowsPerPage,
    selectableRows: 'multiple',
    selectableRowsHideCheckboxes: false, // Keep the checkboxes visible
    fixedHeader: false,
    search: true,
    searchText: searchText,
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
          }
          break;
        default:
          break;
      }
    },
    onRowsSelect: handleRowsSelect, // Update selection state on row selection
    rowsSelected: data
      .map((lot, index) => (selectedLots.includes(lot.id) ? index : null))
      .filter(index => index !== null), // Sync selected rows with state
    selectToolbarPlacement: 'none', // Disable the selection toolbar
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
    download: true,
    print: true,
    selectableRowsHeader: true,
    tableBodyHeight: 'calc(100vh - 200px)',
    maxBodyHeight: 'calc(100vh - 200px)',
    onRowsDelete: () => false, // Disable default row delete behavior
  };

  return (
    <div style={{ height: '100%' }}>
      <MUIDataTable
        title={'Lots'}
        data={data}
        columns={columns}
        options={options}
      />

      {/* Button to navigate to Auction with selected lots in query string */}
      <Button
        component={Link}
        to={`./Auction${queryString}`}
        variant="contained"
        color="primary"
      >
        For Auction
      </Button>

      {/* Display selected lot IDs */}
      <div style={{ marginTop: '20px' }}>
        <h3>Selected Lots IDs:</h3>
        <pre>{JSON.stringify(selectedLots, null, 2)}</pre>
      </div>
    </div>
  );
}
