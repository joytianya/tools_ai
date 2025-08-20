'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TagListProps {
  tags: string[];
  maxVisibleTags?: number;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export function TagList({ 
  tags, 
  maxVisibleTags = 3, 
  variant = 'compact',
  className = '' 
}: TagListProps) {
  const [showAll, setShowAll] = useState(false);
  
  if (tags.length === 0) return null;
  
  const visibleTags = showAll ? tags : tags.slice(0, maxVisibleTags);
  const hasMoreTags = tags.length > maxVisibleTags;
  
  const getTagStyle = (index: number) => {
    if (variant === 'compact') {
      return `
        inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
        ${index === 0 
          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
          : 'bg-gray-100 text-gray-700 border border-gray-200'
        }
        hover:bg-opacity-80 transition-colors
      `;
    } else {
      return `
        inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium
        ${index === 0 
          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
          : 'bg-gray-50 text-gray-600 border border-gray-200'
        }
        hover:bg-opacity-80 transition-colors
      `;
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 items-center ${className}`}>
      {visibleTags.map((tag, index) => (
        <span
          key={tag}
          className={getTagStyle(index)}
        >
          {tag}
        </span>
      ))}
      
      {hasMoreTags && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="inline-flex items-center px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100"
        >
          <span className="mr-1">+{tags.length - maxVisibleTags}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      )}
      
      {hasMoreTags && showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="inline-flex items-center px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100"
        >
          <span className="mr-1">收起</span>
          <ChevronUp className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}