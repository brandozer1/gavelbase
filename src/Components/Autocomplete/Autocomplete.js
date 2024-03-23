import React, { useState } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox } from '@headlessui/react';

const Autocomplete = ({
  options,
  value,
  onChange,
  renderOption,
  renderValue,
  inputClassName,
  optionClassName,
  placeholder,
}) => {
  const [query, setQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState(value);

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase());
        });

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    onChange && onChange(null); // Clear selected option
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onChange && onChange(option);
    setQuery('');
  };

  const renderDefaultOption = (option, { active, selected }) => (
    <>
      <span className={'block truncate ' + (selected && 'font-semibold')}>{option.name}</span>
      {selected && (
        <span className={'absolute inset-y-0 left-0 flex items-center pl-1.5 ' + (active ? 'text-white' : 'text-indigo-600')}>
          <CheckIcon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
    </>
  );

  const renderDefaultInputValue = (option) => option?.name;

  return (
    <Combobox as="div" value={selectedOption} onChange={setSelectedOption}>
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className={inputClassName || 'w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'}
          onChange={handleInputChange}
          value={renderValue ? renderValue(selectedOption) : renderDefaultInputValue(selectedOption)}
          placeholder={placeholder}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredOptions.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option.id}
                value={option}
                className={({ active }) =>
                  'relative cursor-default select-none py-2 pl-8 pr-4 ' +
                  (optionClassName ? optionClassName({ active }) : '')
                }
                onSelect={() => handleOptionSelect(option)}
              >
                {renderOption ? renderOption(option, { active: false, selected: false }) : renderDefaultOption(option, { active: false, selected: false })}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};

export default Autocomplete;
