import Link from 'next/link';
import { ExternalLink, Star, Zap, Shield, Globe, Sparkles, Calendar } from 'lucide-react';
import { Tool } from '@/types';
import { TagList } from './TagList';
import { formatDate } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
}

// 根据工具分类生成渐变背景
function getCategoryGradient(category: string): string {
  const gradients = {
    'development': 'from-blue-500/15 via-cyan-500/15 to-teal-500/15',
    'design': 'from-pink-500/15 via-rose-500/15 to-orange-500/15',
    'productivity': 'from-green-500/15 via-emerald-500/15 to-teal-500/15',
    'ai': 'from-purple-500/15 via-violet-500/15 to-pink-500/15',
    'business': 'from-amber-500/15 via-yellow-500/15 to-orange-500/15',
    'marketing': 'from-red-500/15 via-pink-500/15 to-purple-500/15',
    'analytics': 'from-indigo-500/15 via-blue-500/15 to-cyan-500/15',
    'default': 'from-gray-500/15 via-slate-500/15 to-gray-600/15'
  };
  return gradients[category as keyof typeof gradients] || gradients.default;
}

// 根据工具名称生成头像样式
function generateAvatarStyle(name: string): string {
  const styles = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-green-500 to-green-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-red-500 to-red-600',
    'bg-gradient-to-br from-orange-500 to-orange-600',
    'bg-gradient-to-br from-teal-500 to-teal-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-yellow-500 to-yellow-600',
    'bg-gradient-to-br from-cyan-500 to-cyan-600',
    'bg-gradient-to-br from-emerald-500 to-emerald-600',
    'bg-gradient-to-br from-rose-500 to-rose-600',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return styles[Math.abs(hash) % styles.length];
}

// 获取评分星级显示
function getRatingStars(rating: number) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />);
  }
  
  if (hasHalfStar) {
    stars.push(<Star key="half" className="w-3 h-3 text-yellow-400 fill-current opacity-50" />);
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />);
  }
  
  return stars;
}

export function ToolCard({ tool }: ToolCardProps) {
  const gradientClass = getCategoryGradient(tool.category);
  const avatarStyle = generateAvatarStyle(tool.title);

  return (
    <article className="group relative w-full max-w-full">
      {/* 玻璃态背景容器 */}
      <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300 md:hover:scale-[1.02] hover:bg-white/90 min-h-[400px] sm:h-[420px] flex flex-col w-full max-w-full">
        {/* 渐变背景装饰 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
        
        {/* 内容区域 */}
        <div className="relative p-5 sm:p-6 flex flex-col h-full w-full overflow-hidden">
          {/* 顶部区域：头像和状态标记 */}
          <div className="flex items-start justify-between mb-4">
            {/* 工具头像 */}
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${avatarStyle} flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg md:group-hover:scale-110 transition-transform duration-300`}>
              <span>{tool.title.charAt(0)}</span>
            </div>
            
            {/* 状态标记 */}
            <div className="flex flex-col gap-2">
              {tool.featured && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                  <Sparkles className="w-3 h-3" />
                  <span>推荐</span>
                </div>
              )}
              {tool.isFree && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                  <Zap className="w-3 h-3" />
                  <span>免费</span>
                </div>
              )}
            </div>
          </div>

          {/* 标题和描述 */}
          <div className="mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors duration-200">
              {tool.title}
            </h3>
            <p className="text-gray-600 text-sm sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-2 overflow-hidden">
              {tool.description}
            </p>
          </div>

          {/* 评分区域 */}
          {tool.rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {getRatingStars(tool.rating)}
              </div>
              <span className="text-sm font-semibold text-gray-700">{tool.rating}</span>
              <span className="text-xs text-gray-500">({Math.floor(tool.rating * 127 + 23)} 评价)</span>
            </div>
          )}

          {/* 标签区域 */}
          <div className="mb-4">
            <TagList 
              tags={tool.tags} 
              maxVisibleTags={3} 
              variant="compact" 
            />
          </div>

          {/* 发布时间 - 显示所有工具的日期信息 */}
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
            <Calendar className="w-3 h-3" />
            <span>发布于 {tool.publishedAt ? formatDate(tool.publishedAt) : '未知日期'}</span>
          </div>

          {/* 底部操作区域 */}
          <div className="flex items-center gap-3 mt-auto w-full">
            <Link
              href={`/tools/${tool.slug}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all duration-200 md:hover:scale-105 touch-manipulation"
            >
              <Shield className="w-4 h-4" />
              <span className="truncate">查看详情</span>
            </Link>
            
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium text-sm hover:from-blue-600 hover:to-blue-700 transform md:hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg touch-manipulation"
            >
              <Globe className="w-4 h-4" />
              <span className="truncate">立即使用</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 悬浮效果装饰 */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* 边框光效 */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
      </div>
    </article>
  );
}