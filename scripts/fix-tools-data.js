#!/usr/bin/env node

/**
 * Data Integrity Fix Script for MatrixTools
 * Fixes critical issues in tools.ts:
 * 1. Empty slugs - generates URL-safe slugs from titles
 * 2. Placeholder URLs - replaces example.com with fallback '#'
 * 3. Empty tag arrays - generates appropriate tags based on content
 */

const fs = require('fs');
const path = require('path');

// Chinese to Pinyin mapping for common characters (simplified for this use case)
const pinyinMap = {
  '法': 'fa', '律': 'lv', '相': 'xiang', '关': 'guan', '电': 'dian', '子': 'zi', '书': 'shu',
  '完': 'wan', '全': 'quan', '图': 'tu', '解': 'jie', '恋': 'lian', '爱': 'ai', '心': 'xin', '理': 'li', '学': 'xue',
  '实': 'shi', '用': 'yong', '工': 'gong', '具': 'ju', '集': 'ji', '合': 'he',
  '智': 'zhi', '能': 'neng', '助': 'zhu', '手': 'shou',
  '数': 'shu', '据': 'ju', '分': 'fen', '析': 'xi',
  '设': 'she', '计': 'ji', '软': 'ruan', '件': 'jian',
  '效': 'xiao', '率': 'lv', '办': 'ban', '公': 'gong',
  '在': 'zai', '线': 'xian', '编': 'bian', '辑': 'ji', '器': 'qi',
  '免': 'mian', '费': 'fei', '资': 'zi', '源': 'yuan',
  '网': 'wang', '站': 'zhan', '平': 'ping', '台': 'tai',
  '管': 'guan', '理': 'li', '系': 'xi', '统': 'tong'
};

// Generate URL-safe slug from title
function generateSlug(title) {
  if (!title) return '';
  
  let slug = title.toLowerCase();
  
  // Convert Chinese characters to pinyin
  slug = slug.split('').map(char => pinyinMap[char] || char).join('');
  
  // Replace spaces and special characters with hyphens
  slug = slug
    .replace(/[\s\u4e00-\u9fff]+/g, '-') // Replace spaces and remaining Chinese chars
    .replace(/[^\w\-]/g, '') // Remove non-word characters except hyphens
    .replace(/\-+/g, '-') // Replace multiple hyphens with single
    .replace(/^\-|\-$/g, ''); // Remove leading/trailing hyphens
  
  return slug || 'tool';
}

// Generate tags based on category and title
function generateTags(title, category, description) {
  const tags = [];
  
  // Category-based tags
  const categoryTags = {
    'ai': ['AI', '智能助手', '人工智能'],
    'development': ['开发工具', '编程', '技术'],
    'design': ['设计', 'UI/UX', '创意'],
    'productivity': ['效率工具', '办公', '生产力'],
    'marketing': ['营销', '推广', '商业'],
    'education': ['教育', '学习', '知识'],
    'entertainment': ['娱乐', '休闲', '游戏']
  };
  
  if (categoryTags[category]) {
    tags.push(categoryTags[category][0]); // Add primary category tag
  }
  
  // Title-based tags
  const titleLower = title.toLowerCase();
  if (titleLower.includes('免费') || titleLower.includes('free')) {
    tags.push('免费');
  }
  if (titleLower.includes('在线') || titleLower.includes('online')) {
    tags.push('在线');
  }
  if (titleLower.includes('电子书') || titleLower.includes('book')) {
    tags.push('电子书');
  }
  if (titleLower.includes('图解') || titleLower.includes('图片')) {
    tags.push('图解');
  }
  if (titleLower.includes('心理') || titleLower.includes('psychology')) {
    tags.push('心理学');
  }
  if (titleLower.includes('法律') || titleLower.includes('legal')) {
    tags.push('法律');
  }
  if (titleLower.includes('工具')) {
    tags.push('实用工具');
  }
  if (titleLower.includes('资源')) {
    tags.push('资源');
  }
  
  // Ensure we have at least 2 tags, add generic ones if needed
  if (tags.length === 0) {
    tags.push('工具', '实用');
  } else if (tags.length === 1) {
    tags.push('实用');
  }
  
  return tags.slice(0, 4); // Limit to 4 tags max
}

// Read and parse the tools.ts file
function readToolsFile() {
  const filePath = path.join(__dirname, '..', 'src', 'data', 'tools.ts');
  return fs.readFileSync(filePath, 'utf8');
}

// Write the fixed tools.ts file
function writeToolsFile(content) {
  const filePath = path.join(__dirname, '..', 'src', 'data', 'tools.ts');
  fs.writeFileSync(filePath, content, 'utf8');
}

// Extract tool objects with line numbers for targeted fixes
function identifyProblems(content) {
  const lines = content.split('\n');
  const problems = {
    emptySlugs: [],
    placeholderUrls: [],
    emptyTags: []
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNum = i + 1;
    
    if (line === "slug: '',") {
      problems.emptySlugs.push(lineNum);
    }
    if (line === "url: 'https://example.com',") {
      problems.placeholderUrls.push(lineNum);
    }
    if (line === "tags: [],") {
      problems.emptyTags.push(lineNum);
    }
  }
  
  return problems;
}

// Main execution
function main() {
  console.log('🔧 Starting MatrixTools data integrity fixes...\n');
  
  const content = readToolsFile();
  const problems = identifyProblems(content);
  
  console.log('📊 Issues found:');
  console.log(`- Empty slugs: ${problems.emptySlugs.length} tools`);
  console.log(`- Placeholder URLs: ${problems.placeholderUrls.length} tools`);
  console.log(`- Empty tags: ${problems.emptyTags.length} tools`);
  console.log('');
  
  // The actual fixes will be applied by the MultiEdit tool
  // This script just identifies and reports the issues
  
  console.log('✅ Analysis complete. Ready for fixes to be applied.');
  
  return problems;
}

if (require.main === module) {
  main();
}

module.exports = { generateSlug, generateTags, identifyProblems };