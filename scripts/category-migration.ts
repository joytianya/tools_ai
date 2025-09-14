/**
 * Category Migration Script
 * 用于将旧的分类系统迁移到新的分类系统
 */

import { ToolCategory, TutorialCategory } from '@/types';

// 工具分类映射表
export const TOOL_CATEGORY_MIGRATION: Record<string, ToolCategory> = {
  // 旧分类 -> 新中文分类
  'development': '开发工具',
  'design': '设计工具',
  'productivity': '效率工具',
  'marketing': '营销工具',
  'ai': 'AI工具',
  'analytics': '数据分析',
  'utility': '系统工具'
};

// 教程分类映射表 - 基于内容分析智能映射
export const TUTORIAL_CATEGORY_MIGRATION: Record<string, TutorialCategory> = {
  // 旧分类 -> 新中文分类
  'marketing': '商业增长',
  'development': '网页开发',
  'design': '设计体验',
  'productivity': '效率精通',
  'ai': 'AI自动化',
  'analytics': '数据洞察'
};

// 特殊关键词映射 - 基于标题和内容进行智能分类
export const KEYWORD_BASED_MAPPING = {
  tools: {
    // AI工具关键词
    'AI工具': ['chatgpt', 'ai', '人工智能', 'machine learning', 'gpt', 'claude', 'midjourney', '机器学习'],
    // 开发工具关键词
    '开发工具': ['code', 'vscode', 'git', 'api', 'docker', '开发', '编程', 'ide'],
    // 设计工具关键词
    '设计工具': ['figma', 'photoshop', 'design', '设计', 'ui', 'ux', 'creative'],
    // 效率工具关键词
    '效率工具': ['notion', 'trello', 'slack', '效率', '办公', 'task', 'project'],
    // 营销工具关键词
    '营销工具': ['marketing', 'seo', 'analytics', '营销', '推广', 'social media'],
    // 数据分析关键词
    '数据分析': ['analytics', 'data', 'chart', '数据', '分析', 'visualization'],
    // 媒体内容关键词
    '媒体内容': ['stock', 'image', 'video', '图片', '视频', 'media'],
    // 系统工具关键词
    '系统工具': ['utility', 'system', 'file', '工具', '系统', 'converter']
  },
  tutorials: {
    // 新手入门关键词
    '新手入门': ['新手', '入门', 'beginner', '基础', '开始', '初学者'],
    // 网页开发关键词
    '网页开发': ['web', 'frontend', 'backend', '网页', '前端', '后端', 'javascript', 'react'],
    // AI自动化关键词
    'AI自动化': ['ai', 'automation', '自动化', 'chatgpt', '人工智能', 'prompt'],
    // 设计体验关键词
    '设计体验': ['design', 'ui', 'ux', '设计', '用户体验', 'figma'],
    // 商业增长关键词
    '商业增长': ['marketing', 'seo', 'adsense', '营销', '增长', '商业', '广告'],
    // 数据洞察关键词
    '数据洞察': ['analytics', 'data', '数据', '分析', '洞察', 'metrics'],
    // 效率精通关键词
    '效率精通': ['productivity', '效率', '优化', 'workflow', '工作流'],
    // 职业发展关键词
    '职业发展': ['career', '职业', '发展', 'freelance', '自由职业'],
    // 项目实战关键词
    '项目实战': ['project', '项目', '实战', 'case study', '案例']
  }
};

