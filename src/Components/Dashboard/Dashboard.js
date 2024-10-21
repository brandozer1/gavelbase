import { memo, Fragment, useState, useEffect, useCallback } from 'react';
import { Route, Routes, NavLink, useLocation } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  HomeIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';

import Logo from '../../Assets/Images/Logo.webp';
import { ClipboardCheckIcon, PlusSquareIcon, TagIcon } from 'lucide-react';
import useLib from '../../Hooks/useLib';
import Lots from '../../Pages/Lots/Lots';
import Listings from '../../Pages/Listings/Listings';
import {jwtDecode} from 'jwt-decode'; // Correct import

// Test data
const Shortcuts = [
  { id: 1, name: 'My Profile', href: '#', initial: 'TC', current: false },
];

const memberNavigation = [
  { name: 'Sign out', onClick: useLib.signOut },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Memoized ShortcutsList component
const ShortcutsList = memo(({ shortcuts, isCollapsed }) => (
  <ul role="list" className="-mx-2 mt-2 space-y-1">
    {shortcuts.map((team) => (
      <li key={team.name}>
        <NavLink
          to={team.href}
          className={({ isActive }) =>
            classNames(
              isActive
                ? 'bg-gray-50 text-indigo-600'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
            )
          }
        >
          <span
            className={classNames(
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
              isActive => (isActive ? 'text-indigo-600 border-indigo-600' : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600')
            )}
          >
            {team.initial}
          </span>
          {!isCollapsed && <span className="truncate">{team.name}</span>}
        </NavLink>
      </li>
    ))}
  </ul>
));

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(); 

  const navigation = [
    { name: 'Dashboard', href: '/Dashboard', icon: HomeIcon },
    { name: 'Lots', href: './Lots', icon: PlusSquareIcon },
    { name: 'Listings', href: './Listings', icon: TagIcon },
    { name: 'Orders', href: './Orders', icon: ClipboardCheckIcon },
    { name: 'Reports', href: './Reports', icon: ChartPieIcon },
  ];

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  useEffect(() => {
    document.title = 'Dashboard - Gavelbase';

    const cleanupNotification = useLib.useNotification();

    return () => {
      if (typeof cleanupNotification === 'function') {
        cleanupNotification();
      }
    };
  }, []);

  const username = (() => {
    try {
      const token = useLib.getCookie('accessToken');
      if (!token) return "Username Error";
      const decoded = jwtDecode(token);
      return decoded.username || "Username Error";
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return "Username Error";
    }
  })();

  return (
    <div className="h-full">
      {/* Mobile sidebar */}
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
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar */}
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
                                onClick={() => setSidebarOpen(false)}
                                to={item.href}
                                className={({ isActive }) =>
                                  classNames(
                                    isActive
                                      ? 'bg-gray-50 text-indigo-600'
                                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )
                                }
                              >
                                <item.icon
                                  className={classNames(
                                    'h-6 w-6 shrink-0',
                                    isActive => (isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600')
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
                        <ShortcutsList shortcuts={Shortcuts} isCollapsed={false} />
                      </li>
                      <li className="mt-auto">
                        <NavLink
                          to="#"
                          className={({ isActive }) =>
                            classNames(
                              isActive
                                ? 'bg-gray-50 text-indigo-600'
                                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                            )
                          }
                        >
                          <Cog6ToothIcon
                            className={classNames(
                              'h-6 w-6 shrink-0',
                              isActive => (isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600')
                            )}
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
      <div
        className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col ${
          isCollapsed ? 'w-20' : 'w-72'
        } transition-all duration-300`}
      >
        {/* Sidebar */}
        <div
          className={`flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 ${
            isCollapsed ? 'items-center' : ''
          }`}
        >
          <div className="flex items-center justify-between h-16 shrink-0">
            <img
              className={`h-12 w-auto ${isCollapsed ? 'hidden' : 'block'}`}
              src={Logo}
              alt="Gavelbase"
            />
            {/* Toggle Button */}
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={toggleCollapse}
            >
              <span className="sr-only">Toggle Sidebar</span>
              {isCollapsed ? (
                <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )
                        }
                      >
                        <item.icon
                          className={classNames(
                            'h-6 w-6 shrink-0',
                            isActive => (isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600')
                          )}
                          aria-hidden="true"
                        />
                        {!isCollapsed && item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className={`text-xs font-semibold leading-6 text-gray-400 ${isCollapsed ? 'hidden' : 'block'}`}>
                  Shortcuts
                </div>
                <ShortcutsList shortcuts={Shortcuts} isCollapsed={isCollapsed} />
              </li>
              <li className="mt-auto">
                <NavLink
                  to="#"
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                    )
                  }
                >
                  <Cog6ToothIcon
                    className={classNames(
                      'h-6 w-6 shrink-0',
                      isActive => (isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600')
                    )}
                    aria-hidden="true"
                  />
                  {!isCollapsed && 'Settings'}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content area */}
      <div
        className={`lg:pl-${isCollapsed ? '20' : '72'} lg:transition-all lg:duration-300`}
      >
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={toggleSidebar}
          >
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
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
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
                    <span
                      className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                      aria-hidden="true"
                    >
                      {username}
                    </span>
                    <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    {memberNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <button
                            onClick={item.onClick}
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900'
                            )}
                          >
                            {item.name}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main
          style={{ height: "calc(100vh - 4rem)" }}
          className="h-full overflow-y-auto bg-gray-100"
        >
          <div className="h-full">
            {/* Router for routing the path from the react router param */}
            <Routes>
              {/* <Route path="/Lots/*" element={<Lots />} /> */}
              <Route
                path="/Orders/*"
                element={<h1 className="text-2xl font-semibold text-gray-900">Orders</h1>}
              />
              <Route
                path="/Reports/*"
                element={<h1 className="text-2xl font-semibold text-gray-900">Reports</h1>}
              />
              {/* <Route path="/Listings/*" element={<Listings />} /> */}
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
