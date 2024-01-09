// This component is the navigation bar that will be displayed on every page of the application, 
//the nav comp will be rendered on each page comp so that some pages can opt out of using it
import React from 'react'
//assets
import Logo from  '../../Assets/Images/Logo.webp'


export default function Nav() {
  return (
    <div className='h-14 flex justify-between'>
      <img src={Logo} alt="Logo" className='h-full' />
    </div>
  )
}