import React from 'react'
import Dropzone from 'react-dropzone'

export default function ImageUpload({label, hints}) {
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

            <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <section
                        {...getRootProps()}
                        className={`flex justify-center items-center h-48 border-2 border-dashed mt-1 rounded-md bg-gray-100 transition-all duration-300 cursor-pointer ${
                            isDragActive ? 'border-blue-500' : 'border-gray-300 hover:border-blue-500'
                        }`}
                    >
                        <div className="flex flex-col items-center space-y-2">
                            <input {...getInputProps()} />
                            <p className="text-gray-600">Drag 'n' drop some files here, or click to select files</p>
                        </div>
                    </section>
                )}
            </Dropzone>
        </div>
    )
}
