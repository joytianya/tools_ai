'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ToolCard } from '@/components/ToolCard';
import { TutorialCard } from '@/components/TutorialCard';
import { tools } from '@/data/tools';
import { tutorials } from '@/data/tutorials';
import { POPULAR_SEARCHES } from '@/lib/constants';

function SearchContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'tools' | 'tutorials'>('all');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return { tools: [], tutorials: [] };
    }

    const searchLower = searchTerm.toLowerCase();

    const filteredTools = tools.filter((tool) => {
      const matchesTitle = tool.title.toLowerCase().includes(searchLower);
      const matchesDescription = tool.description.toLowerCase().includes(searchLower);
      const matchesTags = tool.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      return matchesTitle || matchesDescription || matchesTags;
    });

    const filteredTutorials = tutorials.filter((tutorial) => {
      const matchesTitle = tutorial.title.toLowerCase().includes(searchLower);
      const matchesDescription = tutorial.description.toLowerCase().includes(searchLower);
      const matchesTags = tutorial.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      return matchesTitle || matchesDescription || matchesTags;
    });

    return {
      tools: filteredTools,
      tutorials: filteredTutorials
    };
  }, [searchTerm]);

  const totalResults = searchResults.tools.length + searchResults.tutorials.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 搜索结果
          </h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索工具和教程..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-12 py-4 text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 placeholder:font-medium text-gray-900 bg-white"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                搜索
              </button>
            </div>
          </form>
        </div>

        {searchTerm ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600 text-center">
                找到 <span className="font-semibold text-gray-900">{totalResults}</span> 个结果
                {searchTerm && (
                  <>
                    ，关键词: <span className="font-semibold text-blue-600">&ldquo;{searchTerm}&rdquo;</span>
                  </>
                )}
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-white rounded-lg shadow-sm border">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-2 rounded-l-lg font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  全部 ({totalResults})
                </button>
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`px-6 py-2 font-medium transition-colors ${
                    activeTab === 'tools'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  工具 ({searchResults.tools.length})
                </button>
                <button
                  onClick={() => setActiveTab('tutorials')}
                  className={`px-6 py-2 rounded-r-lg font-medium transition-colors ${
                    activeTab === 'tutorials'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  教程 ({searchResults.tutorials.length})
                </button>
              </div>
            </div>

            <div className="space-y-12">
              {(activeTab === 'all' || activeTab === 'tools') && searchResults.tools.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    🛠️ 工具 ({searchResults.tools.length})
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.tools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'tutorials') && searchResults.tutorials.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    📚 教程 ({searchResults.tutorials.length})
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.tutorials.map((tutorial) => (
                      <TutorialCard key={tutorial.id} tutorial={tutorial} />
                    ))}
                  </div>
                </div>
              )}

              {totalResults === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😅</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    没有找到相关结果
                  </h3>
                  <p className="text-gray-600 mb-6">
                    试试使用其他关键词或浏览分类页面
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              开始搜索
            </h3>
            <p className="text-gray-600 mb-6">
              输入关键词搜索工具和教程
            </p>
            
            {/* 热门搜索词 */}
            <div className="max-w-2xl mx-auto">
              <h4 className="text-sm font-medium text-gray-700 mb-3">🔥 热门搜索</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {POPULAR_SEARCHES.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => setSearchTerm(keyword)}
                    className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Layout>
      <Suspense fallback={
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">正在加载搜索页面...</p>
            </div>
          </div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </Layout>
  );
}