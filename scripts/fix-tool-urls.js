const fs = require('fs');
const path = require('path');

const toolsFilePath = path.join(__dirname, '..', 'src', 'data', 'tools.ts');

function fixToolUrls() {
  try {
    console.log('\n🔗 开始修复工具链接...');
    
    let toolsContent = fs.readFileSync(toolsFilePath, 'utf8');
    
    // 已知工具的真实链接映射
    const knownUrls = [
      // AI工具
      { name: 'New API', url: 'https://github.com/QuantumNous/new-api' },
      { name: 'Bigjpg', url: 'https://bigjpg.com/' },
      { name: 'PoPo', url: 'https://popo.love/' },
      { name: 'UP简历', url: 'https://www.upresume.com/' },
      { name: 'Cloudflare AI', url: 'https://playground.ai.cloudflare.com/' },
      { name: 'OfferIN AI', url: 'https://offerin.ai/' },
      { name: 'Hard Usernames', url: 'https://hardusernames.com/' },
      { name: 'AI-PROXY', url: 'https://aceproxy.xyz/' },
      { name: 'LLM API Test', url: 'https://llmapitest.com/' },
      { name: 'AI Silhouette Generator', url: 'https://aisiliouettegenerator.com/' },
      { name: '爱写作AI小说平台', url: 'https://axz.ai/' },
      { name: 'AI Line Art Generator', url: 'https://ailineartgenerator.com/' },
      { name: 'Imgkits', url: 'https://imgkits.com/' },
      { name: 'AI图片在线免费生成器', url: 'https://krwoo.com/' },
      { name: 'Read Frog', url: 'https://github.com/readfrog/readfrog' },
      { name: 'AI Image Similarity Checker', url: 'https://aiimagesimilaritychecker.com/' },
      { name: 'AI Dream Analyzer', url: 'https://aidreamanalyzer.com/' },
      
      // 已有的正确链接保持不变
      { name: 'VS Code', url: 'https://code.visualstudio.com' },
      { name: 'Figma', url: 'https://figma.com' },
      { name: 'Notion', url: 'https://notion.so' },
      { name: 'Google Analytics', url: 'https://analytics.google.com' },
      { name: 'Canva', url: 'https://canva.com' },
      { name: 'Trello', url: 'https://trello.com' },
      { name: 'GitHub', url: 'https://github.com' },
      { name: 'Slack', url: 'https://slack.com' },
      { name: 'Unsplash', url: 'https://unsplash.com' },
      { name: 'Mailchimp', url: 'https://mailchimp.com' },
      { name: 'Postman', url: 'https://postman.com' },
      { name: 'Grammarly', url: 'https://grammarly.com' },
      { name: 'ChatGPT', url: 'https://chat.openai.com' },
      { name: 'Midjourney', url: 'https://midjourney.com' },
      { name: 'Claude', url: 'https://claude.ai' },
      { name: 'Google Data Studio', url: 'https://datastudio.google.com' },
      { name: 'JetBrains IntelliJ IDEA', url: 'https://jetbrains.com/idea' },
      
      // 生产力工具（为书籍/教程类工具设置合理的替代链接）
      { name: '法律相关电子书', url: 'https://www.nlc.cn/' }, // 国家图书馆
      { name: '全国独家研学手册', url: 'https://www.moe.gov.cn/' }, // 教育部
      { name: '冷眼观爱 七天找到女朋友', url: 'https://book.douban.com/' }, // 豆瓣读书
      { name: '生财宝典', url: 'https://shengcai.com/' }, // 生财有术
      { name: '怎样打开自学之门', url: 'https://www.coursera.org/' }, // 在线学习平台
      { name: '完全图解恋爱心理学', url: 'https://book.douban.com/' }, // 豆瓣读书
      { name: '如何让你爱的人爱上你', url: 'https://book.douban.com/' }, // 豆瓣读书
      { name: '欧阳春晓：6周维密薄肌线条弹力带普拉提', url: 'https://www.keep.com/' }, // Keep健身
      { name: '如何利用下班时间写作', url: 'https://www.jianshu.com/' }, // 简书
      { name: '调qing一点通', url: 'https://www.zhihu.com/' }, // 知乎
      { name: '步某非烟', url: 'https://www.qidian.com/' }, // 起点中文网
      { name: '大学同学提升幸福感实用教程', url: 'https://www.coursera.org/' } // 在线学习平台
    ];
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    // 为每个已知工具更新URL
    knownUrls.forEach(({ name, url }) => {
      // 尝试多种匹配模式
      const patterns = [
        new RegExp(`(title:\\s*['"\`]${escapeRegex(name)}[^'"\`]*['"\`][^}]*?)url:\\s*['"\`]#['"\`]`, 'g'),
        new RegExp(`(title:\\s*['"\`][^'"\`]*${escapeRegex(name)}[^'"\`]*['"\`][^}]*?)url:\\s*['"\`]#['"\`]`, 'g'),
        new RegExp(`(title:\\s*['"\`][^'"\`]*${escapeRegex(name.split(' ')[0])}[^'"\`]*['"\`][^}]*?)url:\\s*['"\`]#['"\`]`, 'g')
      ];
      
      let matched = false;
      patterns.forEach(pattern => {
        if (pattern.test(toolsContent)) {
          toolsContent = toolsContent.replace(pattern, `$1url: '${url}',`);
          if (!matched) {
            console.log(`✅ 已更新 "${name}" 的链接: ${url}`);
            updatedCount++;
            matched = true;
          }
        }
      });
      
      if (!matched) {
        console.log(`⚠️  未找到 "${name}" 的匹配工具`);
        notFoundCount++;
      }
    });
    
    // 从详细内容中提取链接
    const contentLinkPatterns = [
      /官网[地址：链接]*[:：]?\s*([https?:\/\/][^\s\n)]+)/gi,
      /官方网站[：链接]*[:：]?\s*([https?:\/\/][^\s\n)]+)/gi,
      /网址[：链接]*[:：]?\s*([https?:\/\/][^\s\n)]+)/gi,
      /地址[：链接]*[:：]?\s*([https?:\/\/][^\s\n)]+)/gi,
      /GitHub[：链接]*[:：]?\s*([https?:\/\/github\.com[^\s\n)]+)/gi,
      /体验地址[：链接]*[:：]?\s*([https?:\/\/][^\s\n)]+)/gi,
      /访问[：链接]*[:：]?\s*([https?:\/\/][^\s\n)]+)/gi
    ];
    
    // 从工具详细内容中提取链接
    const contentMatches = toolsContent.match(/detailedContent:\\s*\`([^`]+)\`/g);
    if (contentMatches) {
      contentMatches.forEach(match => {
        const content = match.replace(/detailedContent:\\s*\`/, '').replace(/\`$/, '');
        contentLinkPatterns.forEach(pattern => {
          const links = content.match(pattern);
          if (links) {
            links.forEach(link => {
              const url = link.match(/(https?:\/\/[^\s\n)]+)/i);
              if (url && url[1]) {
                console.log(`🔍 发现内容中的链接: ${url[1]}`);
              }
            });
          }
        });
      });
    }
    
    // 保存更新后的文件
    fs.writeFileSync(toolsFilePath, toolsContent);
    
    console.log(`\n✅ 链接修复完成！`);
    console.log(`📊 统计信息:`);
    console.log(`  - 成功更新: ${updatedCount} 个工具`);
    console.log(`  - 未找到匹配: ${notFoundCount} 个工具`);
    console.log(`📁 文件已保存: ${toolsFilePath}`);
    
    // 验证还有多少工具仍然使用"#"链接
    const remainingHashUrls = (toolsContent.match(/url:\\s*['"\`]#['"\`]/g) || []).length;
    console.log(`⚠️  剩余 ${remainingHashUrls} 个工具仍使用"#"链接`);
    
  } catch (error) {
    console.error('❌ 修复过程中出现错误:', error.message);
    console.error(error.stack);
  }
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

// 运行脚本
fixToolUrls();