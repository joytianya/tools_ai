#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 内容质量分析器
 * 用于分析extra_info目录中的所有内容文件
 */
class ContentAnalyzer {
  constructor() {
    this.extraInfoPath = path.join(__dirname, '../extra_info/ajie/main_content_data_md');
    this.results = {
      totalDirectories: 0,
      analyzedContent: [],
      statistics: {
        avgWordCount: 0,
        totalImages: 0,
        highQualityContent: 0,
        categorizedContent: {
          'ai-tools': [],
          'programming': [],
          'software': [],
          'tutorials': [],
          'others': []
        }
      }
    };
  }

  /**
   * 扫描所有内容目录
   */
  async scanDirectories() {
    try {
      const directories = fs.readdirSync(this.extraInfoPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      this.results.totalDirectories = directories.length;
      console.log(`📁 发现 ${directories.length} 个内容目录`);

      for (const dir of directories) {
        await this.analyzeDirectory(dir);
      }

      return this.results;
    } catch (error) {
      console.error('❌ 扫描目录失败:', error.message);
      return null;
    }
  }

  /**
   * 分析单个目录的内容
   */
  async analyzeDirectory(dirName) {
    const dirPath = path.join(this.extraInfoPath, dirName);
    const contentFile = path.join(dirPath, 'content.md');
    const linksFile = path.join(dirPath, 'links.md');

    if (!fs.existsSync(contentFile)) {
      console.log(`⚠️  ${dirName}: 缺少content.md文件`);
      return;
    }

    try {
      const contentData = fs.readFileSync(contentFile, 'utf-8');
      const linksData = fs.existsSync(linksFile) ? fs.readFileSync(linksFile, 'utf-8') : '';

      const analysis = this.analyzeContent(dirName, contentData, linksData);
      this.results.analyzedContent.push(analysis);

      // 实时输出分析结果
      console.log(`✅ ${dirName}: ${analysis.quality} 质量, ${analysis.wordCount} 字, ${analysis.category} 分类`);

    } catch (error) {
      console.error(`❌ 分析 ${dirName} 失败:`, error.message);
    }
  }

  /**
   * 分析内容质量和分类
   */
  analyzeContent(dirName, content, links) {
    const analysis = {
      directory: dirName,
      title: this.extractTitle(content),
      wordCount: this.countWords(content),
      imageCount: this.countImages(content),
      hasStructure: this.checkStructure(content),
      category: this.categorizeContent(dirName, content),
      quality: 'unknown',
      extractedInfo: this.extractMetadata(content),
      recommendation: 'pending'
    };

    // 质量评估
    analysis.quality = this.assessQuality(analysis);
    analysis.recommendation = this.getRecommendation(analysis);

    // 更新统计信息
    this.updateStatistics(analysis);

    return analysis;
  }

  /**
   * 提取标题
   */
  extractTitle(content) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) return titleMatch[1].trim();

    const mdTitleMatch = content.match(/## 主要内容\s*\n\s*#\s+(.+)$/m);
    if (mdTitleMatch) return mdTitleMatch[1].trim();

    return 'No Title Found';
  }

