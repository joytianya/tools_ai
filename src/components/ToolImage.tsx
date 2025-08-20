'use client';

import { useState } from 'react';

interface ToolImageProps {
  src?: string;
  alt: string;
  title: string;
  className?: string;
}

// 根据工具名称生成一致的头像样式（与ToolCard保持一致）
function generateAvatarStyle(name: string): string {
  const styles = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-green-500 to-green-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-red-500 to-red-600',
    'bg-gradient-to-br from-orange-500 to-orange-600',
    'bg-gradient-to-br from-teal-500 to-teal-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-yellow-500 to-yellow-600',
    'bg-gradient-to-br from-cyan-500 to-cyan-600',
    'bg-gradient-to-br from-emerald-500 to-emerald-600',
    'bg-gradient-to-br from-rose-500 to-rose-600',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return styles[Math.abs(hash) % styles.length];
}

export function ToolImage({ src, alt, title, className = '' }: ToolImageProps) {
  const [hasError, setHasError] = useState(false);
  const avatarStyle = generateAvatarStyle(title);
  
  if (!src || hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${avatarStyle} ${className}`}>
        <span className="text-white text-2xl font-bold">{title.charAt(0)}</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={() => setHasError(true)}
    />
  );
}