#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 改进的内容过滤器 V2
 * 更精准的过滤策略，保留高质量内容
 */
class ContentFilterV2 {
  constructor() {
    this.convertedToolsPath = path.join(__dirname, 'converted-content/converted-tools.json');
    this.convertedTutorialsPath = path.join(__dirname, 'converted-content/converted-tutorials.json');
    this.outputPath = path.join(__dirname, 'converted-content');
    
    // 明确的不合适内容关键词（更精准）
    this.inappropriateKeywords = [
      'xx训练', '紧致', '绝顶', '高c', 'ru首', 'BO起', 'yan迟',
      '撩妹', '把妹', '偷听女人心', '自wei', '干chao', 'xing无需羞耻',
      '情感私教', '恋爱宝典', '婚恋指南', '搞定你的人生伴侣',
      '小妖精', '两xing关系', '强者内核'
    ];

    // 低质量内容关键词（通常是课程/教程而非工具）
    this.lowQualityKeywords = [
      '全套课程', '课程合集', '视频课', '教程套装', '学习笔记',
      '训练营', '实操课', '保姆级教学', '从入门到精通',
      '资料集', '电子书合集', '书单', '配方技术'
    ];

    this.filteredStats = {
      totalOriginal: 0,
      inappropriateFiltered: 0,
      lowQualityFiltered: 0,
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
    console.log('🔍 开始改进的内容过滤...\n');
    
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
      // 检查不合适内容
      if (this.hasInappropriateContent(tool)) {
        console.log(`  ❌ 不合适: ${tool.title}`);
        this.filteredStats.inappropriateFiltered++;
        return false;
      }
      
      // 检查低质量内容（主要是课程/教程）
      if (this.isLowQualityContent(tool)) {
        console.log(`  📚 课程类: ${tool.title}`);
        this.filteredStats.lowQualityFiltered++;
        return false;
      }
      
      // 清理和优化内容
      const cleanedTool = this.cleanAndOptimizeTool(tool);
      console.log(`  ✅ 保留: ${cleanedTool.title} (${cleanedTool.category})`);
      this.filteredStats.kept++;
      this.filteredStats.categories[cleanedTool.category]++;
      
      return true;
    }).map(tool => this.cleanAndOptimizeTool(tool));

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
      if (this.hasInappropriateContent(tutorial)) {
        console.log(`  ❌ 不合适: ${tutorial.title}`);
        this.filteredStats.inappropriateFiltered++;
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
   * 检查是否包含不合适内容（更精准）
   */
  hasInappropriateContent(item) {
    const textToCheck = `${item.title} ${item.description || ''}`.toLowerCase();
    
    return this.inappropriateKeywords.some(keyword => 
      textToCheck.includes(keyword.toLowerCase())
    );
  }

  /**
   * 检查是否为低质量内容（主要是课程而非工具）
   */
  isLowQualityContent(tool) {
    const textToCheck = `${tool.title} ${tool.description || ''}`.toLowerCase();
    
    // 明确的课程/教程关键词
    const isCourse = this.lowQualityKeywords.some(keyword => 
      textToCheck.includes(keyword.toLowerCase())
    );
    
    if (isCourse) return true;
    
    // 检查是否是食谱、健身、占卜等非工具内容
    const nonToolKeywords = [
      '菜系', '龙虾制作', '凉拌菜', '塔罗', '风水', '算命',
      '瑜伽', '健身', '减肥', '塑形', '按摩', '推拿',
      '小提琴', '声乐', '化妆', '素描', '摄影师'
    ];
    
    return nonToolKeywords.some(keyword => textToCheck.includes(keyword));
  }

  /**
   * 清理和优化工具
   */
  cleanAndOptimizeTool(tool) {
    const cleaned = { ...tool };
    
    // 清理标题
    cleaned.title = this.cleanTitle(cleaned.title);
    
    // 改进描述
    cleaned.description = this.improveDescription(cleaned.description, cleaned.title);
    
    // 清理详细内容
    if (cleaned.detailedContent) {
      cleaned.detailedContent = this.cleanDetailedContent(cleaned.detailedContent);
    }
    
    // 优化分类
    cleaned.category = this.optimizeCategory(cleaned.title + ' ' + cleaned.description);
    
    // 优化标签
    cleaned.tags = this.optimizeTags(cleaned.title + ' ' + cleaned.description);
    
    // 改进URL处理
    cleaned.url = this.improveUrl(cleaned.url, cleaned.detailedContent);
    
    return cleaned;
  }

  /**
   * 清理教程内容
   */
  cleanTutorial(tutorial) {
    const cleaned = { ...tutorial };
    
    cleaned.title = this.cleanTitle(cleaned.title);
    cleaned.description = this.improveDescription(cleaned.description, cleaned.title);
    
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
   * 改进描述
   */
  improveDescription(description, title) {
    if (!description || description.includes('...') || description.length < 20) {
      // 基于标题生成更好的描述
      return this.generateDescriptionFromTitle(title);
    }
    
    return description
      .replace(/^\d+\.\s*/, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/#{1,6}\s+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 150);
  }

  /**
   * 基于标题生成描述
   */
  generateDescriptionFromTitle(title) {
    if (title.includes('AI')) {
      return `${title}是一款基于人工智能技术的实用工具，为用户提供智能化的解决方案。`;
    }
    
    if (title.includes('在线') || title.includes('生成器')) {
      return `${title}是一款便捷的在线工具，提供简单易用的功能服务。`;
    }
    
    if (title.includes('开源')) {
      return `${title}是一款开源工具，提供可靠的技术解决方案。`;
    }
    
    return `${title}是一款专业的工具软件，为用户提供高效便捷的服务体验。`;
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
    
    // 移除日期和分类信息
    cleaned = cleaned.replace(/\d{4}-\d{2}-\d{2}\s*\n/g, '');
    cleaned = cleaned.replace(/\[.*?\]\(.*?\)\s*\n/g, '');
    
    // 移除页脚模板
    cleaned = cleaned.replace(/## 主要功能\s*待补充具体功能说明。/g, '');
    cleaned = cleaned.replace(/## 使用场景\s*待补充使用场景说明。/g, '');
    
    // 清理多余空行
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    return cleaned.trim();
  }

  /**
   * 优化分类
   */
  optimizeCategory(text) {
    const textLower = text.toLowerCase();
    
    // AI相关
    if (textLower.includes('ai') || textLower.includes('人工智能') || 
        textLower.includes('机器学习') || textLower.includes('深度学习')) {
      return 'ai';
    }
    
    // 开发相关
    if (textLower.includes('api') || textLower.includes('开发') || 
        textLower.includes('代码') || textLower.includes('编程') ||
        textLower.includes('github') || textLower.includes('开源')) {
      return 'development';
    }
    
    // 设计相关
    if (textLower.includes('设计') || textLower.includes('图片') || 
        textLower.includes('视频') || textLower.includes('图像') ||
        textLower.includes('画') || textLower.includes('美工')) {
      return 'design';
    }
    
    // 效率工具
    return 'productivity';
  }

  /**
   * 优化标签
   */
  optimizeTags(text) {
    const tags = new Set();
    const textLower = text.toLowerCase();
    
    // 基础标签
    if (textLower.includes('免费')) tags.add('免费');
    if (textLower.includes('在线')) tags.add('在线工具');
    if (textLower.includes('ai')) tags.add('AI');
    if (textLower.includes('开源')) tags.add('开源');
    
    // 功能标签
    if (textLower.includes('图片') || textLower.includes('图像')) tags.add('图片处理');
    if (textLower.includes('视频')) tags.add('视频编辑');
    if (textLower.includes('文本') || textLower.includes('文字')) tags.add('文本处理');
    if (textLower.includes('生成器')) tags.add('生成器');
    if (textLower.includes('转换')) tags.add('格式转换');
    
    return Array.from(tags).slice(0, 5);
  }

  /**
   * 改进URL处理
   */
  improveUrl(url, detailedContent) {
    // 如果原URL有效，保留它
    if (url && url !== '#' && url.startsWith('http') && !url.includes('ahhhhfs.com')) {
      return url;
    }
    
    // 尝试从详细内容中提取URL
    if (detailedContent) {
      const urlMatches = detailedContent.match(/https?:\/\/[^\s\)]+/g);
      if (urlMatches) {
        const validUrls = urlMatches.filter(u => 
          !u.includes('ahhhhfs.com') &&
          !u.includes('ihezu.cc') &&
          !u.includes('jnqywhcm1.cn')
        );
        
        if (validUrls.length > 0) {
          return validUrls[0];
        }
      }
    }
    
    return '#'; // 没有找到有效URL
  }

  /**
   * 保存过滤后的内容
   */
  async saveFilteredContent(filteredTools, filteredTutorials) {
    // 保存过滤后的工具
    const toolsPath = path.join(this.outputPath, 'filtered-tools-v2.json');
    fs.writeFileSync(toolsPath, JSON.stringify(filteredTools, null, 2));
    
    // 保存过滤后的教程
    const tutorialsPath = path.join(this.outputPath, 'filtered-tutorials-v2.json');
    fs.writeFileSync(tutorialsPath, JSON.stringify(filteredTutorials, null, 2));
    
    // 保存过滤报告
    const report = {
      timestamp: new Date().toISOString(),
      statistics: this.filteredStats,
      summary: {
        totalProcessed: this.filteredStats.totalOriginal,
        kept: this.filteredStats.kept,
        inappropriateFiltered: this.filteredStats.inappropriateFiltered,
        lowQualityFiltered: this.filteredStats.lowQualityFiltered,
        keepRate: Math.round((this.filteredStats.kept / this.filteredStats.totalOriginal) * 100)
      },
      improvements: {
        urlExtraction: 'Extract URLs from detailed content when original URL is invalid',
        descriptionGeneration: 'Generate meaningful descriptions based on titles',
        categoryOptimization: 'Improved category assignment based on content analysis',
        tagExtraction: 'Enhanced tag extraction with functional keywords'
      }
    };
    
    const reportPath = path.join(this.outputPath, 'filter-report-v2.json');
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
    console.log(`  ❌ 不合适内容: ${stats.inappropriateFiltered}`);
    console.log(`  📚 课程/低质量: ${stats.lowQualityFiltered}`);
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
  const filter = new ContentFilterV2();
  
  (async () => {
    await filter.filterAllContent();
  })();
}

module.exports = ContentFilterV2;