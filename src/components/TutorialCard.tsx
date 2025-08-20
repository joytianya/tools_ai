import Link from 'next/link';
import { Clock, User, Calendar, BookOpen, Star, TrendingUp } from 'lucide-react';
import { Tutorial } from '@/types';
import { formatDate } from '@/lib/utils';

interface TutorialCardProps {
  tutorial: Tutorial;
}

// 根据教程分类生成渐变背景
function getCategoryGradient(category: string): string {
  const gradients = {
    'ai': 'from-purple-500/10 via-pink-500/10 to-red-500/10',
    'development': 'from-blue-500/10 via-cyan-500/10 to-teal-500/10',
    'design': 'from-pink-500/10 via-rose-500/10 to-orange-500/10',
    'productivity': 'from-green-500/10 via-emerald-500/10 to-teal-500/10',
    'business': 'from-amber-500/10 via-yellow-500/10 to-orange-500/10',
    'marketing': 'from-red-500/10 via-pink-500/10 to-purple-500/10',
    'default': 'from-gray-500/10 via-slate-500/10 to-gray-600/10'
  };
  return gradients[category as keyof typeof gradients] || gradients.default;
}

// 根据难度获取标记颜色
function getDifficultyColor(readTime: number): string {
  if (readTime <= 5) return 'bg-green-100 text-green-700 border-green-200';
  if (readTime <= 15) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-red-100 text-red-700 border-red-200';
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const gradientClass = getCategoryGradient(tutorial.category);
  const difficultyClass = getDifficultyColor(tutorial.readTime);

  return (
    <article className="group relative">
      {/* 玻璃态背景容器 */}
      <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 h-[420px] flex flex-col">
        {/* 渐变背景装饰 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
        
        {/* 内容区域 */}
        <div className="relative p-6 flex flex-col h-full">
          {/* 顶部标记区域 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {tutorial.featured && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                  <Star className="w-3 h-3 fill-current" />
                  <span>精选</span>
                </div>
              )}
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyClass}`}>
                {tutorial.readTime <= 5 ? '快速阅读' : tutorial.readTime <= 15 ? '中等长度' : '深度阅读'}
              </div>
            </div>
            
            {/* 阅读时间指示器 */}
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>{tutorial.readTime}分钟</span>
            </div>
          </div>

          {/* 标题区域 */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors duration-200">
              <Link 
                href={`/tutorials/${tutorial.slug}`}
                className="block"
              >
                {tutorial.title}
              </Link>
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {tutorial.description}
            </p>
          </div>

          {/* 标签区域 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tutorial.tags.slice(0, 4).map((tag, index) => (
              <span
                key={tag}
                className={`
                  inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium
                  ${index === 0 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }
                  hover:scale-105 transition-transform duration-200
                `}
              >
                {tag}
              </span>
            ))}
            {tutorial.tags.length > 4 && (
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                +{tutorial.tags.length - 4}
              </span>
            )}
          </div>

          {/* 底部信息区域 */}
          <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{tutorial.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>发布: {formatDate(tutorial.publishedAt)}</span>
              </div>
            </div>
            {tutorial.updatedAt && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>更新: {formatDate(tutorial.updatedAt)}</span>
              </div>
            )}
          </div>

          {/* 底部操作区域 */}
          <div className="flex items-center justify-between mt-auto">
            <Link
              href={`/tutorials/${tutorial.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-sm hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <BookOpen className="w-4 h-4" />
              <span>开始学习</span>
            </Link>
            
            {/* 阅读指示器 */}
            <div className="flex items-center gap-1 text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">
                {tutorial.readTime > 15 ? '深度教程' : '轻松阅读'}
              </span>
            </div>
          </div>
        </div>

        {/* 悬浮效果装饰 */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </article>
  );
}