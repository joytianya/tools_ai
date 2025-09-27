import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Calendar, Tag, Star, BookOpen } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { HeroImage } from '@/components/HeroImage';
import { CodeShowcase } from '@/components/CodeShowcase';
import { InteractiveQuiz } from '@/components/InteractiveQuiz';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { FloatingTableOfContents } from '@/components/FloatingTableOfContents';
import { tutorials } from '@/data/tutorials';
import { Tutorial } from '@/types';
import { formatDate } from '@/lib/utils';
import { generateSEO, generateStructuredData } from '@/lib/seo';
import { loadTutorialContent } from '@/lib/content-loader';

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

const getTutorialContent = (slug: string, tutorial?: Tutorial): TutorialContent => {
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
        { id: '2', text: '掌握基础提示词框架：TRACI和CREATE' },
        { id: '3', text: '学习2024年最新提示词技巧：零样本CoT、角色扮演' },
        { id: '4', text: '掌握高级技巧：自一致性提示、混合提示技术' },
        { id: '5', text: '实践场景化应用：客服、代码、内容创作' },
        { id: '6', text: '学会调试和优化提示词效果' },
        { id: '7', text: '构建个人提示词模板库' },
        { id: '8', text: '掌握多模态提示和安全性考虑' }
      ],
      codeExamples: [
        {
          id: 'traci-framework',
          title: 'TRACI框架（2024年最受欢迎）',
          language: 'text',
          code: `# TRACI框架模板

**T**ask（任务）：为电商网站撰写产品描述
**R**ole（角色）：你是一位资深的电商文案专家，有5年奢侈品营销经验
**A**udience（受众）：25-40岁高收入女性，注重品质和品牌
**C**ontext（上下文）：这是一款高端护肤品，主打天然有机成分
**I**nstruction（指令）：
1. 突出产品独特卖点
2. 使用感性语言创造情感连接
3. 字数控制在150-200字
4. 包含call-to-action

产品信息：[具体产品信息]`,
          description: '2024年最流行的提示词框架，确保覆盖所有关键要素。'
        },
        {
          id: 'advanced-role-play',
          title: '高级角色扮演提示',
          language: 'text',
          code: `你是一位资深的数据分析师，具有以下背景：
- 10年金融行业数据分析经验
- 专长：风险评估、市场趋势分析、数据可视化
- 工作风格：严谨、基于数据、注重细节
- 沟通特点：用数据说话，提供可视化建议

当前任务：分析Q3季度销售数据异常
分析要求：
1. 识别异常数据点及可能原因
2. 提供风险评估
3. 给出具体改进建议
4. 用专业但易懂的语言解释

请以专业分析师的语调进行分析：[数据详情]`,
          description: '详细的角色定义，类似入职文档，让AI更好地理解期望的专业水平。'
        },
        {
          id: 'zero-shot-cot',
          title: '零样本思维链（Zero-shot CoT）',
          language: 'text',
          code: `问题：一家初创公司应该如何在竞争激烈的市场中建立品牌？

让我们一步步深入思考这个问题：

1. 首先，我需要分析市场环境和竞争态势
2. 然后，识别目标客户群体和需求痛点
3. 接下来，确定差异化定位策略
4. 之后，规划品牌建设的关键步骤
5. 最后，制定可测量的执行计划

请按照上述思路，为每个步骤提供详细分析和具体建议。`,
          description: '不需要提供示例，直接引导AI进行结构化思考。'
        },
        {
          id: 'self-consistency',
          title: '自一致性提示',
          language: 'text',
          code: `请从三个不同的专业角度分析"远程工作的未来发展"：

**角度1：技术发展专家视角**
- 重点：技术工具、平台发展、VR/AR应用
- 时间框架：未来5年
- 考虑因素：技术可行性、成本效益

**角度2：人力资源专家视角**  
- 重点：员工管理、团队协作、企业文化
- 时间框架：当前到未来3年
- 考虑因素：员工满意度、生产力、人才保留

**角度3：商业战略专家视角**
- 重点：成本控制、市场竞争、业务模式
- 时间框架：短期和长期影响
- 考虑因素：ROI、市场优势、风险管理

最后，综合三个角度的分析，给出平衡的结论和建议。`,
          description: '通过多角度分析提高答案的准确性和全面性。'
        },
        {
          id: 'emotional-prompting',
          title: '情感激励提示（提升20%准确性）',
          language: 'text',
          code: `这个分析对我的职业发展极其重要，请您深呼吸，仔细思考。

任务：制定个人品牌建设策略
背景：我是一名5年经验的产品经理，希望转型到AI产品领域

请您一步步帮我分析：
1. 当前技能盘点和差距分析
2. 目标行业的关键能力要求  
3. 个人品牌定位策略
4. 具体的行动计划和时间表

这个建议将直接影响我未来3年的发展方向，请提供最详细和实用的指导。`,
          description: '研究表明，添加情感激励语句可以显著提升AI的回答质量。'
        },
        {
          id: 'multimodal-prompt',
          title: '多模态提示示例',
          language: 'text',
          code: `任务：分析这张数据可视化图表并生成专业报告

图片分析要求：
1. 识别图表类型（柱状图/折线图/饼图等）
2. 提取关键数据点和趋势
3. 分析数据背后的业务含义
4. 指出潜在的问题或机会

报告结构：
- 执行摘要（50字）
- 数据概览（包含具体数字）
- 趋势分析（重点关注变化）
- 业务建议（3-5条具体建议）
- 下一步行动计划

输出格式：结构化markdown文档
语调：专业、客观、有洞察力

[上传图片后添加具体分析要求]`,
          description: '2024年多模态AI的标准提示格式，支持图片+文字分析。'
        }
      ],
      quiz: {
        questions: [
          {
            id: '1',
            question: '2024年最受欢迎的提示词框架是什么？',
            options: ['SMART框架', 'TRACI框架', 'PDCA框架', 'SWOT框架'],
            correctAnswer: 1,
            explanation: 'TRACI框架包含Task任务、Role角色、Audience受众、Context上下文、Instruction指令，是2024年最流行的提示词结构。'
          },
          {
            id: '2',
            question: '情感激励提示可以提升AI回答质量多少？',
            options: ['5%', '10%', '20%', '50%'],
            correctAnswer: 2,
            explanation: '研究表明，在提示中加入"这对我很重要"、"请深呼吸思考"等情感激励语句可以提升20%的准确性。'
          },
          {
            id: '3',
            question: '零样本思维链（Zero-shot CoT）的关键特点是什么？',
            options: ['需要提供多个示例', '不需要示例直接引导推理', '只能用于数学问题', '必须使用特定格式'],
            correctAnswer: 1,
            explanation: '零样本思维链不需要提供示例，通过"让我们一步步思考"等引导语句直接让AI进行结构化推理。'
          },
          {
            id: '4',
            question: '自一致性提示的核心思想是什么？',
            options: ['保持提示词格式一致', '多角度分析同一问题', '使用相同的示例', '重复相同的问题'],
            correctAnswer: 1,
            explanation: '自一致性提示通过从多个不同角度分析同一问题，然后综合多个视角的结果来提高答案的准确性和全面性。'
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
        title: 'Midjourney V7艺术创作：从想象到现实的AI绘画指南',
        subtitle: '掌握2025年最新版本功能，创造出令人惊叹的艺术作品',
        image: 'https://images.unsplash.com/photo-1686191128892-2563c6b1c38a?w=1200&h=600&fit=crop&auto=format',
        gradient: 'from-pink-500 to-violet-600'
      },
      todoItems: [
        { id: '1', text: '注册Midjourney账号并了解V7新功能' },
        { id: '2', text: '掌握基础命令和草稿模式使用' },
        { id: '3', text: '学习2025年最新参数：--weird, --chaos, --sref' },
        { id: '4', text: '掌握角色参考和全能参考功能' },
        { id: '5', text: '学习风格参考和个性化设置' },
        { id: '6', text: '实践双冒号分隔多提示词技术' },
        { id: '7', text: '掌握高级创作模板：角色、场景、产品设计' },
        { id: '8', text: '探索与其他AI工具的结合使用' }
      ],
      codeExamples: [
        {
          id: 'v7-basic-syntax',
          title: 'Midjourney V7基础语法',
          language: 'text',
          code: `# Midjourney V7 命令语法

## 基础生成命令
/imagine prompt: [图像描述] [--参数]

## 草稿模式（2025年新功能）
/imagine prompt: [描述] --draft
# 优势：生成速度提升10倍，成本降低50%

## 语音提示词（V7新功能）
在Discord中使用语音消息描述创意
系统会自动转换为文本提示词

## 个性化设置（首次使用必做）
/tune setup
# 系统会引导你评价约200张图片，训练个人美学偏好

## 重复生成（探索变体）
/repeat [数量] [提示词]
# 生成同一概念的多个变体进行对比`,
          description: 'V7版本引入了革命性的草稿模式和个性化功能，大幅提升创作效率。'
        },
        {
          id: 'advanced-parameters',
          title: '2025年最新参数详解',
          language: 'text',
          code: `# Midjourney V7 高级参数设置

## 核心参数组合
--ar 16:9         # 宽高比（视频、横向海报）
--ar 2:3          # 竖向比例（人像、手机壁纸）
--ar 1:1          # 方形（社交媒体、头像）

## 创意控制参数
--chaos 0-100     # 混乱度（0=一致性强，100=随机性强）
--weird 0-3000    # 奇异度（创造超现实效果）
--s 0-1000        # 风格化程度（0=写实，1000=艺术化）
--style raw       # 原始风格（减少AI过度处理）

## 质量与速度控制
--q 0.25          # 快速预览质量
--q 1             # 标准质量（推荐）
--q 2             # 高质量（消耗更多资源）

## 排除不想要的元素
--no blur, watermark, text, signature
--no hands        # 避免手部生成错误

## V7新增功能
--cref [图片URL]  # 角色参考（由全能参考替代）
--sref [图片URL]  # 风格参考
--sref random     # 随机预设风格`,
          description: 'V7版本参数更加精细，特别是新增的weird和chaos参数可以创造独特效果。'
        },
        {
          id: 'character-design-template',
          title: '角色设计高级模板',
          language: 'text',
          code: `# 角色设计完整模板

## 基础角色模板
[年龄]岁的[性别]，[发色]头发，[发型]，[眼睛颜色]眼睛，[独特特征]，[体型]，[风格]风格，[表情]，[服装描述] --ar 2:3 --s 150

## 实际案例1：赛博朋克角色
25岁的女性，银色长发，编织辫子，翠绿色眼睛，左脸颊有小雀斑，苗条身材，赛博朋克风格，神秘微笑，黑色皮夹克配霓虹蓝色装饰 --ar 2:3 --s 150 --chaos 20

## 实际案例2：奇幻法师
古老的精灵法师::银白胡须::深邃紫色眼眸::手持发光水晶法杖::华丽长袍::魔法光环围绕 --ar 2:3 --s 200 --weird 500

## 角色参考进阶用法
[角色描述] --cref [参考图URL] --cw 80
# --cw 100: 最大相似度（面部、服装、姿态）
# --cw 0: 只保留面部特征

## 一致性角色创作流程
1. 生成基础角色设计
2. 选择最佳结果作为角色参考
3. 创建不同姿态和场景变体
4. 保持 --cref 参数一致性`,
          description: '使用双冒号分隔技术和角色参考功能，创造一致性强的角色设计。'
        },
        {
          id: 'scene-building-advanced',
          title: '场景构建高级技法',
          language: 'text',
          code: `# 场景构建完整框架

## 场景设计模板
[主体物] in [环境设置]::，[光照条件]::，[氛围描述]::，[镜头角度]::，[艺术风格] --ar [比例] --s [数值]

## 室内场景案例
神秘的古老图书馆::废弃城堡中::月光透过破碎彩色玻璃窗::尘埃在光束中飞舞::低角度仰视::哥特式建筑风格 --ar 16:9 --s 200 --chaos 30

## 自然风光案例
樱花飞舞的山谷::春日黄昏::温暖金色阳光::薄雾弥漫::无人机俯视角度::日本传统水彩画风格 --ar 21:9 --s 300 --weird 200

## 未来科幻场景
赛博朋克城市街道::霓虹灯反射在湿润地面::夜晚暴雨::蒸汽升腾::低角度街拍视角::布雷德·罗纳电影风格 --ar 16:9 --s 400 --chaos 50

## 风格参考组合
[场景描述] --sref [风格参考图] --ar 16:9 --s 250
# 建议保持文本简洁，让风格参考主导画面风格

## 多重概念分层
城市::未来主义建筑::飞行汽车::::雨夜::霓虹灯::反射效果 --ar 16:9 --chaos 40
# 使用双冒号分隔不同概念层次`,
          description: '掌握双冒号分隔技术和风格参考，创造层次丰富的复杂场景。'
        },
        {
          id: 'style-reference-mastery',
          title: '风格参考精通技巧',
          language: 'text',
          code: `# 风格参考 (Style Reference) 完全指南

## 基础风格参考语法
/imagine [简洁内容描述] --sref [图像URL或风格代码]

## 多风格混合
[描述] --sref [URL1] [URL2] [URL3]
# 系统会混合多个风格参考

## 风格权重控制
[描述] --sref [URL] --sw 0-1000
# --sw 500: 平衡风格与内容
# --sw 1000: 最大风格影响

## 随机风格探索
任何主题描述 --sref random
# 让系统随机选择预设艺术风格

## 经典艺术风格代码 (2025年推荐)
--sref 1234567890    # 水彩画风格
--sref 2345678901    # 油画质感
--sref 3456789012    # 赛博朋克风格
--sref 4567890123    # 日本动漫风格
--sref 5678901234    # 摄影写实风格

## 风格一致性工作流程
1. 确定主要艺术风格 (--sref)
2. 保持提示词简洁专注内容
3. 避免在文本中描述风格元素
4. 使用相同sref代码保持系列一致性

## 品牌风格定制
[产品/角色] --sref [品牌参考图] --sw 800
# 为品牌项目创建一致的视觉风格`,
          description: '风格参考是V7版本的核心功能，掌握它可以创造一致的视觉品牌风格。'
        }
      ],
      quiz: {
        questions: [
          {
            id: '1',
            question: 'Midjourney V7的草稿模式相比标准模式有什么优势？',
            options: ['质量更高', '速度提升10倍，成本降低50%', '支持更多参数', '图像更大'],
            correctAnswer: 1,
            explanation: 'V7草稿模式专为快速创意探索设计，生成速度提升10倍，成本降低50%，非常适合初期概念验证。'
          },
          {
            id: '2',
            question: '双冒号(::)在Midjourney提示词中的作用是什么？',
            options: ['增加特效', '分隔不同概念层次', '提高图像质量', '加快生成速度'],
            correctAnswer: 1,
            explanation: '双冒号用于分隔不同的概念，让AI分别理解每个部分，而不是作为整体解释，提高生成精确度。'
          },
          {
            id: '3',
            question: '在V7中，角色参考功能被什么新功能替代？',
            options: ['风格参考', '全能参考', '个性化模式', '草稿模式'],
            correctAnswer: 1,
            explanation: 'V7中角色参考功能被全能参考(Omni Reference)替代，提供更强大的参考图像处理能力。'
          },
          {
            id: '4',
            question: '--weird参数的作用是什么？',
            options: ['控制图像大小', '创造超现实和怪异效果', '改变颜色风格', '调整生成速度'],
            correctAnswer: 1,
            explanation: '--weird参数(0-3000)用于创造超现实和怪异的图像效果，数值越高创意越奇特。'
          }
        ]
      }
    },
    'docker-containerization-tutorial': {
      type: 'technical',
      estimatedTime: 90,
      difficulty: 'advanced' as const,
      skills: ['容器化', 'DevOps', '微服务', '部署自动化'],
      hero: {
        title: 'Docker容器化2025：现代云原生应用部署指南',
        subtitle: '掌握最新Docker功能、安全最佳实践和云原生部署技能',
        image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&h=600&fit=crop&auto=format',
        gradient: 'from-blue-600 to-cyan-600'
      },
      todoItems: [
        { id: '1', text: '理解2025年容器化发展趋势和Docker最新特性' },
        { id: '2', text: '掌握Docker Build Cloud和性能优化' },
        { id: '3', text: '学习多阶段构建和安全强化技术' },
        { id: '4', text: '掌握现代Docker Compose最佳实践' },
        { id: '5', text: '实施容器安全和监控策略' },
        { id: '6', text: '集成CI/CD和多云部署' },
        { id: '7', text: '构建生产就绪的容器应用' },
        { id: '8', text: '掌握故障排除和性能调优' }
      ],
      codeExamples: [
        {
          id: 'multistage-dockerfile',
          title: '2025年多阶段构建最佳实践',
          language: 'dockerfile',
          code: `# Node.js生产就绪多阶段构建模板
FROM node:18-alpine AS base
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nextjs -u 1001

# 依赖安装阶段
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 构建阶段
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产运行时阶段
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/dist ./dist
COPY --from=build --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js

CMD ["node", "dist/server.js"]`,
          description: '使用多阶段构建减少镜像大小60-80%，包含安全强化和健康检查。'
        },
        {
          id: 'modern-compose',
          title: '现代Docker Compose配置（2025年格式）',
          language: 'yaml',
          code: `# 2025年推荐格式 - 不再需要version字段
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    secrets:
      - db_password
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    depends_on:
      db:
        condition: service_healthy
    labels:
      - "prometheus.io/scrape=true"
      - "prometheus.io/port=3000"
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "3"

secrets:
  db_password:
    file: ./secrets/db_password.txt

volumes:
  db_data:`,
          description: '包含健康检查、秘密管理、条件依赖和监控标签的现代配置。'
        },
        {
          id: 'security-dockerfile',
          title: '安全强化Dockerfile模板',
          language: 'dockerfile',
          code: `# Python应用安全强化模板
FROM python:3.11-slim AS base

# 安全强化：创建非特权用户
RUN groupadd -r appuser && useradd -r -g appuser appuser

# 依赖阶段
FROM base AS deps
WORKDIR /app
COPY requirements.txt .
# 使用缓存挂载优化构建速度
RUN --mount=type=cache,target=/root/.cache/pip \\
    pip install --no-cache-dir -r requirements.txt

# 运行时阶段  
FROM base AS runtime
WORKDIR /app

# 复制Python包
COPY --from=deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin

# 复制应用代码
COPY . .
RUN chown -R appuser:appuser /app

# 安全设置：非root用户运行
USER appuser

# 只读文件系统（可选）
# --read-only标志在运行时使用

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD python -c "import requests; requests.get('http://localhost:8000/health')"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
          description: '包含多层安全防护：非特权用户、最小权限、健康检查等安全最佳实践。'
        },
        {
          id: 'cicd-pipeline',
          title: 'GitHub Actions CI/CD流水线',
          language: 'yaml',
          code: `name: Docker CI/CD Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Login to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: \${{ github.actor }}
        password: \${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push
      uses: docker/build-push-action@v5
      with:
        context: .
        platforms: linux/amd64,linux/arm64
        push: true
        tags: ghcr.io/\${{ github.repository }}:\${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
    
    - name: Run security scan
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: ghcr.io/\${{ github.repository }}:\${{ github.sha }}
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Deploy to production
      if: github.ref == 'refs/heads/main'
      run: |
        echo "Deploying \${{ github.sha }} to production"`,
          description: '包含多平台构建、安全扫描、缓存优化的完整CI/CD流水线。'
        },
        {
          id: 'performance-optimization',
          title: '性能优化技巧',
          language: 'dockerfile',
          code: `# 性能优化的Dockerfile模板
FROM node:18-alpine AS base

# 使用BuildKit缓存挂载
FROM base AS deps
WORKDIR /app
COPY package*.json ./
# 缓存npm下载，显著提升构建速度
RUN --mount=type=cache,target=/root/.npm \\
    npm ci --only=production

FROM base AS build
WORKDIR /app
COPY package*.json ./
# 使用缓存挂载优化依赖安装
RUN --mount=type=cache,target=/root/.npm \\
    npm ci
COPY . .
RUN npm run build

# 最小化最终镜像
FROM node:18-alpine AS runtime
WORKDIR /app

# 只复制必要文件，减少镜像大小
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# 性能优化设置
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1024"

RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nextjs -u 1001
USER nextjs

# 使用exec形式避免shell开销
CMD ["node", "dist/index.js"]`,
          description: '使用BuildKit缓存挂载、层优化和运行时调优提升容器性能。'
        }
      ]
    },
    'google-adsense-guide-for-beginners': {
      type: 'business',
      estimatedTime: 30,
      difficulty: 'beginner' as const,
      skills: ['网站变现', 'AdSense申请', '内容优化', '审核通过'],
      hero: {
        title: '2025年Google AdSense申请完全指南：从0到过审',
        subtitle: '基于最新政策更新，详解申请要求、避免常见拒绝原因，大幅提升审核通过率',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&auto=format',
        gradient: 'from-green-500 to-emerald-600'
      },
      todoItems: [
        { id: '1', text: '了解2025年AdSense最新政策和要求' },
        { id: '2', text: '准备20-30篇高质量原创内容' },
        { id: '3', text: '创建"过审三件套"：隐私政策、服务条款、关于我们' },
        { id: '4', text: '实施GDPR合规和Cookie政策' },
        { id: '5', text: '优化网站架构和用户体验' },
        { id: '6', text: '通过网站验证和代码部署' },
        { id: '7', text: '避免58%的常见拒绝原因' },
        { id: '8', text: '掌握收益优化最佳实践' }
      ],
      codeExamples: [
        {
          id: 'adsense-setup-2025',
          title: '2025年AdSense代码部署',
          language: 'html',
          code: `<!-- 第一步：在网站每个页面的 <head> 标签中添加 -->
<meta name="google-adsense-account" content="ca-pub-xxxxxxxxxx">

<!-- 第二步：添加自动广告代码（2024年3月更新） -->
<script async 
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxx"
  crossorigin="anonymous">
</script>

<!-- 第三步：GDPR合规 - 欧盟用户必需 -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied'
  });
</script>

<!-- 第四步：添加CMP代码（欧盟地区必需） -->
<!-- 使用Google认证的意见征求管理平台 -->`,
          description: '基于2025年最新政策的完整代码部署，包含GDPR合规要求。'
        },
        {
          id: 'privacy-policy-2025',
          title: '2025年隐私政策模板（GDPR合规）',
          language: 'text',
          code: `隐私政策

最后更新日期：2025年[具体日期]

## 1. 数据收集声明
本网站使用Google AdSense展示广告。我们收集的信息包括：
- Cookie和类似技术数据
- IP地址和设备信息
- 浏览行为和偏好数据

## 2. Google AdSense Cookie声明（必须包含）
本网站使用Google的Cookie来提供服务和分析流量。您的IP地址和用户代理会与Google共享，以便Google能够：
- 投放相关广告
- 测量广告效果
- 提供广告服务

## 3. GDPR权利（欧盟用户）
根据GDPR，您有权：
- 访问您的个人数据
- 要求删除您的数据
- 反对数据处理
- 数据便携性

## 4. 广告合作伙伴
我们与以下第三方广告合作伙伴合作：
- Google AdSense
- [其他广告网络]

## 5. 联系方式
隐私问题请联系：
邮箱：privacy@[您的域名].com
地址：[完整地址]

## 6. Cookie设置
您可以通过以下方式管理Cookie：
- 浏览器设置
- Google广告设置页面：https://adssettings.google.com/`,
          description: '完全符合GDPR要求的隐私政策模板，包含所有必需的声明和用户权利说明。'
        },
        {
          id: 'rejection-avoidance',
          title: '避免常见拒绝原因清单',
          language: 'text',
          code: `# 2025年AdSense申请成功清单

## 🔴 必须避免（58%拒绝原因）
❌ 低价值内容：
- [ ] 从其他网站复制内容
- [ ] 使用AI生成内容超过20%
- [ ] 内容太少（少于20篇文章）
- [ ] 文章过短（少于800字）

❌ 禁止内容：
- [ ] 赌博、博彩相关
- [ ] 成人内容
- [ ] 暴力、仇恨言论
- [ ] 版权侵犯内容

## 🟡 网站架构要求（79%内容问题）
✅ 必备页面：
- [ ] 隐私政策（包含Cookie声明）
- [ ] 服务条款/使用条款
- [ ] 关于我们页面
- [ ] 联系我们页面（真实邮箱/地址）

✅ 技术要求：
- [ ] 使用顶级域名（.com/.net/.org）
- [ ] 安装SSL证书（HTTPS）
- [ ] 移除所有第三方广告
- [ ] 网站在Google中被收录

## 🟢 内容质量标准
✅ 原创性：
- [ ] 至少20-30篇原创文章
- [ ] 每篇文章800字以上
- [ ] 定期更新（每周1-2篇）
- [ ] 避免关键词堆砌

✅ 用户体验：
- [ ] 清晰的网站导航
- [ ] 快速加载速度（<3秒）
- [ ] 移动端友好设计
- [ ] 无破损链接

## 📊 2025年成功率统计
- 遵循此清单：通过率85%
- 原创内容充足：通过率90%
- 完整页面结构：通过率78%
- GDPR合规网站：通过率95%（欧盟地区）`,
          description: '基于2024-2025年拒绝统计数据制定的成功清单，帮助避免常见错误。'
        },
        {
          id: 'revenue-optimization',
          title: '2025年收益优化策略',
          language: 'text',
          code: `# AdSense收益优化最佳实践（2025年更新）

## 当前市场数据
- 平均CPC：$0.14（较历史低位）
- 平均RPM：$7.00-8.00
- 2025年Q1展望：比2024年同期提升5%

## 高收益内容类型
🏆 最佳表现类别：
1. 金融理财（CPC: $2-5）
2. 保险服务（CPC: $3-8）
3. 法律咨询（CPC: $4-12）
4. 医疗健康（CPC: $1-3）
5. 科技产品（CPC: $0.5-2）

## 地理定位优化
💰 高价值国家/地区：
- 美国、加拿大：CPC最高
- 英国、德国、澳洲：次高
- 北欧国家：稳定收益
- 日本、韩国：科技类内容收益好

## 广告位置优化
✅ 推荐位置：
- 文章开头段落后
- 文章中间段落
- 文章结束前
- 侧边栏顶部

❌ 避免位置：
- 导航菜单附近
- 页脚区域
- 弹窗形式
- 欺骗性位置

## 技术优化建议
⚡ 性能优化：
- 启用延迟加载
- 使用自适应广告单元
- 优化页面加载速度
- 实施AMP（加速移动页面）

📱 移动端优化：
- 响应式广告设计
- 移动端专用广告位
- 避免意外点击
- 优化移动加载速度

## 合规性要求
🔒 必须遵守：
- 不得点击自己的广告
- 不得鼓励他人点击
- 不得使用流量购买
- 遵守Google广告政策

## 监控和分析
📊 关键指标：
- 页面浏览量（PV）
- 点击率（CTR）
- 千次展示收益（RPM）
- 广告展示次数

🎯 优化目标：
- CTR > 1%为良好
- RPM持续增长
- 跳出率 < 60%
- 页面停留时间 > 2分钟`,
          description: '基于2025年最新市场数据的收益优化完整策略，包含具体数据和操作建议。'
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
    },
    'vscode-essential-extensions-2024': {
      type: '网页开发',
      estimatedTime: 25,
      difficulty: 'beginner' as const,
      skills: ['VS Code插件', '开发效率', '代码编辑', '工具配置'],
      hero: {
        title: 'VS Code必装插件推荐2024版',
        subtitle: '精选25个最实用的VS Code插件，涵盖前端、后端、调试等各个方面，让你的开发效率翻倍',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop&auto=format',
        gradient: 'from-blue-600 to-indigo-600'
      },
      todoItems: [
        { id: '1', text: '了解VS Code插件系统和安装方法' },
        { id: '2', text: '安装基础功能增强插件' },
        { id: '3', text: '配置主题和图标插件美化界面' },
        { id: '4', text: '安装Git集成和版本控制插件' },
        { id: '5', text: '配置代码格式化和语法检查插件' },
        { id: '6', text: '安装语言特定的开发插件' },
        { id: '7', text: '配置调试和测试相关插件' },
        { id: '8', text: '安装AI辅助编程插件' }
      ],
      codeExamples: [
        {
          id: 'essential-plugins',
          title: '必装插件清单',
          language: 'text',
          code: `# 功能增强类
Chinese (Simplified) Language Pack - 中文语言包
Auto Rename Tag - 自动重命名HTML标签
Bracket Pair Colorizer 2 - 括号配对高亮
Change-case - 变量命名格式转换
Codelf - 变量命名助手

# 主题美化类
One Dark Pro - 热门暗色主题
Material Icon Theme - Material设计图标
Indent Rainbow - 缩进彩虹线

# Git集成类
GitLens - Git增强工具
GitHub Pull Requests - GitHub集成

# 代码质量类
ESLint - JavaScript代码检查
Prettier - 代码格式化
SonarLint - 代码质量检测

# AI辅助类
GitHub Copilot - AI代码补全
Tabnine - AI智能提示`,
          description: '这些插件涵盖了日常开发的各个方面，建议根据自己的需求选择安装。'
        },
        {
          id: 'settings-config',
          title: 'VS Code配置优化',
          language: 'json',
          code: `{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "workbench.iconTheme": "material-icon-theme",
  "workbench.colorTheme": "One Dark Pro",
  "terminal.integrated.fontSize": 13,
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}`,
          description: '推荐的VS Code设置配置，可以复制到settings.json中使用。'
        }
      ],
      quiz: {
        questions: [
          {
            id: '1',
            question: '以下哪个快捷键可以打开VS Code的扩展面板？',
            options: ['Ctrl+Shift+X', 'Ctrl+Shift+P', 'Ctrl+Shift+E', 'Ctrl+Shift+F'],
            correctAnswer: 0,
            explanation: 'Ctrl+Shift+X是打开扩展面板的快捷键，可以在这里搜索和安装插件。'
          },
          {
            id: '2',
            question: 'Prettier插件的主要作用是什么？',
            options: ['代码补全', '代码格式化', '语法检查', '文件管理'],
            correctAnswer: 1,
            explanation: 'Prettier是一个代码格式化工具，能够自动统一代码风格，提高代码可读性。'
          },
          {
            id: '3',
            question: 'GitLens插件的核心功能是什么？',
            options: ['文件压缩', 'Git历史增强', '主题美化', '代码翻译'],
            correctAnswer: 1,
            explanation: 'GitLens增强了VS Code的Git功能，提供详细的提交历史、作者信息等。'
          }
        ]
      }
    },
    'read-frog-ai-language-learning-guide': {
      type: 'ai-language',
      estimatedTime: 12,
      difficulty: 'beginner' as const,
      skills: ['AI翻译', '语言学习', '浏览器扩展使用', '沉浸式学习'],
      hero: {
        title: 'Read Frog（陪读蛙）：让网页阅读变成语言学习体验',
        subtitle: '开源AI浏览器扩展，支持沉浸式翻译、文章分析、智能内容提取，革新你的语言学习方式',
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&h=600&fit=crop&auto=format',
        gradient: 'from-green-500 to-blue-600'
      },
      todoItems: [
        { id: '1', text: '了解Read Frog的核心功能和特点' },
        { id: '2', text: '安装Read Frog浏览器扩展' },
        { id: '3', text: '配置OpenAI API密钥' },
        { id: '4', text: '学习沉浸式翻译功能使用' },
        { id: '5', text: '掌握内容提取和分析功能' },
        { id: '6', text: '体验不同的翻译模式' },
        { id: '7', text: '优化个性化设置' },
        { id: '8', text: '探索高级功能和使用技巧' }
      ],
      codeExamples: [
        {
          id: 'installation',
          title: 'Chrome扩展安装步骤',
          language: 'text',
          code: `# 安装Read Frog扩展的三种方式

## 方式一：Chrome Web Store（推荐）
1. 访问Chrome Web Store
2. 搜索"Read Frog"或"陪读蛙"
3. 点击"添加至Chrome"
4. 确认安装权限

## 方式二：从GitHub下载
1. 访问：https://github.com/mengxi-ream/read-frog
2. 下载最新版本的.crx文件
3. 打开Chrome扩展管理页面
4. 拖拽.crx文件进行安装

## 方式三：开发者模式安装
1. 下载源码：git clone https://github.com/mengxi-ream/read-frog.git
2. 打开Chrome://extensions/
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹`,
          description: '提供多种安装方式，满足不同用户需求，推荐使用官方Chrome Web Store安装。'
        },
        {
          id: 'api-config',
          title: 'OpenAI API配置',
          language: 'javascript',
          code: `// Read Frog支持的AI模型配置

// 1. OpenAI GPT系列（推荐）
const openaiConfig = {
  apiKey: 'sk-your-openai-api-key',
  model: 'gpt-3.5-turbo', // 或 'gpt-4'
  baseURL: 'https://api.openai.com/v1',
  temperature: 0.7
};

// 2. Azure OpenAI Service
const azureConfig = {
  apiKey: 'your-azure-api-key',
  model: 'gpt-35-turbo',
  baseURL: 'https://your-resource.openai.azure.com/v1',
  temperature: 0.7
};

// 3. 其他兼容OpenAI API的服务
const customConfig = {
  apiKey: 'your-custom-api-key',
  model: 'your-model-name',
  baseURL: 'https://your-custom-endpoint.com/v1',
  temperature: 0.7
};

// 在扩展设置中配置这些参数`,
          description: 'Read Frog支持多种AI模型，包括OpenAI官方API、Azure OpenAI以及其他兼容服务。'
        },
        {
          id: 'usage-examples',
          title: '核心功能使用示例',
          language: 'text',
          code: `# Read Frog核心功能实战指南

## 1. 沉浸式翻译模式
选中文本 → 右键菜单 → "翻译选中内容"
快捷键：Ctrl+Shift+T (Windows) / Cmd+Shift+T (Mac)
支持：双语对照、替换原文、弹窗显示

## 2. 整页翻译
点击扩展图标 → "翻译整个页面"
智能识别主要内容区域
保持原有页面布局和样式

## 3. 内容分析与总结
点击扩展图标 → "分析页面内容"
功能：
- 提取文章关键信息
- 生成内容摘要
- 识别重点段落
- 提供学习建议

## 4. 语言学习模式
启用"学习模式"后：
- 自动标注生词
- 提供语法解释
- 显示同义词替换
- 生成练习题目

## 5. 自定义词汇本
右键单词 → "添加到词汇本"
支持：
- 个人词汇收集
- 复习提醒
- 导出功能
- 学习进度跟踪`,
          description: 'Read Frog提供丰富的语言学习功能，从基础翻译到高级学习辅助一应俱全。'
        }
      ],
      quiz: {
        questions: [
          {
            id: '1',
            question: 'Read Frog的核心特色功能是什么？',
            options: ['普通网页翻译', '沉浸式语言学习', '网页内容下载', '社交媒体管理'],
            correctAnswer: 1,
            explanation: 'Read Frog的核心特色是将网页阅读转化为沉浸式语言学习体验，不仅翻译还提供学习辅助。'
          },
          {
            id: '2',
            question: 'Read Frog支持哪些AI模型？',
            options: ['仅支持ChatGPT', '仅支持Google翻译', '支持OpenAI及兼容API', '仅支持本地模型'],
            correctAnswer: 2,
            explanation: 'Read Frog支持OpenAI GPT系列、Azure OpenAI以及其他兼容OpenAI API格式的服务。'
          },
          {
            id: '3',
            question: '使用Read Frog需要什么前提条件？',
            options: ['购买付费版本', '配置AI API密钥', '安装特殊软件', '注册会员账号'],
            correctAnswer: 1,
            explanation: 'Read Frog是开源免费扩展，但需要用户自己配置AI API密钥（如OpenAI API）来使用AI功能。'
          }
        ]
      }
    },
    'figma-beginner-complete-guide': {
      type: '设计体验',
      estimatedTime: 60,
      difficulty: 'beginner' as const,
      skills: ['UI设计', '原型制作', '协作设计', '设计系统'],
      hero: {
        title: 'Figma零基础入门：现代UI设计师的第一课',
        subtitle: '从界面认识到高级技巧，掌握2024年最受欢迎的设计工具',
        image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&h=600&fit=crop&auto=format',
        gradient: 'from-purple-600 to-pink-600'
      },
      todoItems: [
        { id: '1', text: '注册Figma账户并了解界面' },
        { id: '2', text: '掌握基础绘图工具使用' },
        { id: '3', text: '学习组件和样式系统' },
        { id: '4', text: '创建响应式设计布局' },
        { id: '5', text: '制作交互原型' },
        { id: '6', text: '团队协作和评论功能' },
        { id: '7', text: '导出资源和开发交接' },
        { id: '8', text: '搭建个人设计系统' }
      ]
    },
    'notion-knowledge-management-system': {
      type: '效率精通',
      estimatedTime: 50,
      difficulty: 'intermediate' as const,
      skills: ['知识管理', '项目管理', 'GTD方法论', '数据库设计'],
      hero: {
        title: 'Notion全能工作空间：打造个人生产力系统',
        subtitle: '用PARA方法论构建知识管理系统，让信息变成知识，让想法变成行动',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop&auto=format',
        gradient: 'from-indigo-600 to-purple-600'
      },
      todoItems: [
        { id: '1', text: '理解PARA信息管理框架' },
        { id: '2', text: '搭建个人知识库架构' },
        { id: '3', text: '设计任务管理数据库' },
        { id: '4', text: '创建项目跟踪模板' },
        { id: '5', text: '建立GTD工作流程' },
        { id: '6', text: '掌握公式和自动化' },
        { id: '7', text: '优化移动端使用体验' },
        { id: '8', text: '建立个人复习系统' }
      ]
    },
    'github-beginner-to-contributor': {
      type: '网页开发',
      estimatedTime: 75,
      difficulty: 'beginner' as const,
      skills: ['Git版本控制', '开源协作', '代码管理', '项目贡献'],
      hero: {
        title: 'GitHub从入门到开源贡献者：程序员必备技能',
        subtitle: '掌握Git版本控制，学会团队协作，成为活跃的开源社区贡献者',
        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=600&fit=crop&auto=format',
        gradient: 'from-gray-700 to-gray-900'
      },
      todoItems: [
        { id: '1', text: '理解Git和GitHub的基本概念' },
        { id: '2', text: '学习Git命令行基础操作' },
        { id: '3', text: '创建和管理个人仓库' },
        { id: '4', text: '掌握分支管理和合并' },
        { id: '5', text: '学会提交Pull Request' },
        { id: '6', text: '参与开源项目贡献' },
        { id: '7', text: '使用GitHub协作功能' },
        { id: '8', text: '建立个人开源项目' }
      ]
    }
  };

  return contentMap[slug] || {
    type: 'standard',
    estimatedTime: 30,
    difficulty: 'beginner' as const,
    skills: ['基础知识'],
    hero: {
      title: tutorial?.title || '实用技能学习指南',
      subtitle: tutorial?.description || '掌握实用工具和方法',
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

// 生成页面元数据
export async function generateMetadata({ params }: TutorialPageProps) {
  const resolvedParams = await params;
  const tutorial = tutorials.find(t => t.slug === resolvedParams.slug);
  
  if (!tutorial) {
    return {};
  }

  return generateSEO({
    title: tutorial.title,
    description: tutorial.description,
    keywords: tutorial.tags,
    url: `/tutorials/${tutorial.slug}`,
    type: 'article',
    publishedTime: tutorial.publishedAt,
    modifiedTime: tutorial.publishedAt,
    authors: tutorial.author ? [tutorial.author] : undefined,
  });
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const resolvedParams = await params;
  const tutorial = tutorials.find(t => t.slug === resolvedParams.slug);

  if (!tutorial) {
    notFound();
  }

  // 尝试从外部文件加载内容，如果没有则使用原有的内联内容
  const externalContent = await loadTutorialContent(tutorial.slug);
  const finalContent = externalContent || tutorial.content;

  const content = getTutorialContent(tutorial.slug, tutorial);

  // 生成结构化数据
  const structuredData = generateStructuredData({
    type: 'Article',
    name: tutorial.title,
    description: tutorial.description,
    url: `https://matrixtools.me/tutorials/${tutorial.slug}`,
    datePublished: tutorial.publishedAt,
    dateModified: tutorial.publishedAt,
    author: tutorial.author,
  });

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <Layout>
        <div className="min-h-screen bg-gray-50 overflow-x-hidden max-w-full" data-tutorial-page>
        {/* Hero Section */}
        <div className={`relative bg-gradient-to-r ${content.hero.gradient} text-white overflow-hidden`}>
          <div className="absolute inset-0">
            <HeroImage 
              src={content.hero.image} 
              alt={tutorial.title}
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
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 overflow-x-hidden">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
            {/* 左侧主要内容 */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">

              {/* 教程简介 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 overflow-hidden">
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

              {/* 教程详细内容 */}
              {finalContent && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg p-4 sm:p-8 overflow-hidden">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 shadow-lg">
                      <span className="text-xl">📖</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
                      教程详细内容
                    </h2>
                    <p className="text-gray-600">
                      深度解析每个关键概念，配合实际案例帮助理解
                    </p>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-3 sm:p-6 overflow-hidden">
                    <MarkdownRenderer
                      content={finalContent}
                      className="markdown-content"
                    />
                  </div>
                </div>
              )}

              {/* 代码示例 (仅对技术类教程显示) */}
              {content.codeExamples && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg p-4 sm:p-8 overflow-hidden">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl mb-4 shadow-lg">
                      <span className="text-xl">💻</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-teal-800 bg-clip-text text-transparent mb-2">
                      代码示例
                    </h2>
                    <p className="text-gray-600">
                      实用代码片段和最佳实践，可直接复制使用
                    </p>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-3 sm:p-6 overflow-hidden">
                    <CodeShowcase examples={content.codeExamples} />
                  </div>
                </div>
              )}

              {/* 知识测验 */}
              {content.quiz && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg p-4 sm:p-8 overflow-hidden">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mb-4 shadow-lg">
                      <span className="text-xl">🎯</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-2">
                      知识检测
                    </h2>
                    <p className="text-gray-600">
                      测试你的理解程度，巩固学习成果
                    </p>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-3 sm:p-6 overflow-hidden">
                    <InteractiveQuiz 
                      title="测试你的理解程度"
                      questions={content.quiz.questions}
                    />
                  </div>
                </div>
              )}

              {/* 相关推荐 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 overflow-hidden">
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
            <div className="space-y-4 sm:space-y-6 min-w-0">


            </div>
          </div>
        </div>
      </div>

      {/* 悬浮目录 */}
      {finalContent && (
        <FloatingTableOfContents content={finalContent} />
      )}
    </Layout>
    </>
  );
}