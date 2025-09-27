'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { isPathExcluded } from '@/lib/stats-config';

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 使用配置文件检查是否应该排除此路径
    if (isPathExcluded(pathname)) {
      console.debug(`跳过统计: 排除路径 ${pathname}`);
      return;
    }

    const trackVisit = async () => {
      try {
        const response = await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: pathname,
            userAgent: navigator.userAgent,
            referer: document.referrer,
          }),
        });

        // 在开发环境下显示追踪结果
        if (process.env.NODE_ENV === 'development') {
          const result = await response.json();
          if (result.excluded) {
            console.debug(`访问被排除: ${result.reason}`);
          } else if (result.success) {
            console.debug(`访问已记录: ${pathname}`);
          }
        }
      } catch (error) {
        // 静默处理错误，不影响用户体验
        console.debug('Failed to track page visit:', error);
      }
    };

    // 延迟执行，确保页面完全加载
    const timer = setTimeout(trackVisit, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null; // 不渲染任何内容
}