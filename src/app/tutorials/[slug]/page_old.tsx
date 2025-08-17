import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Calendar, Tag, CheckCircle, ExternalLink } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { tutorials } from '@/data/tutorials';
import { formatDate } from '@/lib/utils';

// 为不同教程定义不同的图片和资源
const getTutorialImages = (slug: string) => {
  const imageMap: { [key: string]: { main: string; step1: string; step2: string; step3?: string; extra1?: string; extra2?: string } } = {
    'google-adsense-guide-for-beginners': {
      main: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=400&fit=crop&auto=format', // 网站分析数据
      step1: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&auto=format', // 网站建设
      step2: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop&auto=format', // 数据分析
      step3: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=300&fit=crop&auto=format', // 收入统计
      extra1: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop&auto=format', // 移动端广告
      extra2: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=300&fit=crop&auto=format' // 网站优化
    },
    'vscode-essential-extensions-2024': {
      main: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&auto=format', // 代码编辑器
      step1: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600&h=300&fit=crop&auto=format', // 编程工作环境
      step2: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=600&h=300&fit=crop&auto=format', // 代码调试
      step3: 'https://images.unsplash.com/photo-1607706189992-eae578626c86?w=600&h=300&fit=crop&auto=format', // 编程团队协作
      extra1: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=300&fit=crop&auto=format', // 程序员工作
      extra2: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&h=300&fit=crop&auto=format' // 多屏幕开发
    },
    'figma-beginner-complete-guide': {
      main: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=400&fit=crop&auto=format', // UI设计界面
      step1: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=300&fit=crop&auto=format', // 设计工具
      step2: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=300&fit=crop&auto=format', // 用户界面设计
      step3: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=300&fit=crop&auto=format', // 原型设计
      extra1: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=300&fit=crop&auto=format', // 移动端设计
      extra2: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&h=300&fit=crop&auto=format' // 设计团队协作
    },
    'notion-knowledge-management-system': {
      main: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop&auto=format', // 知识管理
      step1: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=300&fit=crop&auto=format', // 笔记整理
      step2: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=300&fit=crop&auto=format', // 任务管理
      step3: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=600&h=300&fit=crop&auto=format', // 文档协作
      extra1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop&auto=format', // 学习思考
      extra2: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop&auto=format' // 团队协作
    },
    'github-beginner-to-contributor': {
      main: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop&auto=format', // GitHub界面
      step1: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=300&fit=crop&auto=format', // Git版本控制
      step2: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&h=300&fit=crop&auto=format', // 代码协作
      step3: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=300&fit=crop&auto=format', // 开源项目
      extra1: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=300&fit=crop&auto=format', // 程序员团队
      extra2: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=300&fit=crop&auto=format' // 代码审查
    },
    'canva-poster-design-tutorial': {
      main: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&h=400&fit=crop&auto=format', // 平面设计
      step1: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&h=300&fit=crop&auto=format', // 设计工具
      step2: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=300&fit=crop&auto=format', // 创意设计
      step3: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=600&h=300&fit=crop&auto=format', // 海报设计
      extra1: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=300&fit=crop&auto=format', // 品牌设计
      extra2: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=600&h=300&fit=crop&auto=format' // 视觉设计
    },
    'trello-project-management-best-practices': {
      main: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop&auto=format', // 项目管理
      step1: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop&auto=format', // 团队协作
      step2: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=600&h=300&fit=crop&auto=format', // 任务规划
      step3: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop&auto=format', // 工作流程
      extra1: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop&auto=format', // 数据分析
      extra2: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=300&fit=crop&auto=format' // 进度跟踪
    },
    'google-analytics-beginner-tutorial': {
      main: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&auto=format', // 数据分析
      step1: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&h=300&fit=crop&auto=format', // 网站分析
      step2: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop&auto=format', // 流量分析
      step3: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=300&fit=crop&auto=format', // 报表统计
      extra1: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&auto=format', // 数据可视化
      extra2: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop&auto=format' // 移动端分析
    },
    'slack-team-collaboration-guide': {
      main: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&auto=format', // 团队协作
      step1: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=300&fit=crop&auto=format', // 团队沟通
      step2: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=600&h=300&fit=crop&auto=format', // 远程工作
      step3: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=300&fit=crop&auto=format', // 在线协作
      extra1: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=300&fit=crop&auto=format', // 工作效率
      extra2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop&auto=format' // 团队管理
    },
    'postman-api-testing-complete-tutorial': {
      main: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=400&fit=crop&auto=format', // API开发
      step1: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=600&h=300&fit=crop&auto=format', // 接口测试
      step2: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop&auto=format', // 代码调试
      step3: 'https://images.unsplash.com/photo-1607706189992-eae578626c86?w=600&h=300&fit=crop&auto=format', // 软件测试
      extra1: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=300&fit=crop&auto=format', // 开发工具
      extra2: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&h=300&fit=crop&auto=format' // 后端开发
    }
  };
  
  return imageMap[slug] || {
    main: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&auto=format',
    step1: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600&h=300&fit=crop&auto=format',
    step2: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=600&h=300&fit=crop&auto=format'
  };
};

