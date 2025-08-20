'use client';

import { useEffect, useState } from 'react';
import { List, ChevronRight } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
  defaultExpanded?: boolean;
}

export function TableOfContents({ content, className = '', defaultExpanded = false }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(defaultExpanded);

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

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className={`toc-container bg-white rounded-xl border border-gray-200 shadow-sm w-full ${className}`}>
      <div 
        className="p-4 border-b border-gray-100 cursor-pointer flex items-center justify-between"
        onClick={() => setIsVisible(!isVisible)}
      >
        <h3 className="text-lg font-semibold text-gray-900 flex items-center min-w-0 flex-1">
          <List className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
          <span className="truncate">目录</span>
        </h3>
        <ChevronRight 
          className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${
            isVisible ? 'rotate-90' : ''
          }`} 
        />
      </div>
      
      {isVisible && (
        <div className="p-4 toc-container">
          <nav className="space-y-2 toc-container">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={`toc-container block w-full text-left py-3 px-3 rounded-lg text-sm transition-all hover:bg-gray-50 ${
                  activeId === item.id
                    ? 'bg-blue-50 text-blue-700 border-l-3 border-blue-500 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={{
                  paddingLeft: `${Math.min((item.level - 1) * 16 + 12, 60)}px`
                }}
              >
                <span className="toc-text-wrap">
                  {item.text}
                </span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}