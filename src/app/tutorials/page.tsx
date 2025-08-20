'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/Layout';
import { TutorialCard } from '@/components/TutorialCard';
import { tutorials } from '@/data/tutorials';
import { CATEGORIES } from '@/lib/constants';

function TutorialsContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  // 从URL参数中获取初始值
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredTutorials = useMemo(() => {
    return tutorials.filter((tutorial) => {
      // 分类筛选
      if (selectedCategory && tutorial.category !== selectedCategory) {
        return false;
      }

      // 搜索筛选
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesTitle = tutorial.title.toLowerCase().includes(searchLower);
        const matchesDescription = tutorial.description.toLowerCase().includes(searchLower);
        const matchesTags = tutorial.tags.some(tag => 
          tag.toLowerCase().includes(searchLower)
        );
        
        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // 按时间排序，最新的在前
      const dateA = new Date(a.publishedAt || '1970-01-01');
      const dateB = new Date(b.publishedAt || '1970-01-01');
      return dateB.getTime() - dateA.getTime();
    });
  }, [selectedCategory, searchTerm]);

  const featuredTutorials = tutorials.filter(t => t.featured).sort((a, b) => {
    // 推荐教程也按时间排序，最新的在前
    const dateA = new Date(a.publishedAt || '1970-01-01');
    const dateB = new Date(b.publishedAt || '1970-01-01');
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <span className="text-2xl">📚</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
              教程中心
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              深度学习现代工具和技术，掌握提升效率的核心技能
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>持续更新</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>实战导向</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>专业深度</span>
              </div>
            </div>
          </div>

          {/* 搜索和筛选 */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* 搜索框 */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="搜索教程标题、描述或标签..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white/90 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none placeholder:text-gray-500 shadow-sm hover:border-gray-300 transition-all duration-200 backdrop-blur-sm"
                  />
                </div>
                
                {/* 分类筛选 */}
                <div className="lg:w-56">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-white/90 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none shadow-sm hover:border-gray-300 transition-all duration-200 backdrop-blur-sm"
                  >
                    <option value="">🗂️ 所有分类</option>
                    {CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* 快速筛选标签 */}
                <div className="flex items-center gap-2 lg:border-l lg:border-gray-200 lg:pl-4">
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSelectedCategory('ai')}
                      className="px-3 py-1.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      🤖 AI工具
                    </button>
                    <button 
                      onClick={() => setSelectedCategory('development')}
                      className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      💻 开发
                    </button>
                    <button 
                      onClick={() => setSelectedCategory('design')}
                      className="px-3 py-1.5 text-xs font-medium bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
                    >
                      🎨 设计
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 推荐教程 */}
          {!searchTerm && !selectedCategory && featuredTutorials.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">✨</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  精选推荐
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredTutorials.map((tutorial) => (
                  <TutorialCard key={tutorial.id} tutorial={tutorial} />
                ))}
              </div>
            </div>
          )}

          {/* 教程列表 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📖</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {searchTerm || selectedCategory ? '搜索结果' : '全部教程'}
                </h2>
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <span>{filteredTutorials.length}</span>
                  <span>篇教程</span>
                </div>
              </div>
              
              {/* 排序选项 */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-gray-500">排序：</span>
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">最新</button>
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">热门</button>
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">时长</button>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTutorials.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>

            {filteredTutorials.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  没有找到符合条件的教程
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  试试调整搜索关键词或选择不同的分类，也可以清除筛选条件查看所有教程
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    清除筛选
                  </button>
                  <button 
                    onClick={() => setSelectedCategory('ai')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    查看AI教程
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function TutorialsPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">正在加载教程页面...</p>
            </div>
          </div>
        </div>
      </Layout>
    }>
      <TutorialsContent />
    </Suspense>
  );
}