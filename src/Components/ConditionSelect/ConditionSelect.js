import { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import axiosInstance from '../../axiosInstance'; // Ensure this path is correct

// Utility function to concatenate class names
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ConditionSelect({
  label,
  placeholder = 'Select a condition',
  onChange,
  selectedOption = null,
}) {
  const [conditions, setConditions] = useState([]); // List of conditions fetched from API
  const [selected, setSelected] = useState(
    selectedOption ? selectedOption : { name: placeholder }
  );
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to map condition value to badgeColor
  const getBadgeColor = (value) => {
    if (value >= 8) return 'bg-green-400';
    if (value >= 5) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  useEffect(() => {
    // Fetch conditions from the API
    const fetchConditions = async () => {
      try {
        const response = await axiosInstance.get('/v1/crew/condition');
        const fetchedConditions = response.data; // Adjust based on your API response structure

        // Filter out archived conditions if necessary
        const activeConditions = fetchedConditions.filter(
          (condition) => !condition.archived
        );

        // Map fetched conditions to include badgeColor
        const mappedConditions = activeConditions.map((condition) => ({
          id: condition._id,
          name: condition.name,
          useNotes: condition.useNotes,
          value: condition.value,
          description: condition.description || '',
          badgeColor: getBadgeColor(condition.value),
        }));

        setConditions(mappedConditions);

        // If a selectedOption is provided, ensure it's part of the fetched conditions
        if (selectedOption) {
          const exists = mappedConditions.find(
            (cond) => cond.id === selectedOption.id
          );
          if (exists) {
            setSelected(exists);
          } else {
            setSelected({ name: placeholder });
          }
        } else if (mappedConditions.length > 0) {
          setSelected(mappedConditions[0]); // Default to first condition
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching conditions:', err);
        setError('Failed to load conditions.');
        setLoading(false);
      }
    };

    fetchConditions();
  }, [selectedOption, placeholder]);

  // Handle selection change
  const handleChange = (condition) => {
    setSelected(condition);
    if (onChange) {
      onChange(condition);  // Only trigger onChange here when user selects a condition
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <svg
          className="animate-spin h-5 w-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="text-gray-500">Loading conditions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        {error}
      </div>
    );
  }

  return (
    <Listbox value={selected} onChange={handleChange}>
      {({ open }) => (
        <div>
          <Listbox.Label className="block text-sm font-medium text-gray-900">
            {label}
          </Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <span className="flex items-center">
                {selected.badgeColor && (
                  <span
                    className={classNames(
                      selected.badgeColor,
                      'inline-block h-2 w-2 flex-shrink-0 rounded-full'
                    )}
                  />
                )}
                <span className={selected.badgeColor ? 'ml-3 block truncate' : 'block truncate'}>
                  {selected.name}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              show={open}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                {conditions.length > 0 ? (
                  conditions
                    .sort((a, b) => b.value - a.value) // Sort conditions from highest to lowest value
                    .map((condition) => (
                      <Listbox.Option
                        key={condition.id}
                        className={({ active }) =>
                          classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9'
                          )
                        }
                        value={condition}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              {condition.badgeColor && (
                                <span
                                  className={classNames(
                                    condition.badgeColor,
                                    'inline-block h-2 w-2 flex-shrink-0 rounded-full'
                                  )}
                                />
                              )}
                              <span
                                className={classNames(
                                  selected ? 'font-semibold' : 'font-medium',
                                  condition.badgeColor ? 'ml-3 block truncate' : 'ml-3 block truncate'
                                )}
                              >
                                {condition.name}
                              </span>
                            </div>

                            {condition.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {condition.description}
                              </p>
                            )}

                            {selected ? (
                              <span
                                className={classNames(
                                  'absolute inset-y-0 right-0 flex items-center pr-4',
                                  active ? 'text-indigo-600' : 'text-indigo-600'
                                )}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))
                ) : (
                  <Listbox.Option
                    value={{ name: 'No Conditions Available' }}
                    disabled
                    className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500"
                  >
                    No Conditions Available
                  </Listbox.Option>
                )}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
}
