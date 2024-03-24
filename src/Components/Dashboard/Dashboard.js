
import { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import { Route, BrowserRouter as Router, Routes, useParams, NavLink } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  // CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  // DocumentDuplicateIcon,
  // DocumentTextIcon,
  FolderIcon,
  GlobeAltIcon,
  HomeIcon,
  // Square2StackIcon,
  // Square3Stack3DIcon,
  // UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import Logo from '../../Assets/Images/Logo.webp'
import { CubeIcon } from '@radix-ui/react-icons'
import { Globe2Icon, PlusSquareIcon, ShellIcon, Upload, UploadIcon, Wallet2Icon, WalletIcon } from 'lucide-react'
import useLib from '../../Hooks/useLib'

//import pages
import Create from '../../Pages/Create/Create';
import TextInput from '../TextInput/TextInput';




//TEST DATA THIS WILL BE REPLACED WITH REAL DATA FROM A DATABASE, current will be set to true if the current path matches the href
const Shortcuts = [
  { id: 1, name: 'My Profile', href: '#', initial: 'TC', current: false },
]
  

const memberNavigation = [
  { name: 'Sign out', onClick: useLib.signOut},
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



export default function Dashboard({ Children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // Collect path from url to determine which page to render in the dashboard
  const {path} = useParams();
  // this is only here because the current var needs to know the routers path
  const navigation = [
    { name: 'Dashboard', href: '/Dashboard', icon: HomeIcon, current: path === '' },
    { name: 'Create', href: './Create', icon: PlusSquareIcon, current: path === 'Create'},
    { name: 'List', href: './List', icon: UploadIcon, current: path === 'List'},
    { name: 'Payments', href: './Payments', icon: WalletIcon, current: path === 'Payments'},
    // { name: 'Fast-Track', href: '/Dashboard/Fasttrack', icon: CubeIcon, current: path === 'Fasttrack'},
    { name: 'Data', href: './Data', icon: FolderIcon, current: path === 'Data'},
    { name: 'Reports', href: './Reports', icon: ChartPieIcon, current: path === 'Reports'},
  
  ]

  useEffect(() => {
    document.title = 'Dashboard - Gavelbase'

    // run notification if there is one
    useLib.useNotification()
  
    // check if the user is already logged in
    axios.get(useLib.createServerUrl('/api/v1/member/verify'), {
      withCredentials: true
    })
    .then((response) => {
      if (response.status !== 200) {
        useLib.toast.error('Login Expired')
        window.location.href = '/Sign-In?'+useLib.createNotification('error', 'Login Expired')
      }
      
    })
    .catch((error) => {
      window.location.href = '/Sign-In?'+useLib.createNotification('error', 'Login Expired')
      
    })
  }, [])


  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-12 w-auto"
                        src={Logo}
                        alt="Gavelbase"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <NavLink
                                  onClick={()=>setSidebarOpen(false)}
                                  to={item.href}
                                  className={classNames(
                                    item.current
                                      ? 'bg-gray-50 text-indigo-600'
                                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                      'h-6 w-6 shrink-0'
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">Shortcuts</div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {Shortcuts.map((team) => (
                              <li key={team.name}>
                                <NavLink
                                  href={team.href}
                                  className={classNames(
                                    team.current
                                      ? 'bg-gray-50 text-indigo-600'
                                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <span
                                    className={classNames(
                                      team.current
                                        ? 'text-indigo-600 border-indigo-600'
                                        : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                                    )}
                                  >
                                    {team.initial}
                                  </span>
                                  <span className="truncate">{team.name}</span>
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="mt-auto">
                          <NavLink
                            href="#"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                          >
                            <Cog6ToothIcon
                              className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                              aria-hidden="true"
                            />
                            Settings
                          </NavLink>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-12 w-auto"
                src={Logo}
                alt="Gavelbase"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">Shortcuts</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {Shortcuts.map((team) => (
                      <li key={team.name}>
                        <NavLink
                          to={team.href}
                          className={classNames(
                            team.current
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <span
                            className={classNames(
                              team.current
                                ? 'text-indigo-600 border-indigo-600'
                                : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                              'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                            )}
                          >
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <NavLink
                    to="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    <Cog6ToothIcon
                      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                      aria-hidden="true"
                    />
                    Settings
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form className="relative flex flex-1" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                  name="search"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open Member menu</span>
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                        {useLib.getCookie('gavelbase_username')}
                      </span>
                      <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      {memberNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <NavLink
                              to={item.href}
                              onClick={item.onClick}
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'block px-3 py-1 text-sm leading-6 text-gray-900'
                              )}
                            >
                              {item.name}
                            </NavLink>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main>
            <div>
              {/* Simple router for routing the path from the react router param */}
              <Routes>
                <Route path="/" element={<TextInput scanner={true}/>} />
                <Route path="/Create/*" element={<Create />} />
                <Route path="/Payments/*" element={<h1 className="text-2xl font-semibold text-gray-900">Payments</h1>} />
                <Route path="/Fasttrack/*" element={<h1 className="text-2xl font-semibold text-gray-900">Fast-Track</h1>} />
                <Route path="/Data/*" element={<h1 className="text-2xl font-semibold text-gray-900">Data</h1>} />
                <Route path="/Reports/*" element={<h1 className="text-2xl font-semibold text-gray-900">Reports</h1>} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
