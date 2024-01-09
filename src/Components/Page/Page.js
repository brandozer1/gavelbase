// This will be a component used a "wrapper" for each page of the application, it will
// provide the padding, margine and other styles that will be used on each page universally

import React from 'react'

//components imported below
import Navigation from '../Navigation/Navigation' // this is the navigation bar that will be displayed on each page of the application

export default function Page({children}) {
    return (
        <div>
            <Navigation />
            {children}
        </div>
    )
}