// 分类信息配置
export const CATEGORY_INFO = {
  tools: {
    '开发工具': {
      name: '开发工具',
      nameEn: 'Development',
      description: '代码编辑器、IDE、DevOps、API工具等开发必备工具',
      icon: '💻',
      color: '#3B82F6'
    },
    'AI工具': {
      name: 'AI工具',
      nameEn: 'AI & Machine Learning', 
      description: 'AI助手、机器学习平台、AI生成器等智能工具',
      icon: '🤖',
      color: '#8B5CF6'
    },
    '设计工具': {
      name: '设计工具',
      nameEn: 'Design & Creative',
      description: 'UI/UX设计、图像编辑、创意设计等工具',
      icon: '🎨',
      color: '#EC4899'
    },
    '效率工具': {
      name: '效率工具',
      nameEn: 'Productivity & Workspace',
      description: '任务管理、笔记工具、团队协作等效率提升工具',
      icon: '⚡',
      color: '#10B981'
    },
    '营销工具': {
      name: '营销工具',
      nameEn: 'Marketing & Growth',
      description: '社交媒体、邮件营销、SEO分析等营销工具',
      icon: '📈',
      color: '#F59E0B'
    },
    '数据分析': {
      name: '数据分析',
      nameEn: 'Data & Analytics',
      description: 'BI工具、数据可视化、报告分析等数据工具',
      icon: '📊',
      color: '#06B6D4'
    },
    '媒体内容': {
      name: '媒体内容',
      nameEn: 'Media & Content',
      description: '素材库、视频编辑、内容创作等媒体工具',
      icon: '🎬',
      color: '#8B5CF6'
    },
    '商业财务': {
      name: '商业财务',
      nameEn: 'Business & Finance',
      description: 'CRM、会计软件、电商工具等商业管理工具',
      icon: '💼',
      color: '#059669'
    },
    '安全隐私': {
      name: '安全隐私',
      nameEn: 'Security & Privacy',
      description: '密码管理、VPN、安全工具等隐私保护工具',
      icon: '🔒',
      color: '#DC2626'
    },
    '系统工具': {
      name: '系统工具',
      nameEn: 'Utilities & System',
      description: '文件管理、系统优化等实用系统工具',
      icon: '🛠️',
      color: '#6B7280'
    }
  },
  tutorials: {
    '新手入门': {
      name: '新手入门',
      nameEn: 'Getting Started',
      description: '零基础入门指南、基础概念讲解',
      icon: '🌱',
      color: '#10B981'
    },
    '网页开发': {
      name: '网页开发',
      nameEn: 'Web Development',
      description: '前端、后端、全栈开发技术教程',
      icon: '💻',
      color: '#3B82F6'
    },
    'AI自动化': {
      name: 'AI自动化',
      nameEn: 'AI & Automation',
      description: 'AI工具使用、自动化工作流程',
      icon: '🤖',
      color: '#8B5CF6'
    },
    '设计体验': {
      name: '设计体验',
      nameEn: 'Design & UI/UX',
      description: '视觉设计、用户体验设计教程',
      icon: '🎨',
      color: '#EC4899'
    },
    '商业增长': {
      name: '商业增长',
      nameEn: 'Business & Growth',
      description: '营销策略、SEO优化、变现方法',
      icon: '📈',
      color: '#F59E0B'
    },
    '数据洞察': {
      name: '数据洞察',
      nameEn: 'Data & Insights',
      description: '数据分析、报告制作、数据可视化',
      icon: '📊',
      color: '#06B6D4'
    },
    '效率精通': {
      name: '效率精通',
      nameEn: 'Productivity Mastery',
      description: '高级工作流程、效率优化技巧',
      icon: '⚡',
      color: '#10B981'
    },
    '职业发展': {
      name: '职业发展',
      nameEn: 'Career Development',
      description: '职业技能、自由职业、职场发展',
      icon: '🚀',
      color: '#8B5CF6'
    },
    '项目实战': {
      name: '项目实战',
      nameEn: 'Project Showcase',
      description: '端到端项目教程、实际案例分析',
      icon: '🎯',
      color: '#059669'
    }
  }
};

/**
 * 智能分类映射函数
 * 基于标题、描述和标签进行智能分类
 */
export function intelligentCategoryMapping(
  title: string,
  description: string,
  tags: string[],
  type: 'tools' | 'tutorials'
): ToolCategory | TutorialCategory {
  const content = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
  const keywordMap = KEYWORD_BASED_MAPPING[type];
  
  // 计算每个分类的匹配得分
  const scores: Record<string, number> = {};
  
  Object.entries(keywordMap).forEach(([category, keywords]) => {
    scores[category] = 0;
    keywords.forEach(keyword => {
      if (content.includes(keyword.toLowerCase())) {
        scores[category] += 1;
      }
    });
  });
  
  // 返回得分最高的分类
  const bestCategory = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];
  
  return bestCategory as ToolCategory | TutorialCategory;
}

/**
 * 获取分类的显示信息
 */
export function getCategoryInfo(category: string, type: 'tools' | 'tutorials') {
  return CATEGORY_INFO[type][category as keyof typeof CATEGORY_INFO[typeof type]];
}