#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// 分类调整映射
const categoryMapping = {
  // ID -> 新分类
  '36': '个人成长',  // 调qing一点通 – 晚熟青年
  '37': '知识资源',  // 法律相关电子书
  '38': '知识资源',  // 全国独家研学手册
  '39': '个人成长',  // 冷眼观爱 七天找到女朋友
  '40': '商业增长',  // 生财宝典（保持不变）
  '41': '学习方法',  // 怎样打开自学之门
  '42': '个人成长',  // 完全图解恋爱心理学
  '43': '个人成长',  // 如何让你爱的人爱上你
  '44': '生活技能',  // 欧阳春晓：6周维密薄肌线条弹力带普拉提
  '45': '生活技能',  // 如何利用下班时间写作
  '46': '知识资源',  // 步某非烟第1-4季 合集
  '47': '个人成长',  // 大学同学提升幸福感实用教程
  '27': '效率精通',  // 远程工作工具栈完整配置
};

// 标题到分类的映射（用于验证）
const titleToCategoryMap = {
  '调qing一点通 – 晚熟青年': '个人成长',
  '法律相关电子书': '知识资源',
  '全国独家研学手册': '知识资源',
  '冷眼观爱 七天找到女朋友': '个人成长',
  '生财宝典（100位生财高手的判断路径和经验）': '商业增长',
  '怎样打开自学之门': '学习方法',
  '完全图解恋爱心理学': '个人成长',
  '如何让你爱的人爱上你': '个人成长',
  '欧阳春晓：6周维密薄肌线条弹力带普拉提': '生活技能',
  '如何利用下班时间写作': '生活技能',
  '步某非烟第1-4季 合集': '知识资源',
  '大学同学提升幸福感实用教程': '个人成长',
  '远程工作工具栈完整配置': '效率精通',
};

async function updateTutorialCategories() {
  const tutorialsPath = path.join(__dirname, '..', 'src', 'data', 'tutorials.ts');

  // 备份文件
  const timestamp = Date.now();
  const backupPath = `${tutorialsPath}.backup-category-${timestamp}`;
  const content = await fs.readFile(tutorialsPath, 'utf8');
  await fs.writeFile(backupPath, content);
  console.log(`✅ 备份创建: ${backupPath}\n`);

  let updatedContent = content;
  let updateCount = 0;

  // 处理每个需要更新的教程
  for (const [id, newCategory] of Object.entries(categoryMapping)) {
    // 创建匹配ID的正则表达式
    const idRegex = new RegExp(`(id:\\s*'${id}'[^}]*?category:\\s*')([^']+)(')`);

    if (idRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(idRegex, `$1${newCategory}$3`);
      console.log(`✅ 更新 ID ${id}: -> ${newCategory}`);
      updateCount++;
    }
  }

  // 处理通过标题匹配的教程
  for (const [title, newCategory] of Object.entries(titleToCategoryMap)) {
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const titleRegex = new RegExp(
      `(title:\\s*'${escapedTitle}'[^}]*?category:\\s*')([^']+)(')`,
      'g'
    );

    if (titleRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(titleRegex, (match, p1, oldCategory, p3) => {
        if (oldCategory !== newCategory) {
          console.log(`✅ 更新 "${title}": ${oldCategory} -> ${newCategory}`);
          updateCount++;
          return `${p1}${newCategory}${p3}`;
        }
        return match;
      });
    }
  }

  // 保存更新后的文件
  await fs.writeFile(tutorialsPath, updatedContent);
  console.log(`\n✨ 分类优化完成！共更新 ${updateCount} 个教程`);

  // 统计新的分类分布
  const categories = {};
  const categoryRegex = /category:\s*'([^']+)'/g;
  let match;

  while ((match = categoryRegex.exec(updatedContent)) !== null) {
    const category = match[1];
    categories[category] = (categories[category] || 0) + 1;
  }

  console.log('\n📊 新的分类分布：');
  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  for (const [category, count] of sortedCategories) {
    console.log(`  ${category}: ${count}个`);
  }

  // 检查是否有未使用的新分类
  const newCategories = ['个人成长', '学习方法', '生活技能', '知识资源'];
  const unusedCategories = newCategories.filter(cat => !categories[cat]);

  if (unusedCategories.length === 0) {
    console.log('\n✅ 所有新分类都已被使用');
  } else {
    console.log('\n⚠️  未使用的新分类：', unusedCategories.join(', '));
  }
}

async function main() {
  try {
    console.log('🚀 开始优化教程分类结构...\n');
    await updateTutorialCategories();

    console.log('\n📝 下一步：');
    console.log('1. 运行 npm run dev 测试');
    console.log('2. 检查教程页面分类筛选功能');
    console.log('3. 确认所有教程显示正常');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();