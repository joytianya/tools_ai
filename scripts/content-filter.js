#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 内容过滤器
 * 过滤不合适的内容，保留高质量的工具和教程
 */
class ContentFilter {
  constructor() {
    this.convertedToolsPath = path.join(__dirname, 'converted-content/converted-tools.json');
    this.convertedTutorialsPath = path.join(__dirname, 'converted-content/converted-tutorials.json');
    this.outputPath = path.join(__dirname, 'converted-content');
    
    // 不合适内容的关键词列表
    this.inappropriateKeywords = [
      '成人', '大人', '两性', '情感', '撩妹', '恋爱', '约会', '亲密',
      '男女', '女人', '性', '调情', '魅力', '吸引', '追求', '表白',
      '腰臀', '身材', '肌肉', '训练', '减肥', '瘦身', '塑形',
      '按摩', '推拿', '风水', '算命', '占卜', '星座', '塔罗',
      '偷听', '心理', '把妹', '脱单', '恋爱宝典', '婚恋',
      'xx训练', '紧致', '高c', '绝顶', '自wei', 'BO起', 'ru首'
    ];

    this.filteredStats = {
      totalOriginal: 0,
      filtered: 0,
      kept: 0,
      categories: {
        'ai': 0,
        'development': 0,
        'productivity': 0,
        'design': 0,
        'tools': 0
      }
    };
  }

  /**
   * 主过滤方法
   */
  async filterAllContent() {
    console.log('🔍 开始内容过滤...\n');
    
    const tools = await this.loadTools();
    const tutorials = await this.loadTutorials();
    
    const filteredTools = this.filterTools(tools);
    const filteredTutorials = this.filterTutorials(tutorials);
    
    await this.saveFilteredContent(filteredTools, filteredTutorials);
    
    this.printStats();
    console.log('\n✅ 内容过滤完成！');
  }

  /**
   * 加载工具数据
   */
  async loadTools() {
    if (!fs.existsSync(this.convertedToolsPath)) {
      console.log('❌ 未找到转换后的工具文件');
      return { tools: [] };
    }
    
    const data = JSON.parse(fs.readFileSync(this.convertedToolsPath, 'utf-8'));
    this.filteredStats.totalOriginal += data.tools.length;
    return data;
  }

  /**
   * 加载教程数据
   */
  async loadTutorials() {
    if (!fs.existsSync(this.convertedTutorialsPath)) {
      return { tutorials: [] };
    }
    
    const data = JSON.parse(fs.readFileSync(this.convertedTutorialsPath, 'utf-8'));
    this.filteredStats.totalOriginal += data.tutorials.length;
    return data;
  }

  /**
   * 过滤工具
   */
  filterTools(toolsData) {
    console.log('🛠  过滤工具内容...');
    
    const filteredTools = toolsData.tools.filter(tool => {
      if (this.isInappropriate(tool)) {
        console.log(`  ❌ 过滤: ${tool.title}`);
        this.filteredStats.filtered++;
        return false;
      }
      
      if (this.isLowQuality(tool)) {
        console.log(`  ⚠️  低质量: ${tool.title}`);
        this.filteredStats.filtered++;
        return false;
      }
      
      // 清理和优化内容
      const cleanedTool = this.cleanTool(tool);
      console.log(`  ✅ 保留: ${cleanedTool.title} (${cleanedTool.category})`);
      this.filteredStats.kept++;
      this.filteredStats.categories[cleanedTool.category]++;
      
      return true;
    }).map(tool => this.cleanTool(tool));

    return {
      ...toolsData,
      tools: filteredTools,
      count: filteredTools.length
    };
  }

  /**
   * 过滤教程
   */
  filterTutorials(tutorialsData) {
    console.log('📚 过滤教程内容...');
    
    const filteredTutorials = tutorialsData.tutorials.filter(tutorial => {
      if (this.isInappropriate(tutorial)) {
        console.log(`  ❌ 过滤: ${tutorial.title}`);
        this.filteredStats.filtered++;
        return false;
      }
      
      console.log(`  ✅ 保留: ${tutorial.title}`);
      this.filteredStats.kept++;
      return true;
    }).map(tutorial => this.cleanTutorial(tutorial));

    return {
      ...tutorialsData,
      tutorials: filteredTutorials,
      count: filteredTutorials.length
    };
  }

