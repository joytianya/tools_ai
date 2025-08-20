import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Star, ArrowLeft, Tag } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { TableOfContents } from '@/components/TableOfContents';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { TagList } from '@/components/TagList';
import { ToolImage } from '@/components/ToolImage';
import { tools } from '@/data/tools';
import { CATEGORIES } from '@/lib/constants';
import { generateSEO, generateStructuredData } from '@/lib/seo';

interface ToolDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 生成页面元数据
export async function generateMetadata({ params }: ToolDetailPageProps) {
  const resolvedParams = await params;
  const tool = tools.find((t) => t.slug === resolvedParams.slug);
  
  if (!tool) {
    return {};
  }

  return generateSEO({
    title: tool.title,
    description: tool.description,
    keywords: [tool.category, ...tool.tags],
    url: `/tools/${tool.slug}`,
    type: 'website',
  });
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const resolvedParams = await params;
  const tool = tools.find((t) => t.slug === resolvedParams.slug);

  if (!tool) {
    notFound();
  }

  // 生成软件应用结构化数据
  const structuredData = generateStructuredData({
    type: 'SoftwareApplication',
    name: tool.title,
    description: tool.description,
    url: tool.url,
  });

  const category = CATEGORIES.find((c) => c.id === tool.category);
  const relatedTools = tools
    .filter((t) => t.slug !== tool.slug && t.category === tool.category)
    .slice(0, 3);

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <Layout>
        <div className="bg-gray-50 min-h-screen overflow-x-hidden">
          <div className="container mx-auto px-4 py-8 max-w-7xl overflow-x-hidden">
            {/* 返回按钮 */}
            <Link
              href="/tools"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回工具列表</span>
            </Link>

            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 overflow-x-hidden">
              {/* 移动端目录 */}
              {tool.detailedContent && tool.detailedContent.length > 500 && (
                <div className="lg:hidden mb-8 overflow-hidden" style={{ width: '100%', maxWidth: 'calc(100vw - 2rem)' }}>
                  <TableOfContents 
                    content={tool.detailedContent}
                    defaultExpanded={false}
                    className=""
                  />
                </div>
              )}
              
              <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
                {/* 主要内容 */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
                  <div className="bg-white rounded-lg shadow-md p-6 lg:p-8 overflow-hidden">
                    {/* 工具头部信息 */}
                    <div className="mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
                        <div className="flex-1 min-w-0">
                          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">
                            {tool.title}
                          </h1>
                          {category && (
                            <div className="flex items-center space-x-2 mb-4">
                              <span className="text-lg">{category.icon}</span>
                              <span className="text-gray-600">{category.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 self-center sm:self-start">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                            <ToolImage 
                              src={tool.imageUrl} 
                              alt={tool.title}
                              title={tool.title}
                            />
                          </div>
                        </div>
                      </div>

                      <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        {tool.description}
                      </p>

                      {/* 工具特性 */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6">
                        {tool.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                            <span className="font-medium text-gray-900">{tool.rating}</span>
                            <span className="text-gray-500 text-sm">评分</span>
                          </div>
                        )}
                        {tool.isFree && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium">
                            免费使用
                          </span>
                        )}
                        {tool.featured && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium">
                            编辑推荐
                          </span>
                        )}
                      </div>

                      {/* 标签 */}
                      {tool.tags.length > 0 && (
                        <div className="flex items-start space-x-2 mb-6">
                          <Tag className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                          <TagList 
                            tags={tool.tags} 
                            maxVisibleTags={6} 
                            variant="detailed" 
                            className="flex-1 min-w-0"
                          />
                        </div>
                      )}

                      {/* 操作按钮 */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          <span>访问工具</span>
                          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                      </div>
                    </div>

                    {/* 详细介绍 */}
                    <div className="border-t pt-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                        详细介绍
                      </h2>
                      <div className="prose prose-sm sm:prose max-w-none overflow-hidden break-words">
                        {tool.detailedContent ? (
                          <MarkdownRenderer 
                            content={tool.detailedContent}
                            className="max-w-none"
                          />
                        ) : (
                          <>
                            <p className="text-gray-700 leading-relaxed">
                              {tool.title} 是一款优秀的{category?.name}，专为提升工作效率而设计。
                              该工具具有直观的用户界面和强大的功能，适合各种技能水平的用户使用。
                            </p>
                            
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-6 mb-3">
                              主要特性
                            </h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                              <li>简洁直观的用户界面</li>
                              <li>强大的功能和高性能</li>
                              <li>跨平台支持</li>
                              <li>活跃的社区支持</li>
                            </ul>

                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-6 mb-3">
                              适用场景
                            </h3>
                            <p className="text-gray-700">
                              无论你是初学者还是专业人士，{tool.title} 都能满足你的需求。
                              特别适合需要{tool.tags.join('、')}等功能的用户。
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右侧边栏 */}
                <div className="space-y-4 sm:space-y-6 min-w-0">
                  {/* 桌面端目录导航 */}
                  {tool.detailedContent && tool.detailedContent.length > 500 && (
                    <div className="hidden lg:block">
                      <TableOfContents 
                        content={tool.detailedContent} 
                        className="sticky top-4"
                        defaultExpanded={true}
                      />
                    </div>
                  )}
                  
                  {/* 相关工具 */}
                  {relatedTools.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        相关工具
                      </h3>
                      <div className="space-y-4">
                        {relatedTools.map((relatedTool) => (
                          <Link
                            key={relatedTool.id}
                            href={`/tools/${relatedTool.slug}`}
                            className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <h4 className="font-medium text-gray-900 mb-1 text-sm">
                              {relatedTool.title}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-2">
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
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium text-sm">分类</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {category?.icon} {category?.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium text-sm">价格</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          tool.isFree 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {tool.isFree ? '💰 免费' : '💳 付费'}
                        </span>
                      </div>
                      {tool.rating && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium text-sm">评分</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="bg-yellow-100 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
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
        </div>
      </Layout>
    </>
  );
}