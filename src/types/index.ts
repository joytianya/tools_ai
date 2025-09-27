// 工具分类类型 - 重构后的中文分类系统
export type ToolCategory =
  | '开发工具'                 // development
  | 'AI工具'                  // ai-ml
  | '设计工具'                // design-creative
  | '效率工具'                // productivity-workspace
  | '营销工具'                // marketing-growth
  | '数据分析'                // data-analytics
  | '媒体内容'                // media-content
  | '商业财务'                // business-finance
  | '安全隐私'                // security-privacy
  | '系统工具'                // utilities-system
  | '网络工具';               // network-tools

// 教程分类类型 - 优化后的12分类系统
export type TutorialCategory =
  | '新手入门'                // getting-started - 基础教程、快速上手
  | '网页开发'                // web-development - 前端、后端、全栈技术
  | 'AI自动化'                // ai-automation - AI工具使用、自动化流程
  | '设计体验'                // design-ui-ux - UI/UX设计、视觉设计
  | '商业增长'                // business-growth - 创业、营销、商业策略
  | '数据洞察'                // data-insights - 数据分析、可视化、BI
  | '效率精通'                // productivity-mastery - 生产力工具、工作流程
  | '职业发展'                // career-development - 职场技能、求职面试
  | '个人成长'                // personal-growth - 心理、情感、人际关系
  | '学习方法'                // learning-methods - 学习技巧、知识管理
  | '生活技能'                // life-skills - 健康、健身、生活品质
  | '知识资源';               // knowledge-resources - 电子书、资料集、参考手册

// 难度级别
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// 工具接口（扩展版）
export interface Tool {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  subCategory?: string;
  tags: string[];
  url: string;
  imageUrl?: string;
  rating: number;
  isFree: boolean;
  featured: boolean;
  slug: string;
  detailedContent?: string;
  publishedAt?: string;
  updatedAt?: string;
  originalSource?: string;
  metadata?: {
    wordCount?: number;
    imageCount?: number;
    lastVerified?: string;
    qualityScore?: number;
  };
}

// 教程接口（扩展版）
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  content: string;
  category: TutorialCategory;
  subCategory?: string;
  tags: string[];
  author?: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  difficulty?: DifficultyLevel;
  featured: boolean;
  slug: string;
  prerequisite?: string[];
  relatedTools?: string[];
  metadata?: {
    wordCount?: number;
    viewCount?: number;
    completionRate?: number;
  };
}

// 分类接口（扩展版）
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  type: 'tool' | 'tutorial';
  color?: string;
  toolCount?: number;
  tutorialCount?: number;
}

// 搜索和筛选相关
export interface SearchFilters {
  category?: ToolCategory | TutorialCategory;
  tags?: string[];
  isFree?: boolean;
  featured?: boolean;
  difficulty?: DifficultyLevel;
  rating?: number;
}

export interface SearchResult {
  tools: Tool[];
  tutorials: Tutorial[];
  totalCount: number;
  filters: SearchFilters;
}

// 统计信息
export interface SiteStats {
  totalTools: number;
  totalTutorials: number;
  categoryCounts: Record<string, number>;
  featuredCount: number;
  freeToolsCount: number;
  lastUpdated: string;
}