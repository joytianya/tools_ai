const fs = require('fs');
const path = require('path');

// 读取已处理的工具数据
const filteredToolsPath = path.join(__dirname, 'converted-content', 'filtered-tools-v2.json');
const currentToolsPath = path.join(__dirname, '..', 'src', 'data', 'tools.ts');

function extractImagesFromArticles() {
  try {
    // 读取已处理的工具数据
    const filteredData = JSON.parse(fs.readFileSync(filteredToolsPath, 'utf8'));
    const articleTools = filteredData.tools;
    
    console.log(`\n📊 找到 ${articleTools.length} 个已处理的工具数据`);
    
    // 统计图片信息
    const toolsWithImages = articleTools.filter(tool => tool.imageUrl && tool.imageUrl !== '#');
    console.log(`🖼️  其中 ${toolsWithImages.length} 个工具包含图片链接`);
    
    // 显示一些图片链接示例
    console.log('\n🖼️  图片链接示例:');
    toolsWithImages.slice(0, 5).forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.title}`);
      console.log(`   图片: ${tool.imageUrl}`);
      console.log('');
    });
    
    // 读取当前工具数据文件
    const currentToolsContent = fs.readFileSync(currentToolsPath, 'utf8');
    
    // 查找匹配的工具并提取图片链接
    const matchedImages = [];
    
    articleTools.forEach(articleTool => {
      if (!articleTool.imageUrl || articleTool.imageUrl === '#') return;
      
      // 尝试通过标题匹配
      const titleMatch = findToolByTitle(currentToolsContent, articleTool.title);
      if (titleMatch) {
        matchedImages.push({
          originalTitle: titleMatch,
          articleTitle: articleTool.title,
          imageUrl: articleTool.imageUrl,
          detailedContent: articleTool.detailedContent || ''
        });
      }
    });
    
    console.log(`\n🎯 成功匹配 ${matchedImages.length} 个工具的图片`);
    
    // 生成更新建议
    const suggestions = generateUpdateSuggestions(matchedImages);
    
    // 保存结果
    const resultPath = path.join(__dirname, 'image-extraction-result.json');
    fs.writeFileSync(resultPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalArticleTools: articleTools.length,
      toolsWithImages: toolsWithImages.length,
      matchedImages: matchedImages.length,
      matches: matchedImages,
      suggestions
    }, null, 2));
    
    console.log(`\n✅ 结果已保存到: ${resultPath}`);
    console.log('\n📝 更新建议:');
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion}`);
    });
    
  } catch (error) {
    console.error('❌ 处理过程中出现错误:', error.message);
  }
}

function findToolByTitle(content, articleTitle) {
  // 尝试通过关键词匹配
  const keywords = extractKeywords(articleTitle);
  
  for (const keyword of keywords) {
    if (keyword.length > 2 && content.toLowerCase().includes(keyword.toLowerCase())) {
      // 查找包含该关键词的工具标题
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.includes('title:') && line.toLowerCase().includes(keyword.toLowerCase())) {
          const titleMatch = line.match(/title:\s*['"`]([^'"`]+)['"`]/);
          if (titleMatch) {
            return titleMatch[1];
          }
        }
      }
    }
  }
  
  return null;
}

function extractKeywords(title) {
  // 提取标题中的关键词
  return title.split(/[：:、，,\s]+/)
    .filter(word => word.length > 1)
    .slice(0, 3); // 只取前3个关键词
}

function generateUpdateSuggestions(matches) {
  const suggestions = [];
  
  matches.forEach(match => {
    suggestions.push(
      `更新 "${match.originalTitle}" 的图片链接为: ${match.imageUrl}`
    );
  });
  
  if (matches.length > 0) {
    suggestions.push('建议在详细内容中添加相关图片展示，提升用户体验');
    suggestions.push('考虑为图片添加适当的alt文本和说明');
  }
  
  return suggestions;
}

// 运行脚本
extractImagesFromArticles();