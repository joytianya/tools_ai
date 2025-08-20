const fs = require('fs');
const path = require('path');

const toolsFilePath = path.join(__dirname, '..', 'src', 'data', 'tools.ts');

function addGenericImages() {
  try {
    console.log('\n🎨 开始为工具添加通用示例图片...');
    
    let toolsContent = fs.readFileSync(toolsFilePath, 'utf8');
    
    // 根据工具类型和名称添加相关图片
    const imageMapping = [
      // AI工具
      {
        patterns: ['AI', 'GPT', 'ChatGPT', '人工智能', '机器学习'],
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb',
        alt: 'AI人工智能技术'
      },
      // 设计工具
      {
        patterns: ['Figma', 'Sketch', '设计', 'UI', 'UX', 'Photoshop'],
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb',
        alt: '设计工具界面'
      },
      // 编程工具
      {
        patterns: ['VS Code', 'GitHub', '编程', '代码', 'IDE', 'Git'],
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb',
        alt: '编程开发环境'
      },
      // 生产力工具
      {
        patterns: ['Notion', 'Trello', '效率', '项目管理', '笔记'],
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb',
        alt: '生产力工具界面'
      },
      // 图片处理
      {
        patterns: ['图片', '图像', 'Image', '放大', '压缩'],
        imageUrl: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb',
        alt: '图片处理工具'
      },
      // 数据分析
      {
        patterns: ['Analytics', '分析', '数据', 'Google Analytics'],
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb',
        alt: '数据分析工具'
      },
      // 通讯工具
      {
        patterns: ['Slack', '邮件', 'Email', '通讯', '聊天'],
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb',
        alt: '通讯协作工具'
      }
    ];
    
    let updatedCount = 0;
    
    // 为每个工具添加对应的示例图片
    imageMapping.forEach(({ patterns, imageUrl, alt }) => {
      patterns.forEach(pattern => {
        // 匹配包含该关键词的工具，且还没有图片的
        const regex = new RegExp(
          `(detailedContent:\\s*\`[^]*?(?:title|description).*?${escapeRegex(pattern)}[^]*?)(\\n\\n##[^\\n]*?\\n)`,
          'gsi'
        );
        
        toolsContent = toolsContent.replace(regex, (match, content, heading) => {
          // 只为还没有图片的工具添加
          if (!content.includes('![') && !content.includes('<img')) {
            const imageMarkdown = `\\n\\n![${alt}](${imageUrl})\\n*${pattern}工具示例*\\n`;
            updatedCount++;
            console.log(`✅ 为包含 "${pattern}" 的工具添加了示例图片`);
            return content + imageMarkdown + heading;
          }
          return match;
        });
      });
    });
    
    // 为详细内容很长但没有图片的工具添加通用图片
    const longContentRegex = /(detailedContent:\s*\`[^]*?#{1,3}\s*[^#\n]*?\n\n)([^]*?)(\n\n#{1,3}|\`$)/gs;
    
    toolsContent = toolsContent.replace(longContentRegex, (match, start, middle, end) => {
      // 如果内容很长（超过500字符）但没有图片，添加通用图片
      if (middle.length > 500 && !middle.includes('![') && !middle.includes('<img')) {
        const genericImage = `\\n\\n![工具功能展示](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=entropy&cs=tinysrgb)\\n*功能特性展示*\\n`;
        updatedCount++;
        console.log(`✅ 为长内容工具添加了通用示例图片`);
        return start + middle + genericImage + end;
      }
      return match;
    });
    
    // 保存更新后的文件
    fs.writeFileSync(toolsFilePath, toolsContent);
    
    console.log(`\\n✅ 图片添加完成！共为 ${updatedCount} 个位置添加了示例图片`);
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
addGenericImages();