'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/Layout';
import { ToolCard } from '@/components/ToolCard';
import { ToolFilter } from '@/components/ToolFilter';
import { Pagination } from '@/components/Pagination';
import { tools } from '@/data/tools';

function ToolsContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 每页显示12个工具

  // 从URL参数中获取初始值
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // 分类筛选
      if (selectedCategory && tool.category !== selectedCategory) {
        return false;
      }

      // 价格筛选
      if (priceFilter !== null && tool.isFree !== priceFilter) {
        return false;
      }

      // 标签筛选
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some(tag => 
          tool.tags.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }

      // 搜索筛选
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesTitle = tool.title.toLowerCase().includes(searchLower);
        const matchesDescription = tool.description.toLowerCase().includes(searchLower);
        const matchesTags = tool.tags.some(tag => 
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
  }, [selectedCategory, selectedTags, priceFilter, searchTerm]);

  // 分页数据计算
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTools = filteredTools.slice(startIndex, endIndex);

  // 当筛选条件变化时重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTags, priceFilter, searchTerm]);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              🛠️ 工具分享
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              发现最实用的工具，提升你的工作效率
            </p>
          </div>

          {/* 搜索栏 */}
          <div className="max-w-md mx-auto mb-8 px-2">
            <input
              type="text"
              placeholder="搜索工具..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-3 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none placeholder:text-gray-500 placeholder:font-medium shadow-sm hover:border-gray-400 transition-colors search-input"
              style={{ color: '#000000 !important', backgroundColor: '#ffffff !important' }}
            />
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-8">
            {/* 工具列表 - 移动端优先 */}
            <div className="lg:col-span-3 lg:order-2 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  找到 {filteredTools.length} 个工具
                  {totalPages > 1 && (
                    <span className="text-sm font-normal text-gray-500 ml-2 hidden sm:inline">
                      （第 {currentPage} / {totalPages} 页）
                    </span>
                  )}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {currentTools.map((tool) => (
                  <div key={tool.id} className="w-full">
                    <ToolCard tool={tool} />
                  </div>
                ))}
              </div>
              
              {/* 分页组件 */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="mt-8"
                />
              )}

              {filteredTools.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    没有找到符合条件的工具
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    试试调整筛选条件或搜索关键词
                  </p>
                </div>
              )}
            </div>

            {/* 筛选侧边栏 - 移动端在下方 */}
            <div className="lg:col-span-1 lg:order-1">
              <ToolFilter
                selectedCategory={selectedCategory}
                selectedTags={selectedTags}
                onCategoryChange={setSelectedCategory}
                onTagChange={setSelectedTags}
                onPriceFilter={setPriceFilter}
                priceFilter={priceFilter}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">正在加载工具页面...</p>
            </div>
          </div>
        </div>
      </Layout>
    }>
      <ToolsContent />
    </Suspense>
  );
}