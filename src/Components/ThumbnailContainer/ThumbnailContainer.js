import React from 'react'

import image_missing from '../../Assets/Images/image_missing.jpg';

export default function ThumbnailContainer({src, className}) {
    return (
        <div
            style={{
              aspectRatio: '1/1',
              display: 'flex',
              alignItems: 'center', // Center the content vertically
              overflow: 'hidden', // Ensure content is contained within the container
            }}
            className={`relative bg-gray-250 rounded justify-center `+className}
          >
            <div
                style={{
                transition: 'opacity 0.2s ease-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%', // Ensure the image container takes full width
                height: '100%', // Ensure the image container takes full height
                }}
            >
                <img
                    src={
                        src
                        ? src
                        : image_missing
                    }
                    style={{
                        maxWidth: '100%', // Ensure the image fits within the container
                        maxHeight: '100%', // Ensure the image fits within the container
                        height: 'auto', // Maintain aspect ratio
                        width: 'auto', // Maintain aspect ratio
                    }}
                />
            </div>
        </div>
    )
}
