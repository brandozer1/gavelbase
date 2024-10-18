import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../axiosInstance';
import MUIDataTable from 'mui-datatables';
import { TextField, IconButton, Button } from '@material-ui/core';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import ebayIcon from '../../Assets/Images/ebay_icon.svg';
import facebookIcon from '../../Assets/Images/facebook_icon.svg';
import Loading from '../Loading/Loading';

export default function ViewListings() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Table state
  const [page, setPage] = useState(0); // Zero-based index
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
            const title = tableMeta.rowData[2]; // 'title' is at index 2
            return (
              <div
                className="w-half flex m-2 items-center justify-center bg-gray-100 border border-gray-300 rounded overflow-hidden"
                style={{ aspectRatio: '1/1' }}
              >
                <img
                  src={value || 'https://via.placeholder.com/96'}
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
      // Include 'lotNumber' as a hidden column
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
        name: 'status',
        label: 'Status',
        options: {
          filter: false,
          sort: false,
        },
      },
      // Add the 'condition' column here
      {
        name: 'condition',
        label: 'Condition',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => {
            if (value && typeof value === 'object') {
              return (
                <div className="flex flex-col">
                  <p className="font-bold">{value.name || 'N/A'}</p>
                  <p>{value.conditionDescription || 'No description'}</p>
                </div>
              );
            }
            return 'N/A';
          },
        },
      },
      {
        name: 'listings',
        label: 'Type',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (listings) => {
            if (listings && listings.length > 0) {
              return <div>{listings[0].type}</div>;
            }
            return 'N/A';
          },
        },
      },
      {
        name: 'listings',
        label: 'Platforms',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (listings) => {
            if (listings && listings.length > 0) {
              return (
                <div className="h-full flex gap-3">
                  {listings.map((listing, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-evenly h-full leading-tight"
                    >
                      <p className="font-bold text-lg">
                        ${(listing.currentPrice / 100).toFixed(2)}
                      </p>
                      {listing.platform === 'Ebay' && (
                        <a
                          href={`https://www.ebay.com/itm/${listing.ebayItemId}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={ebayIcon}
                            className="h-5 mt-0"
                            alt="Ebay Icon"
                          />
                        </a>
                      )}
                      {listing.platform === 'Facebook' && (
                        <a
                          href={`https://www.facebook.com/marketplace/item/${listing.facebookItemId}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={facebookIcon}
                            className="h-4"
                            alt="Facebook Icon"
                          />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              );
            }
            return 'N/A';
          },
        },
      },
      {
        name: 'location',
        label: 'Location',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (location) => location?.label || 'N/A',
        },
      },
    ],
    []
  );

  // Custom Toolbar Component
  const CustomToolbar = () => {
    return (
      <Button
        component={Link}
        to="./Create"
        variant="contained"
        color="primary"
      >
        Create Listing
      </Button>
    );
  };

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
        '/v1/crew/listing/keyword-search',
        {
          keyword: searchText,
          offset: offset,
          count: count,
          sort: { createdAt: -1 },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        const combinedListings = response.data.results;
        setData(
          combinedListings.map((listing) => ({
            id: listing._id,
            ...listing,
            thumbnail:
              listing.thumbnail || 'https://via.placeholder.com/96',
            location: listing.location || { label: 'N/A' },
            lotNumber: listing.lotNumber || 'N/A', // Ensure lotNumber is included
            condition: listing.condition || null, // Include condition field
          }))
        );
        setTotalCount(response.data.totalSearchCount);
      } else {
        console.warn('Unexpected response status:', response.status);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when page, rowsPerPage, or searchText change
  useEffect(() => {
    document.title = 'Listings - Gavelbase';
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchText]);

  const options = {
    responsive: 'scrollMaxHeight',
    serverSide: true,
    sort: false, // Disable global sorting
    filter: false, // Disable filters
    viewColumns: false, // Disable view columns option
    count: totalCount,
    page: page,
    rowsPerPage: rowsPerPage,
    selectableRows: 'none',
    search: true, // Enable built-in search bar
    searchText: searchText, // Bind searchText state to table's search bar
    customToolbar: () => <CustomToolbar />, // Add custom toolbar
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
    rowsPerPageOptions: [10, 20, 30, 40, 50],
    download: true, // Enable download option
    print: true, // Enable print option
    selectableRowsHeader: false,
  };

  return (
    <div className="flex flex-col h-full">
      <div style={{ overflowX: 'auto' }}>
        <MUIDataTable
          title={'Listings'}
          data={data}
          columns={columns}
          options={options}
        />
      </div>
    </div>
  );
}