// 为不同教程定义详细内容
const getDetailedContent = (slug: string) => {
  const contentMap: { [key: string]: { requirements: string[]; steps: Array<{ title: string; content: string; tips: string[] }> } } = {
    'google-adsense-guide-for-beginners': {
      requirements: [
        '年龄必须满18周岁',
        '拥有高质量、原创的网站内容',
        '网站至少有15-20个页面',
        '符合Google AdSense政策规范',
        '拥有Google账号',
        '网站有稳定的访问量'
      ],
      steps: [
        {
          title: '网站准备阶段',
          content: '确保网站内容质量高、原创性强，至少有15-20页内容。网站导航清晰，用户体验良好。添加隐私政策、使用条款等必要页面。',
          tips: [
            '内容要原创，避免抄袭',
            '确保网站加载速度快',
            '添加网站地图(sitemap)',
            '设置合适的网站结构'
          ]
        },
        {
          title: '申请流程详解',
          content: '访问Google AdSense官网，点击"立即开始"。输入网站URL和所在国家/地区，选择付款货币。验证手机号码并完成账户设置。',
          tips: [
            '确保网站URL正确无误',
            '选择正确的国家/地区',
            '手机号码用于验证',
            '保持信息真实准确'
          ]
        },
        {
          title: '代码部署与审核',
          content: '将AdSense代码添加到网站<head>标签中。Google会审核你的网站，通常需要7-14天。审核期间保持网站正常运营，持续更新内容。',
          tips: [
            '正确放置AdSense代码',
            '审核期间不要修改网站结构',
            '保持内容更新频率',
            '确保网站始终可访问'
          ]
        }
      ]
    },
    'vscode-essential-extensions-2024': {
      requirements: [
        '安装最新版VS Code',
        '基本的编程知识',
        '了解扩展安装方法',
        '根据开发语言选择对应扩展'
      ],
      steps: [
        {
          title: '必装基础扩展',
          content: '安装这些提升开发效率的核心扩展：ESLint、Prettier、GitLens、Auto Rename Tag、Bracket Pair Colorizer等。',
          tips: [
            'ESLint: 代码质量检查',
            'Prettier: 代码格式化',
            'GitLens: Git增强工具',
            'Auto Rename Tag: 自动重命名标签'
          ]
        },
        {
          title: '前端开发专用扩展',
          content: '针对前端开发的特殊扩展：Live Server、Debugger for Chrome、JavaScript (ES6) code snippets、HTML CSS Support等。',
          tips: [
            'Live Server: 本地开发服务器',
            'Chrome调试器集成',
            'ES6代码片段快速插入',
            'CSS智能提示增强'
          ]
        },
        {
          title: '效率提升工具',
          content: '安装提升编码效率的扩展：Tabnine AI、GitHub Copilot、CodeRunner、REST Client、Thunder Client等。',
          tips: [
            'AI代码补全助手',
            '一键运行代码',
            'API测试工具',
            '智能代码建议'
          ]
        }
      ]
    },
    'figma-beginner-complete-guide': {
      requirements: [
        '注册Figma账号',
        '了解基本设计概念',
        '具备审美基础',
        '熟悉电脑操作'
      ],
      steps: [
        {
          title: 'Figma界面熟悉',
          content: '了解Figma的工作界面：左侧图层面板、中间画布区域、右侧属性面板。掌握基本工具的位置和功能。',
          tips: [
            '熟悉工具栏位置',
            '学会图层管理',
            '掌握属性面板使用',
            '了解组件系统'
          ]
        },
        {
          title: '基础设计操作',
          content: '学习创建形状、文本、图片等基础元素。掌握对齐、分布、群组等基本操作。了解颜色、字体、效果的设置方法。',
          tips: [
            '练习形状工具使用',
            '掌握文本编辑技巧',
            '学会图层组织',
            '熟练使用快捷键'
          ]
        },
        {
          title: '进阶功能应用',
          content: '学习组件创建、变体使用、自动布局、约束设置等高级功能。掌握原型制作和交互设计基础。',
          tips: [
            '创建可复用组件',
            '使用自动布局',
            '设置合理约束',
            '制作交互原型'
          ]
        }
      ]
    }
  };
  
  return contentMap[slug] || null;
};

