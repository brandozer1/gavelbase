import React, { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { ScanBarcodeIcon } from 'lucide-react';

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
  value
}) => {
const [open, setOpen] = React.useState(false)
const cancelButtonRef = useRef(null)
const inputId = label ? label.toLowerCase() : 'input';

const inputContainerClasses = `relative mt-2 rounded-md shadow-sm ${
    (prefix || suffix || icon || trailingIcon || scanner) ? 'flex' : '' // Updated to include scanner in the condition
  }`;

const inputClasses = `block w-full rounded-md border-0 py-1.5 ${
(icon || prefix) ? 'pl-10' : 'pl-1.5' // Adjusted to handle icon or prefix
} ${disabled ? 'bg-gray-100' : 'text-gray-900'} shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset ${
error ? 'ring-red-500' : 'ring-gray-300'
} placeholder:text-gray-400 focus:ring-indigo-600 sm:text-sm sm:leading-6 ${className}`;

  return (
    <>
        {
            scanner && (
                <>
                    <Transition.Root show={open} as={Fragment}>
                        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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

                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg flex flex-col bg-white p-3 text-left shadow-xl w-full transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    <BarcodeScannerComponent
                                        width={500}
                                        height={500}
                                        delay={10}
                                        onUpdate={(err, result) => {
                                        if (result) {
                                            setOpen(false);
                                            document.getElementById(inputId).value = result.text;
                                        
                                        }
                                        }}
                                    />
                                        {/* <QrReader
                                            delay={10}
                                            // set value of input element to the scanned data
                                            onScan={(data) => {
                                                if (data) {
                                                    setOpen(false);
                                                    document.getElementById(inputId).value = data.text;
                                                }
                                            }}
                                            facingMode="rear"
                                            chooseDeviceId={true}
                                            className='rounded-md'
                                        /> */}
                                        <div className="mt-5 sm:mt-4 sm:flex w-full sm:flex-row-reverse">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
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
            )
        }
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
            onChange={onChange}
            disabled={disabled}
            />
            {scanner && (
                <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                    onClick={() => setOpen(true)}
                >
                    {/* scan icon from icon pack */}
                    <ScanBarcodeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </button>
            )}
            {trailingIcon && <div className="absolute inset-y-0 right-0 flex items-center pr-3">{trailingIcon}</div>}
            {suffix && <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 sm:text-sm">{suffix}</span>}
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

