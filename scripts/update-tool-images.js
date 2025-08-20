const fs = require('fs');
const path = require('path');

// 读取图片提取结果
const resultsPath = path.join(__dirname, 'image-extraction-result.json');
const toolsFilePath = path.join(__dirname, '..', 'src', 'data', 'tools.ts');

function updateToolImages() {
  try {
    const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    const matches = results.matches;
    
    console.log(`\n🔄 开始更新工具图片链接...`);
    
    // 读取当前工具文件
    let toolsContent = fs.readFileSync(toolsFilePath, 'utf8');
    
    // 过滤出有效的图片链接（排除SVG占位符）
    const validMatches = matches.filter(match => 
      match.imageUrl && 
      !match.imageUrl.startsWith('data:image/svg+xml') &&
      match.imageUrl.startsWith('http')
    );
    
    console.log(`📸 找到 ${validMatches.length} 个有效的图片链接`);
    
    let updatedCount = 0;
    
    // 创建工具名称到图片URL的映射
    const imageMap = new Map();
    
    validMatches.forEach(match => {
      // 尝试匹配不同的工具名称变体
      const possibleNames = [
        match.originalTitle,
        extractMainToolName(match.originalTitle),
        extractFirstWord(match.originalTitle)
      ].filter(Boolean);
      
      possibleNames.forEach(name => {
        imageMap.set(name, match.imageUrl);
      });
    });
    
    console.log('\n🎯 图片映射:');
    imageMap.forEach((url, name) => {
      console.log(`  "${name}" -> ${url.substring(0, 80)}...`);
    });
    
    // 手动映射一些已知的工具
    const manualMappings = [
      { 
        patterns: ['New API', 'new-api'],
        imageUrl: 'https://www.ahhhhfs.com/wp-content/uploads/2025/07/New-API%EF%BC%9A%E5%BC%80%E6%BA%90%E5%A4%A7%E6%A8%A1%E5%9E%8B%E7%BD%91%E5%85%B3%E4%B8%8E-AI-%E8%B5%84%E4%BA%A7%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%EF%BC%8C30-%E6%9C%8D%E5%8A%A1%E5%95%86%E6%94%AF%E6%8C%81%EF%BC%81-main.jpg'
      },
      {
        patterns: ['Bigjpg', 'bigjpg'],
        imageUrl: 'https://www.ahhhhfs.com/wp-content/uploads/2025/07/Bigjpg%EF%BC%9AAI%E5%9B%BE%E7%89%87%E6%97%A0%E6%8D%9F%E6%94%BE%E5%A4%A7%E7%A5%9E%E5%99%A8%EF%BC%8C4K%E8%B6%85%E6%B8%85%E6%94%BE%E5%A4%A732%E5%80%8D%EF%BC%81.jpg'
      },
      {
        patterns: ['PoPo', 'popo'],
        imageUrl: 'https://www.ahhhhfs.com/wp-content/uploads/2025/08/PoPo%E5%BC%80%E6%BA%90AI%E5%B7%A5%E5%85%B7%EF%BC%9A%E7%94%A8%E8%87%AA%E7%84%B6%E8%AF%AD%E8%A8%80%E7%94%9F%E6%88%90MMD%E8%A7%92%E8%89%B2%E5%8A%A8%E4%BD%9C%E4%B8%8E%E8%A1%A8%E6%83%85.jpg'
      },
      {
        patterns: ['Read Frog', 'readfrog', '陪读蛙'],
        imageUrl: 'https://www.ahhhhfs.com/wp-content/uploads/2025/08/Read-Frog%EF%BC%88%E9%99%AA%E8%AF%BB%E8%9B%99%EF%BC%89%EF%BC%9A%E5%BC%80%E6%BA%90-AI-%E6%B5%8F%E8%A7%88%E5%99%A8%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0%E6%89%A9%E5%B1%95%EF%BC%8C%E6%B2%89%E6%B5%B8%E5%BC%8F%E7%BF%BB%E8%AF%91%E4%B8%8E%E6%96%87%E7%AB%A0%E7%90%86%E8%A7%A3.jpg'
      }
    ];
    
    // 应用手动映射
    manualMappings.forEach(mapping => {
      mapping.patterns.forEach(pattern => {
        const regex = new RegExp(`title:\\s*['"\`]([^'"\`]*${pattern}[^'"\`]*)['"\`]`, 'gi');
        let match;
        while ((match = regex.exec(toolsContent)) !== null) {
          console.log(`🎯 找到匹配的工具: "${match[1]}" -> 将添加图片`);
          // 更新imageUrl
          const toolBlockRegex = new RegExp(`(\\{[^}]*title:\\s*['"\`]${escapeRegex(match[1])}['"\`][^}]*?)imageUrl:\\s*undefined,`, 'gs');
          const replacement = `$1imageUrl: '${mapping.imageUrl}',`;
          if (toolBlockRegex.test(toolsContent)) {
            toolsContent = toolsContent.replace(toolBlockRegex, replacement);
            updatedCount++;
            console.log(`✅ 已更新 "${match[1]}" 的图片链接`);
          }
        }
      });
    });
    
    // 保存更新后的文件
    fs.writeFileSync(toolsFilePath, toolsContent);
    
    console.log(`\n✅ 更新完成！共更新了 ${updatedCount} 个工具的图片链接`);
    console.log(`📁 文件已保存: ${toolsFilePath}`);
    
  } catch (error) {
    console.error('❌ 更新过程中出现错误:', error.message);
    console.error(error.stack);
  }
}

function extractMainToolName(title) {
  // 提取主要工具名称（去除描述部分）
  const match = title.match(/^([^：:]+)/);
  return match ? match[1].trim() : null;
}

function extractFirstWord(title) {
  // 提取第一个词
  const match = title.match(/^([A-Za-z0-9]+)/);
  return match ? match[1] : null;
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

// 运行脚本
updateToolImages();