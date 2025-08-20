const fs = require('fs');
const path = require('path');

const toolsFilePath = path.join(__dirname, '../src/data/tools.ts');

function finalCleanup() {
  try {
    // 读取工具数据文件
    let content = fs.readFileSync(toolsFilePath, 'utf8');
    
    console.log('开始最终清理...');
    
    // 1. 移除所有"本文链接"相关内容的变体
    const patterns = [
      /\n\n本文链接：\[https:\/\/www\.ahhhhfs\.com\/[^\]]+\]\(https:\/\/www\.ahhhhfs\.com\/[^\)]+\)/g,
      /本文链接：\[https:\/\/www\.ahhhhfs\.com\/[^\]]+\]\(https:\/\/www\.ahhhhfs\.com\/[^\)]+\)\n?/g,
      /本文链接：[^\n]*ahhhhfs\.com[^\n]*\n?/g,
      /本文链接：[^\n]*\n?/g,
    ];
    
    let cleanedCount = 0;
    patterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        cleanedCount += matches.length;
        console.log(`模式 ${index + 1}: 找到 ${matches.length} 个匹配`);
      }
      content = content.replace(pattern, '');
    });
    
    // 2. 清理markdown内容中的"本文链接"段落
    content = content.replace(/## [^#]*官网地址[\s\S]*?本文链接：[^\n]*\n/g, (match) => {
      return match.replace(/\n\n本文链接：[^\n]*/, '');
    });
    
    // 3. 在markdown内容结尾部分删除"本文链接"
    content = content.replace(/官网地址：[^\n]*\n\n本文链接：[^\n]*(`|$)/g, '官网地址：$&'.replace(/\n\n本文链接：[^\n]*/, '$1'));
    
    // 4. 修复可能的多余换行
    content = content.replace(/\n{3,}/g, '\n\n');
    
    // 5. 修复以`,`结尾的detailedContent
    content = content.replace(/官网地址：[^\n]*\n*`/g, (match) => {
      return match.replace(/\n+`/, '`');
    });
    
    // 备份原文件
    const backupPath = toolsFilePath + '.backup-final-' + Date.now();
    fs.writeFileSync(backupPath, fs.readFileSync(toolsFilePath, 'utf8'));
    console.log(`原文件已备份到: ${backupPath}`);
    
    // 写入清理后的内容
    fs.writeFileSync(toolsFilePath, content);
    
    // 统计清理结果
    const remainingLinks = (content.match(/本文链接/g) || []).length;
    
    console.log(`最终清理完成:`);
    console.log(`- 总共清理的"本文链接"数量: ${cleanedCount}`);
    console.log(`- 清理后剩余数量: ${remainingLinks}`);
    
    if (remainingLinks > 0) {
      console.log('仍有残留的"本文链接"，继续清理...');
      // 如果还有残留，再执行一次更激进的清理
      content = content.replace(/本文链接[^\n]*/g, '');
      content = content.replace(/\n{3,}/g, '\n\n');
      fs.writeFileSync(toolsFilePath, content);
      
      const finalCount = (content.match(/本文链接/g) || []).length;
      console.log(`- 激进清理后剩余数量: ${finalCount}`);
    }
    
    return true;
  } catch (error) {
    console.error('最终清理时出错:', error);
    return false;
  }
}

// 执行最终清理
if (require.main === module) {
  console.log('开始最终清理工具内容...');
  const success = finalCleanup();
  if (success) {
    console.log('✅ 最终清理完成');
  } else {
    console.log('❌ 最终清理失败');
    process.exit(1);
  }
}

module.exports = { finalCleanup };