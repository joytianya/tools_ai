import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Calendar, Tag, Star, BookOpen, Target } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { InteractiveTodoList } from '@/components/InteractiveTodoList';
import { LearningProgress } from '@/components/LearningProgress';
import { CodeShowcase } from '@/components/CodeShowcase';
import { InteractiveQuiz } from '@/components/InteractiveQuiz';
import { tutorials } from '@/data/tutorials';
import { formatDate } from '@/lib/utils';

interface TutorialPageProps {
  params: Promise<{ slug: string; }>;
}

// 为不同教程定义独特的内容结构
interface TutorialContent {
  type: string;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  hero: {
    title: string;
    subtitle: string;
    image: string;
    gradient: string;
  };
  todoItems: Array<{ id: string; text: string }>;
  codeExamples?: Array<{
    id: string;
    title: string;
    language: string;
    code: string;
    description: string;
  }>;
  quiz?: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  };
}

const getTutorialContent = (slug: string): TutorialContent => {
  const contentMap: { [key: string]: TutorialContent } = {
    'chatgpt-prompt-engineering-guide': {
      type: 'ai-interactive',
      estimatedTime: 45,
      difficulty: 'intermediate' as const,
      skills: ['提示词设计', 'AI对话技巧', '效率优化', '创意写作'],
      hero: {
        title: '掌握ChatGPT的艺术：从新手到提示词工程师',
        subtitle: '学会与AI高效对话，让ChatGPT成为你最得力的助手',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop&auto=format',
        gradient: 'from-purple-600 to-blue-600'
      },
      todoItems: [
        { id: '1', text: '理解ChatGPT的工作原理和局限性' },
        { id: '2', text: '学习基础提示词结构：角色 + 任务 + 要求' },
        { id: '3', text: '掌握高级提示词技巧：Chain of Thought、Few-shot' },
        { id: '4', text: '实践场景化应用：写作、编程、分析、创意' },
        { id: '5', text: '学会调试和优化提示词效果' },
        { id: '6', text: '构建个人提示词模板库' }
      ],
      codeExamples: [
        {
          id: 'basic',
          title: '基础提示词结构',
          language: 'text',
          code: `你是一位专业的技术文档撰写专家。

任务：将以下技术概念解释给初学者
要求：
1. 使用简单易懂的语言
2. 提供具体的例子
3. 避免过于专业的术语
4. 控制在200字以内

概念：[在这里输入要解释的概念]`,
          description: '这是一个标准的提示词结构模板，包含角色定义、任务说明和具体要求。'
        },
        {
          id: 'chain-of-thought',
          title: 'Chain of Thought 思维链',
          language: 'text',
          code: `请逐步分析以下问题：

问题：如何提高网站的用户转化率？

请按照以下步骤思考：
1. 首先分析影响转化率的主要因素
2. 然后识别可能的问题点
3. 提出具体的优化建议
4. 最后给出实施的优先级

每一步都要说明你的思考过程。`,
          description: '引导AI进行逐步推理，提高回答的质量和逻辑性。'
        },
        {
          id: 'few-shot',
          title: 'Few-shot 示例学习',
          language: 'text',
          code: `请根据以下示例，为新的产品写一个吸引人的标题：

示例1：
产品：智能手环
标题：24小时健康守护者，让运动更科学

示例2：
产品：降噪耳机
标题：静谧世界，专属你的音乐净土

示例3：
产品：智能台灯
标题：护眼光芒，陪伴每个深夜的灵感

现在请为以下产品创作标题：
产品：[新产品描述]`,
          description: '通过提供示例来训练AI理解你想要的输出格式和风格。'
        }
      ],
      quiz: {
        questions: [
          {
            id: '1',
            question: '什么是提示词工程中最重要的三个要素？',
            options: ['角色、任务、要求', '输入、处理、输出', '问题、思考、答案', '创意、逻辑、实用'],
            correctAnswer: 0,
            explanation: '角色定义帮助AI理解身份，任务说明告诉AI要做什么，要求确保输出符合期望。'
          },
          {
            id: '2',
            question: 'Chain of Thought技术的主要作用是什么？',
            options: ['加快AI响应速度', '引导AI逐步推理', '减少AI错误率', '增加输出长度'],
            correctAnswer: 1,
            explanation: 'Chain of Thought让AI展示思考过程，通过逐步推理来提高回答质量。'
          },
          {
            id: '3',
            question: '在Few-shot提示中，示例的数量通常建议是？',
            options: ['1个', '2-3个', '5-10个', '越多越好'],
            correctAnswer: 1,
            explanation: '2-3个示例通常最有效，既能让AI理解模式，又不会让提示词过长。'
          }
        ]
      }
    },
    'midjourney-ai-art-mastery': {
      type: 'creative',
      estimatedTime: 60,
      difficulty: 'intermediate' as const,
      skills: ['AI绘画', '提示词设计', '参数调优', '艺术创作'],
      hero: {
        title: 'Midjourney艺术创作：从想象到现实',
        subtitle: '掌握AI绘画的秘密，创造出令人惊叹的艺术作品',
        image: 'https://images.unsplash.com/photo-1686191128892-2563c6b1c38a?w=1200&h=600&fit=crop&auto=format',
        gradient: 'from-pink-500 to-violet-600'
      },
      todoItems: [
        { id: '1', text: '注册Midjourney账号并了解基本界面' },
        { id: '2', text: '学习基础命令：/imagine, /describe, /blend' },
        { id: '3', text: '掌握提示词结构：主体+风格+构图+参数' },
        { id: '4', text: '理解关键参数：--ar, --s, --q, --chaos' },
        { id: '5', text: '学习不同艺术风格的关键词' },
        { id: '6', text: '实践创作：肖像、风景、概念艺术' },
        { id: '7', text: '掌握高级技巧：图片融合、风格迁移' }
      ]
    },
    'docker-containerization-tutorial': {
      type: 'technical',
      estimatedTime: 90,
      difficulty: 'advanced' as const,
      skills: ['容器化', 'DevOps', '微服务', '部署自动化'],
      hero: {
        title: 'Docker容器化：现代应用部署的必修课',
        subtitle: '从零开始学习Docker，掌握容器化部署的核心技能',
        image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&h=600&fit=crop&auto=format',
        gradient: 'from-blue-600 to-cyan-600'
      },
      todoItems: [
        { id: '1', text: '理解容器化概念和Docker基础架构' },
        { id: '2', text: '安装Docker并验证环境配置' },
        { id: '3', text: '学习核心命令：pull, run, build, push' },
        { id: '4', text: '编写第一个Dockerfile' },
        { id: '5', text: '掌握镜像层概念和优化技巧' },
        { id: '6', text: '使用Docker Compose管理多容器应用' },
        { id: '7', text: '学习数据卷和网络配置' },
        { id: '8', text: '实践CI/CD集成部署' }
      ],
      codeExamples: [
        {
          id: 'dockerfile',
          title: 'Node.js应用Dockerfile',
          language: 'dockerfile',
          code: `# 使用官方Node.js运行时作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用源代码
COPY . .

# 暴露端口
EXPOSE 3000

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# 启动应用
CMD ["npm", "start"]`,
          description: '这是一个优化过的Node.js应用Dockerfile，使用了多阶段构建和安全最佳实践。'
        },
        {
          id: 'compose',
          title: 'Docker Compose配置',
          language: 'yaml',
          code: `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    depends_on:
      - db
      - redis
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge`,
          description: '完整的多服务Docker Compose配置，包含Web应用、数据库和缓存。'
        }
      ]
    },
    'google-adsense-guide-for-beginners': {
      type: 'business',
      estimatedTime: 30,
      difficulty: 'beginner' as const,
      skills: ['网站变现', 'AdSense申请', '内容优化', '审核通过'],
      hero: {
        title: '新手如何快速申请Google AdSense',
        subtitle: '详细介绍从零开始申请Google AdSense的完整流程，包括网站准备、内容要求和审核技巧',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&auto=format',
        gradient: 'from-green-500 to-emerald-600'
      },
      todoItems: [
        { id: '1', text: '了解AdSense基本要求和优势' },
        { id: '2', text: '准备符合要求的网站内容' },
        { id: '3', text: '创建必备页面：隐私政策、使用条款等' },
        { id: '4', text: '注册Google账号并访问AdSense官网' },
        { id: '5', text: '添加网站并完成基本信息' },
        { id: '6', text: '在网站中添加AdSense代码和meta标签' },
        { id: '7', text: '提交申请并等待审核' },
        { id: '8', text: '优化网站以提高审核通过率' }
      ],
      codeExamples: [
        {
          id: 'meta-tag',
          title: 'AdSense Meta标签',
          language: 'html',
          code: `<!-- 在网站每个页面的 <head> 标签中添加 -->
<meta name="google-adsense-account" content="ca-pub-xxxxxxxxxx">

<!-- 同时添加AdSense脚本 -->
<script async 
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxx"
  crossorigin="anonymous">
</script>`,
          description: '这两个代码片段都需要添加到网站的每个页面中，用于AdSense审核和后续广告显示。'
        },
        {
          id: 'privacy-policy',
          title: '隐私政策模板',
          language: 'text',
          code: `隐私政策

最后更新日期：[日期]

1. 信息收集
我们的网站使用Google AdSense投放广告。Google及其合作伙伴可能会：
- 使用Cookie收集用户信息
- 根据用户的浏览历史投放个性化广告
- 收集设备信息和位置数据

2. 信息使用
收集的信息用于：
- 提供个性化广告体验
- 改善网站服务质量
- 进行网站分析和统计

3. 用户权利
用户可以通过Google广告设置页面：
- 选择退出个性化广告
- 管理广告偏好设置
- 了解更多关于Google隐私政策

4. 联系我们
如有隐私相关问题，请联系：[邮箱地址]`,
          description: '隐私政策是AdSense申请的必要页面，需要详细说明数据收集和使用方式。'
        },
        {
          id: 'site-structure',
          title: '网站结构检查清单',
          language: 'text',
          code: `网站审核前检查清单：

✅ 基本要求
- [ ] 拥有独立域名（非免费子域名）
- [ ] 至少包含20-30篇原创文章
- [ ] 每篇文章字数300-500字以上
- [ ] 网站导航清晰易用

✅ 必备页面
- [ ] 隐私政策页面
- [ ] 使用条款页面  
- [ ] 关于我们页面
- [ ] 联系方式页面

✅ 内容质量
- [ ] 所有内容均为原创
- [ ] 内容对用户有价值
- [ ] 定期更新内容
- [ ] 无违法违规内容

✅ 技术要求
- [ ] 网站加载速度快
- [ ] 移动端友好
- [ ] 无404错误链接
- [ ] SSL证书已配置`,
          description: '申请前请逐项检查，确保网站完全符合AdSense要求。'
        }
      ],
      quiz: {
        questions: [
          {
            id: '1',
            question: 'AdSense申请最重要的网站要求是什么？',
            options: ['高流量', '原创优质内容', '华丽设计', '多种语言'],
            correctAnswer: 1,
            explanation: '原创优质内容是AdSense最看重的，它能为用户提供价值，也能吸引高质量广告主。'
          },
          {
            id: '2',
            question: '以下哪个页面是AdSense申请必须的？',
            options: ['产品页面', '隐私政策', '购物车', '用户注册'],
            correctAnswer: 1,
            explanation: '隐私政策是法律要求的页面，说明网站如何收集和使用用户数据，是AdSense审核的必要条件。'
          },
          {
            id: '3',
            question: 'AdSense审核通常需要多长时间？',
            options: ['24小时', '1-14天', '1个月', '3个月'],
            correctAnswer: 1,
            explanation: 'Google AdSense的审核时间通常在1-14天，具体时间取决于网站质量和当时的审核量。'
          }
        ]
      }
    }
  };

  return contentMap[slug] || {
    type: 'standard',
    estimatedTime: 30,
    difficulty: 'beginner' as const,
    skills: ['基础知识'],
    hero: {
      title: '学习新技能',
      subtitle: '掌握实用工具和方法',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop&auto=format',
      gradient: 'from-blue-500 to-purple-600'
    },
    todoItems: [
      { id: '1', text: '了解基础概念' },
      { id: '2', text: '学习核心功能' },
      { id: '3', text: '实践应用' }
    ]
  };
};

