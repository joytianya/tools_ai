'use client';

import { useEffect, useState, useRef } from 'react';
import { List, ChevronRight, X, ChevronUp } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface FloatingTableOfContentsProps {
  content: string;
  className?: string;
}

export function FloatingTableOfContents({ content, className = '' }: FloatingTableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const tocRef = useRef<HTMLDivElement>(null);

  // 从markdown内容中提取标题
  useEffect(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      // 使用与rehype-slug相同的ID生成算法
      const id = text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-\u4e00-\u9fff]/g, ''); // 保留中文、英文、数字和连字符

      items.push({ id, text, level });
    }

    setTocItems(items);
    setIsVisible(items.length > 0);
  }, [content]);

  // 监听滚动，更新当前活跃的标题
  useEffect(() => {
    const handleScroll = () => {
      const headings = tocItems.map(item => {
        const element = document.getElementById(item.id);
        return {
          id: item.id,
          element,
          offsetTop: element?.offsetTop || 0
        };
      }).filter(item => item.element);

      const scrollTop = window.scrollY + 100;

      let currentActiveId = '';
      for (let i = headings.length - 1; i >= 0; i--) {
        if (scrollTop >= headings[i].offsetTop) {
          currentActiveId = headings[i].id;
          break;
        }
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始调用

    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  // 监听点击外部区域，自动收缩目录
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tocRef.current && !tocRef.current.contains(event.target as Node) && !isMinimized) {
        setIsMinimized(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMinimized]);

  // 平滑滚动到指定标题
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible || tocItems.length === 0) {
    return null;
  }

  return (
    <div ref={tocRef} className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* 悬浮按钮 - 最小化状态 */}
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
          title="打开目录"
        >
          <List className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
        </button>
      )}

      {/* 展开的目录面板 */}
      {!isMinimized && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-80 max-h-96 overflow-hidden">
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <List className="w-4 h-4 mr-2 text-blue-600" />
              目录
            </h3>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              title="最小化"
            >
              <ChevronUp className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* 目录内容 */}
          <div className="p-3 max-h-80 overflow-y-auto">
            <nav className="space-y-1">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={`block w-full text-left py-2 px-3 rounded-lg text-sm transition-all hover:bg-gray-50 ${
                    activeId === item.id
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={{
                    paddingLeft: `${Math.min((item.level - 1) * 12 + 12, 48)}px`
                  }}
                >
                  <span className="line-clamp-2 break-words">
                    {item.text}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}