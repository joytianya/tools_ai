export interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  url: string;
  imageUrl?: string;
  rating?: number;
  isFree: boolean;
  featured?: boolean;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  readTime: number;
  featured?: boolean;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
}