  /**
   * 检查是否包含不合适内容
   */
  isInappropriate(item) {
    const textToCheck = `${item.title} ${item.description || ''} ${item.detailedContent || item.content || ''}`.toLowerCase();
    
    return this.inappropriateKeywords.some(keyword => 
      textToCheck.includes(keyword.toLowerCase())
    );
  }

  /**
   * 检查是否低质量
   */
  isLowQuality(tool) {
    // 检查标题长度
    if (tool.title.length < 5 || tool.title.length > 100) {
      return true;
    }
    
    // 检查是否有有效的URL
    if (!tool.url || tool.url === '#' || tool.url.includes('ahhhhfs.com')) {
      return true;
    }
    
    // 检查描述质量
    if (!tool.description || tool.description.length < 20) {
      return true;
    }
    
    // 检查是否是重复的模板内容
    if (tool.detailedContent && tool.detailedContent.includes('待补充具体功能说明')) {
      return true;
    }
    
    return false;
  }

  /**
   * 清理工具内容
   */
  cleanTool(tool) {
    const cleaned = { ...tool };
    
    // 清理标题
    cleaned.title = this.cleanTitle(cleaned.title);
    
    // 清理描述
    cleaned.description = this.cleanDescription(cleaned.description);
    
    // 清理详细内容
    if (cleaned.detailedContent) {
      cleaned.detailedContent = this.cleanDetailedContent(cleaned.detailedContent);
    }
    
    // 优化分类
    cleaned.category = this.optimizeCategory(cleaned.category, cleaned.title + ' ' + cleaned.description);
    
    // 优化标签
    cleaned.tags = this.optimizeTags(cleaned.tags, cleaned.title + ' ' + cleaned.description);
    
    // 确保URL有效
    cleaned.url = this.validateUrl(cleaned.url);
    
    return cleaned;
  }

  /**
   * 清理教程内容
   */
  cleanTutorial(tutorial) {
    const cleaned = { ...tutorial };
    
    cleaned.title = this.cleanTitle(cleaned.title);
    cleaned.description = this.cleanDescription(cleaned.description);
    
    if (cleaned.content) {
      cleaned.content = this.cleanDetailedContent(cleaned.content);
    }
    
    return cleaned;
  }

  /**
   * 清理标题
   */
  cleanTitle(title) {
    return title
      .replace(/[【】\[\]]/g, '')
      .replace(/[：:]\s*$/, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 80);
  }

  /**
   * 清理描述
   */
  cleanDescription(description) {
    if (!description) return '优质工具，提供便捷实用的功能服务。';
    
    return description
      .replace(/^.*?\.\.\.$/, '') // 移除省略号开头的描述
      .replace(/^\d+\.\s*/, '') // 移除数字前缀
      .replace(/\[.*?\]\(.*?\)/g, '') // 移除markdown链接
      .replace(/#{1,6}\s+/g, '') // 移除标题标记
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 150);
  }

