export const SITE_CONFIG = {
  name: 'MatrixTools',
  title: 'MatrixTools - 发现最好用的工具和教程',
  description: '为新手提供最实用的工具推荐和详细教程，快速提升工作效率',
  url: 'https://matrixtools.me',
  ogImage: '/og-image.jpg',
  creator: 'MatrixTools Team',
};

export const CATEGORIES = [
  {
    id: 'development',
    name: '开发工具',
    description: '编程开发相关的实用工具',
    icon: '💻',
    slug: 'development',
  },
  {
    id: 'design',
    name: '设计工具',
    description: '设计和创意相关的工具',
    icon: '🎨',
    slug: 'design',
  },
  {
    id: 'productivity',
    name: '效率工具',
    description: '提升工作效率的实用工具',
    icon: '⚡',
    slug: 'productivity',
  },
  {
    id: 'marketing',
    name: '营销工具',
    description: '数字营销和推广工具',
    icon: '📈',
    slug: 'marketing',
  },
  {
    id: 'ai',
    name: 'AI工具',
    description: '人工智能相关工具',
    icon: '🤖',
    slug: 'ai',
  },
  {
    id: 'analytics',
    name: '数据分析',
    description: '数据分析和统计工具',
    icon: '📊',
    slug: 'analytics',
  },
] as const;

// 扩展的导航结构，支持下拉菜单
export const NAVIGATION = [
  { name: '首页', href: '/' },
  { 
    name: '工具分享', 
    href: '/tools',
    dropdowns: [
      { name: '💻 开发工具', href: '/tools?category=development' },
      { name: '🎨 设计工具', href: '/tools?category=design' },
      { name: '⚡ 效率工具', href: '/tools?category=productivity' },
      { name: '📈 营销工具', href: '/tools?category=marketing' },
      { name: '🤖 AI工具', href: '/tools?category=ai' },
      { name: '📊 数据分析', href: '/tools?category=analytics' },
    ]
  },
  { 
    name: '教程中心', 
    href: '/tutorials',
    dropdowns: [
      { name: '🔰 新手教程', href: '/tutorials?filter=beginner' },
      { name: '📈 进阶教程', href: '/tutorials?filter=advanced' },
      { name: '💰 AdSense教程', href: '/tutorials?category=marketing' },
      { name: '💻 开发教程', href: '/tutorials?category=development' },
      { name: '🎨 设计教程', href: '/tutorials?category=design' },
    ]
  },
  { name: '关于我们', href: '/about' },
] as const;

// 新增热门搜索词
export const POPULAR_SEARCHES = [
  'ChatGPT提示词',
  'AI绘画工具',
  'Google AdSense',
  'VS Code插件',
  'Docker部署',
  'Figma设计',
  'Excel数据分析',
  'Notion知识管理',
  'GitHub开源',
  '社交媒体营销',
  'API测试',
  '远程工作工具',
] as const;