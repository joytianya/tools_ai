'use client';

import { useState } from 'react';
import { Clock, Trophy, Target, BookOpen } from 'lucide-react';

interface LearningProgressProps {
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  className?: string;
}

export function LearningProgress({ 
  estimatedTime, 
  difficulty, 
  skills, 
  className = "" 
}: LearningProgressProps) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  const difficultyConfig = {
    beginner: { 
      color: 'text-green-600 bg-green-100', 
      label: '新手入门',
      icon: '🟢'
    },
    intermediate: { 
      color: 'text-yellow-600 bg-yellow-100', 
      label: '进阶提升',
      icon: '🟡'
    },
    advanced: { 
      color: 'text-red-600 bg-red-100', 
      label: '高级挑战',
      icon: '🔴'
    }
  };

  const config = difficultyConfig[difficulty];
  const progress = Math.min((timeSpent / estimatedTime) * 100, 100);

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 预计学习时间 */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">预计学习时间</div>
            <div className="text-lg font-semibold text-gray-900">{estimatedTime} 分钟</div>
          </div>
        </div>

        {/* 难度等级 */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">难度等级</div>
            <div className={`text-sm font-medium px-2 py-1 rounded-full ${config.color}`}>
              {config.icon} {config.label}
            </div>
          </div>
        </div>

        {/* 技能点数 */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">学习技能</div>
            <div className="text-lg font-semibold text-gray-900">{skills.length} 项技能</div>
          </div>
        </div>
      </div>

      {/* 技能标签 */}
      <div className="mt-4">
        <div className="text-sm text-gray-600 mb-2 flex items-center">
          <BookOpen className="w-4 h-4 mr-1" />
          你将学到的技能:
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 学习进度跟踪 */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">学习进度跟踪</span>
          <span className="text-xs text-indigo-600">{Math.round(progress)}% 完成</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            已学习 {timeSpent} 分钟 / 预计 {estimatedTime} 分钟
          </span>
          <button
            onClick={() => {
              if (isTracking) {
                setIsTracking(false);
              } else {
                setIsTracking(true);
                const interval = setInterval(() => {
                  setTimeSpent(prev => {
                    const newTime = prev + 1;
                    if (newTime >= estimatedTime) {
                      setIsTracking(false);
                      clearInterval(interval);
                    }
                    return newTime;
                  });
                }, 60000); // 每分钟更新一次
              }
            }}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              isTracking 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
            }`}
          >
            {isTracking ? '⏹️ 停止计时' : '▶️ 开始学习'}
          </button>
        </div>
      </div>
    </div>
  );
}