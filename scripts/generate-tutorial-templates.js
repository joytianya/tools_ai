const fs = require('fs');
const path = require('path');

// 读取 tutorials.ts 文件中的空教程
const tutorialsPath = path.join(__dirname, '../src/data/tutorials.ts');
const contentDir = path.join(__dirname, '../src/content/tutorials');

// 确保内容目录存在
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// 需要创建内容的教程列表（基于之前的分析）
const emptyTutorials = [
  { slug: 'trello-project-management-best-practices', title: 'Trello项目管理最佳实践', description: '学习如何使用Trello看板进行高效的项目管理和团队协作' },
  { slug: 'slack-team-collaboration-guide', title: 'Slack团队协作高效指南', description: '掌握Slack的各种功能，提升远程团队沟通协作效率' },
  { slug: 'postman-api-testing-complete-tutorial', title: 'Postman API测试完整教程', description: '从基础到高级，全面掌握API测试、自动化和团队协作功能' },
  { slug: 'excel-data-analysis-practical-tutorial', title: 'Excel数据分析实战教程', description: '学习Excel数据分析的各种技巧，从基础统计到高级数据建模' },
  { slug: 'tableau-data-visualization-guide', title: 'Tableau数据可视化入门指南', description: '零基础学习Tableau，创建专业的数据可视化报告和仪表板' },
  { slug: 'power-bi-business-intelligence-reports', title: 'Power BI商业智能报告制作', description: '使用Power BI创建交互式商业智能报告和数据分析解决方案' },
  { slug: 'vercel-frontend-deployment-guide', title: 'Vercel前端项目部署指南', description: '学习如何使用Vercel快速部署前端项目，包括域名配置和CI/CD设置' },
  { slug: 'intellij-idea-development-tips', title: 'IntelliJ IDEA高效开发技巧', description: '掌握IDEA的各种快捷键、插件和高级功能，提升Java开发效率' },
  { slug: 'adobe-photoshop-image-processing', title: 'Adobe Photoshop图像处理基础', description: '学习Photoshop的基础操作和常用技巧，掌握图像编辑和设计技能' },
  { slug: 'sketch-ui-design-workflow', title: 'Sketch UI设计工作流程', description: '使用Sketch进行UI/UX设计的完整工作流程和最佳实践' },
  { slug: 'free-resources-complete-guide', title: '免费素材资源完整指南', description: '收集整理各类免费的设计素材、图片、字体和开发资源' },
  { slug: 'obsidian-knowledge-network-guide', title: 'Obsidian知识网络构建指南', description: '使用Obsidian构建个人知识管理系统，建立知识之间的联系' },
  { slug: 'todoist-gtd-time-management', title: 'Todoist GTD时间管理系统', description: '结合GTD方法论，使用Todoist构建高效的个人任务管理系统' },
  { slug: 'social-media-marketing-tools-comparison', title: '社交媒体营销工具对比指南', description: '对比分析各种社交媒体管理和营销自动化工具的特点和适用场景' },
  { slug: 'mailchimp-email-marketing-automation', title: 'Mailchimp邮件营销自动化设置', description: '学习使用Mailchimp创建邮件营销活动和自动化序列' },
  { slug: 'remote-work-tools-complete-setup', title: '远程工作工具栈完整配置', description: '构建高效的远程工作环境，包括协作工具、时间管理和生产力工具' },
  { slug: 'essential-tools-for-new-programmers', title: '新手程序员必备工具清单', description: '为编程新手推荐必备的开发工具、学习资源和生产力工具' }
];

function createContentTemplate(slug, title, description) {
  const filePath = path.join(contentDir, `${slug}.md`);

  // 如果文件已存在，跳过
  if (fs.existsSync(filePath)) {
    console.log(`✓ 内容文件已存在: ${slug}.md`);
    return;
  }

  const template = `# ${title}

## 简介

${description}

在现代数字化工作环境中，掌握合适的工具和方法对提升工作效率至关重要。本教程将详细介绍相关概念、最佳实践和实际应用技巧。

## 主要内容

### 基础概念

本节将介绍核心概念和基础知识，帮助你建立正确的理解框架。

### 快速入门

通过简单的步骤快速上手，让你能够立即开始使用。

### 进阶技巧

深入探讨高级功能和使用技巧，提升你的专业水平。

### 实战案例

通过真实的应用场景，展示如何在实际工作中应用所学知识。

### 最佳实践

总结经验和教训，分享业界认可的最佳实践方法。

### 常见问题

解答用户在使用过程中经常遇到的问题和困惑。

## 总结

通过本教程的学习，你将能够：
- 掌握核心功能和基本操作
- 了解高级特性和应用技巧
- 建立高效的工作流程
- 避免常见的错误和陷阱

## 相关资源

- [官方文档](#)
- [社区论坛](#)
- [视频教程](#)
- [扩展阅读](#)

---

*本教程由 MatrixTools 制作，更多实用工具教程请访问 [MatrixTools.me](https://matrixtools.me)*
`;

  try {
    fs.writeFileSync(filePath, template, 'utf-8');
    console.log(`✓ 已创建内容模板: ${slug}.md`);
  } catch (error) {
    console.error(`✗ 创建失败 ${slug}.md:`, error.message);
  }
}

// 为所有空教程创建模板
console.log('开始为空教程创建内容模板...\n');

emptyTutorials.forEach(tutorial => {
  createContentTemplate(tutorial.slug, tutorial.title, tutorial.description);
});

console.log('\n模板创建完成！');
console.log(`\n已在 ${contentDir} 目录下创建了内容文件`);
console.log('你可以编辑这些 .md 文件来添加详细的教程内容。');