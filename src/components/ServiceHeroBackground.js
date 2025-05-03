"use client";

import { useState } from 'react';

export default function ServiceHeroBackground({ coverImage, slug }) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError ? `/services/${slug}.jpg` : (coverImage || `/services/${slug}.jpg`);
  
  return (
    <div 
      className="h-[60vh] bg-cover bg-center flex flex-col justify-center items-center text-white text-center px-4 relative"
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    </div>
  );
} 