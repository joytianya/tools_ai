'use client';

import { useEffect, useState, useRef } from 'react';
import { List, ChevronUp } from 'lucide-react';

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
  const isScrollingFromClickRef = useRef(false);

  // 从DOM中提取标题和ID
  useEffect(() => {
    const timer = setTimeout(() => {
      const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
      const items: TocItem[] = [];

      headings.forEach((heading) => {
        const tagName = heading.tagName.toLowerCase();
        const level = parseInt(tagName.charAt(1));
        const text = heading.textContent?.trim() || '';
        const id = heading.id;

        if (id && text) {
          items.push({ id, text, level });
        }
      });

      setTocItems(items);
      setIsVisible(items.length > 0);
    }, 100); // 延迟执行，确保DOM已渲染

    return () => clearTimeout(timer);
  }, [content]);

  // 动态计算滚动偏移量
  const getScrollOffset = (): number => {
    // 查找导航栏元素
    const header = document.querySelector('header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;

    // 基础偏移量：导航栏高度 + 额外边距
    const baseOffset = headerHeight + 20;

    // 移动端和教程页面的额外偏移
    const isMobile = window.innerWidth < 768;
    const isTutorialPage = window.location.pathname.startsWith('/tutorials/');

    let extraOffset = 0;
    if (isTutorialPage) {
      extraOffset = isMobile ? 40 : 30; // 教程页面额外偏移
    }

    return baseOffset + extraOffset;
  };

  // 监听滚动，更新当前活跃的标题
  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      // 如果是点击导致的滚动，不重新计算
      if (isScrollingFromClickRef.current) return;

      rafId = requestAnimationFrame(() => {
        const headings = tocItems.map(item => {
          const element = document.getElementById(item.id);
          if (!element) return null;

          // 使用 getBoundingClientRect 获取准确位置
          const rect = element.getBoundingClientRect();
          const absoluteTop = rect.top + window.scrollY;

          return {
            id: item.id,
            element,
            absoluteTop
          };
        }).filter(Boolean) as Array<{id: string; element: Element; absoluteTop: number}>;

        const scrollOffset = getScrollOffset();
        const scrollTop = window.scrollY;

        let currentActiveId = '';

        // 正确的判断逻辑：找到在视口偏移位置处或之上的最后一个标题
        for (let i = headings.length - 1; i >= 0; i--) {
          // 标题顶部位置 <= 当前滚动位置 + 偏移量
          // 加一个小的容错范围
          if (headings[i].absoluteTop <= scrollTop + scrollOffset + 1) {
            currentActiveId = headings[i].id;
            break;
          }
        }

        setActiveId(currentActiveId);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始调用

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
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
      // 使用 getBoundingClientRect 获取准确位置
      const rect = element.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      const scrollOffset = getScrollOffset();

      const targetTop = Math.max(0, absoluteTop - scrollOffset);

      // 立即设置为活跃状态
      setActiveId(id);

      // 设置标志，防止滚动事件覆盖
      isScrollingFromClickRef.current = true;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });

      // 1秒后恢复滚动监听
      setTimeout(() => {
        isScrollingFromClickRef.current = false;
      }, 1000);

      // 更新 URL hash
      if (history.replaceState) {
        history.replaceState(null, '', `#${id}`);
      }
    }
  };

  if (!isVisible || tocItems.length === 0) {
    return null;
  }

  return (
    <div ref={tocRef} className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 ${className}`}>
      {/* 悬浮按钮 - 最小化状态 */}
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 rounded-full p-3 md:p-3 shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 group touch-manipulation"
          title="打开目录"
        >
          <List className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
        </button>
      )}

      {/* 展开的目录面板 */}
      {!isMinimized && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-72 md:w-80 max-h-80 md:max-h-96 overflow-hidden">
          {/* 头部 */}
          <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <List className="w-4 h-4 mr-2 text-blue-600" />
              目录
            </h3>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 md:p-1 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
              title="最小化"
            >
              <ChevronUp className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* 目录内容 */}
          <div className="p-2 md:p-3 max-h-64 md:max-h-80 overflow-y-auto">
            <nav className="space-y-0.5 md:space-y-1">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={`block w-full text-left py-3 md:py-2 px-3 rounded-lg text-sm transition-all hover:bg-gray-50 active:bg-gray-100 touch-manipulation ${
                    activeId === item.id
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={{
                    paddingLeft: `${Math.min((item.level - 1) * 10 + 12, 40)}px`
                  }}
                >
                  <span className="line-clamp-2 break-words leading-relaxed">
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