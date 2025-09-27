#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// 需要从工具类移除的内容标题列表（精确匹配）
const titlesToRemove = [
  '调qing一点通 – 晚熟青年',
  '法律相关电子书',
  '全国独家研学手册',
  '冷眼观爱 七天找到女朋友',
  '生财宝典（100位生财高手的判断路径和经验）',
  '怎样打开自学之门',
  '完全图解恋爱心理学',
  '如何让你爱的人爱上你',
  '欧阳春晓：6周维密薄肌线条弹力带普拉提',
  '如何利用下班时间写作',
  '步某非烟第1-4季 合集',
  '大学同学提升幸福感实用教程'
];

async function main() {
  try {
    console.log('🚀 开始批量调整内容分类...\n');

    const toolsFilePath = path.join(__dirname, '..', 'src', 'data', 'tools.ts');

    // 1. 备份原文件
    console.log('📦 步骤 1: 备份原文件');
    const timestamp = Date.now();
    const backupPath = `${toolsFilePath}.backup-adjustment-${timestamp}`;
    const originalContent = await fs.readFile(toolsFilePath, 'utf8');
    await fs.writeFile(backupPath, originalContent);
    console.log(`✅ 备份创建成功: ${backupPath}`);

    // 2. 解析并处理内容
    console.log('\n✂️ 步骤 2: 移除指定的工具');

    // 提取 tools 数组部分
    const toolsArrayMatch = originalContent.match(/export const tools:\s*Tool\[\]\s*=\s*\[([\s\S]*?)\];/);

    if (!toolsArrayMatch) {
      throw new Error('无法找到 tools 数组');
    }

    const toolsArrayContent = toolsArrayMatch[1];
    const removedTools = [];
    let processedContent = toolsArrayContent;
    let removedCount = 0;

    // 对每个要移除的标题进行处理
    for (const title of titlesToRemove) {
      // 转义标题中的特殊字符
      const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // 创建匹配整个工具对象的正则表达式
      // 这个正则会匹配从 { 开始到对应的 } 结束的整个对象
      const toolRegex = new RegExp(
        `\\{[^{}]*title:\\s*['"\`]${escapedTitle}['"\`][^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}`,
        'g'
      );

      const matches = processedContent.match(toolRegex);

      if (matches && matches.length > 0) {
        console.log(`  ✂️ 移除: ${title}`);
        removedTools.push({
          title: title,
          content: matches[0]
        });

        // 移除工具对象及其后面可能的逗号
        processedContent = processedContent.replace(
          new RegExp(`\\{[^{}]*title:\\s*['"\`]${escapedTitle}['"\`][^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\},?\\s*`, 'g'),
          ''
        );
        removedCount++;
      }
    }

    // 清理可能的尾部逗号
    processedContent = processedContent.replace(/,(\s*)$/, '$1');

    // 重新组合文件内容
    const newContent = originalContent.replace(
      /export const tools:\s*Tool\[\]\s*=\s*\[([\s\S]*?)\];/,
      `export const tools: Tool[] = [${processedContent}];`
    );

    // 3. 保存修改后的文件
    console.log('\n💾 步骤 3: 保存修改后的文件');
    await fs.writeFile(toolsFilePath, newContent);

    // 4. 保存移除的内容供参考
    if (removedTools.length > 0) {
      const removedFilePath = path.join(__dirname, '..', 'removed-tools.json');
      await fs.writeFile(removedFilePath, JSON.stringify(removedTools, null, 2));
      console.log(`✅ 已保存 ${removedTools.length} 个移除的工具到: removed-tools.json`);
    }

    console.log('\n✨ 分类调整完成！');
    console.log(`📊 共移除 ${removedCount} 个内容`);

    if (removedCount < titlesToRemove.length) {
      console.log(`⚠️  注意: 有 ${titlesToRemove.length - removedCount} 个标题未找到`);
    }

    console.log('\n📝 下一步建议：');
    console.log('1. 检查 removed-tools.json 文件');
    console.log('2. 将内容转换为教程格式');
    console.log('3. 添加到 tutorials.ts 文件');
    console.log('4. 运行 npm run dev 测试变更');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();