'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

interface ToolFilterProps {
  selectedCategory: string;
  selectedTags: string[];
  onCategoryChange: (category: string) => void;
  onTagChange: (tags: string[]) => void;
  onPriceFilter: (isFree: boolean | null) => void;
  priceFilter: boolean | null;
}

export function ToolFilter({
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagChange,
  onPriceFilter,
  priceFilter,
}: ToolFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const availableTags = [
    '编辑器', '开发', '免费', '设计', 'UI/UX', '协作', 
    '笔记', '项目管理', '分析', '营销'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">筛选工具</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-500 hover:text-gray-700"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden md:block'}`}>
        {/* 分类筛选 */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">分类</h4>
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange('')}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              全部分类
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 价格筛选 */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">价格</h4>
          <div className="space-y-2">
            <button
              onClick={() => onPriceFilter(null)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                priceFilter === null
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => onPriceFilter(true)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                priceFilter === true
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              免费工具
            </button>
            <button
              onClick={() => onPriceFilter(false)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                priceFilter === false
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              付费工具
            </button>
          </div>
        </div>

        {/* 标签筛选 */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">标签</h4>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 清除筛选 */}
        {(selectedCategory || selectedTags.length > 0 || priceFilter !== null) && (
          <div>
            <button
              onClick={() => {
                onCategoryChange('');
                onTagChange([]);
                onPriceFilter(null);
              }}
              className="flex items-center space-x-2 text-red-600 hover:text-red-800 text-sm"
            >
              <X className="w-4 h-4" />
              <span>清除所有筛选</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}