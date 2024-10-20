import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { TrashIcon } from 'lucide-react';
import { BarLoader } from 'react-spinners';

export default function ImageUploadItem({
  id,
  file,
  imageUrl,
  onRemove,
  onUploadComplete,
  dragHandleProps
}) {
  const [uploadStatus, setUploadStatus] = useState(imageUrl ? 'success' : 'loading'); // Pre-uploaded images are marked as 'success'
  const [error, setError] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState(imageUrl || '');

  useEffect(() => {
    if (!imageUrl && file) {
      // Start the upload process for new images only
      const uploadImage = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await axiosInstance.post('/v1/crew/image/upload-draft', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.status === 200) {
            const newImageUrl = response.data.imageUrl.imageUrl;
            setUploadedUrl(newImageUrl);
            setUploadStatus('success');
            // Call the onUploadComplete prop to notify parent of the completed upload
            onUploadComplete(id, newImageUrl);
          } else {
            setError('Unexpected response from the server.');
            setUploadStatus('error');
          }
        } catch (err) {
          const errorMsg = err.response?.data?.error || 'Failed to upload the image.';
          setError(errorMsg);
          setUploadStatus('error');
        }
      };

      uploadImage();
    }
  }, [file, imageUrl, onUploadComplete, id]);

  const handleRemove = (e) => {
    e.stopPropagation(); // Prevent event bubbling to the drag event
    e.preventDefault();  // Prevent any default form behavior
    onRemove(id); // Call the onRemove function with the image ID
  };

  return (
    <div
      className="relative justify-center bg-white flex rounded h-32 ring-1 ring-inset shadow-sm ring-gray-300 overflow-hidden"
      style={{ aspectRatio: '1/1' }}
    >
      {/* Image Container */}
      {uploadStatus === 'success' ? (
        <img
          {...dragHandleProps} // Apply drag handle props to make the image draggable
          src={
            uploadedUrl.includes("gavelbase.s3") 
              ? uploadedUrl.replace("/images/", "/thumbnails/") 
              : uploadedUrl
          }
          alt="Uploaded"
          className="object-contain h-full w-full"
        />
      ) : (
        <div
          className={`h-32 w-full bg-gray-200 rounded-md flex items-center justify-center overflow-hidden relative ${
            uploadStatus === 'error' ? 'border-2 border-red-500' : ''
          }`}
          {...dragHandleProps}  // Apply drag handle props here as well
        >
          {uploadStatus === 'loading' && (
            <div className="flex flex-col items-center">
              <BarLoader />
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex flex-col items-center">
              <span className="text-red-500 text-sm">{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Remove Button */}
      <button
        type="button"
        onClick={handleRemove}
        className="absolute top-1 right-1 bg-white p-1 rounded-full hover:bg-gray-200 transition-all duration-300 focus:outline-none"
      >
        <TrashIcon size={16} />
      </button>
    </div>
  );
}
