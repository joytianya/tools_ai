'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { tutorials } from '@/data/tutorials';
import {
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove,
} from '@/lib/utils';

interface EnhancedSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function EnhancedSearch({ value, onChange, placeholder = "搜索教程标题、描述或标签..." }: EnhancedSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 加载搜索历史
  useEffect(() => {
    const history = safeLocalStorageGet<string[]>('tutorial-search-history', []);
    if (history) {
      setSearchHistory(history);
    }
  }, []);

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 生成搜索建议
  const suggestions = useMemo(() => {
    if (!value) return [];

    const searchLower = value.toLowerCase();
    const titleMatches = new Set<string>();
    const tagMatches = new Set<string>();

    tutorials.forEach(tutorial => {
      // 标题匹配
      if (tutorial.title.toLowerCase().includes(searchLower)) {
        const words = tutorial.title.split(' ');
        words.forEach(word => {
          if (word.toLowerCase().includes(searchLower)) {
            titleMatches.add(word);
          }
        });
      }

      // 标签匹配
      tutorial.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchLower)) {
          tagMatches.add(tag);
        }
      });
    });

    const allSuggestions = [
      ...Array.from(titleMatches).slice(0, 3),
      ...Array.from(tagMatches).slice(0, 3)
    ].filter(s => s.toLowerCase() !== value.toLowerCase());

    return allSuggestions.slice(0, 5);
  }, [value]);

  // 保存到搜索历史
  const saveToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const updatedHistory = [
      searchTerm,
      ...searchHistory.filter(item => item !== searchTerm)
    ].slice(0, 5);

    setSearchHistory(updatedHistory);
    safeLocalStorageSet('tutorial-search-history', updatedHistory);
  };

  // 处理搜索提交
  const handleSearch = (searchTerm: string) => {
    onChange(searchTerm);
    saveToHistory(searchTerm);
    setShowSuggestions(false);
  };

  // 清除搜索历史
  const clearHistory = () => {
    setSearchHistory([]);
    safeLocalStorageRemove('tutorial-search-history');
  };

  // 热门搜索词
  const popularSearches = ['AI工具', '网页开发', 'Python', '效率提升', '设计教程'];

  return (
    <div className="relative flex-1">
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value) {
              handleSearch(value);
            }
            if (e.key === 'Escape') {
              setShowSuggestions(false);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 bg-white/90 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none placeholder:text-gray-500 shadow-sm hover:border-gray-300 transition-all duration-200 backdrop-blur-sm"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* 搜索建议下拉框 */}
      {showSuggestions && (isFocused || value) && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
        >
          {/* 搜索建议 */}
          {suggestions.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 text-xs text-gray-500 font-medium">建议</div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* 搜索历史 */}
          {!value && searchHistory.length > 0 && (
            <div className="py-2 border-t border-gray-100">
              <div className="px-4 py-1 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">搜索历史</span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  清除
                </button>
              </div>
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* 热门搜索 */}
          {!value && searchHistory.length === 0 && (
            <div className="py-2">
              <div className="px-4 py-1 text-xs text-gray-500 font-medium">热门搜索</div>
              {popularSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
