import React from 'react'
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
export default function Nav() {
  return (
    <nav className='h-screen flex flex-column justify-content-between bg-primary' style={{width: '13vw'}}>
        <div>
            <div>Auction Dashboard</div>
            <div className='flex justify-content-center'>
                Username
            </div>
            <div className='flex flex-column'>    
                <Link to='/'><Button className='border-noround w-full px-6' label="Dashboard" icon="pi pi-th-large" style={{boxShadow: 'none'}}/></Link>
                <Link to='/Auctions'><Button className='border-noround w-full px-6' label="Auctions" icon="pi pi-megaphone" style={{boxShadow: 'none'}}/></Link>
                <Link to='/Lots'><Button className='border-noround w-full px-6' label="Lots" icon="pi pi-box" style={{boxShadow: 'none'}}/></Link>
                <Link to='/People'><Button className='border-noround w-full px-6' label="People" icon="pi pi-users" style={{boxShadow: 'none'}}/></Link>
                <Link to='/Statements'><Button className='border-noround w-full px-6' label="Statements" icon="pi pi-file" style={{boxShadow: 'none'}}/></Link>
                <Link to='/Settings'><Button className='border-noround w-full px-6' label="Settings" icon="pi pi-cog" style={{boxShadow: 'none'}}/></Link>
            </div>
        </div>
        <Link to='/Settings'><Button className='border-noround w-full px-6' label="Log-out" icon="pi pi-angle-left" style={{boxShadow: 'none'}}/></Link>
        
    </nav>
  )
}
