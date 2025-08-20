'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { NAVIGATION } from '@/lib/constants';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 关闭下拉菜单当点击外部时
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b relative z-[99999]" style={{ isolation: 'isolate' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🛠️</span>
            <span className="text-xl font-bold text-gray-900">MatrixTools</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" ref={dropdownRef}>
            {NAVIGATION.map((item) => (
              <div key={item.href} className="relative">
                {'dropdowns' in item && item.dropdowns ? (
                  // 有下拉菜单的项目
                  <div className="relative">
                    <button
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors py-2"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setDropdownPosition({ 
                          top: rect.bottom + 4, 
                          left: rect.left 
                        });
                        setActiveDropdown(activeDropdown === item.name ? null : item.name);
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setDropdownPosition({ 
                          top: rect.bottom + 4, 
                          left: rect.left 
                        });
                        setActiveDropdown(item.name);
                      }}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {/* 下拉菜单 */}
                    {activeDropdown === item.name && (
                      <div 
                        className="fixed w-48 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg"
                        style={{ 
                          zIndex: 999999,
                          position: 'fixed',
                          top: `${dropdownPosition.top}px`,
                          left: `${dropdownPosition.left}px`,
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="py-2">
                          <Link
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-b border-gray-100"
                            onClick={() => setActiveDropdown(null)}
                          >
                            📋 查看全部
                          </Link>
                          {item.dropdowns.map((dropdown) => (
                            <Link
                              key={dropdown.href}
                              href={dropdown.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {dropdown.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // 普通链接
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Search Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/search" className="p-2 text-gray-500 hover:text-gray-700">
              <Search className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {NAVIGATION.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {'dropdowns' in item && item.dropdowns && (
                    <div className="pl-6 space-y-1">
                      {item.dropdowns.map((dropdown) => (
                        <Link
                          key={dropdown.href}
                          href={dropdown.href}
                          className="block px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {dropdown.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="px-3 py-2 border-t border-gray-200 mt-2 pt-2">
                <Link 
                  href="/search" 
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Search className="w-5 h-5" />
                  <span>搜索工具和教程</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}