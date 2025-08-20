const fs = require('fs');
const path = require('path');

const toolsFilePath = path.join(__dirname, '../src/data/tools.ts');

function organizeToolImages() {
  try {
    // 读取工具数据文件
    const content = fs.readFileSync(toolsFilePath, 'utf8');
    
    console.log('开始处理工具图片组织...');
    
    // 处理每个工具条目
    let processedContent = content;
    
    // 匹配工具对象的正则表达式
    const toolPattern = /(\{\s*id:\s*'[^']+',[\s\S]*?detailedContent:\s*`)([\s\S]*?)(`[\s\S]*?\},)/g;
    
    let matchCount = 0;
    
    processedContent = processedContent.replace(toolPattern, (match, prefix, detailedContent, suffix) => {
      matchCount++;
      
      // 在详细内容中查找并处理图片
      let updatedDetailedContent = detailedContent;
      
      // 1. 移除"本文链接"行
      updatedDetailedContent = updatedDetailedContent.replace(/\n\n本文链接：\[https:\/\/www\.ahhhhfs\.com\/[^\]]+\]\(https:\/\/www\.ahhhhfs\.com\/[^\)]+\)/g, '');
      updatedDetailedContent = updatedDetailedContent.replace(/本文链接：[^\n]*\n?/g, '');
      
      // 2. 查找工具相关的图片链接（通常在imageUrl字段中）
      const imageUrlMatch = match.match(/imageUrl:\s*'([^']*ahhhhfs\.com[^']*)'/);
      
      if (imageUrlMatch) {
        const imageUrl = imageUrlMatch[1];
        const toolTitleMatch = match.match(/title:\s*'([^']+)'/);
        const toolTitle = toolTitleMatch ? toolTitleMatch[1] : '工具';
        
        // 3. 在介绍开头添加工具截图（如果还没有的话）
        if (!updatedDetailedContent.includes('![') && imageUrl) {
          // 查找第一个标题后添加图片
          const firstHeaderMatch = updatedDetailedContent.match(/(# [^\n]+\n)/);
          if (firstHeaderMatch) {
            const insertPosition = firstHeaderMatch.index + firstHeaderMatch[1].length;
            const imageMarkdown = `\n![${toolTitle}截图](${imageUrl})\n*${toolTitle}界面展示*\n`;
            updatedDetailedContent = updatedDetailedContent.slice(0, insertPosition) + 
                                   imageMarkdown + 
                                   updatedDetailedContent.slice(insertPosition);
          }
        }
      }
      
      // 4. 清理多余的空行
      updatedDetailedContent = updatedDetailedContent.replace(/\n{3,}/g, '\n\n');
      
      // 5. 确保官网地址后正确结束
      updatedDetailedContent = updatedDetailedContent.replace(/官网地址：[^\n]*\n*$/, (match) => {
        return match.replace(/\n+$/, '');
      });
      
      return prefix + updatedDetailedContent + suffix;
    });
    
    // 备份原文件
    const backupPath = toolsFilePath + '.backup-images-' + Date.now();
    fs.writeFileSync(backupPath, content);
    console.log(`原文件已备份到: ${backupPath}`);
    
    // 写入处理后的内容
    fs.writeFileSync(toolsFilePath, processedContent);
    
    console.log(`图片组织完成:`);
    console.log(`- 处理的工具数量: ${matchCount}`);
    
    // 统计清理结果
    const originalLinks = (content.match(/本文链接：/g) || []).length;
    const remainingLinks = (processedContent.match(/本文链接：/g) || []).length;
    console.log(`- 清理的"本文链接"数量: ${originalLinks - remainingLinks}`);
    
    return true;
  } catch (error) {
    console.error('组织工具图片时出错:', error);
    return false;
  }
}

// 执行图片组织
if (require.main === module) {
  console.log('开始组织工具图片...');
  const success = organizeToolImages();
  if (success) {
    console.log('✅ 工具图片组织完成');
  } else {
    console.log('❌ 工具图片组织失败');
    process.exit(1);
  }
}

module.exports = { organizeToolImages };