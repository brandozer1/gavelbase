import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import ViewLots from './ViewLots';
import EditLot from './EditLot';


export default function Listings() {
    return (
        <Routes>
            <Route path='/' element={<ViewLots />} />
            <Route path='/Edit/:lotId' element={<EditLot />} />

        </Routes>
    );
}
