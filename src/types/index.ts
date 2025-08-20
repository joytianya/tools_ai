// 工具分类类型
export type ToolCategory = 'ai' | 'development' | 'design' | 'productivity' | 'tools' | 'marketing' | 'analytics';

// 教程分类类型
export type TutorialCategory = 'beginner' | 'intermediate' | 'advanced' | 'development' | 'ai' | 'tools' | 'general' | 'marketing' | 'design' | 'productivity' | 'analytics';

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