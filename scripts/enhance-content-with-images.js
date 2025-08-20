const fs = require('fs');
const path = require('path');

const toolsFilePath = path.join(__dirname, '..', 'src', 'data', 'tools.ts');

function enhanceContentWithImages() {
  try {
    console.log('\n🖼️  开始为工具详细内容添加图片...');
    
    let toolsContent = fs.readFileSync(toolsFilePath, 'utf8');
    
    // 为特定工具添加图片到详细内容中
    const imageEnhancements = [
      {
        toolName: 'New API',
        imageUrl: 'https://www.ahhhhfs.com/wp-content/uploads/2025/07/New-API%EF%BC%9A%E5%BC%80%E6%BA%90%E5%A4%A7%E6%A8%A1%E5%9E%8B%E7%BD%91%E5%85%B3%E4%B8%8E-AI-%E8%B5%84%E4%BA%A7%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%EF%BC%8C30-%E6%9C%8D%E5%8A%A1%E5%95%86%E6%94%AF%E6%8C%81%EF%BC%81-main.jpg',
        insertAfter: '## New API概览'
      },
      {
        toolName: 'Bigjpg',
        imageUrl: 'https://www.ahhhhfs.com/wp-content/uploads/2025/07/Bigjpg%EF%BC%9AAI%E5%9B%BE%E7%89%87%E6%97%A0%E6%8D%9F%E6%94%BE%E5%A4%A7%E7%A5%9E%E5%99%A8%EF%BC%8C4K%E8%B6%85%E6%B8%85%E6%94%BE%E5%A4%A732%E5%80%8D%EF%BC%81.jpg',
        insertAfter: '## Bigjpg概述'
      },
      {
        toolName: 'PoPo',
        imageUrl: 'https://www.ahhhhfs.com/wp-content/uploads/2025/08/PoPo%E5%BC%80%E6%BA%90AI%E5%B7%A5%E5%85%B7%EF%BC%9A%E7%94%A8%E8%87%AA%E7%84%B6%E8%AF%AD%E8%A8%80%E7%94%9F%E6%88%90MMD%E8%A7%92%E8%89%B2%E5%8A%A8%E4%BD%9C%E4%B8%8E%E8%A1%A8%E6%83%85.jpg',
        insertAfter: '## PoPo简介'
      },
      {
        toolName: 'Read Frog',
        imageUrl: 'https://www.ahhhhfs.com/wp-content/uploads/2025/08/Read-Frog%EF%BC%88%E9%99%AA%E8%AF%BB%E8%9B%99%EF%BC%89%EF%BC%9A%E5%BC%80%E6%BA%90-AI-%E6%B5%8F%E8%A7%88%E5%99%A8%E8%AF%AD%E8%A8%80%E5%AD%A6%E4%B9%A0%E6%89%A9%E5%B1%95%EF%BC%8C%E6%B2%89%E6%B5%B8%E5%BC%8F%E7%BF%BB%E8%AF%91%E4%B8%8E%E6%96%87%E7%AB%A0%E7%90%86%E8%A7%A3.jpg',
        insertAfter: '## Read Frog 功能特色'
      }
    ];
    
    let updatedCount = 0;
    
    imageEnhancements.forEach(enhancement => {
      const { toolName, imageUrl, insertAfter } = enhancement;
      
      // 查找包含该工具的详细内容
      const toolBlockRegex = new RegExp(
        `(detailedContent:\\s*\`[^]*?${escapeRegex(insertAfter)}[^]*?)\``,
        'gs'
      );
      
      const match = toolBlockRegex.exec(toolsContent);
      if (match) {
        const imageMarkdown = `\\n\\n![${toolName}示例图片](${imageUrl})\\n*${toolName}功能展示*\\n`;
        
        // 在指定位置后插入图片
        const newContent = match[1].replace(
          insertAfter,
          `${insertAfter}${imageMarkdown}`
        );
        
        toolsContent = toolsContent.replace(match[1], newContent);
        updatedCount++;
        console.log(`✅ 已为 "${toolName}" 添加图片展示`);
      } else {
        console.log(`⚠️  未找到 "${toolName}" 的详细内容`);
      }
    });
    
    // 为一些通用工具添加相关截图
    const genericImages = [
      {
        patterns: ['Figma', 'figma'],
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb',
        alt: 'Figma设计界面'
      },
      {
        patterns: ['VS Code', 'vscode'],
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb',
        alt: 'VS Code编程界面'
      },
      {
        patterns: ['Notion', 'notion'],
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb',
        alt: 'Notion工作空间'
      }
    ];
    
    genericImages.forEach(({ patterns, imageUrl, alt }) => {
      patterns.forEach(pattern => {
        const regex = new RegExp(
          `(detailedContent:\\s*\`[^]*?title.*${escapeRegex(pattern)}[^]*?)(\\n\\n## |\\n\\n### |$)`,
          'gsi'
        );
        
        toolsContent = toolsContent.replace(regex, (match, content, ending) => {
          if (!content.includes('![')) { // 只在没有图片时添加
            const imageMarkdown = `\\n\\n![${alt}](${imageUrl})\\n*${pattern}界面展示*\\n`;
            return content + imageMarkdown + ending;
          }
          return match;
        });
      });
    });
    
    // 保存更新后的文件
    fs.writeFileSync(toolsFilePath, toolsContent);
    
    console.log(`\\n✅ 内容增强完成！共更新了 ${updatedCount} 个工具的详细内容`);
    console.log(`📁 文件已保存: ${toolsFilePath}`);
    
  } catch (error) {
    console.error('❌ 处理过程中出现错误:', error.message);
    console.error(error.stack);
  }
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

// 运行脚本
enhanceContentWithImages();