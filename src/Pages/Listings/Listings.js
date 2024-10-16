import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import ViewListings from './ViewListings';
import CreateAuction from './CreateAuction';
import CreateSale from './CreateSale';
import CreateListings from './CreateListings';


export default function Listings() {
    return (
        <Routes>
            <Route path='/' element={<ViewListings />} />
            <Route path='/Create' element={<CreateListings />} />
            <Route path='Create/Sale' element={<CreateSale />} />
            <Route path='Create/Auction' element={<CreateAuction />} />
        </Routes>
    );
}
