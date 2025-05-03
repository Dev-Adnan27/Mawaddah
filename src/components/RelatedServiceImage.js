"use client";

import { useState } from 'react';

export default function RelatedServiceImage({ coverImage, slug }) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError ? `/services/${slug}.jpg` : (coverImage || `/services/${slug}.jpg`);
  
  return (
    <div className="w-full h-full bg-cover bg-center">
      <img 
        src={imageSrc}
        alt={`Service: ${slug}`}
        className="w-full h-full object-cover invisible"
        onError={() => {
          console.log("Related service image failed to load:", coverImage);
          setImageError(true);
        }}
      />
      <div 
        className="w-full h-full bg-cover bg-center absolute top-0 left-0"
        style={{
          backgroundImage: `url(${imageSrc})`,
        }}
      ></div>
    </div>
  );
} 