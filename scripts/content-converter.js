#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 内容格式标准化转换器
 * 将分析后的内容转换为网站标准格式
 */
class ContentConverter {
  constructor() {
    this.extraInfoPath = path.join(__dirname, '../extra_info/ajie/main_content_data_md');
    this.outputPath = path.join(__dirname, '../scripts/converted-content');
    this.reportPath = path.join(__dirname, '../docs/content-processing-report.json');
    
    // 创建输出目录
    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath, { recursive: true });
    }
    
    this.convertedTools = [];
    this.convertedTutorials = [];
    this.processingStats = {
      processed: 0,
      skipped: 0,
      errors: 0
    };
  }

  /**
   * 主转换方法
   */
  async convertAllContent() {
    console.log('🔄 开始内容格式转换...\n');
    
    // 读取处理报告
    const reportData = JSON.parse(fs.readFileSync(this.reportPath, 'utf-8'));
    
    // 转换高质量文章
    await this.convertIndividualArticles(reportData.individualArticles);
    
    // 转换提取的工具
    await this.convertExtractedTools(reportData.extractedTools);
    
    // 生成最终结果
    await this.generateFinalOutput();
    
    console.log('\n✅ 内容转换完成！');
    this.printStats();
  }

  /**
   * 转换具体文章
   */
  async convertIndividualArticles(articles) {
    console.log('📄 转换具体文章...');
    
    const highQualityArticles = articles.filter(article => 
      article.quality === 'excellent' || 
      (article.quality === 'good' && article.wordCount >= 800)
    );

    for (const article of highQualityArticles) {
      try {
        const convertedContent = await this.convertArticle(article);
        if (convertedContent) {
          if (this.isToolArticle(article)) {
            this.convertedTools.push(convertedContent);
          } else {
            this.convertedTutorials.push(convertedContent);
          }
          this.processingStats.processed++;
          console.log(`  ✅ ${article.directory}: ${article.title}`);
        } else {
          this.processingStats.skipped++;
        }
      } catch (error) {
        console.error(`  ❌ 转换失败 ${article.directory}: ${error.message}`);
        this.processingStats.errors++;
      }
    }
  }

  /**
   * 转换提取的工具
   */
  async convertExtractedTools(extractedTools) {
    console.log('🛠  转换提取的工具...');
    
    // 按质量和相关性排序
    const sortedTools = extractedTools
      .filter(tool => tool.title && tool.url && !this.isDuplicate(tool.title))
      .slice(0, 50); // 取前50个

    for (const tool of sortedTools) {
      try {
        const convertedTool = await this.convertSimpleTool(tool);
        if (convertedTool) {
          this.convertedTools.push(convertedTool);
          this.processingStats.processed++;
          console.log(`  ✅ 提取工具: ${tool.title}`);
        }
      } catch (error) {
        console.error(`  ❌ 转换工具失败 ${tool.title}: ${error.message}`);
        this.processingStats.errors++;
      }
    }
  }

  /**
   * 转换单个文章
   */
  async convertArticle(article) {
    const contentPath = path.join(this.extraInfoPath, article.directory, 'content.md');
    const rawContent = fs.readFileSync(contentPath, 'utf-8');
    
    // 提取详细内容
    const detailedContent = this.extractAndCleanContent(rawContent);
    if (detailedContent.length < 500) {
      return null; // 内容太短，跳过
    }

    const baseData = {
      id: this.generateId(),
      title: this.cleanTitle(article.title),
      description: this.generateDescription(detailedContent),
      imageUrl: this.extractBestImage(rawContent),
      rating: this.calculateRating(article),
      isFree: this.determineFreeStatus(detailedContent),
      featured: article.quality === 'excellent',
      slug: this.generateSlug(article.title),
      publishedAt: this.extractPublishDate(rawContent) || new Date().toISOString()
    };

    if (this.isToolArticle(article)) {
      return {
        ...baseData,
        category: this.mapCategory(article.category),
        tags: this.extractTags(detailedContent, article.category),
        url: this.extractMainUrl(rawContent, detailedContent),
        detailedContent: this.formatDetailedContent(detailedContent, article.title)
      };
    } else {
      return {
        ...baseData,
        content: this.formatTutorialContent(detailedContent, article.title),
        category: this.mapTutorialCategory(article.category),
        tags: this.extractTags(detailedContent, article.category),
        readTime: Math.ceil(article.wordCount / 200),
        difficulty: this.determineDifficulty(detailedContent)
      };
    }
  }

  /**
   * 转换简单工具
   */
  async convertSimpleTool(tool) {
    if (!tool.title || !tool.url) return null;

    return {
      id: this.generateId(),
      title: this.cleanTitle(tool.title),
      description: this.cleanDescription(tool.description) || this.generateSimpleDescription(tool.title),
      category: this.mapCategoryFromText(tool.title + ' ' + tool.description),
      tags: this.extractTagsFromText(tool.title + ' ' + tool.description),
      url: tool.url,
      imageUrl: this.generatePlaceholderImage(tool.title),
      rating: 4.0, // 默认评分
      isFree: true, // 假设大部分是免费的
      featured: false,
      slug: this.generateSlug(tool.title),
      detailedContent: this.generateSimpleDetailedContent(tool),
      publishedAt: new Date().toISOString()
    };
  }

  /**
   * 判断是否为工具文章
   */
  isToolArticle(article) {
    const toolKeywords = ['工具', 'tool', '生成器', 'generator', '平台', 'platform', 'app', '应用'];
    const title = article.title.toLowerCase();
    return toolKeywords.some(keyword => title.includes(keyword)) || 
           article.category === 'ai-tools' || 
           article.category === 'software';
  }

  /**
   * 提取和清理内容
   */
  extractAndCleanContent(rawContent) {
    let content = rawContent;
    
    // 移除前置matter
    content = content.replace(/^---[\s\S]*?---\n/, '');
    
    // 移除页面图片部分
    content = content.replace(/## 页面图片[\s\S]*?---\n/, '');
    
    // 移除导航链接
    content = content.replace(/\* \[.*?\]\(.*?\)\n/g, '');
    
    // 移除广告图片
    content = content.replace(/!\[.*?趣闲赚.*?\]\(.*?\)/g, '');
    content = content.replace(/!\[.*?流媒体Netflix.*?\]\(.*?\)/g, '');
    
    // 移除广告链接
    content = content.replace(/\[.*?趣闲赚.*?\]\(.*?\)/g, '');
    content = content.replace(/\[.*?流媒体Netflix.*?\]\(.*?\)/g, '');
    
    // 移除页脚信息
    content = content.replace(/本文链接：.*$/gm, '');
    content = content.replace(/### \*相关\*[\s\S]*$/g, '');
    
    // 清理多余空行
    content = content.replace(/\n{3,}/g, '\n\n');
    
    return content.trim();
  }

  /**
   * 格式化详细内容
   */
  formatDetailedContent(content, title) {
    let formatted = `# ${title}\n\n`;
    
    // 移除重复的标题
    content = content.replace(new RegExp(`^#+ ${title}\\s*\n`, 'gm'), '');
    
    // 确保内容结构合理
    if (!content.includes('## ')) {
      // 如果没有二级标题，添加基本结构
      formatted += '## 产品简介\n\n';
    }
    
    formatted += content;
    
    // 添加基本结构（如果缺失）
    if (!formatted.includes('## 主要功能') && !formatted.includes('## 核心功能')) {
      formatted += '\n\n## 主要功能\n\n待补充具体功能说明。';
    }
    
    if (!formatted.includes('## 使用场景') && !formatted.includes('## 适用场景')) {
      formatted += '\n\n## 使用场景\n\n待补充使用场景说明。';
    }
    
    return formatted;
  }

  /**
   * 格式化教程内容
   */
  formatTutorialContent(content, title) {
    let formatted = `# ${title}\n\n`;
    
    // 移除重复的标题
    content = content.replace(new RegExp(`^#+ ${title}\\s*\n`, 'gm'), '');
    
    formatted += content;
    
    return formatted;
  }

  /**
   * 生成简单的详细内容
   */
  generateSimpleDetailedContent(tool) {
    return `# ${tool.title}

## 工具简介

${tool.description || `${tool.title}是一款实用的在线工具。`}

## 主要功能

- 提供核心功能服务
- 界面简洁易用
- 支持多种操作

## 使用方法

1. 访问工具官网
2. 按照页面提示操作
3. 获得所需结果

## 工具特点

- **免费使用**: 大部分功能免费提供
- **操作简单**: 无需复杂设置
- **效果良好**: 能够满足基本需求

## 相关链接

- 官方网站: [${tool.title}](${tool.url})

---

*工具信息来源于网络收集整理，具体功能以官方网站为准。*`;
  }

  /**
   * 映射分类
   */
  mapCategory(category) {
    const categoryMap = {
      'ai-tools': 'ai',
      'programming': 'development',
      'software': 'productivity',
      'tutorials': 'education',
      'others': 'tools'
    };
    return categoryMap[category] || 'tools';
  }

  /**
   * 映射教程分类
   */
  mapTutorialCategory(category) {
    const categoryMap = {
      'ai-tools': 'ai',
      'programming': 'development',
      'software': 'tools',
      'tutorials': 'general',
      'others': 'general'
    };
    return categoryMap[category] || 'general';
  }

  /**
   * 从文本映射分类
   */
  mapCategoryFromText(text) {
    const textLower = text.toLowerCase();
    
    if (textLower.includes('ai') || textLower.includes('人工智能')) return 'ai';
    if (textLower.includes('编程') || textLower.includes('开发') || textLower.includes('code')) return 'development';
    if (textLower.includes('设计') || textLower.includes('design')) return 'design';
    if (textLower.includes('软件') || textLower.includes('工具')) return 'productivity';
    
    return 'tools';
  }

  /**
   * 提取标签
   */
  extractTags(content, category) {
    const tags = [];
    const contentLower = content.toLowerCase();
    
    // 基于分类的基础标签
    const categoryTags = {
      'ai': ['AI', '人工智能'],
      'development': ['开发', '编程'],
      'productivity': ['效率', '工具'],
      'design': ['设计', '创意']
    };
    
    if (categoryTags[category]) {
      tags.push(...categoryTags[category]);
    }
    
    // 从内容中提取关键词
    const keywords = [
      { keyword: ['免费', 'free'], tag: '免费' },
      { keyword: ['在线', 'online'], tag: '在线工具' },
      { keyword: ['开源', 'open source'], tag: '开源' },
      { keyword: ['图片', 'image'], tag: '图片处理' },
      { keyword: ['视频', 'video'], tag: '视频编辑' },
      { keyword: ['文本', 'text'], tag: '文本处理' }
    ];
    
    keywords.forEach(({ keyword, tag }) => {
      if (keyword.some(k => contentLower.includes(k))) {
        tags.push(tag);
      }
    });
    
    return [...new Set(tags)].slice(0, 5); // 去重并限制数量
  }

  /**
   * 从文本提取标签
   */
  extractTagsFromText(text) {
    const tags = [];
    const textLower = text.toLowerCase();
    
    const keywords = [
      { keyword: ['ai'], tag: 'AI' },
      { keyword: ['免费'], tag: '免费' },
      { keyword: ['在线'], tag: '在线' },
      { keyword: ['工具'], tag: '工具' },
      { keyword: ['生成器'], tag: '生成器' }
    ];
    
    keywords.forEach(({ keyword, tag }) => {
      if (keyword.some(k => textLower.includes(k))) {
        tags.push(tag);
      }
    });
    
    return tags.slice(0, 3);
  }

  /**
   * 清理标题
   */
  cleanTitle(title) {
    return title
      .replace(/^\d+\.\s*/, '') // 移除数字前缀
      .replace(/[【】\[\]]/g, '') // 移除方括号
      .replace(/\s+/g, ' ') // 合并空格
      .trim()
      .substring(0, 100); // 限制长度
  }

  /**
   * 清理描述
   */
  cleanDescription(description) {
    if (!description) return '';
    
    return description
      .replace(/[【】\[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 200);
  }

  /**
   * 生成描述
   */
  generateDescription(content) {
    // 尝试提取第一段有意义的内容
    const lines = content.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (line.length > 50 && !line.startsWith('#') && !line.startsWith('[')) {
        return line.substring(0, 200).trim() + '...';
      }
    }
    
    return '详细介绍请查看完整内容。';
  }

  /**
   * 生成简单描述
   */
  generateSimpleDescription(title) {
    return `${title}是一款实用的在线工具，为用户提供便捷的服务。`;
  }

  /**
   * 提取最佳图片
   */
  extractBestImage(content) {
    const imageMatches = content.match(/!\[([^\]]*)\]\(([^)]+)\)/g);
    if (!imageMatches) return null;
    
    // 过滤掉广告图片
    const validImages = imageMatches.filter(img => 
      !img.includes('趣闲赚') && 
      !img.includes('Netflix') &&
      !img.includes('ihezu') &&
      img.includes('http')
    );
    
    if (validImages.length > 0) {
      const match = validImages[0].match(/!\[([^\]]*)\]\(([^)]+)\)/);
      return match ? match[2] : null;
    }
    
    return null;
  }

  /**
   * 生成占位图片
   */
  generatePlaceholderImage(title) {
    // 可以返回一个基于标题的占位图片URL
    return null;
  }

  /**
   * 计算评分
   */
  calculateRating(article) {
    let rating = 3.5; // 基础评分
    
    if (article.quality === 'excellent') rating += 1;
    if (article.wordCount > 1200) rating += 0.3;
    if (article.imageCount > 3) rating += 0.2;
    
    return Math.min(5.0, Math.round(rating * 10) / 10);
  }

  /**
   * 确定是否免费
   */
  determineFreeStatus(content) {
    const freeKeywords = ['免费', 'free', '无需注册', '不需要付费'];
    const paidKeywords = ['付费', '订阅', '会员', 'premium'];
    
    const contentLower = content.toLowerCase();
    
    if (freeKeywords.some(keyword => contentLower.includes(keyword))) {
      return true;
    }
    
    if (paidKeywords.some(keyword => contentLower.includes(keyword))) {
      return false;
    }
    
    return true; // 默认认为是免费的
  }

  /**
   * 确定难度级别
   */
  determineDifficulty(content) {
    const beginnerKeywords = ['初学者', '新手', '入门', 'beginner'];
    const advancedKeywords = ['高级', '专业', '复杂', 'advanced'];
    
    const contentLower = content.toLowerCase();
    
    if (beginnerKeywords.some(keyword => contentLower.includes(keyword))) {
      return 'beginner';
    }
    
    if (advancedKeywords.some(keyword => contentLower.includes(keyword))) {
      return 'advanced';
    }
    
    return 'intermediate';
  }

  /**
   * 提取主URL
   */
  extractMainUrl(rawContent, cleanContent) {
    // 尝试从metadata提取
    const metaUrlMatch = rawContent.match(/url:\s*(https?:\/\/[^\s]+)/);
    if (metaUrlMatch) return metaUrlMatch[1];
    
    // 从内容中提取
    const urlMatches = cleanContent.match(/https?:\/\/[^\s\)]+/g);
    if (urlMatches) {
      // 过滤掉已知的广告域名
      const validUrls = urlMatches.filter(url => 
        !url.includes('ahhhhfs.com') &&
        !url.includes('ihezu.cc') &&
        !url.includes('jnqywhcm1.cn')
      );
      
      return validUrls[0] || urlMatches[0];
    }
    
    return '#';
  }

  /**
   * 提取发布日期
   */
  extractPublishDate(content) {
    const dateMatch = content.match(/scraped_time:\s*([^\n]+)/);
    if (dateMatch) {
      try {
        return new Date(dateMatch[1]).toISOString();
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * 生成slug
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  /**
   * 生成ID
   */
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
  }

  /**
   * 检查是否重复
   */
  isDuplicate(title) {
    const existingTitles = [
      ...this.convertedTools.map(t => t.title),
      ...this.convertedTutorials.map(t => t.title)
    ];
    
    return existingTitles.some(existing => 
      this.similarity(existing.toLowerCase(), title.toLowerCase()) > 0.8
    );
  }

  /**
   * 计算字符串相似度
   */
  similarity(s1, s2) {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * 计算编辑距离
   */
  levenshteinDistance(s1, s2) {
    const matrix = [];
    
    for (let i = 0; i <= s2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= s1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= s2.length; i++) {
      for (let j = 1; j <= s1.length; j++) {
        if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[s2.length][s1.length];
  }

  /**
   * 生成最终输出
   */
  async generateFinalOutput() {
    // 保存转换后的工具
    const toolsOutput = {
      timestamp: new Date().toISOString(),
      count: this.convertedTools.length,
      tools: this.convertedTools
    };
    
    const toolsPath = path.join(this.outputPath, 'converted-tools.json');
    fs.writeFileSync(toolsPath, JSON.stringify(toolsOutput, null, 2));
    
    // 保存转换后的教程
    const tutorialsOutput = {
      timestamp: new Date().toISOString(),
      count: this.convertedTutorials.length,
      tutorials: this.convertedTutorials
    };
    
    const tutorialsPath = path.join(this.outputPath, 'converted-tutorials.json');
    fs.writeFileSync(tutorialsPath, JSON.stringify(tutorialsOutput, null, 2));
    
    console.log(`\n💾 转换结果已保存:`);
    console.log(`  - 工具: ${toolsPath} (${this.convertedTools.length}个)`);
    console.log(`  - 教程: ${tutorialsPath} (${this.convertedTutorials.length}个)`);
  }

  /**
   * 打印统计信息
   */
  printStats() {
    console.log('\n📊 转换统计:');
    console.log(`  ✅ 成功处理: ${this.processingStats.processed}`);
    console.log(`  ⏭  跳过: ${this.processingStats.skipped}`);
    console.log(`  ❌ 错误: ${this.processingStats.errors}`);
    console.log(`  🛠  转换工具: ${this.convertedTools.length}`);
    console.log(`  📚 转换教程: ${this.convertedTutorials.length}`);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const converter = new ContentConverter();
  
  (async () => {
    await converter.convertAllContent();
  })();
}

module.exports = ContentConverter;