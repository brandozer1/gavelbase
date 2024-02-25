import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'


const exampleOption = {id: 1, name: 'Wade Cooper', badgeColor: 'bg-green-400', descripti: 'Online'}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SelectMenu({label, options, placeholder}) {
  const [selected, setSelected] = useState(placeholder ? {name: placeholder}: options[0])

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">{label}</Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <span
                  className={classNames(
                    selected.badgeColor ? selected.badgeColor : '',
                    'inline-block h-2 w-2 flex-shrink-0 rounded-full'
                  )}
                />
                <span className={selected.badgeColor ? "ml-3 block truncate" : 'block truncate'} >{selected.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-gray-100' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                        <>
                            <div className="flex items-center">
                                <span
                                    className={classNames(
                                    option.badgeColor ? option.badgeColor : '',
                                    'inline-block h-2 w-2 flex-shrink-0 rounded-full'
                                    )}
                                    aria-hidden="true"
                                />
                                <span className={classNames(selected ? 'font-bold' : 'font-semibold', option.badgeColor ? 'ml-3 block truncate' : 'block truncate')}>
                                    {option.name}
                                </span>
                                
                            </div>
                            
                            <p className={classNames(active ? 'ml-5 text-grey-500 ' : ' ml-5 text-gray-500', 'mt-2')}>
                                {option.description}
                            </p>    

                            {selected ? (
                                <span
                                    className={classNames(
                                    'text-indigo-600',
                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                    )}
                                >
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                            ) : null}
                        </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
