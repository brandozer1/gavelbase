import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ImageUpload({ label, hints, helpText }) {
  const [files, setFiles] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const onDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const onImageDragStart = (index) => () => {
    setDraggedIndex(index);
  };

  const onImageDragOver = (index) => (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setHoveredIndex(index);
  };

  const onImageDragLeave = () => {
    setHoveredIndex(null);
  };

  const onImageDrop = (index) => (event) => {
    event.preventDefault();
    if (draggedIndex !== null) {
      const newFiles = [...files];
      const draggedFile = newFiles[draggedIndex];
      newFiles.splice(draggedIndex, 1);
      newFiles.splice(index, 0, draggedFile);
      setFiles(newFiles);
    }
    setHoveredIndex(null);
    setDraggedIndex(null);
  };

  const onImageDragEnd = () => {
    setDraggedIndex(null);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      {label && (
        <div className="flex justify-between">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            {label}
          </label>
          {hints && (
            <span className="text-sm leading-6 text-gray-500">{hints}</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-6 sm:grid-cols-6 lg:grid-cols-7 xl:grid-cols-9 2xl:grid-cols-12 gap-2 mt-1">
        {files.map((file, index) => (
          <div
            key={index}
            onDragOver={onImageDragOver(index)}
            onDragLeave={onImageDragLeave}
            onDrop={onImageDrop(index)}
            onDragEnd={onImageDragEnd}
            style={{
              aspectRatio: '1/1',
            }}
            className={`relative bg-gray-250 rounded justify-center ${
              index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
            }`}
          >
            <div
              style={{
                transition: 'opacity 0.2s ease-out',
                opacity: draggedIndex === index ? 0 : hoveredIndex === index ? 0.5 : 1,
              }}
            >
              {hoveredIndex === index && draggedIndex !== index && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-gray-500 text-sm">Drop Here</span>
                </div>
              )}
              <img
                src={URL.createObjectURL(file)}
                className="object-contain w-full h-full"
                alt="uploaded file"
                draggable
                onDragStart={onImageDragStart(index)}
              />
            </div>
            <button
              onClick={() => {
                const newFiles = [...files];
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
        <div
          {...getRootProps()}
          className="p-3 justify-center text-center items-center border-2 border-dashed rounded-md bg-gray-100 transition-all duration-300 cursor-pointer"
        >
          <input {...getInputProps()} />
          <p className="text-gray-600">{helpText ? helpText : ''}</p>
        </div>
      </div>
    </div>
  );
}
