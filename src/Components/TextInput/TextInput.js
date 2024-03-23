import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ScanBarcodeIcon } from 'lucide-react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";

// Assuming Select component's API matches React Select or a similar API
const Select = ({
    options,
    onChange,
    value,
    label,
}) => {
    return (
        <div className="my-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
            <select
                value={value}
                onChange={onChange}
                className="block w-full p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.name}</option>
                ))}
            </select>
        </div>
    );
};

const TextInput = ({
    className,
    onChange,
    label,
    placeholder,
    prefix,
    suffix,
    helpText,
    disabled,
    warning,
    error,
    hints,
    icon,
    trailingIcon,
    scanner,
    value,
    setState,
    clearable,
}) => {
    const [open, setOpen] = useState(false);
    const cancelButtonRef = useRef(null);
    const inputId = label ? label.toLowerCase().replace(/ /g, '-') : 'input'; // Ensure ID is HTML-friendly
    const [hasContent, setHasContent] = useState(Boolean(value));
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
            if (videoDevices.length > 0) {
                setSelectedDeviceId(videoDevices[0].deviceId);
            }
        });
    }, []);

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setHasContent(Boolean(inputValue));
        if (typeof onChange === 'function') {
            onChange(event);
        }
    };

    const handleClearClick = () => {
        setHasContent(false);
        if (typeof setState === 'function') {
            setState('');
        }
        document.getElementById(inputId).value = '';
    };

    const inputContainerClasses = `relative mt-1 rounded-md shadow-sm ${prefix || suffix || icon || trailingIcon || scanner ? 'flex' : ''}`;
    const inputClasses = `block w-full rounded-md border-0 py-1.5 ${icon || prefix ? 'pl-10' : 'pl-2'} ${disabled ? 'bg-gray-100' : 'text-gray-900'} shadow-sm ring-1 ring-inset ${error ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-indigo-600 sm:text-sm sm:leading-6 ${className}`;

    return (
        <>
            {scanner && (
                <>
                    <Transition.Root show={open} as={Fragment}>
                        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setOpen(false)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-10 overflow-y-auto">
                                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all sm:my-8 sm:max-w-lg">
                                            <Select
                                                options={devices.map(device => ({
                                                    name: device.label || `Camera ${device.deviceId.substring(0, 8)}...`, // Shorten device ID for display
                                                    value: device.deviceId,
                                                }))}
                                                label="Select Camera"
                                                onChange={event => setSelectedDeviceId(event.target.value)}
                                                value={selectedDeviceId}
                                            />

                                              <BarcodeScannerComponent
                                                  key={selectedDeviceId} // Add this line
                                                  width={500}
                                                  height={500}
                                                  delay={500}
                                                  facingMode="user"
                                                  deviceId={selectedDeviceId}
                                                  onUpdate={(err, result) => {
                                                      if (result) {
                                                          setOpen(false);
                                                          if (typeof setState === 'function') {
                                                              setState(result.text);
                                                          }
                                                          document.getElementById(inputId).value = result.text;
                                                          setHasContent(true);
                                                      }
                                                  }}
                                              />
                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="button"
                                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    Cancel Scan
                                                </button>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>
                </>
            )}

            <div>
                {label && (
                    <div className="flex justify-between">
                        <label htmlFor={inputId} className="block text-sm font-medium leading-6 text-gray-900">
                            {label}
                        </label>
                        {hints && <span className="text-sm leading-6 text-gray-500">{hints}</span>}
                    </div>
                )}

                <div className={inputContainerClasses}>
                    {prefix && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 sm:text-sm">{prefix}</span>}
                    {icon && <div className="absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>}

                    <input
                        value={value}
                        type="text"
                        id={inputId}
                        className={inputClasses}
                        placeholder={placeholder}
                        onChange={handleInputChange}
                        disabled={disabled}
                    />

                    {scanner && (
                        <button
                            className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                            onClick={() => setOpen(true)}
                        >
                            <ScanBarcodeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </button>
                    )}
  
            {trailingIcon && <div className="absolute inset-y-0 right-0 flex items-center pr-3">{trailingIcon}</div>}
            {suffix && <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 sm:text-sm">{suffix}</span>}
  
            {/* Add clearable icon when 'clearable' prop is true and input has content */}
            {clearable && hasContent && (
                <button
                    className={scanner ? "absolute inset-y-0 right-0 flex items-center pr-10 focus:outline-none": "absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"}
                    onClick={()=>handleClearClick()}
                >
                    {/* Larger 'x' icon or clear icon from your theme */}
                    <span className="text-gray-400 text-lg">✕</span>
                </button>
            )}
          </div>
  
          {helpText && <p className="mt-2 text-sm text-gray-500">{helpText}</p>}
          {warning && <p className="mt-2 text-sm text-yellow-500">{warning}</p>}
          {error && (
            <div className="relative mt-2 rounded-md shadow-sm">
              <p className="text-sm text-red-600" id={`${inputId}-error`}>
                {error}
              </p>
            </div>
          )}
        </div>
      </>
    );
  };
  
  export default TextInput;
  