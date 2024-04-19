import React, {useState} from 'react'
import Tabs from '../../Components/Tabs/Tabs'

import Lots from './Tabs/Lots'
import Users from './Tabs/Users'

// router
import { useNavigate } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'

export default function Edit() {
    const navigate = useNavigate()

    const [currentTab, setCurrentTab] = useState('Lots')

    return (
        <div className="py-4 md:py-10 px-4 sm:px-6 lg:px-8 bg-gray-100 flex flex-col gap-2 h-full" >
            <div className='flex flex-col justify-between h-full'>

                <div className='flex flex-col gap-2 h-full'>
                    <span className="text-3xl font-bold">Edit</span>
                    <Tabs
                        tabs={[
                            { name: 'Lots', icon: null },
                            { name: 'Auctions', icon: null },
                            { name: 'Users', icon: null },
                            { name: 'Crew Members', icon: null}
                        ]} 
                        onTabChange={(tab) => {setCurrentTab(tab); navigate(tab)}}
                        currentTab={currentTab}

                    />

                    <Routes>
                        <Route path="/Lots" element={<Lots />} />
                        {/* <Route path="/Auctions" element={<Auctions />} /> */}
                        <Route path="/Users" element={<Users />} />
                        {/* <Route path="/CrewMembers" element={<CrewMembers />} /> */}
                    </Routes>
                
                </div>
            </div>
        </div>
    )
}
