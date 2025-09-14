#!/usr/bin/env node

/**
 * Category Migration Script
 * 执行实际的分类系统重构
 */

const fs = require('fs');
const path = require('path');

// 工具分类映射表
const TOOL_CATEGORY_MIGRATION = {
  'development': '开发工具',
  'design': '设计工具',
  'productivity': '效率工具',
  'marketing': '营销工具',
  'ai': 'AI工具',
  'analytics': '数据分析',
  'utility': '系统工具'
};

// 教程分类映射表
const TUTORIAL_CATEGORY_MIGRATION = {
  'marketing': '商业增长',
  'development': '网页开发',
  'design': '设计体验',
  'productivity': '效率精通',
  'ai': 'AI自动化',
  'analytics': '数据洞察'
};

// 特殊映射规则 - 基于关键词的智能分类
function getSmartCategory(title, description, tags, type) {
  const content = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
  
  if (type === 'tools') {
    // AI工具关键词检测
    if (['chatgpt', 'ai', '人工智能', 'gpt', 'claude', 'midjourney'].some(keyword => 
      content.includes(keyword.toLowerCase())
    )) {
      return 'AI工具';
    }
    
    // 开发工具关键词检测
    if (['code', 'vscode', 'git', 'api', 'docker', '开发', '编程'].some(keyword => 
      content.includes(keyword.toLowerCase())
    )) {
      return '开发工具';
    }
    
    // 设计工具关键词检测
    if (['figma', 'photoshop', 'design', '设计', 'ui', 'ux'].some(keyword => 
      content.includes(keyword.toLowerCase())
    )) {
      return '设计工具';
    }
    
    // 营销工具关键词检测
    if (['marketing', 'seo', '营销', '推广', 'social'].some(keyword => 
      content.includes(keyword.toLowerCase())
    )) {
      return '营销工具';
    }
    
    // 数据分析关键词检测
    if (['analytics', 'data', '数据', '分析', 'chart'].some(keyword => 
      content.includes(keyword.toLowerCase())
    )) {
      return '数据分析';
    }
    
    // 默认为效率工具
    return '效率工具';
    
  } else if (type === 'tutorials') {
    // 新手入门关键词检测
    if (['新手', '入门', 'beginner', '基础', '开始'].some(keyword => 
      content.includes(keyword.toLowerCase())
    )) {
      return '新手入门';
    }
    
    // AI自动化关键词检测
    if (['ai', 'automation', '自动化', 'chatgpt', '人工智能'].some(keyword => 
      content.includes(keyword.toLowerCase())
    )) {
      return 'AI自动化';
    }
    
    // 网页开发关键词检测
    if (['web', 'frontend', 'backend', '网页', '前端', '后端'].some(keyword => 
      content.includes(keyword.toLowerCase())
    )) {
      return '网页开发';
    }
    
    // 商业增长关键词检测
    if (['marketing', 'seo', 'adsense', '营销', '增长', '广告'].some(keyword => 
      content.includes(keyword.toLowerCase())
    )) {
      return '商业增长';
    }
    
    // 设计体验关键词检测
    if (['design', 'ui', 'ux', '设计', '用户体验'].some(keyword => 
      content.includes(keyword.toLowerCase())
    )) {
      return '设计体验';
    }
    
    // 数据洞察关键词检测
    if (['analytics', 'data', '数据', '分析', '洞察'].some(keyword => 
      content.includes(keyword.toLowerCase())
    )) {
      return '数据洞察';
    }
    
    // 默认为效率精通
    return '效率精通';
  }
}

function migrateToolsCategories() {
  const toolsPath = path.join(__dirname, '../src/data/tools.ts');
  let content = fs.readFileSync(toolsPath, 'utf8');
  
  console.log('🔄 开始迁移工具分类...');
  
  // 使用正则表达式查找并替换所有的 category 字段
  let migrationCount = 0;
  
  // 匹配 category: 'old-category' 模式
  content = content.replace(/category: '([^']+)'/g, (match, oldCategory) => {
    const newCategory = TOOL_CATEGORY_MIGRATION[oldCategory];
    if (newCategory) {
      migrationCount++;
      console.log(`  ✓ ${oldCategory} → ${newCategory}`);
      return `category: '${newCategory}'`;
    }
    return match;
  });
  
  // 创建备份
  const backupPath = `${toolsPath}.backup-${Date.now()}`;
  fs.writeFileSync(backupPath, fs.readFileSync(toolsPath, 'utf8'));
  console.log(`📁 备份创建: ${backupPath}`);
  
  // 写入更新后的内容
  fs.writeFileSync(toolsPath, content);
  console.log(`✅ 工具分类迁移完成，共更新 ${migrationCount} 个分类`);
}

function migrateTutorialsCategories() {
  const tutorialsPath = path.join(__dirname, '../src/data/tutorials.ts');
  let content = fs.readFileSync(tutorialsPath, 'utf8');
  
  console.log('🔄 开始迁移教程分类...');
  
  let migrationCount = 0;
  
  // 匹配 category: 'old-category' 模式
  content = content.replace(/category: '([^']+)'/g, (match, oldCategory) => {
    const newCategory = TUTORIAL_CATEGORY_MIGRATION[oldCategory];
    if (newCategory) {
      migrationCount++;
      console.log(`  ✓ ${oldCategory} → ${newCategory}`);
      return `category: '${newCategory}'`;
    }
    return match;
  });
  
  // 创建备份
  const backupPath = `${tutorialsPath}.backup-${Date.now()}`;
  fs.writeFileSync(backupPath, fs.readFileSync(tutorialsPath, 'utf8'));
  console.log(`📁 备份创建: ${backupPath}`);
  
  // 写入更新后的内容
  fs.writeFileSync(tutorialsPath, content);
  console.log(`✅ 教程分类迁移完成，共更新 ${migrationCount} 个分类`);
}

function validateMigration() {
  console.log('🔍 验证迁移结果...');
  
  // 验证工具分类
  const toolsContent = fs.readFileSync(path.join(__dirname, '../src/data/tools.ts'), 'utf8');
  const toolCategories = [...toolsContent.matchAll(/category: '([^']+)'/g)].map(match => match[1]);
  const uniqueToolCategories = [...new Set(toolCategories)];
  
  console.log('📊 工具分类统计:');
  uniqueToolCategories.forEach(category => {
    const count = toolCategories.filter(c => c === category).length;
    console.log(`  ${category}: ${count}个`);
  });
  
  // 验证教程分类
  const tutorialsContent = fs.readFileSync(path.join(__dirname, '../src/data/tutorials.ts'), 'utf8');
  const tutorialCategories = [...tutorialsContent.matchAll(/category: '([^']+)'/g)].map(match => match[1]);
  const uniqueTutorialCategories = [...new Set(tutorialCategories)];
  
  console.log('📚 教程分类统计:');
  uniqueTutorialCategories.forEach(category => {
    const count = tutorialCategories.filter(c => c === category).length;
    console.log(`  ${category}: ${count}个`);
  });
}

// 执行迁移
console.log('🚀 开始分类系统重构...\n');

try {
  migrateToolsCategories();
  console.log('');
  migrateTutorialsCategories();
  console.log('');
  validateMigration();
  console.log('\n✨ 分类系统重构完成！');
} catch (error) {
  console.error('❌ 迁移过程中发生错误:', error);
  process.exit(1);
}