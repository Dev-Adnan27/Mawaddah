"use client";

import { useState } from 'react';

export default function ServiceImage({ src, alt, slug }) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError ? `/services/${slug}.jpg` : (src || `/services/${slug}.jpg`);
  
  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className="w-full h-full object-cover"
      onError={() => {
        console.log("Image failed to load:", src);
        setImageError(true);
      }}
    />
  );
} 