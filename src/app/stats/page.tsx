'use client';

import { useState, useEffect } from 'react';
import { DailyStats, UserVisitDetails } from '@/lib/stats';
import { Clock, Users, Eye, Globe, Calendar, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/Layout';

export default function StatsPage() {
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
  const [recentStats, setRecentStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchStats = async () => {
    try {
      setLoading(true);

      // 获取今日统计
      const todayResponse = await fetch('/api/stats');
      const todayData = await todayResponse.json();
      setTodayStats(todayData);

      // 获取最近7天统计
      const recentResponse = await fetch('/api/stats?days=7');
      const recentData = await recentResponse.json();
      setRecentStats(recentData);

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // 每30秒自动刷新数据
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const getPageName = (url: string) => {
    if (url === '/') return '首页';
    if (url === '/tools') return '工具页';
    if (url === '/tutorials') return '教程页';
    if (url.startsWith('/tools/')) return `工具详情: ${url.split('/')[2]}`;
    if (url.startsWith('/tutorials/')) return `教程详情: ${url.split('/')[2]}`;
    return url;
  };

  if (loading && !todayStats) {
    return (
      <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-gray-600">加载统计数据中...</p>
        </div>
      </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Globe className="w-8 h-8 mr-3 text-blue-500" />
                网站访问统计
              </h1>
              <p className="text-gray-600 mt-2">实时监控网站访问数据和用户行为</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                最后更新: {lastUpdate.toLocaleTimeString('zh-CN')}
              </span>
              <button
                onClick={fetchStats}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                刷新
              </button>
            </div>
          </div>
        </div>

        {/* 今日概览 */}
        {todayStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">今日总访问量</p>
                  <p className="text-2xl font-bold text-gray-900">{todayStats.totalVisits}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">独立访客</p>
                  <p className="text-2xl font-bold text-gray-900">{todayStats.uniqueUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">平均访问页面</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.uniqueUsers > 0
                      ? (todayStats.totalVisits / todayStats.uniqueUsers).toFixed(1)
                      : '0'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 最近7天趋势 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近7天访问趋势</h2>
          <div className="grid grid-cols-7 gap-4">
            {recentStats.map((dayStats, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-2">{formatDate(dayStats.date)}</div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="text-lg font-bold text-gray-900">{dayStats.totalVisits}</div>
                  <div className="text-xs text-gray-600">{dayStats.uniqueUsers} 用户</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 用户访问详情 */}
        {todayStats && todayStats.userVisits.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">今日用户访问详情</h2>
              <p className="text-sm text-gray-600 mt-1">显示每个用户的访问记录和浏览页面</p>
            </div>

            <div className="overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        用户ID (IP)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        访问次数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        访问时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        访问页面
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {todayStats.userVisits
                      .sort((a, b) => b.visitCount - a.visitCount)
                      .map((user, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.userId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {user.visitCount} 次
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>首次: {formatTime(user.firstVisit)}</div>
                            <div>最新: {formatTime(user.lastVisit)}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {user.visitedPages.map((page, pageIndex) => (
                                <span
                                  key={pageIndex}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                                  title={page}
                                >
                                  {getPageName(page)}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 无数据状态 */}
        {todayStats && todayStats.totalVisits === 0 && (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无访问数据</h3>
            <p className="text-gray-600">今天还没有用户访问您的网站，请稍后再查看。</p>
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
}