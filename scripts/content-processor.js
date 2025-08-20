#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 改进的内容处理器
 * 正确识别分类页面和具体文章，并进行准确的内容分类
 */
class ContentProcessor {
  constructor() {
    this.extraInfoPath = path.join(__dirname, '../extra_info/ajie/main_content_data_md');
    this.results = {
      categoryPages: [],
      individualArticles: [],
      extractedTools: [],
      statistics: {
        totalProcessed: 0,
        categoryPageCount: 0,
        articleCount: 0,
        extractedToolsCount: 0,
        categoryCounts: {
          'ai-tools': 0,
          'programming': 0,
          'software': 0,
          'tutorials': 0,
          'others': 0
        }
      }
    };
  }

  /**
   * 主处理方法
   */
  async processAllContent() {
    console.log('🚀 开始改进的内容处理...\n');
    
    const directories = fs.readdirSync(this.extraInfoPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const dir of directories) {
      await this.processDirectory(dir);
    }

    this.generateSummary();
    return this.results;
  }

  /**
   * 处理单个目录
   */
  async processDirectory(dirName) {
    const contentFile = path.join(this.extraInfoPath, dirName, 'content.md');
    
    if (!fs.existsSync(contentFile)) {
      console.log(`⚠️  ${dirName}: 缺少content.md文件`);
      return;
    }

    const content = fs.readFileSync(contentFile, 'utf-8');
    const isListPage = this.isListPage(dirName, content);

    if (isListPage) {
      await this.processCategoryPage(dirName, content);
    } else {
      await this.processIndividualArticle(dirName, content);
    }

    this.results.statistics.totalProcessed++;
  }

