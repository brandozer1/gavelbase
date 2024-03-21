import React, {useState, useEffect} from 'react'
import Dropzone from 'react-dropzone'

export default function ImageUpload({label, hints, helpText}) {
    const [files, setFiles] = useState([])


    const onDrop = (acceptedFiles) => {
        setFiles([...files, ...acceptedFiles])
    }

    return (
        <div>
            {label && (
                <div className="flex justify-between">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                    {label}
                    </label>
                    {hints && <span className="text-sm leading-6 text-gray-500">{hints}</span>}
                </div>
            )}

            {
                files.length > 0 ?
                    <div className="grid grid-cols-6 sm:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9 2xl:grid-cols-12 gap-2 mt-1">
                        {files.map((file, index) => (
                            //square image container with image maintaing aspect ratio and fitting inside the container. first image takes 2 cols and 2 rows, the rest take 1 col and 1 row
                            <div key={index} style={{height: '100%', width: '100%', aspectRatio: 1}} className={`relative bg-gray-250 rounded ${index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`}>
                                <img src={URL.createObjectURL(file)} className="object-contain rounded w-full h-full" alt="uploaded file" />
                                <button
                                    onClick={() => {
                                        let newFiles = [...files];
                                        newFiles.splice(index, 1);
                                        setFiles(newFiles);
                                    }}
                                    className="absolute top-0 right-0 bg-white p-1 rounded-full"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-red-500"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 1a9 9 0 100 18 9 9 0 000-18zm4.95 12.95a1 1 0 01-1.41 1.41L10 11.41l-3.54 3.54a1 1 0 01-1.41-1.41L8.59 10 5.05 6.46a1 1 0 011.41-1.41L10 8.59l3.54-3.54a1 1 0 011.41 1.41L11.41 10l3.54 3.54z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <Dropzone onDrop={acceptedFiles => onDrop(acceptedFiles)}>
                            {({ getRootProps, getInputProps, isDragActive }) => (
                                <section
                                    {...getRootProps()}
                                    style={{height: '100%', width: '100%', aspectRatio: 1}}
                                    className={`p-3 justify-center text-center items-center border-2 border-dashed rounded-md bg-gray-100 transition-all duration-300 cursor-pointer ${
                                        isDragActive ? 'border-blue-500' : 'border-gray-300 hover:border-blue-500'
                                    }`}
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        <input {...getInputProps()} />
                                        <p className="text-gray-600">{helpText ? helpText : ''}</p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    </div>
                    
                :
                    <Dropzone onDrop={acceptedFiles => onDrop(acceptedFiles)}>
                        {({ getRootProps, getInputProps, isDragActive }) => (
                            <section
                                {...getRootProps()}
                                className={`flex justify-center items-center h-48 border-2 border-dashed mt-1 rounded-md bg-gray-100 transition-all duration-300 cursor-pointer ${
                                    isDragActive ? 'border-blue-500' : 'border-gray-300 hover:border-blue-500'
                                }`}
                            >
                                <div className="flex flex-col items-center space-y-2">
                                    <input {...getInputProps()} />
                                    <p className="text-gray-600">{helpText ? helpText : ''}</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>

            }
            
        </div>
    )
}