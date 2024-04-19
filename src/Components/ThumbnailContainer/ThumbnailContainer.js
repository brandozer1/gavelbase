import React from 'react'

import image_missing from '../../Assets/Images/image_missing.jpg';

export default function ThumbnailContainer({imageFile, imageUrl}) {
    return (
        <div
            style={{
              aspectRatio: '1/1',
              display: 'flex',
              alignItems: 'center', // Center the content vertically
              overflow: 'hidden', // Ensure content is contained within the container
            }}
            className={`relative bg-gray-250 rounded justify-center`}
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
                    src={"https://food.fnr.sndimg.com/content/dam/images/food/fullset/2012/6/1/1/FNM_070112-Milky-Way-Ice-Cream-Recipe_s4x3.jpg.rend.hgtvcom.616.462.suffix/1382541468590.jpeg"}
                    style={{
                        maxWidth: '100%', // Ensure the image fits within the container
                        maxHeight: '100%', // Ensure the image fits within the container
                        height: 'auto', // Maintain aspect ratio
                        width: 'auto', // Maintain aspect ratio
                    }}
                    alt="Missing Image"
                />
            </div>
        </div>
    )
}
