#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// 需要从工具类移除的内容标题列表
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

async function backupFile(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup-${timestamp}`;
  const content = await fs.readFile(filePath, 'utf8');
  await fs.writeFile(backupPath, content);
  console.log(`✅ 备份创建成功: ${backupPath}`);
  return backupPath;
}

async function extractToolsToRemove(toolsFilePath) {
  const content = await fs.readFile(toolsFilePath, 'utf8');
  const removedTools = [];
  const lines = content.split('\n');

  let currentTool = [];
  let isInTool = false;
  let braceCount = 0;
  let shouldRemove = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 检测工具对象的开始
    if (line.includes('{') && !isInTool) {
      isInTool = true;
      currentTool = [line];
      braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;

      // 检查是否包含要移除的标题
      if (line.includes('title:')) {
        for (const title of titlesToRemove) {
          if (line.includes(title)) {
            shouldRemove = true;
            break;
          }
        }
      }
    } else if (isInTool) {
      currentTool.push(line);

      // 检查标题
      if (line.includes('title:')) {
        for (const title of titlesToRemove) {
          if (line.includes(title)) {
            shouldRemove = true;
            break;
          }
        }
      }

      // 更新括号计数
      braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;

      // 工具对象结束
      if (braceCount === 0) {
        if (shouldRemove) {
          removedTools.push(currentTool.join('\n'));
          console.log(`📋 提取工具: ${currentTool.find(l => l.includes('title:'))?.trim()}`);
        }

        currentTool = [];
        isInTool = false;
        shouldRemove = false;
      }
    }
  }

  return removedTools;
}

async function removeToolsFromFile(toolsFilePath) {
  const content = await fs.readFile(toolsFilePath, 'utf8');
  const lines = content.split('\n');
  const newLines = [];

  let isInTool = false;
  let braceCount = 0;
  let shouldRemove = false;
  let skipTool = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('{') && !isInTool) {
      isInTool = true;
      braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;

      // 向前查看是否包含要移除的标题
      for (const title of titlesToRemove) {
        if (content.slice(i, i + 1000).includes(title)) {
          shouldRemove = true;
          skipTool = true;
          break;
        }
      }

      if (!skipTool) {
        newLines.push(line);
      }
    } else if (isInTool) {
      if (!skipTool) {
        newLines.push(line);
      }

      braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;

      if (braceCount === 0) {
        isInTool = false;
        shouldRemove = false;
        skipTool = false;

        // 如果刚移除了一个工具，检查下一行是否是逗号
        if (skipTool && i + 1 < lines.length && lines[i + 1].trim() === ',') {
          i++; // 跳过逗号
        }
      }
    } else {
      newLines.push(line);
    }
  }

  // 清理多余的逗号
  let cleanedContent = newLines.join('\n');
  cleanedContent = cleanedContent.replace(/,(\s*),/g, ','); // 移除连续逗号
  cleanedContent = cleanedContent.replace(/,(\s*)\]/g, '\n]'); // 移除数组末尾的逗号

  await fs.writeFile(toolsFilePath, cleanedContent);
  console.log(`✅ 已从 tools.ts 中移除 ${titlesToRemove.length} 个内容`);
}

async function saveRemovedTools(removedTools) {
  const outputPath = path.join(__dirname, '..', 'removed-tools.json');
  await fs.writeFile(outputPath, JSON.stringify(removedTools, null, 2));
  console.log(`💾 移除的工具已保存到: ${outputPath}`);
  console.log('   可以手动将这些内容转换为教程格式后添加到 tutorials.ts');
}

async function main() {
  try {
    console.log('🚀 开始批量调整内容分类...\n');

    const toolsFilePath = path.join(__dirname, '..', 'src', 'data', 'tools.ts');

    // 1. 备份原文件
    console.log('📦 步骤 1: 备份原文件');
    await backupFile(toolsFilePath);

    // 2. 提取要移除的工具
    console.log('\n📋 步骤 2: 提取要移除的内容');
    const removedTools = await extractToolsToRemove(toolsFilePath);

    // 3. 保存移除的内容
    console.log('\n💾 步骤 3: 保存移除的内容');
    await saveRemovedTools(removedTools);

    // 4. 从 tools.ts 中移除内容
    console.log('\n✂️ 步骤 4: 从 tools.ts 中移除内容');
    await removeToolsFromFile(toolsFilePath);

    console.log('\n✨ 分类调整完成！');
    console.log('\n📝 下一步建议：');
    console.log('1. 检查 removed-tools.json 文件');
    console.log('2. 将内容转换为教程格式');
    console.log('3. 添加到 tutorials.ts 文件');
    console.log('4. 运行 npm run dev 测试变更');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();