export default async function TutorialPage({ params }: TutorialPageProps) {
  const resolvedParams = await params;
  const tutorial = tutorials.find(t => t.slug === resolvedParams.slug);
  
  if (!tutorial) {
    notFound();
  }

  const content = getTutorialContent(tutorial.slug);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className={`relative bg-gradient-to-r ${content.hero.gradient} text-white overflow-hidden`}>
          <div className="absolute inset-0">
            <img 
              src={content.hero.image} 
              alt={tutorial.title}
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="relative container mx-auto px-4 py-16">
            <Link 
              href="/tutorials" 
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回教程列表
            </Link>
            
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {content.hero.title}
              </h1>
              <p className="text-xl text-white/90 mb-8">
                {content.hero.subtitle}
              </p>
              
              {/* Meta信息 */}
              <div className="flex flex-wrap gap-6 text-white/80">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{tutorial.readTime} 分钟阅读</span>
                </div>
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  <span>{tutorial.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{formatDate(tutorial.publishedAt)}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  <span>精选教程</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 左侧主要内容 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 学习进度 */}
              <LearningProgress 
                estimatedTime={content.estimatedTime}
                difficulty={content.difficulty}
                skills={content.skills}
              />

              {/* 教程简介 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                  教程简介
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {tutorial.description}
                </p>
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {tutorial.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 代码示例 (仅对技术类教程显示) */}
              {content.codeExamples && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">💻 代码示例</h2>
                  <CodeShowcase examples={content.codeExamples} />
                </div>
              )}

              {/* 知识测验 */}
              {content.quiz && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 知识检测</h2>
                  <InteractiveQuiz 
                    title="测试你的理解程度"
                    questions={content.quiz.questions}
                  />
                </div>
              )}

              {/* 相关推荐 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 相关教程推荐</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {tutorials
                    .filter(t => t.category === tutorial.category && t.id !== tutorial.id)
                    .slice(0, 4)
                    .map((relatedTutorial) => (
                      <Link
                        key={relatedTutorial.id}
                        href={`/tutorials/${relatedTutorial.slug}`}
                        className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                          {relatedTutorial.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {relatedTutorial.description.slice(0, 100)}...
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {relatedTutorial.readTime} 分钟
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>

            {/* 右侧边栏 */}
            <div className="space-y-6">
              {/* 学习清单 */}
              <InteractiveTodoList 
                title="学习清单"
                items={content.todoItems}
              />

              {/* 学习目标 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  学习目标
                </h3>
                <ul className="space-y-3">
                  {content.skills.map((skill, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 难度指标 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 教程信息</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">预计学习时间</span>
                      <span className="font-medium">{content.estimatedTime}分钟</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">难度等级</span>
                      <span className={`font-medium ${
                        content.difficulty === 'beginner' ? 'text-green-600' :
                        content.difficulty === 'intermediate' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {content.difficulty === 'beginner' ? '入门级' :
                         content.difficulty === 'intermediate' ? '进阶级' : '高级'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">技能点数</span>
                      <span className="font-medium">{content.skills.length}个技能</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}