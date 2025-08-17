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
  const [filterType, setFilterType] = useState('');

  // 从URL参数中获取初始值
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const filterParam = searchParams.get('filter');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (filterParam) {
      setFilterType(filterParam);
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
    });
  }, [selectedCategory, searchTerm]);

  const featuredTutorials = tutorials.filter(t => t.featured);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📚 教程中心
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              从零开始学习各种工具的使用技巧和最佳实践
            </p>
          </div>

          {/* 搜索和筛选 */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* 搜索框 */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="搜索教程..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500 placeholder:font-medium"
                />
              </div>
              
              {/* 分类筛选 */}
              <div className="md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="">所有分类</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 推荐教程 */}
          {!searchTerm && !selectedCategory && featuredTutorials.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🌟 推荐教程
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTutorials.map((tutorial) => (
                  <TutorialCard key={tutorial.id} tutorial={tutorial} />
                ))}
              </div>
            </div>
          )}

          {/* 教程列表 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {searchTerm || selectedCategory ? '搜索结果' : '所有教程'}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredTutorials.length} 篇)
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>

            {filteredTutorials.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  没有找到符合条件的教程
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  试试调整搜索关键词或分类筛选
                </p>
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