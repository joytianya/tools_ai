import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Star, ArrowLeft, Tag } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { tools } from '@/data/tools';
import { CATEGORIES } from '@/lib/constants';

interface ToolDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const resolvedParams = await params;
  const tool = tools.find((t) => t.id === resolvedParams.id);

  if (!tool) {
    notFound();
  }

  const category = CATEGORIES.find((c) => c.id === tool.category);
  const relatedTools = tools
    .filter((t) => t.id !== tool.id && t.category === tool.category)
    .slice(0, 3);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* 返回按钮 */}
          <Link
            href="/tools"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回工具列表</span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 主要内容 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                {/* 工具头部信息 */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {tool.title}
                      </h1>
                      {category && (
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-gray-600">{category.name}</span>
                        </div>
                      )}
                    </div>
                    {tool.imageUrl && (
                      <div className="ml-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-3xl">{tool.title.charAt(0)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {tool.description}
                  </p>

                  {/* 工具特性 */}
                  <div className="flex items-center space-x-4 mb-6">
                    {tool.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-medium">{tool.rating}</span>
                        <span className="text-gray-500 text-sm">评分</span>
                      </div>
                    )}
                    {tool.isFree && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        免费使用
                      </span>
                    )}
                    {tool.featured && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        编辑推荐
                      </span>
                    )}
                  </div>

                  {/* 标签 */}
                  <div className="flex items-center space-x-2 mb-6">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex space-x-4">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <span>访问工具</span>
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* 详细介绍 */}
                <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    详细介绍
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {tool.title} 是一款优秀的{category?.name}，专为提升工作效率而设计。
                      该工具具有直观的用户界面和强大的功能，适合各种技能水平的用户使用。
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                      主要特性
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>简洁直观的用户界面</li>
                      <li>强大的功能和高性能</li>
                      <li>跨平台支持</li>
                      <li>活跃的社区支持</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                      适用场景
                    </h3>
                    <p className="text-gray-700">
                      无论你是初学者还是专业人士，{tool.title} 都能满足你的需求。
                      特别适合需要{tool.tags.join('、')}等功能的用户。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 侧边栏 */}
            <div className="lg:col-span-1">
              {/* 相关工具 */}
              {relatedTools.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    相关工具
                  </h3>
                  <div className="space-y-4">
                    {relatedTools.map((relatedTool) => (
                      <Link
                        key={relatedTool.id}
                        href={`/tools/${relatedTool.id}`}
                        className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900 mb-1">
                          {relatedTool.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedTool.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 工具信息卡片 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  工具信息
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">分类</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {category?.icon} {category?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">价格</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      tool.isFree 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {tool.isFree ? '💰 免费' : '💳 付费'}
                    </span>
                  </div>
                  {tool.rating && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">评分</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {tool.rating}/5.0
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}