  /**
   * 判断是否为分类列表页面
   */
  isListPage(dirName, content) {
    // 数字ID通常是具体文章
    if (/^\d+$/.test(dirName)) {
      return false;
    }

    // 检查是否包含大量链接（列表页面特征）
    const linkCount = (content.match(/\]\(https?:\/\/[^)]+\)/g) || []).length;
    const listItemCount = (content.match(/^#{2,3}\s*\[.*?\]/gm) || []).length;
    
    // 如果有很多链接或列表项，可能是分类页面
    if (linkCount > 10 || listItemCount > 5) {
      return true;
    }

    // 常见的分类页面名称
    const categoryNames = [
      'ai-tool', 'programming-development', 'chrome', 'software', 
      'android', 'apple', 'windows', 'mac', 'ios', 'greasy-fork',
      'material-template', 'internet-marketing', 'online-earning-projects'
    ];

    return categoryNames.includes(dirName) || 
           dirName.startsWith('_e') || // URL编码的中文分类名
           ['recourse', 'funny_site', 'learn', 'toss'].includes(dirName);
  }

  /**
   * 处理分类页面
   */
  async processCategoryPage(dirName, content) {
    console.log(`📋 处理分类页面: ${dirName}`);
    
    const category = this.identifyCategory(dirName, content);
    const tools = this.extractToolsFromListPage(content);
    
    const categoryPage = {
      directory: dirName,
      category: category,
      extractedToolsCount: tools.length,
      tools: tools
    };

    this.results.categoryPages.push(categoryPage);
    this.results.extractedTools.push(...tools);
    this.results.statistics.categoryPageCount++;
    this.results.statistics.extractedToolsCount += tools.length;
    
    console.log(`  ✅ 提取了 ${tools.length} 个工具/资源`);
  }

  /**
   * 处理具体文章
   */
  async processIndividualArticle(dirName, content) {
    const title = this.extractTitle(content);
    const category = this.identifyCategory(dirName, content);
    const wordCount = this.countWords(content);
    const imageCount = this.countImages(content);
    const quality = this.assessQuality(content, wordCount, imageCount);

    const article = {
      directory: dirName,
      title: title,
      category: category,
      wordCount: wordCount,
      imageCount: imageCount,
      quality: quality,
      sourceUrl: this.extractUrl(content),
      hasMainContent: this.hasMainContent(content)
    };

    this.results.individualArticles.push(article);
    this.results.statistics.articleCount++;
    this.results.statistics.categoryCounts[category]++;

    console.log(`📄 ${dirName}: ${title} (${category}, ${wordCount}字, ${quality})`);
  }

  /**
   * 从列表页面提取工具信息
   */
  extractToolsFromListPage(content) {
    const tools = [];
    
    // 匹配工具链接的模式，例如: ## [工具名称](https://example.com)
    const toolPattern = /#{2,3}\s*\[([^\]]+)\]\((https?:\/\/[^)]+)[^)]*\)\s*"?([^"]*)"?/g;
    let match;

    while ((match = toolPattern.exec(content)) !== null) {
      const [, title, url, description] = match;
      
      // 过滤掉导航链接和广告链接
      if (!this.isValidToolLink(url, title)) {
        continue;
      }

      tools.push({
        title: title.trim(),
        url: url.trim(),
        description: description ? description.trim() : this.extractDescriptionFromContent(content, title),
        extractedFrom: 'list-page'
      });
    }

    // 同时尝试提取带描述的工具
    const toolWithDescPattern = /#{2,3}\s*\[([^\]]+)\]\([^)]+\)[^#]*?\n\n([^#\n]+)/g;
    while ((match = toolWithDescPattern.exec(content)) !== null) {
      const [, title, description] = match;
      
      if (!tools.some(tool => tool.title === title)) {
        tools.push({
          title: title.trim(),
          url: this.extractUrlFromTitle(content, title),
          description: description.trim().substring(0, 200),
          extractedFrom: 'list-page-with-desc'
        });
      }
    }

    return tools.slice(0, 50); // 限制每个页面最多50个工具
  }

  /**
   * 验证是否为有效的工具链接
   */
  isValidToolLink(url, title) {
    // 排除导航链接
    const excludePatterns = [
      /ahhhhfs\.com\/(?:funny_site|recourse|software)\/?$/,
      /ahhhhfs\.com\/.*\/page\/\d+/,
      /ihezu\.cc/,
      /jnqywhcm1\.cn/,
      /下一页|上一页|全部|免费|会员/
    ];

    return !excludePatterns.some(pattern => pattern.test(url) || pattern.test(title));
  }

  /**
   * 改进的分类识别
   */
  identifyCategory(dirName, content) {
    const title = this.extractTitle(content).toLowerCase();
    const contentLower = content.toLowerCase();
    const urlLower = this.extractUrl(content).toLowerCase();

    // 基于目录名的分类
    if (dirName.includes('ai') || dirName === 'ai-tool') return 'ai-tools';
    if (dirName.includes('programming') || dirName === 'code') return 'programming';
    if (['chrome', 'android', 'apple', 'windows', 'mac', 'ios', 'software'].includes(dirName)) return 'software';
    if (dirName.includes('learn') || dirName.includes('edu') || dirName.includes('course')) return 'tutorials';

    // 基于URL路径的分类
    if (urlLower.includes('/ai-tool/') || urlLower.includes('ai工具')) return 'ai-tools';
    if (urlLower.includes('/programming-development/') || urlLower.includes('编程开发')) return 'programming';
    if (urlLower.includes('/software/') || urlLower.includes('软件')) return 'software';
    if (urlLower.includes('/recourse/') || urlLower.includes('教程') || urlLower.includes('课程')) return 'tutorials';

    // 基于内容关键词的分类
    const aiKeywords = ['ai', '人工智能', '机器学习', 'chatgpt', '图像生成', '语音合成'];
    const progKeywords = ['编程', '开发', 'python', 'java', 'javascript', '代码', '算法'];
    const softKeywords = ['软件', '工具', '应用', '插件', '扩展'];
    const tutKeywords = ['教程', '课程', '培训', '学习', '指南'];

    if (this.hasKeywords(title + ' ' + contentLower, aiKeywords)) return 'ai-tools';
    if (this.hasKeywords(title + ' ' + contentLower, progKeywords)) return 'programming';
    if (this.hasKeywords(title + ' ' + contentLower, softKeywords)) return 'software';
    if (this.hasKeywords(title + ' ' + contentLower, tutKeywords)) return 'tutorials';

    return 'others';
  }

  /**
   * 检查是否包含关键词
   */
  hasKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  /**
   * 提取标题
   */
  extractTitle(content) {
    // 尝试多种标题模式
    const patterns = [
      /^#\s+(.+)$/m,
      /## 主要内容\s*\n\s*#\s+(.+)$/m,
      /#{2,3}\s*\[([^\]]+)\]/m
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) return match[1].trim();
    }

    return 'No Title Found';
  }

  /**
   * 提取URL
   */
  extractUrl(content) {
    const match = content.match(/url:\s*(https?:\/\/[^\s]+)/);
    return match ? match[1] : '';
  }

  /**
   * 检查是否有主要内容
   */
  hasMainContent(content) {
    const match = content.match(/has_main_content:\s*(true|false)/i);
    return match ? match[1].toLowerCase() === 'true' : false;
  }

  /**
   * 统计字数
   */
  countWords(content) {
    const cleanContent = content
      .replace(/---[\s\S]*?---/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*|\*|__|\|/g, '')
      .trim();

    const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (cleanContent.match(/[a-zA-Z]+/g) || []).length;

    return chineseChars + englishWords;
  }

  /**
   * 统计图片数量
   */
  countImages(content) {
    return (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
  }

  /**
   * 评估内容质量
   */
  assessQuality(content, wordCount, imageCount) {
    let score = 0;

    if (wordCount >= 1000) score += 40;
    else if (wordCount >= 500) score += 20;
    else if (wordCount >= 200) score += 10;

    if (imageCount >= 3) score += 20;
    else if (imageCount >= 1) score += 10;

    if (this.hasMainContent(content)) score += 20;

    const hasStructure = /#{2,6}\s+/.test(content) && /[-*+]\s+/.test(content);
    if (hasStructure) score += 20;

    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }

  /**
   * 辅助方法：从内容中提取描述
   */
  extractDescriptionFromContent(content, title) {
    const lines = content.split('\n');
    const titleIndex = lines.findIndex(line => line.includes(title));
    
    if (titleIndex >= 0 && titleIndex + 1 < lines.length) {
      const nextLines = lines.slice(titleIndex + 1, titleIndex + 3);
      return nextLines.join(' ').trim().substring(0, 100);
    }
    
    return '';
  }

  /**
   * 辅助方法：从标题提取URL
   */
  extractUrlFromTitle(content, title) {
    const linkPattern = new RegExp(`\\[${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]\\(([^)]+)\\)`);
    const match = content.match(linkPattern);
    return match ? match[1] : '';
  }

  /**
   * 生成处理摘要
   */
  generateSummary() {
    const stats = this.results.statistics;
    console.log('\n📊 内容处理完成！');
    console.log('='.repeat(60));
    console.log(`总处理目录: ${stats.totalProcessed}`);
    console.log(`分类页面: ${stats.categoryPageCount}`);
    console.log(`具体文章: ${stats.articleCount}`);
    console.log(`提取的工具总数: ${stats.extractedToolsCount}`);
    
    console.log('\n📈 内容分类统计:');
    Object.entries(stats.categoryCounts).forEach(([category, count]) => {
      if (count > 0) {
        console.log(`  ${category}: ${count} 篇文章`);
      }
    });

    // 按分类统计提取的工具
    const toolsByCategory = {};
    this.results.extractedTools.forEach(tool => {
      const category = this.identifyCategory('', tool.title + ' ' + tool.description + ' ' + tool.url);
      toolsByCategory[category] = (toolsByCategory[category] || 0) + 1;
    });

    console.log('\n🛠 提取的工具分类统计:');
    Object.entries(toolsByCategory).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} 个工具`);
    });
  }

  /**
   * 保存处理结果
   */
  async saveResults(outputPath) {
    const fullResults = {
      timestamp: new Date().toISOString(),
      summary: {
        totalProcessed: this.results.statistics.totalProcessed,
        categoryPages: this.results.statistics.categoryPageCount,
        individualArticles: this.results.statistics.articleCount,
        extractedTools: this.results.statistics.extractedToolsCount,
        categoryCounts: this.results.statistics.categoryCounts
      },
      categoryPages: this.results.categoryPages,
      individualArticles: this.results.individualArticles.filter(article => 
        article.quality !== 'poor' && article.wordCount >= 200
      ),
      extractedTools: this.results.extractedTools.slice(0, 100), // 取前100个质量最好的工具
      recommendations: this.generateRecommendations()
    };

    fs.writeFileSync(outputPath, JSON.stringify(fullResults, null, 2), 'utf-8');
    console.log(`\n💾 处理结果已保存到: ${outputPath}`);
    
    return fullResults;
  }

  /**
   * 生成推荐建议
   */
  generateRecommendations() {
    const highQualityArticles = this.results.individualArticles
      .filter(article => article.quality === 'excellent' || article.quality === 'good')
      .slice(0, 30);

    const topToolsByCategory = {};
    ['ai-tools', 'programming', 'software', 'tutorials'].forEach(category => {
      topToolsByCategory[category] = this.results.extractedTools
        .filter(tool => this.identifyCategory('', tool.title + ' ' + tool.description) === category)
        .slice(0, 20);
    });

    return {
      highQualityArticles: highQualityArticles.length,
      topArticles: highQualityArticles.map(article => ({
        directory: article.directory,
        title: article.title,
        category: article.category,
        wordCount: article.wordCount,
        quality: article.quality
      })),
      recommendedToolsByCategory: topToolsByCategory,
      implementationPlan: this.generateImplementationPlan(highQualityArticles, topToolsByCategory)
    };
  }

  /**
   * 生成实施计划
   */
  generateImplementationPlan(articles, toolsByCategory) {
    return {
      phase1: {
        description: '处理高质量文章内容',
        items: articles.slice(0, 20).map(a => a.directory),
        estimatedTimeHours: 8
      },
      phase2: {
        description: '集成分类页面提取的工具',
        items: Object.keys(toolsByCategory).map(cat => `${cat}: ${toolsByCategory[cat].length} tools`),
        estimatedTimeHours: 12
      },
      phase3: {
        description: '网站结构调整和SEO优化',
        items: ['更新数据文件', '调整导航结构', 'SEO优化', '性能测试'],
        estimatedTimeHours: 6
      }
    };
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const processor = new ContentProcessor();
  
  (async () => {
    const results = await processor.processAllContent();
    const outputPath = path.join(__dirname, '../docs/content-processing-report.json');
    await processor.saveResults(outputPath);
  })();
}

module.exports = ContentProcessor;