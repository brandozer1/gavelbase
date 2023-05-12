import React from 'react'
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import Logo from '../../Assets/Logo.png'
export default function Nav() {
  return (
    <nav className='h-screen flex flex-column justify-content-between bg-primary' style={{width: '13vw'}}>
        <div className='flex flex-column align-items-center'>
            <img src={Logo} alt="hyper" className="mb-3 bg-white w-full p-3 mr-2 border-round-bottom" />
            <div className='flex flex-column w-full gap-1 mb-3 px-3 align-items-center'>
                <span className='text-xs'>Logged in as:</span>
                <div className='flex gap-2 align-items-center'>
                  <i className="pi pi-user"></i>
                  <span>USERNAME</span>
                </div>
                
            </div>
            <div className='flex flex-column w-full'>    
                <Link to='/Dashboard'><Button className='border-noround w-full px-6' label="Dashboard" icon="pi pi-th-large" style={{boxShadow: 'none'}}/></Link>
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