  /**
   * 清理详细内容
   */
  cleanDetailedContent(content) {
    let cleaned = content;
    
    // 移除导航部分
    cleaned = cleaned.replace(/## 主要内容[\s\S]*?(?=##|$)/g, '');
    
    // 移除文章目录
    cleaned = cleaned.replace(/\*\*文章目录\*\*[\s\S]*?(?=##|$)/g, '');
    
    // 移除页脚信息
    cleaned = cleaned.replace(/## 主要功能\s*待补充具体功能说明。/g, '');
    cleaned = cleaned.replace(/## 使用场景\s*待补充使用场景说明。/g, '');
    
    // 清理多余空行
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    return cleaned.trim();
  }

  /**
   * 优化分类
   */
  optimizeCategory(category, text) {
    const textLower = text.toLowerCase();
    
    // AI相关
    if (textLower.includes('ai') || textLower.includes('人工智能') || 
        textLower.includes('机器学习') || textLower.includes('图像生成')) {
      return 'ai';
    }
    
    // 开发相关
    if (textLower.includes('api') || textLower.includes('开发') || 
        textLower.includes('代码') || textLower.includes('编程')) {
      return 'development';
    }
    
    // 设计相关
    if (textLower.includes('设计') || textLower.includes('图片') || 
        textLower.includes('视频') || textLower.includes('图像')) {
      return 'design';
    }
    
    // 效率工具
    if (textLower.includes('工具') || textLower.includes('在线') || 
        textLower.includes('生成器') || textLower.includes('转换')) {
      return 'productivity';
    }
    
    return category || 'tools';
  }

  /**
   * 优化标签
   */
  optimizeTags(tags, text) {
    const optimizedTags = new Set(tags || []);
    const textLower = text.toLowerCase();
    
    // 添加相关标签
    if (textLower.includes('免费')) optimizedTags.add('免费');
    if (textLower.includes('在线')) optimizedTags.add('在线工具');
    if (textLower.includes('ai')) optimizedTags.add('AI');
    if (textLower.includes('开源')) optimizedTags.add('开源');
    if (textLower.includes('图片')) optimizedTags.add('图片处理');
    if (textLower.includes('视频')) optimizedTags.add('视频编辑');
    
    return Array.from(optimizedTags).slice(0, 5);
  }

  /**
   * 验证URL
   */
  validateUrl(url) {
    if (!url || url === '#') return '#';
    
    // 如果是相对路径或内部链接，标记为无效
    if (url.includes('ahhhhfs.com') || !url.startsWith('http')) {
      return '#';
    }
    
    return url;
  }

  /**
   * 保存过滤后的内容
   */
  async saveFilteredContent(filteredTools, filteredTutorials) {
    // 保存过滤后的工具
    const toolsPath = path.join(this.outputPath, 'filtered-tools.json');
    fs.writeFileSync(toolsPath, JSON.stringify(filteredTools, null, 2));
    
    // 保存过滤后的教程
    const tutorialsPath = path.join(this.outputPath, 'filtered-tutorials.json');
    fs.writeFileSync(tutorialsPath, JSON.stringify(filteredTutorials, null, 2));
    
    // 保存过滤报告
    const report = {
      timestamp: new Date().toISOString(),
      statistics: this.filteredStats,
      summary: {
        totalProcessed: this.filteredStats.totalOriginal,
        kept: this.filteredStats.kept,
        filtered: this.filteredStats.filtered,
        keepRate: Math.round((this.filteredStats.kept / this.filteredStats.totalOriginal) * 100)
      },
      qualityChecks: {
        titleLength: 'Cleaned titles to 5-80 characters',
        urlValidation: 'Removed invalid internal URLs',
        contentCleaning: 'Removed navigation and footer content',
        categoryOptimization: 'Reassigned categories based on content'
      }
    };
    
    const reportPath = path.join(this.outputPath, 'filter-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n💾 过滤结果已保存:`);
    console.log(`  - 工具: ${toolsPath} (${filteredTools.count}个)`);
    console.log(`  - 教程: ${tutorialsPath} (${filteredTutorials.count}个)`);
    console.log(`  - 报告: ${reportPath}`);
  }

  /**
   * 打印统计信息
   */
  printStats() {
    const stats = this.filteredStats;
    console.log('\n📊 过滤统计:');
    console.log(`  📥 原始内容: ${stats.totalOriginal}`);
    console.log(`  ✅ 保留内容: ${stats.kept}`);
    console.log(`  ❌ 过滤内容: ${stats.filtered}`);
    console.log(`  📈 保留率: ${Math.round((stats.kept / stats.totalOriginal) * 100)}%`);
    
    console.log('\n📂 分类统计:');
    Object.entries(stats.categories).forEach(([category, count]) => {
      if (count > 0) {
        console.log(`  ${category}: ${count} 个`);
      }
    });
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const filter = new ContentFilter();
  
  (async () => {
    await filter.filterAllContent();
  })();
}

module.exports = ContentFilter;