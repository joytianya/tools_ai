'use client';

import Link from 'next/link';
import { Clock, Eye, Bookmark, ChevronRight, CheckCircle } from 'lucide-react';
import { Tutorial } from '@/types';
import { useState, useEffect } from 'react';
import {
  safeLocalStorageGet,
  safeLocalStorageSet,
} from '@/lib/utils';

interface TutorialCardProps {
  tutorial: Tutorial;
  viewCount?: number;
  onView?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
}

interface UserProgress {
  [tutorialId: string]: {
    completed: boolean;
    progress: number;
    lastAccessed: string;
  };
}

// 分类配色方案 - 更加统一和专业
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '新手入门': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  '网页开发': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'AI自动化': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  '设计体验': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  '商业增长': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  '数据洞察': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  '效率精通': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  '职业发展': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  '个人成长': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  '学习方法': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  '生活技能': { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  '知识资源': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
};

// 获取难度等级
function getDifficultyLevel(readTime: number): { label: string; stars: number; color: string } {
  if (readTime <= 5) {
    return { label: '入门', stars: 1, color: 'text-emerald-600' };
  } else if (readTime <= 10) {
    return { label: '基础', stars: 2, color: 'text-blue-600' };
  } else if (readTime <= 20) {
    return { label: '进阶', stars: 3, color: 'text-amber-600' };
  } else {
    return { label: '高级', stars: 4, color: 'text-red-600' };
  }
}

// 格式化相对时间
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  if (days < 365) return `${Math.floor(days / 30)}个月前`;
  return `${Math.floor(days / 365)}年前`;
}

// 格式化数字
function formatNumber(num: number): string {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export function TutorialCardOptimized({ tutorial, viewCount = 0, onView, variant = 'default' }: TutorialCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({});

  const categoryStyle = CATEGORY_COLORS[tutorial.category] || CATEGORY_COLORS['新手入门'];
  const difficulty = getDifficultyLevel(tutorial.readTime);
  const relativeTime = formatRelativeTime(tutorial.publishedAt);
  const progress = userProgress[tutorial.id];
  const isCompleted = progress?.completed || false;
  const progressPercent = progress?.progress || 0;

  // 加载用户数据
  useEffect(() => {
    // 加载书签状态
    const bookmarks = safeLocalStorageGet<Record<string, boolean>>('tutorial-bookmarks', {});
    if (bookmarks) {
      setIsBookmarked(!!bookmarks[tutorial.id]);
    }

    const progressData = safeLocalStorageGet<UserProgress>('tutorial-progress', {});
    if (progressData) {
      setUserProgress(progressData);
    }
  }, [tutorial.id]);

  // 切换书签
  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const parsed = safeLocalStorageGet<Record<string, boolean>>('tutorial-bookmarks', {}) || {};

    if (isBookmarked) {
      delete parsed[tutorial.id];
    } else {
      parsed[tutorial.id] = true;
    }

    safeLocalStorageSet('tutorial-bookmarks', parsed);
    setIsBookmarked(!isBookmarked);
  };

  // 紧凑版本
  if (variant === 'compact') {
    return (
      <Link href={`/tutorials/${tutorial.slug}`} onClick={onView}>
        <article className="group bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded ${categoryStyle.bg} ${categoryStyle.text}`}>
                  {tutorial.category}
                </span>
                {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-600" />}
              </div>
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600">
                {tutorial.title}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {tutorial.readTime}分钟
                </span>
                {viewCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(viewCount)}
                  </span>
                )}
                <span>{relativeTime}</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </div>
        </article>
      </Link>
    );
  }

  // 默认卡片版本 - 优化后的设计
  return (
    <article className="group relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200">
      {/* 学习进度条 */}
      {progressPercent > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 rounded-t-xl overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      <Link href={`/tutorials/${tutorial.slug}`} onClick={onView} className="block p-6">
        {/* 顶部：分类标签和书签 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}>
              {tutorial.category}
            </span>
            {tutorial.featured && (
              <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 border border-orange-200">
                精选
              </span>
            )}
            {isCompleted && (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <button
            onClick={toggleBookmark}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isBookmarked ? '取消收藏' : '收藏教程'}
          >
            <Bookmark
              className={`w-4 h-4 transition-colors ${
                isBookmarked ? 'fill-blue-600 text-blue-600' : 'text-gray-400'
              }`}
            />
          </button>
        </div>

        {/* 主体：标题和描述 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {tutorial.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {tutorial.description}
          </p>
        </div>

        {/* 标签 - 简化显示 */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tutorial.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {tutorial.tags.length > 3 && (
            <span className="inline-block px-2 py-0.5 text-gray-400 text-xs">
              +{tutorial.tags.length - 3}
            </span>
          )}
        </div>

        {/* 底部：核心指标 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {/* 阅读时间和难度 */}
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{tutorial.readTime}分钟</span>
              <span className="text-gray-300">·</span>
              <span className={difficulty.color}>
                {'★'.repeat(difficulty.stars)}{'☆'.repeat(4 - difficulty.stars)}
              </span>
            </div>

            {/* 浏览量 */}
            {viewCount > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{formatNumber(viewCount)}</span>
              </div>
            )}
          </div>

          {/* 相对时间 */}
          <span className="text-xs text-gray-400">{relativeTime}</span>
        </div>
      </Link>

      {/* 悬浮时显示的操作按钮 */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Link
          href={`/tutorials/${tutorial.slug}`}
          onClick={onView}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isCompleted ? '复习' : progressPercent > 0 ? '继续学习' : '开始学习'}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
