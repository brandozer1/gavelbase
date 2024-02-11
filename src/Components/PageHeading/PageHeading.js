import { Fragment } from 'react'
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  PencilIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { BoxIcon, HammerIcon, TimerIcon, User2Icon } from 'lucide-react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function PageHeading({title, stats, actions, showDropdown = true}) {

    // title is the title of the component

    // stats is an array of objects with the following properties:
    // {icon, label, value}

    // actions is an array of objects with the following properties:
    // {label, href, icon, onClick, className, dropown}
    // className is optional and the default style from this file will be used unless provided. the className will be added to the end of the default class
    // dropdown is a bool that will determine if the action is moved to the dropdown when the screen is small or if it is always visible (true by default)
    //EXAMPLE
    // actions = [
    //     {
    //         label: 'Edit',
    //         icon: PencilIcon,
    //     },
    //     {
    //         label: 'View',
    //         icon: LinkIcon,
    //         onClick: () => {alert('View')}
    //     }
    // ]

    return (
        <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    {title || 'Title not provided'}
                </h2>
                
                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                    {
                        //STATS OBJECT MAPPING
                        stats && stats.map((stat) => (
                            <div key={stat.label} className="mt-2 flex items-center text-sm text-gray-500">
                                <stat.icon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                {stat.label}: {stat.value}
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="mt-5 flex lg:ml-4 lg:mt-0">
                <div className='flex gap-3'>
                    {
                        actions && actions.map((action) => {
                            return (
                                <span key={action.label} className={action.dropdown ? "sm:block" : "hidden sm:block"}>
                                    <a  
                                        href={action.href}
                                        onClick={action.onClick}
                                        type="button"
                                        className={!action.className && "inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"}
                                    >
                                    <action.icon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    {action.label}
                                    </a>
                                </span>
                            )
                        })
                    }

                </div>
                

                

                

                {/* Dropdown */}
                {
                    actions && actions.length > 0 && showDropdown &&
                    <Menu as="div" className="relative ml-3 sm:hidden">
                        <Menu.Button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400">
                        More
                        <ChevronDownIcon className="-mr-1 ml-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Menu.Button>

                        <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute left-0 z-10 -mr-1 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {
                                    actions && actions.map((action) => {
                                        return (
                                            <Menu.Item key={action.label}>
                                                {({ active }) => (
                                                    <a
                                                        href={action.href}
                                                        onClick={action.onClick}
                                                        className={classNames(
                                                            active ? 'bg-gray-100 flex' : '',
                                                            'px-4 py-2 text-sm flex text-gray-700'
                                                        )}
                                                    >
                                                        <action.icon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                        {action.label}
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        )
                                    })
                                }
                            </Menu.Items>
                        </Transition>
                    </Menu>
                }
            </div>
        </div>
    )
}

