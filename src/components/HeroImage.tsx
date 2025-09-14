'use client';

import { useState } from 'react';
import Image from 'next/image';

interface HeroImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export function HeroImage({ src, alt, fallbackSrc }: HeroImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const defaultFallback = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop&auto=format';

  return (
    <Image 
      src={hasError ? (fallbackSrc || defaultFallback) : imageSrc} 
      alt={alt}
      fill
      className="object-cover opacity-20"
      onError={() => {
        setHasError(true);
        setImageSrc(fallbackSrc || defaultFallback);
      }}
      unoptimized={hasError}
    />
  );
}