// 为不同教程定义相关资源
const getTutorialResources = (slug: string) => {
  const resourceMap: { [key: string]: { official: Array<{name: string; url: string}>; community: Array<{name: string; url: string}> } } = {
    'google-adsense-guide-for-beginners': {
      official: [
        { name: 'Google AdSense 官方帮助', url: 'https://support.google.com/adsense/' },
        { name: 'AdSense 政策中心', url: 'https://support.google.com/adsense/answer/48182' },
        { name: 'AdSense 注册页面', url: 'https://www.google.com/adsense/start/' }
      ],
      community: [
        { name: 'AdSense 中文社区', url: 'https://support.google.com/adsense/community' },
        { name: 'YouTube 创作者学院', url: 'https://creatoracademy.youtube.com/' }
      ]
    },
    'vscode-essential-extensions-2024': {
      official: [
        { name: 'VS Code 官方文档', url: 'https://code.visualstudio.com/docs' },
        { name: 'VS Code 扩展市场', url: 'https://marketplace.visualstudio.com/vscode' },
        { name: 'VS Code 快捷键大全', url: 'https://code.visualstudio.com/docs/getstarted/keybindings' }
      ],
      community: [
        { name: 'VS Code GitHub', url: 'https://github.com/microsoft/vscode' },
        { name: 'VS Code 技巧集合', url: 'https://github.com/Microsoft/vscode-tips-and-tricks' }
      ]
    },
    'figma-beginner-complete-guide': {
      official: [
        { name: 'Figma 官方帮助中心', url: 'https://help.figma.com/' },
        { name: 'Figma 学院', url: 'https://www.figma.com/academy/' },
        { name: 'Figma 官网', url: 'https://www.figma.com/' }
      ],
      community: [
        { name: 'Figma 社区', url: 'https://www.figma.com/community' },
        { name: 'Figma 中文网', url: 'https://www.figmasoft.cn/' }
      ]
    }
  };
  
  return resourceMap[slug] || { official: [], community: [] };
};

