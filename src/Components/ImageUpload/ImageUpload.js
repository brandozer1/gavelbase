import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import ImageUploadItem from './ImageUploadItem';
import { v4 as uuidv4 } from 'uuid';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function ImageUpload({ label, hints, helpText, preUploadedImages = [], onChange }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Initialize images with pre-uploaded images (URL array)
    const initializedImages = [
      ...preUploadedImages.map((url) => ({
        id: uuidv4(),
        file: null,
        imageUrl: url,
        isUploaded: true, // Mark pre-uploaded images as already uploaded
      })),
    ];

    setImages(initializedImages);
  }, [preUploadedImages]);

  const triggerOnChange = (updatedImages) => {
    // Only send back the URLs of the uploaded images
    const uploadedUrls = updatedImages
      .filter((image) => image.isUploaded)
      .map((image) => image.imageUrl);

    onChange(uploadedUrls); // Send back only the URLs
  };

  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => ({
      id: uuidv4(),
      file, // File to be uploaded
      imageUrl: null, // No URL yet
      isUploaded: false, // Mark this as not yet uploaded
    }));

    const updatedImages = [...newImages, ...images];
    setImages(updatedImages);
  };

  const handleUploadComplete = (id, imageUrl) => {
    const updatedImages = images.map((image) =>
      image.id === id ? { ...image, imageUrl, isUploaded: true } : image
    );
    setImages(updatedImages);
    triggerOnChange(updatedImages); // Trigger onChange after upload completion
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const reorderedImages = arrayMove(
        images,
        images.findIndex((i) => i.id === active.id),
        images.findIndex((i) => i.id === over.id)
      );
      setImages(reorderedImages);
      triggerOnChange(reorderedImages); // Trigger onChange after reorder
    }
  };

  const removeImage = (id) => {
    const updatedImages = images.filter((image) => image.id !== id);
    setImages(updatedImages);
    triggerOnChange(updatedImages); // Trigger onChange after removal
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }, // Accept all image types
    multiple: true,
  });

  return (
    <div>
      {/* Label and Hints */}
      {label && (
        <div className="flex justify-between">
          <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
          {hints && <span className="text-sm leading-6 text-gray-500">{hints}</span>}
        </div>
      )}

      {/* DnD Context for reordering */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images} strategy={verticalListSortingStrategy}>
          {/* Updated Container: Added `flex-nowrap` */}
          <div className="flex space-x-3 flex-nowrap overflow-x-auto">
            {images.map((image) => (
              <SortableImageUploadItem
                key={image.id}
                id={image.id}
                file={image.file}
                imageUrl={image.imageUrl}
                isUploaded={image.isUploaded}
                onRemove={removeImage}
                onUploadComplete={handleUploadComplete} // Pass onUploadComplete
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className="p-4 flex justify-center text-center items-center border-2 border-dashed rounded-md bg-gray-100 transition-all duration-300 cursor-pointer mt-4"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">{helpText || 'Drag files here or click to select files'}</p>
      </div>
    </div>
  );
}

function SortableImageUploadItem({ id, file, imageUrl, isUploaded, onRemove, onUploadComplete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    // Added `flex-shrink-0` to prevent individual scrolls
    <div ref={setNodeRef} className="flex-shrink-0" style={style} {...attributes}>
      <ImageUploadItem
        id={id}
        file={file}
        imageUrl={imageUrl}
        isUploaded={isUploaded}
        onRemove={onRemove}
        onUploadComplete={onUploadComplete}
        dragHandleProps={listeners}
      />
    </div>
  );
}
