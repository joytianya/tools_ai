'use client';

import { useState, useEffect } from 'react';
import { STATS_CONFIG } from '@/lib/stats-config';
import { Settings, Plus, Trash2, Shield, Globe, User, Bot } from 'lucide-react';
import { Layout } from '@/components/Layout';

export default function StatsConfigPage() {
  const [adminIPs, setAdminIPs] = useState<string[]>(STATS_CONFIG.adminIPs);
  const [newIP, setNewIP] = useState('');
  const [excludedPaths, setExcludedPaths] = useState<string[]>(STATS_CONFIG.excludedPaths);
  const [newPath, setNewPath] = useState('');

  const addAdminIP = () => {
    if (newIP.trim() && !adminIPs.includes(newIP.trim())) {
      setAdminIPs([...adminIPs, newIP.trim()]);
      setNewIP('');
    }
  };

  const removeAdminIP = (ip: string) => {
    setAdminIPs(adminIPs.filter(item => item !== ip));
  };

  const addExcludedPath = () => {
    if (newPath.trim() && !excludedPaths.includes(newPath.trim())) {
      setExcludedPaths([...excludedPaths, newPath.trim()]);
      setNewPath('');
    }
  };

  const removeExcludedPath = (path: string) => {
    setExcludedPaths(excludedPaths.filter(item => item !== path));
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-blue-500" />
            统计配置管理
          </h1>
          <p className="text-gray-600 mt-2">配置统计系统的排除规则和管理员权限</p>
        </div>

        <div className="grid gap-6">
          {/* 管理员IP配置 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-green-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">管理员IP地址</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              这些IP地址的访问将不计入统计数据
            </p>

            <div className="space-y-3">
              {adminIPs.map((ip, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                  <span className="font-mono text-sm">{ip}</span>
                  <button
                    onClick={() => removeAdminIP(ip)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={newIP}
                  onChange={(e) => setNewIP(e.target.value)}
                  placeholder="输入IP地址，如 192.168.1.100"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addAdminIP}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加
                </button>
              </div>
            </div>
          </div>

          {/* 排除路径配置 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Globe className="w-5 h-5 text-purple-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">排除路径</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              这些路径的访问将不计入统计数据
            </p>

            <div className="space-y-3">
              {excludedPaths.map((path, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                  <span className="font-mono text-sm">{path}</span>
                  <button
                    onClick={() => removeExcludedPath(path)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  placeholder="输入路径，如 /admin/"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addExcludedPath}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加
                </button>
              </div>
            </div>
          </div>

          {/* 当前排除规则概览 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Bot className="w-5 h-5 text-orange-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">当前排除规则</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">排除的用户代理</h3>
                <div className="space-y-1">
                  {STATS_CONFIG.excludedUserAgents.map((agent, index) => (
                    <span key={index} className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs mr-2 mb-1">
                      {agent}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">排除的引用来源</h3>
                <div className="space-y-1">
                  {STATS_CONFIG.excludedReferrers.map((referrer, index) => (
                    <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2 mb-1">
                      {referrer}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 保存按钮 */}
          <div className="flex justify-end">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>注意：</strong> 当前配置仅在此会话中生效。要永久保存配置，请修改
                <code className="bg-yellow-100 px-1 rounded mx-1">src/lib/stats-config.ts</code> 文件。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}