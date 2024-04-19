import { TrashIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import useLib from '../../Hooks/useLib';

export default function ImageUpload({ label, hints, helpText, value, onChange }) {
  const [files, setFiles] = useState(value || []);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    if (value) {
      setFiles(value);
    }
  }, [value]);

  useEffect(() => {
    if (onChange) {
      onChange(files);
    }
  }, [files]);

  const onDrop = (acceptedFiles) => {
    // Check each file before adding it to the state
    acceptedFiles.forEach(file => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
  
      image.onload = function () {
        const MIN_WIDTH = 150; // Minimum required width
        const MIN_HEIGHT = 150; // Minimum required height
        const MAX_ASPECT_RATIO = 4; // Maximum aspect ratio
  
        const aspectRatio = image.width / image.height;
  
        if (image.width < MIN_WIDTH) {
          useLib.toast.error(`Image width should be at least ${MIN_WIDTH} pixels.`);
        } else if (image.height < MIN_HEIGHT) {
          useLib.toast.error(`Image height should be at least ${MIN_HEIGHT} pixels.`);
        } else if (aspectRatio > MAX_ASPECT_RATIO) {
          useLib.toast.error(`Image aspect ratio should be at most 1:${MAX_ASPECT_RATIO}.`);
        } else {
          // If the image meets all requirements, add it to the state
          setFiles(prevFiles => [...prevFiles, file]);
        }
      };
  
      image.onerror = function () {
        useLib.toast.error('Failed to load the image.');
      };
    });
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

  const onTouchStart = (index) => (event) => {
    event.stopPropagation();
    setDraggedIndex(index);
  };

  const onTouchMove = (index) => (event) => {
    event.preventDefault();
    if (draggedIndex !== null) {
      setHoveredIndex(index);
    }
  };

  const onTouchEnd = (index) => (event) => {
    event.stopPropagation();
    if (draggedIndex !== null) {
      const newFiles = [...files];
      const draggedFile = newFiles[draggedIndex];
      newFiles.splice(draggedIndex, 1);
      newFiles.splice(index, 0, draggedFile);
      setFiles(newFiles);
      setDraggedIndex(null);
      setHoveredIndex(null);
    }
  };

  const onTouchCancel = () => {
    setDraggedIndex(null);
    setHoveredIndex(null);
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
  
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 xl:grid-cols-9 2xl:grid-cols-12 gap-2 mt-1">
        {files.map((file, index) => (
          <div
            key={index}
            onDragOver={onImageDragOver(index)}
            onDragLeave={onImageDragLeave}
            onDrop={onImageDrop(index)}
            onDragEnd={onImageDragEnd}
            onTouchStart={onTouchStart(index)}
            onTouchMove={onTouchMove(index)}
            onTouchEnd={onTouchEnd(index)}
            onTouchCancel={onTouchCancel}
            style={{
              aspectRatio: '1/1',
              display: 'flex',
              alignItems: 'center', // Center the content vertically
              overflow: 'hidden', // Ensure content is contained within the container
            }}
            className={`relative bg-gray-250 rounded justify-center ${
              index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
            }`}
          >
            <div
              style={{
                transition: 'opacity 0.2s ease-out',
                opacity: draggedIndex === index ? 0 : hoveredIndex === index ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%', // Ensure the image container takes full width
                height: '100%', // Ensure the image container takes full height
              }}
            >
              {hoveredIndex === index && draggedIndex !== index && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-gray-500 text-sm">Drop Here</span>
                </div>
              )}
              <img
                src={URL.createObjectURL(file)}
                style={{
                  maxWidth: '100%', // Ensure the image fits within the container
                  maxHeight: '100%', // Ensure the image fits within the container
                  height: 'auto', // Maintain aspect ratio
                  width: 'auto', // Maintain aspect ratio
                }}
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
              className="absolute top-1 right-1 bg-white p-1 rounded-full hover:bg-gray-200 transition-all duration-300 focus:outline-none"
            >
              <TrashIcon size={18} />
            </button>
          </div>
        ))}
        <div
          {...getRootProps()}
          className={`p-3 flex justify-center text-center items-center border-2 border-dashed rounded-md bg-gray-100 transition-all duration-300 cursor-pointer ${
            files.length === 0 ? 'col-span-full h-20' : ''
          }`}
          style={files.length > 0 ? {aspectRatio: '1'} : {}}
        >
          <input {...getInputProps()} />
          <p className="text-gray-600">{helpText ? helpText : 'Drag files here or click to select files'}</p>
        </div>
      </div>
    </div>
  );
  
}
