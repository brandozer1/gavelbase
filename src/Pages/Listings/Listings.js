import React, { /* ... */ } from 'react';
import { /* ... */ } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Button from '../../Components/Button/Button';
import axiosInstance from '../../axiosInstance';
import Swal from 'sweetalert2'; // Using SweetAlert2 for alerts

export default function Listings() {
    // ... existing code

    const handleBulkDelete = async () => {
        const selectedIdsArray = Array.from(selectedLotIds);

        // Confirm deletion
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${selectedIdsArray.length} lots.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete them!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosInstance.post('/v1/crew/lot/bulk-delete', {
                    lotIds: selectedIdsArray,
                });

                if (response.status === 200) {
                    // Remove deleted lots from state
                    setListings(prevListings => prevListings.filter(lot => !selectedLotIds.has(lot.id)));
                    // Clear selected IDs
                    setSelectedLotIds(new Set());
                    Swal.fire('Deleted!', 'Selected lots have been deleted.', 'success');
                } else {
                    Swal.fire('Error', 'Failed to delete selected lots.', 'error');
                }
            } catch (error) {
                console.error('Bulk delete error:', error);
                Swal.fire('Error', 'An error occurred while deleting lots.', 'error');
            }
        }
    };

    return (
        <Routes>
            {/* ... existing routes */}
            <Route path='/' element={
                <div className='w-full h-full p-4'>
                    <h1 className='text-2xl font-semibold mb-4'>Select Lots</h1>
                    {error && (
                        <div className="text-red-500 mb-4">
                            {error}
                        </div>
                    )}
                    {loading ? (
                        <div className="flex justify-center items-center h-96">
                            <span className="text-gray-500">Loading listings...</span>
                        </div>
                    ) : (
                        <>
                            <div className='ag-theme-alpine' style={{ height: '600px', width: '100%' }}>
                                <AgGridReact
                                    ref={gridRef}
                                    rowData={rowData}
                                    columnDefs={columnDefs}
                                    defaultColDef={defaultColDef}
                                    rowSelection='multiple'
                                    onSelectionChanged={onSelectionChanged}
                                    onGridReady={onGridReady}
                                    onPaginationChanged={onPaginationChanged}
                                    pagination={true}
                                    paginationPageSize={10}
                                    suppressRowClickSelection={true}
                                />
                            </div>
                            <div className='mt-4 flex justify-end space-x-2'>
                                <Button onClick={handleBulkDelete} disabled={selectedLotIds.size === 0} className="bg-red-500 hover:bg-red-600">
                                    Delete Selected Lots
                                </Button>
                                <Button onClick={handleBulkAction} disabled={selectedLotIds.size === 0}>
                                    Perform Another Bulk Action
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            } />
            {/* ... other routes */}
        </Routes>
    );
}
