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
    id: '开发工具',
    name: '开发工具',
    description: '代码编辑器、IDE、DevOps、API工具等开发必备工具',
    icon: '💻',
    slug: 'development',
    color: '#3B82F6'
  },
  {
    id: 'AI工具',
    name: 'AI工具',
    description: 'AI助手、机器学习平台、AI生成器等智能工具',
    icon: '🤖',
    slug: 'ai',
    color: '#8B5CF6'
  },
  {
    id: '设计工具',
    name: '设计工具',
    description: 'UI/UX设计、图像编辑、创意设计等工具',
    icon: '🎨',
    slug: 'design',
    color: '#EC4899'
  },
  {
    id: '效率工具',
    name: '效率工具',
    description: '任务管理、笔记工具、团队协作等效率提升工具',
    icon: '⚡',
    slug: 'productivity',
    color: '#10B981'
  },
  {
    id: '营销工具',
    name: '营销工具',
    description: '社交媒体、邮件营销、SEO分析等营销工具',
    icon: '📈',
    slug: 'marketing',
    color: '#F59E0B'
  },
  {
    id: '数据分析',
    name: '数据分析',
    description: 'BI工具、数据可视化、报告分析等数据工具',
    icon: '📊',
    slug: 'analytics',
    color: '#06B6D4'
  },
  {
    id: '媒体内容',
    name: '媒体内容',
    description: '素材库、视频编辑、内容创作等媒体工具',
    icon: '🎬',
    slug: 'media',
    color: '#8B5CF6'
  },
  {
    id: '商业财务',
    name: '商业财务',
    description: 'CRM、会计软件、电商工具等商业管理工具',
    icon: '💼',
    slug: 'business',
    color: '#059669'
  },
  {
    id: '安全隐私',
    name: '安全隐私',
    description: '密码管理、VPN、安全工具等隐私保护工具',
    icon: '🔒',
    slug: 'security',
    color: '#DC2626'
  },
  {
    id: '系统工具',
    name: '系统工具',
    description: '文件管理、系统优化等实用系统工具',
    icon: '🛠️',
    slug: 'utilities',
    color: '#6B7280'
  },
] as const;

// 教程分类定义
export const TUTORIAL_CATEGORIES = [
  {
    id: '新手入门',
    name: '新手入门',
    description: '零基础入门指南、基础概念讲解',
    icon: '🌱',
    slug: 'getting-started',
    color: '#10B981'
  },
  {
    id: '网页开发',
    name: '网页开发',
    description: '前端、后端、全栈开发技术教程',
    icon: '💻',
    slug: 'web-development',
    color: '#3B82F6'
  },
  {
    id: 'AI自动化',
    name: 'AI自动化',
    description: 'AI工具使用、自动化工作流程',
    icon: '🤖',
    slug: 'ai-automation',
    color: '#8B5CF6'
  },
  {
    id: '设计体验',
    name: '设计体验',
    description: '视觉设计、用户体验设计教程',
    icon: '🎨',
    slug: 'design-ux',
    color: '#EC4899'
  },
  {
    id: '商业增长',
    name: '商业增长',
    description: '营销策略、SEO优化、变现方法',
    icon: '📈',
    slug: 'business-growth',
    color: '#F59E0B'
  },
  {
    id: '数据洞察',
    name: '数据洞察',
    description: '数据分析、报告制作、数据可视化',
    icon: '📊',
    slug: 'data-insights',
    color: '#06B6D4'
  },
  {
    id: '效率精通',
    name: '效率精通',
    description: '高级工作流程、效率优化技巧',
    icon: '⚡',
    slug: 'productivity-mastery',
    color: '#10B981'
  },
  {
    id: '职业发展',
    name: '职业发展',
    description: '职业技能、自由职业、职场发展',
    icon: '🚀',
    slug: 'career-development',
    color: '#8B5CF6'
  },
  {
    id: '项目实战',
    name: '项目实战',
    description: '端到端项目教程、实际案例分析',
    icon: '🎯',
    slug: 'project-showcase',
    color: '#059669'
  },
] as const;

// 扩展的导航结构，支持下拉菜单
export const NAVIGATION = [
  { name: '首页', href: '/' },
  { 
    name: '工具分享', 
    href: '/tools',
    dropdowns: [
      { name: '💻 开发工具', href: '/tools?category=开发工具' },
      { name: '🤖 AI工具', href: '/tools?category=AI工具' },
      { name: '🎨 设计工具', href: '/tools?category=设计工具' },
      { name: '⚡ 效率工具', href: '/tools?category=效率工具' },
      { name: '📈 营销工具', href: '/tools?category=营销工具' },
      { name: '📊 数据分析', href: '/tools?category=数据分析' },
      { name: '🎬 媒体内容', href: '/tools?category=媒体内容' },
      { name: '🛠️ 系统工具', href: '/tools?category=系统工具' },
    ]
  },
  { 
    name: '教程中心', 
    href: '/tutorials',
    dropdowns: [
      { name: '🌱 新手入门', href: '/tutorials?category=新手入门' },
      { name: '💻 网页开发', href: '/tutorials?category=网页开发' },
      { name: '🤖 AI自动化', href: '/tutorials?category=AI自动化' },
      { name: '🎨 设计体验', href: '/tutorials?category=设计体验' },
      { name: '📈 商业增长', href: '/tutorials?category=商业增长' },
      { name: '📊 数据洞察', href: '/tutorials?category=数据洞察' },
      { name: '⚡ 效率精通', href: '/tutorials?category=效率精通' },
      { name: '🚀 职业发展', href: '/tutorials?category=职业发展' },
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