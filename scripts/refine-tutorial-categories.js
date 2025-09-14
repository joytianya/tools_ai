#!/usr/bin/env node

/**
 * Tutorial Category Refinement Script
 * 精细化调整教程分类，特别是识别新手教程
 */

const fs = require('fs');
const path = require('path');

// 基于标题关键词的精细分类规则
const TUTORIAL_REFINEMENT_RULES = [
  // 新手入门 - 基于标题关键词的强匹配
  {
    category: '新手入门',
    patterns: [
      /新手.*如何/i,
      /.*入门.*教程/i,
      /.*基础.*教程/i,
      /从零开始/i,
      /初学者/i,
      /beginner/i,
      /.*完全指南/i,
      /快速上手/i,
      /第一次.*设置/i,
      /.*安装.*配置/i
    ]
  },
  
  // 项目实战 - 实际项目和案例
  {
    category: '项目实战',
    patterns: [
      /.*项目.*搭建/i,
      /.*实战.*案例/i,
      /从头.*构建/i,
      /完整.*项目/i,
      /.*开发.*实例/i,
      /案例研究/i,
      /项目优化/i
    ]
  },
  
  // 职业发展 - 职场和技能提升
  {
    category: '职业发展',
    patterns: [
      /.*求职.*/i,
      /.*面试.*/i,
      /职业.*规划/i,
      /.*技能.*提升/i,
      /工作.*技巧/i,
      /.*职场.*/i,
      /自由职业/i,
      /远程工作/i
    ]
  }
];

// 特殊的手动分类调整 - 基于具体标题
const MANUAL_CATEGORY_ADJUSTMENTS = [
  {
    title: '新手如何快速申请Google AdSense',
    category: '新手入门'
  },
  {
    title: 'Google Analytics网站分析入门教程',
    category: '新手入门'
  }
];

function refineCategories() {
  const tutorialsPath = path.join(__dirname, '../src/data/tutorials.ts');
  let content = fs.readFileSync(tutorialsPath, 'utf8');
  
  console.log('🔍 开始精细化调整教程分类...\n');
  
  let adjustmentCount = 0;
  
  // 1. 首先应用手动调整规则
  console.log('📋 应用手动分类调整:');
  MANUAL_CATEGORY_ADJUSTMENTS.forEach(({ title, category }) => {
    // 查找包含该标题的教程
    const titleRegex = new RegExp(`title:\\s*'${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g');
    if (content.match(titleRegex)) {
      // 查找该教程的category字段并替换
      const tutorialRegex = new RegExp(
        `(title:\\s*'${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?)category:\\s*'[^']*'`,
        'g'
      );
      
      content = content.replace(tutorialRegex, (match, beforeCategory) => {
        adjustmentCount++;
        console.log(`  ✓ "${title}" → ${category}`);
        return `${beforeCategory}category: '${category}'`;
      });
    }
  });
  
  // 2. 应用基于模式的智能分类
  console.log('\n🤖 应用智能模式匹配:');
  
  // 提取所有教程标题和位置
  const titleMatches = [...content.matchAll(/title:\s*'([^']+)'/g)];
  
  titleMatches.forEach(match => {
    const title = match[1];
    const titleIndex = match.index;
    
    // 检查是否匹配任何精细分类规则
    for (const rule of TUTORIAL_REFINEMENT_RULES) {
      for (const pattern of rule.patterns) {
        if (pattern.test(title)) {
          // 找到匹配的教程，查找其category字段
          const tutorialStartIndex = titleIndex;
          const nextTutorialIndex = content.indexOf('title:', titleIndex + 1);
          const tutorialEndIndex = nextTutorialIndex > -1 ? nextTutorialIndex : content.length;
          
          const tutorialSection = content.substring(tutorialStartIndex, tutorialEndIndex);
          const categoryMatch = tutorialSection.match(/category:\s*'([^']*)'/);
          
          if (categoryMatch && categoryMatch[1] !== rule.category) {
            // 找到当前分类，检查是否需要更改
            const currentCategory = categoryMatch[1];
            const categoryStartIndex = tutorialStartIndex + tutorialSection.indexOf(categoryMatch[0]);
            const categoryEndIndex = categoryStartIndex + categoryMatch[0].length;
            
            // 执行替换
            content = content.substring(0, categoryStartIndex) + 
                     `category: '${rule.category}'` + 
                     content.substring(categoryEndIndex);
            
            adjustmentCount++;
            console.log(`  ✓ "${title}" → ${rule.category} (从 ${currentCategory})`);
            
            // 找到匹配后跳出，避免重复分类
            break;
          }
          break;
        }
      }
    }
  });
  
  // 创建备份
  const backupPath = `${tutorialsPath}.backup-refinement-${Date.now()}`;
  fs.writeFileSync(backupPath, fs.readFileSync(tutorialsPath, 'utf8'));
  console.log(`\n📁 备份创建: ${backupPath}`);
  
  // 写入更新后的内容
  fs.writeFileSync(tutorialsPath, content);
  console.log(`✅ 教程分类精细化调整完成，共调整 ${adjustmentCount} 个分类`);
  
  // 验证结果
  validateRefinement();
}

function validateRefinement() {
  const tutorialsContent = fs.readFileSync(path.join(__dirname, '../src/data/tutorials.ts'), 'utf8');
  const tutorialCategories = [...tutorialsContent.matchAll(/category: '([^']+)'/g)].map(match => match[1]);
  const uniqueCategories = [...new Set(tutorialCategories)];
  
  console.log('\n📚 精细化调整后的教程分类统计:');
  uniqueCategories.forEach(category => {
    const count = tutorialCategories.filter(c => c === category).length;
    console.log(`  ${category}: ${count}个`);
  });
  
  // 检查是否有新手入门类别
  const beginnerCount = tutorialCategories.filter(c => c === '新手入门').length;
  console.log(`\n🌱 新手入门教程: ${beginnerCount}个`);
  
  // 检查是否有项目实战类别
  const projectCount = tutorialCategories.filter(c => c === '项目实战').length;
  console.log(`🎯 项目实战教程: ${projectCount}个`);
}

// 执行精细化调整
console.log('🚀 开始教程分类精细化调整...\n');

try {
  refineCategories();
  console.log('\n✨ 教程分类精细化调整完成！');
} catch (error) {
  console.error('❌ 调整过程中发生错误:', error);
  process.exit(1);
}