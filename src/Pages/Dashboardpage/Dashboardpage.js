import React, {useEffect, useState} from 'react';
import { Button } from 'primereact/button';
import Statgraph from '../../Components/Statgraph/Statgraph';
import { Link } from 'react-router-dom';
export default function Dashboardpage() {
  
  return (
    <div className='flex surface-ground px-4 w-12 flex-column'>
      
      <div className='flex justify-content-between'>
        <h1>Dashboard</h1>
        <div className='flex gap-3 align-items-center'>
          <Link to='/Createauction'><Button label='Create New Auction' icon='pi pi-megaphone'/></Link>
          <Link to='/Createlot'><Button label='Add Lot(s)' icon='pi pi-box'/></Link>
          <Button label='Add Cosignor' icon='pi pi-user'/>
        </div>
        
      </div>
      <div className='flex gap-3 w-12'>
        <Statgraph/>
        <Statgraph statName={'Revenue'}/>
        <Statgraph statName={'Lots Sold'}/>
        <Statgraph statName={'Page Views'}/>
      </div>
    </div>
  )
}