interface TutorialPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const resolvedParams = await params;
  const tutorial = tutorials.find(t => t.slug === resolvedParams.slug);

  if (!tutorial) {
    notFound();
  }

  const images = getTutorialImages(resolvedParams.slug);
  const resources = getTutorialResources(resolvedParams.slug);
  const detailedContent = getDetailedContent(resolvedParams.slug);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* 返回按钮 */}
          <div className="mb-6">
            <Link
              href="/tutorials"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回教程列表</span>
            </Link>
          </div>

          {/* 文章头部 */}
          <article className="bg-white rounded-lg shadow-sm p-8">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {tutorial.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{tutorial.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(tutorial.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{tutorial.readTime} 分钟阅读</span>
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2">
                {tutorial.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </header>

            {/* 文章内容 */}
            <div className="tutorial-content-wrapper">
              <div className="tutorial-content">
                {/* 教程概述 */}
                <div className="intro-section bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-3xl mr-3">📖</span>
                    教程概述
                  </h2>
                  <div className="mb-6">
                    <img 
                      src={images.main}
                      alt={`${tutorial.title} 教程概述`} 
                      className="w-full h-48 object-cover rounded-lg shadow-sm" 
                    />
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    本教程将详细介绍{tutorial.title}的相关内容，适合{tutorial.tags.includes('新手教程') ? '完全没有经验的新手' : '有一定基础的用户'}学习。
                    {tutorial.description}
                  </p>
                </div>

                {/* 学习目标 */}
                <div className="objectives-section mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="text-3xl mr-3">🎯</span>
                    学习目标
                  </h2>
                  <div className="bg-white border-l-4 border-green-500 p-6 rounded-r-lg shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <CheckCircle className="flex-shrink-0 w-6 h-6 text-green-600 mr-3 mt-0.5" />
                        <span className="text-gray-700">了解基本概念和核心原理</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="flex-shrink-0 w-6 h-6 text-green-600 mr-3 mt-0.5" />
                        <span className="text-gray-700">掌握实际操作技巧和最佳实践</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="flex-shrink-0 w-6 h-6 text-green-600 mr-3 mt-0.5" />
                        <span className="text-gray-700">避免常见问题和误区</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="flex-shrink-0 w-6 h-6 text-green-600 mr-3 mt-0.5" />
                        <span className="text-gray-700">获得进阶使用建议</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 详细内容 */}
                <div className="content-section mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="text-3xl mr-3">📝</span>
                    详细内容
                  </h2>

                  <div className="space-y-8">
                    {/* 基础知识 */}
                    <div className="section-card bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                        基础知识
                      </h3>
                      <div className="mb-4">
                        <img 
                          src={images.step1}
                          alt="学习基础知识" 
                          className="w-full h-32 object-cover rounded-lg shadow-sm" 
                        />
                      </div>
                      <div className="text-gray-700 space-y-4">
                        <p>在开始实际操作之前，我们需要了解一些基础概念。{tutorial.description}</p>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-2">为什么这个工具很重要？</h4>
                          <ul className="space-y-2 text-blue-800">
                            <li className="flex items-start">
                              <span className="text-blue-500 mr-2">▶</span>
                              <span><strong>效率提升</strong>：能够显著提高工作效率</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-blue-500 mr-2">▶</span>
                              <span><strong>专业必备</strong>：是该领域的必备技能</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-blue-500 mr-2">▶</span>
                              <span><strong>趋势所向</strong>：符合当前行业发展趋势</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 准备工作 */}
                    <div className="section-card bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                        准备工作
                      </h3>
                      <div className="text-gray-700">
                        <p className="mb-4">在开始之前，请确保你已经完成以下准备：</p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="space-y-3">
                            {detailedContent?.requirements ? (
                              detailedContent.requirements.map((requirement: string, index: number) => (
                                <label key={index} className="flex items-center">
                                  <input type="checkbox" className="mr-3 h-4 w-4 text-green-600" />
                                  <span>{requirement}</span>
                                </label>
                              ))
                            ) : (
                              <>
                                <label className="flex items-center">
                                  <input type="checkbox" className="mr-3 h-4 w-4 text-green-600" />
                                  <span>准备好必要的设备和环境</span>
                                </label>
                                <label className="flex items-center">
                                  <input type="checkbox" className="mr-3 h-4 w-4 text-green-600" />
                                  <span>下载安装相关软件</span>
                                </label>
                                <label className="flex items-center">
                                  <input type="checkbox" className="mr-3 h-4 w-4 text-green-600" />
                                  <span>注册必要的账户</span>
                                </label>
                                <label className="flex items-center">
                                  <input type="checkbox" className="mr-3 h-4 w-4 text-green-600" />
                                  <span>准备好学习时间（预计{tutorial.readTime}分钟）</span>
                                </label>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 详细步骤 */}
                    <div className="section-card bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                        详细步骤
                      </h3>
                      <div className="mb-4">
                        <img 
                          src={images.step2}
                          alt="详细操作步骤" 
                          className="w-full h-32 object-cover rounded-lg shadow-sm" 
                        />
                      </div>
                      <div className="text-gray-700 space-y-8">
                        {detailedContent?.steps ? (
                          detailedContent.steps.map((step, index: number) => (
                            <div key={index} className="step-item border-l-4 border-purple-200 pl-6">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">{index + 1}</span>
                                {step.title}
                              </h4>
                              {index === 2 && images.step3 && (
                                <div className="mb-4">
                                  <img 
                                    src={images.step3}
                                    alt={`步骤${index + 1}: ${step.title}`}
                                    className="w-full h-32 object-cover rounded-lg shadow-sm" 
                                  />
                                </div>
                              )}
                              <p className="text-gray-600 mb-4 leading-relaxed">{step.content}</p>
                              {step.tips && step.tips.length > 0 && (
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                  <h5 className="font-medium text-purple-900 mb-2">💡 关键要点：</h5>
                                  <ul className="space-y-1">
                                    {step.tips.map((tip: string, tipIndex: number) => (
                                      <li key={tipIndex} className="text-purple-800 text-sm flex items-start">
                                        <span className="text-purple-500 mr-2 mt-0.5">•</span>
                                        <span>{tip}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="step-item">
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
                                初始设置
                              </h4>
                              <p className="ml-8 text-gray-600">首先需要进行基本的设置和配置，确保所有环境都已正确安装。这一步是后续操作的基础，请仔细按照说明执行。</p>
                            </div>
                            
                            <div className="step-item">
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">2</span>
                                核心操作
                              </h4>
                              <p className="ml-8 text-gray-600">这是最重要的部分，需要仔细按照步骤执行。我们将逐步演示每个关键操作，并解释其作用和注意事项。</p>
                            </div>
                            
                            <div className="step-item">
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">3</span>
                                优化调整
                              </h4>
                              <p className="ml-8 text-gray-600">完成基本操作后，我们可以进行一些优化和个性化设置，让工具更好地适应你的使用习惯。</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 常见问题 */}
                <div className="faq-section mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="text-3xl mr-3">❓</span>
                    常见问题
                  </h2>
                  {images.extra1 && (
                    <div className="mb-6">
                      <img 
                        src={images.extra1}
                        alt="常见问题解答" 
                        className="w-full h-40 object-cover rounded-lg shadow-sm" 
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900 mb-2">Q: 如何解决常见错误？</h4>
                      <p className="text-yellow-800">首先检查配置是否正确，然后查看错误日志确定具体问题。大多数问题都是由于配置不当或版本不匹配造成的。</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900 mb-2">Q: 性能如何优化？</h4>
                      <p className="text-yellow-800">可以通过调整配置参数、清理缓存、升级硬件配置等方式提升性能。具体方法要根据实际使用情况来定。</p>
                    </div>
                  </div>
                </div>

                {/* 相关资源 */}
                {(resources.official.length > 0 || resources.community.length > 0) && (
                  <div className="resources-section mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-3xl mr-3">📚</span>
                      相关资源
                    </h2>
                    {images.extra2 && (
                      <div className="mb-6">
                        <img 
                          src={images.extra2}
                          alt="相关学习资源" 
                          className="w-full h-40 object-cover rounded-lg shadow-sm" 
                        />
                      </div>
                    )}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        {resources.official.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900">官方资源</h4>
                            <ul className="space-y-1">
                              {resources.official.map((resource, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="text-blue-500 mr-2">🔗</span>
                                  <a 
                                    href={resource.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                                  >
                                    {resource.name}
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {resources.community.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900">社区资源</h4>
                            <ul className="space-y-1">
                              {resources.community.map((resource, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="text-green-500 mr-2">💬</span>
                                  <a 
                                    href={resource.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800 hover:underline flex items-center"
                                  >
                                    {resource.name}
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 总结 */}
                <div className="conclusion-section bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-3xl mr-3">🎉</span>
                    总结
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg">通过本教程的学习，你应该已经掌握了{tutorial.title}的基本使用方法。</p>
                    <p>记住，学习是一个持续的过程，不断实践才能真正掌握。如果在学习过程中遇到问题，欢迎通过我们的联系方式寻求帮助。</p>
                    
                    <div className="mt-6 p-4 bg-white border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">下一步建议：</h4>
                      <ul className="space-y-1 text-green-800">
                        <li className="flex items-center"><span className="text-green-500 mr-2">▶</span>尝试更多进阶功能</li>
                        <li className="flex items-center"><span className="text-green-500 mr-2">▶</span>参与社区讨论</li>
                        <li className="flex items-center"><span className="text-green-500 mr-2">▶</span>实际项目中应用</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* 相关教程推荐 */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">相关教程推荐</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {tutorials
                .filter(t => t.id !== tutorial.id && t.category === tutorial.category)
                .slice(0, 2)
                .map((relatedTutorial) => (
                  <Link
                    key={relatedTutorial.id}
                    href={`/tutorials/${relatedTutorial.slug}`}
                    className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {relatedTutorial.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {relatedTutorial.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{relatedTutorial.readTime} 分钟</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// 生成静态页面
export async function generateStaticParams() {
  return tutorials.map((tutorial) => ({
    slug: tutorial.slug,
  }));
}

// 生成页面元数据
export async function generateMetadata({ params }: TutorialPageProps) {
  const resolvedParams = await params;
  const tutorial = tutorials.find(t => t.slug === resolvedParams.slug);

  if (!tutorial) {
    return {
      title: '教程不存在',
    };
  }

  return {
    title: `${tutorial.title} - 工具分享站`,
    description: tutorial.description,
    keywords: tutorial.tags.join(', '),
  };
}