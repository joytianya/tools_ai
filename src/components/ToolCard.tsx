import Link from 'next/link';
import { ExternalLink, Star } from 'lucide-react';
import { Tool } from '@/types';

interface ToolCardProps {
  tool: Tool;
}

// 根据工具名称生成颜色
function generateAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500 text-white',
    'bg-green-500 text-white',
    'bg-purple-500 text-white',
    'bg-red-500 text-white',
    'bg-orange-500 text-white',
    'bg-teal-500 text-white',
    'bg-pink-500 text-white',
    'bg-indigo-500 text-white',
    'bg-yellow-500 text-white',
    'bg-cyan-500 text-white',
    'bg-emerald-500 text-white',
    'bg-rose-500 text-white',
  ];
  
  // 简单的哈希函数来确保同一个工具总是得到相同的颜色
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {tool.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
        </div>
        {tool.imageUrl && (
          <div className="ml-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${generateAvatarColor(tool.title)}`}>
              <span>{tool.title.charAt(0)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {tool.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{tool.rating}</span>
            </div>
          )}
          {tool.isFree && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              免费
            </span>
          )}
          {tool.featured && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              推荐
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Link
          href={`/tools/${tool.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          查看详情
        </Link>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <span>访问工具</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}