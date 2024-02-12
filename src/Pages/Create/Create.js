import React from 'react'
import {Route, Routes} from 'react-router-dom'
import useLib from '../../Hooks/useLib'

//icons
import {
    AcademicCapIcon,
    BanknotesIcon,
    CheckBadgeIcon,
    ClockIcon,
    ReceiptRefundIcon,
    UsersIcon,
  } from '@heroicons/react/24/outline'

//import components below
import PageHeading from '../../Components/PageHeading/PageHeading'
import ActionGrid from '../../Components/ActionGrid/ActionGrid'
import Lot from './Lot/Lot'

const actions = [
    
    {
      title: 'Create Lot',
      href: './Lot',
      icon: CheckBadgeIcon,
      iconForeground: 'text-purple-700',
      iconBackground: 'bg-purple-50',
    },
    {
        title: 'Create Auction',
        href: './Auction',
        icon: ClockIcon,
        iconForeground: 'text-teal-700',
        iconBackground: 'bg-teal-50',
    },
    {
      title: 'Create User',
      href: './User',
        
      icon: UsersIcon,
      iconForeground: 'text-sky-700',
      iconBackground: 'bg-sky-50',
    },
    {
      title: 'Invite Crew Member',
      href: './CrewMember',
      icon: BanknotesIcon,
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-50',
    },
    // {
    //   title: 'Report',
    //   href: '#',
    //   icon: ReceiptRefundIcon,
    //   iconForeground: 'text-rose-700',
    //   iconBackground: 'bg-rose-50',
    // },
    // {
    //   title: 'Training',
    //   href: '#',
    //   icon: AcademicCapIcon,
    //   iconForeground: 'text-indigo-700',
    //   iconBackground: 'bg-indigo-50',
    // },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function Create() {
    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-100" >
            <PageHeading title={'Create'} />
            <Routes>
                <Route path="/" element={<ActionGrid actions={actions} className={'md:mt-3'} />} />
                <Route path="Lot" element={<Lot />} />
            </Routes>
        </div>
    )
}
