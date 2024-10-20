import { useState, useEffect, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import axiosInstance from '../../axiosInstance'; // Ensure this path is correct

// Utility function to concatenate class names
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function TagSelect({ label, placeholder = 'Select tags', onChange, selectedTags = [] }) {
  const [tags, setTags] = useState([]); // List of all tags fetched from API
  const [selected, setSelected] = useState(selectedTags); // Track selected tags
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch tags from the API
    const fetchTags = async () => {
      try {
        const response = await axiosInstance.get('/v1/crew/tag/all'); // Adjust based on your API route
        const fetchedTags = response.data;

        setTags(fetchedTags);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Failed to load tags.');
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagSelect = (tag) => {
    if (!selected.some((t) => t._id === tag._id)) {
      const updatedSelected = [...selected, tag];
      setSelected(updatedSelected);
      if (onChange) {
        onChange(updatedSelected.map((tag) => tag)); // Pass only tag IDs to onChange
      }
    }
  };

  const handleTagRemove = (id) => {
    const updatedSelected = selected.filter((tag) => tag._id !== id);
    setSelected(updatedSelected);
    if (onChange) {
      onChange(updatedSelected.map((tag) => tag._id)); // Pass only tag IDs to onChange
    }
  };

  if (loading) {
    return <p>Loading tags...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      {/* Label */}
      {label && <div className="block text-sm font-medium text-gray-900 mb-2">{label}</div>}

      <div className='flex gap-2 flex-row-reverse justify-end items-center'>
        <div className="flex flex-wrap gap-2 items-center h-full">
            {selected.map((tag) => (
            <div
                key={tag._id}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
                style={{ backgroundColor: tag.backgroundColor, color: tag.color }} // Apply tag colors
            >
                <span>{tag.name}</span>
                <button
                type="button"
                onClick={() => handleTagRemove(tag._id)}
                style={{color: tag.color}}
                className=" hover:text-red-700 focus:outline-none"
                >
                ×
                </button>
            </div>
            ))}
        </div>
        {/* Listbox for selecting tags */}
        <Listbox value={null} onChange={handleTagSelect}>
            {({ open }) => (
            <>
                <div className="relative">
                <Listbox.Button
                    className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-16 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <span className="block truncate">{placeholder}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    show={open}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {tags.map((tag) => (
                        <Listbox.Option
                        key={tag._id}
                        value={tag}
                        className={({ active }) =>
                            classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9'
                            )
                        }
                        >
                        <div className="flex items-center">
                            <span
                            className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                            style={{ backgroundColor: tag.backgroundColor }}
                            />
                            <span className="ml-3 block truncate">{tag.name}</span>
                        </div>
                        </Listbox.Option>
                    ))}
                    </Listbox.Options>
                </Transition>
                </div>
            </>
            )}
        </Listbox>
        </div>
    </div>
  );
}
