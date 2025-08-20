import Link from 'next/link';
import Script from 'next/script';
import { Star, Users, BookOpen, Zap } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ToolCard } from '@/components/ToolCard';
import { TutorialCard } from '@/components/TutorialCard';
import { tools } from '@/data/tools';
import { tutorials } from '@/data/tutorials';
import { SITE_CONFIG } from '@/lib/constants';
import { generateStructuredData } from '@/lib/seo';

export default function Home() {
  const featuredTools = tools.filter(tool => tool.featured);
  const featuredTutorials = tutorials.filter(tutorial => tutorial.featured);

  const websiteStructuredData = generateStructuredData({
    type: 'WebSite',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
  });

  return (
    <>
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="inline-block text-6xl mb-4">🛠️</span>
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              发现最好用的
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                工具和教程
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              为新手精心筛选的实用工具推荐和详细教程<br />
              让工作效率提升变得简单易行
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link
                href="/tools"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                🚀 探索工具
              </Link>
              <Link
                href="/tutorials"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                📚 学习教程
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{tools.length}</div>
                <div className="text-gray-600 text-sm">精选工具</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{tutorials.length}</div>
                <div className="text-gray-600 text-sm">实用教程</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-gray-600 text-sm">免费使用</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">新手</div>
                <div className="text-gray-600 text-sm">友好设计</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Tools */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🌟 精选工具推荐
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              经过实际测试验证的优质工具，帮助你快速提升工作效率
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          
          <div className="text-center">
            <Link
              href="/tools"
              className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              查看全部工具 →
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Tutorials */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📖 热门教程
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              从零开始的详细教程，让你快速掌握各种工具的使用技巧
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
          
          <div className="text-center">
            <Link
              href="/tutorials"
              className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              查看全部教程 →
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎯 为什么选择我们？
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              我们专注于为新手用户提供最佳的工具发现和学习体验
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">精心筛选</h3>
              <p className="text-gray-600 text-sm">
                每个工具都经过实际测试和深度体验验证
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">新手友好</h3>
              <p className="text-gray-600 text-sm">
                所有教程都以新手视角编写，步骤详细易懂
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">内容丰富</h3>
              <p className="text-gray-600 text-sm">
                涵盖开发、设计、效率、营销等多个领域
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">持续更新</h3>
              <p className="text-gray-600 text-sm">
                定期更新内容，跟上最新的工具趋势
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备开始探索了吗？
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            发现更多实用工具和教程，让你的工作效率翻倍
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/tools"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              浏览所有工具
            </Link>
            <Link
              href="/tutorials"
              className="bg-transparent text-white px-8 py-3 rounded-lg font-semibold border-2 border-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              学习教程
            </Link>
          </div>
        </div>
      </div>
      </Layout>
    </>
  );
}