  /**
   * 统计字数（中文按字符，英文按单词）
   */
  countWords(content) {
    // 移除markdown语法和链接
    const cleanContent = content
      .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
      .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
      .replace(/```[\s\S]*?```/g, '') // 移除代码块
      .replace(/---[\s\S]*?---/g, '') // 移除前置matter
      .replace(/#{1,6}\s+/g, '') // 移除标题标记
      .replace(/\*\*|\*|__|\|/g, '') // 移除加粗斜体
      .replace(/\n+/g, ' ') // 替换换行
      .trim();

    // 分别统计中文字符和英文单词
    const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (cleanContent.match(/[a-zA-Z]+/g) || []).length;

    return chineseChars + englishWords;
  }

  /**
   * 统计图片数量
   */
  countImages(content) {
    const imageMatches = content.match(/!\[.*?\]\(.*?\)/g) || [];
    return imageMatches.length;
  }

  /**
   * 检查内容结构
   */
  checkStructure(content) {
    const hasHeadings = /#{2,6}\s+/.test(content);
    const hasLists = /^\s*[-*+]\s+/m.test(content) || /^\s*\d+\.\s+/m.test(content);
    const hasParagraphs = content.split('\n\n').length > 3;

    return {
      hasHeadings,
      hasLists,
      hasParagraphs,
      wellStructured: hasHeadings && (hasLists || hasParagraphs)
    };
  }

  /**
   * 内容分类
   */
  categorizeContent(dirName, content) {
    const title = this.extractTitle(content).toLowerCase();
    const contentLower = content.toLowerCase();

    // AI工具类关键词
    const aiKeywords = ['ai', '人工智能', '图像生成', '视频生成', '音效生成', '机器学习', 'chatgpt', '深度学习'];
    
    // 编程开发类关键词
    const programmingKeywords = ['编程', '开发', 'python', 'java', 'javascript', 'vue', 'react', '算法', '数据结构', '前端', '后端'];
    
    // 软件工具类关键词
    const softwareKeywords = ['软件', '工具', '应用', 'chrome', '插件', '扩展', 'windows', 'mac', 'android', 'ios'];
    
    // 教程资源类关键词
    const tutorialKeywords = ['教程', '课程', '培训', '学习', '指南', '教育', '技能', '资源'];

    const checkKeywords = (keywords) => keywords.some(keyword => 
      title.includes(keyword) || contentLower.includes(keyword)
    );

    if (checkKeywords(aiKeywords)) return 'ai-tools';
    if (checkKeywords(programmingKeywords)) return 'programming';
    if (checkKeywords(softwareKeywords)) return 'software';
    if (checkKeywords(tutorialKeywords)) return 'tutorials';

    return 'others';
  }

  /**
   * 提取元数据
   */
  extractMetadata(content) {
    const metadata = {};

    // 提取URL
    const urlMatch = content.match(/url:\s*(https?:\/\/[^\s]+)/);
    if (urlMatch) metadata.sourceUrl = urlMatch[1];

    // 提取爬取时间
    const timeMatch = content.match(/scraped_time:\s*([^\n]+)/);
    if (timeMatch) metadata.scrapedTime = timeMatch[1];

    // 提取是否有主要内容
    const hasContentMatch = content.match(/has_main_content:\s*(true|false)/i);
    if (hasContentMatch) metadata.hasMainContent = hasContentMatch[1].toLowerCase() === 'true';

    // 提取图片数量（从metadata）
    const imageCountMatch = content.match(/images_count:\s*(\d+)/);
    if (imageCountMatch) metadata.metadataImageCount = parseInt(imageCountMatch[1]);

    return metadata;
  }

  /**
   * 质量评估
   */
  assessQuality(analysis) {
    let score = 0;
    const reasons = [];

    // 字数评分 (40分)
    if (analysis.wordCount >= 1500) {
      score += 40;
      reasons.push('字数充足(1500+)');
    } else if (analysis.wordCount >= 1000) {
      score += 30;
      reasons.push('字数适中(1000+)');
    } else if (analysis.wordCount >= 500) {
      score += 15;
      reasons.push('字数偏少(500+)');
    } else {
      reasons.push('字数不足(<500)');
    }

    // 结构评分 (25分)
    if (analysis.hasStructure.wellStructured) {
      score += 25;
      reasons.push('结构良好');
    } else if (analysis.hasStructure.hasHeadings) {
      score += 15;
      reasons.push('有标题结构');
    } else {
      reasons.push('结构简单');
    }

    // 图片评分 (15分)
    if (analysis.imageCount >= 3) {
      score += 15;
      reasons.push('图片丰富');
    } else if (analysis.imageCount >= 1) {
      score += 10;
      reasons.push('有配图');
    } else {
      reasons.push('无配图');
    }

    // 内容完整性评分 (20分)
    if (analysis.extractedInfo.hasMainContent) {
      score += 20;
      reasons.push('有主要内容');
    } else {
      reasons.push('内容不完整');
    }

    analysis.qualityScore = score;
    analysis.qualityReasons = reasons;

    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }

  /**
   * 获取推荐建议
   */
  getRecommendation(analysis) {
    if (analysis.quality === 'excellent' || analysis.quality === 'good') {
      return 'recommend'; // 推荐使用
    } else if (analysis.quality === 'fair' && analysis.wordCount >= 800) {
      return 'consider'; // 考虑使用
    } else {
      return 'skip'; // 跳过
    }
  }

  /**
   * 更新统计信息
   */
  updateStatistics(analysis) {
    const stats = this.results.statistics;
    
    stats.totalImages += analysis.imageCount;
    
    if (analysis.quality === 'excellent' || analysis.quality === 'good') {
      stats.highQualityContent++;
    }

    // 按分类统计
    if (stats.categorizedContent[analysis.category]) {
      stats.categorizedContent[analysis.category].push(analysis);
    } else {
      stats.categorizedContent.others.push(analysis);
    }
  }

  /**
   * 生成分析报告
   */
  generateReport() {
    const report = {
      summary: this.generateSummary(),
      recommendations: this.generateRecommendations(),
      detailedStats: this.generateDetailedStats()
    };

    return report;
  }

  generateSummary() {
    const total = this.results.analyzedContent.length;
    const highQuality = this.results.statistics.highQualityContent;
    const avgWords = Math.round(
      this.results.analyzedContent.reduce((sum, item) => sum + item.wordCount, 0) / total
    );

    return {
      totalAnalyzed: total,
      highQualityCount: highQuality,
      highQualityPercentage: Math.round((highQuality / total) * 100),
      averageWordCount: avgWords,
      totalImages: this.results.statistics.totalImages,
      categoryDistribution: Object.keys(this.results.statistics.categorizedContent).map(cat => ({
        category: cat,
        count: this.results.statistics.categorizedContent[cat].length
      }))
    };
  }

  generateRecommendations() {
    const recommended = this.results.analyzedContent.filter(item => item.recommendation === 'recommend');
    const consider = this.results.analyzedContent.filter(item => item.recommendation === 'consider');

    return {
      strongRecommendations: recommended.length,
      conditionalRecommendations: consider.length,
      totalUsableContent: recommended.length + consider.length,
      topContent: [...recommended, ...consider]
        .sort((a, b) => b.qualityScore - a.qualityScore)
        .slice(0, 20)
        .map(item => ({
          directory: item.directory,
          title: item.title,
          category: item.category,
          quality: item.quality,
          wordCount: item.wordCount,
          score: item.qualityScore
        }))
    };
  }

  generateDetailedStats() {
    const stats = {};
    
    ['ai-tools', 'programming', 'software', 'tutorials', 'others'].forEach(category => {
      const items = this.results.statistics.categorizedContent[category] || [];
      const recommended = items.filter(item => item.recommendation === 'recommend').length;
      const consider = items.filter(item => item.recommendation === 'consider').length;
      
      stats[category] = {
        total: items.length,
        recommended,
        consider,
        usable: recommended + consider,
        avgWordCount: items.length > 0 ? Math.round(
          items.reduce((sum, item) => sum + item.wordCount, 0) / items.length
        ) : 0
      };
    });

    return stats;
  }

  /**
   * 保存分析结果
   */
  async saveResults(outputPath) {
    const report = this.generateReport();
    const fullResults = {
      timestamp: new Date().toISOString(),
      summary: report.summary,
      recommendations: report.recommendations,
      detailedStats: report.detailedStats,
      allContent: this.results.analyzedContent
    };

    fs.writeFileSync(outputPath, JSON.stringify(fullResults, null, 2), 'utf-8');
    console.log(`📊 分析结果已保存到: ${outputPath}`);
    
    return fullResults;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const analyzer = new ContentAnalyzer();
  
  (async () => {
    console.log('🚀 开始内容分析...\n');
    
    const results = await analyzer.scanDirectories();
    if (results) {
      const report = analyzer.generateReport();
      
      console.log('\n📊 分析完成！');
      console.log('='.repeat(50));
      console.log(`总分析文件: ${report.summary.totalAnalyzed}`);
      console.log(`高质量内容: ${report.summary.highQualityCount} (${report.summary.highQualityPercentage}%)`);
      console.log(`平均字数: ${report.summary.averageWordCount}`);
      console.log(`强烈推荐: ${report.recommendations.strongRecommendations} 篇`);
      console.log(`可考虑使用: ${report.recommendations.conditionalRecommendations} 篇`);
      console.log(`可用内容总计: ${report.recommendations.totalUsableContent} 篇`);
      
      console.log('\n📈 分类统计:');
      Object.entries(report.detailedStats).forEach(([category, stats]) => {
        console.log(`  ${category}: ${stats.usable}/${stats.total} 可用 (平均${stats.avgWordCount}字)`);
      });

      // 保存详细结果
      const outputPath = path.join(__dirname, '../docs/content-analysis-report.json');
      await analyzer.saveResults(outputPath);
    }
  })();
}

module.exports = ContentAnalyzer;