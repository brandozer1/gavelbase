import React, {useEffect, useState} from 'react'
import { DataTable } from 'primereact/datatable';
import { Link } from 'react-router-dom';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
export default function Lotpage() {
    const [lots, setLots] = useState([])
    useEffect(() => {
        for(let i=0;i<50;i++) {
            setLots(prev => [...prev, {
                name: 'Lot ' + i,
                country: 'Country ' + i,
                company: 'Company ' + i,
                representative: 'Representative ' + i
            }])
        }
    }, [])
  return (
    <div className='px-3 w-full'>
        <div className='flex justify-content-between align-items-center w-full'>
            <h1>Lot Dashboard</h1>
            <Link><Button label='Create Lot' icon='pi pi-plus'/></Link>
        </div>
        <DataTable value={lots} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
            <Column sortable field="name" header="Name" style={{ width: '25%' }}></Column>
            <Column sortable field="country" header="Country" style={{ width: '25%' }}></Column>
            <Column sortable field="company" header="Company" style={{ width: '25%' }}></Column>
            <Column sortable field="representative" header="Representative" style={{ width: '25%' }}></Column>
        </DataTable>
    </div>
  )
}
