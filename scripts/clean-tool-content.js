const fs = require('fs');
const path = require('path');

const toolsFilePath = path.join(__dirname, '../src/data/tools.ts');

function cleanToolContent() {
  try {
    // 读取工具数据文件
    const content = fs.readFileSync(toolsFilePath, 'utf8');
    
    // 匹配和移除"本文链接"相关内容
    // 匹配模式：本文链接：[URL](URL) 
    const linkPattern = /\n\n本文链接：\[https:\/\/www\.ahhhhfs\.com\/[^\]]+\]\(https:\/\/www\.ahhhhfs\.com\/[^\)]+\)/g;
    
    let cleanedContent = content.replace(linkPattern, '');
    
    // 移除可能的其他变体
    const linkPattern2 = /本文链接：[^\n]*\n?/g;
    cleanedContent = cleanedContent.replace(linkPattern2, '');
    
    // 确保官网地址部分结束后没有多余的空行
    cleanedContent = cleanedContent.replace(/官网地址：[^\n]*\n\n+`/g, '官网地址：$&'.replace(/\n\n+/, '\n'));
    
    // 修复可能出现的多个连续换行
    cleanedContent = cleanedContent.replace(/\n{3,}/g, '\n\n');
    
    // 备份原文件
    const backupPath = toolsFilePath + '.backup-' + Date.now();
    fs.writeFileSync(backupPath, content);
    console.log(`原文件已备份到: ${backupPath}`);
    
    // 写入清理后的内容
    fs.writeFileSync(toolsFilePath, cleanedContent);
    
    // 统计清理结果
    const originalLinks = (content.match(/本文链接：/g) || []).length;
    const remainingLinks = (cleanedContent.match(/本文链接：/g) || []).length;
    
    console.log(`清理完成:`);
    console.log(`- 原始"本文链接"数量: ${originalLinks}`);
    console.log(`- 清理后剩余数量: ${remainingLinks}`);
    console.log(`- 已清理数量: ${originalLinks - remainingLinks}`);
    
    return true;
  } catch (error) {
    console.error('清理工具内容时出错:', error);
    return false;
  }
}

// 执行清理
if (require.main === module) {
  console.log('开始清理工具内容...');
  const success = cleanToolContent();
  if (success) {
    console.log('✅ 工具内容清理完成');
  } else {
    console.log('❌ 工具内容清理失败');
    process.exit(1);
  }
}

module.exports = { cleanToolContent };