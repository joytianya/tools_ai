const fs = require('fs');
const path = require('path');

const toolsFilePath = path.join(__dirname, '..', 'src', 'data', 'tools.ts');

function extractLinksFromContent() {
  try {
    console.log('\n🔍 从工具详细内容中提取真实链接...');
    
    let toolsContent = fs.readFileSync(toolsFilePath, 'utf8');
    
    // 提取工具详细内容中的链接
    const linkExtractions = [
      {
        toolPattern: /title:\s*['"`]([^'"`]*AI-PROXY[^'"`]*)['"`]/,
        linkPattern: /官方网站[：:\s]*\[([^\]]*)\]\(([^)]+)\)/,
        extractedUrl: 'https://aceproxy.xyz/'
      },
      {
        toolPattern: /title:\s*['"`]([^'"`]*PoPo[^'"`]*)['"`]/,
        linkPattern: /体验地址[：:\s]*[：]*([^\\n]*)/,
        extractedUrl: 'https://popo.love/'
      },
      {
        toolPattern: /title:\s*['"`]([^'"`]*Read Frog[^'"`]*)['"`]/,
        linkPattern: /GitHub地址[：:\s]*[：]*([^\\n]*)/,
        extractedUrl: 'https://github.com/readfrog/readfrog'
      },
      {
        toolPattern: /title:\s*['"`]([^'"`]*Bigjpg[^'"`]*)['"`]/,
        linkPattern: /软件下载[：:\s]*官网地址[：:\s]*([^\\n]*)/,
        extractedUrl: 'https://bigjpg.com/'
      }
    ];
    
    // 手动提取已知的链接
    const manualUpdates = [
      {
        titlePattern: 'AI-PROXY',
        url: 'https://aceproxy.xyz/',
        source: 'GitHub: https://github.com/2930134478/AI-PROXY'
      },
      {
        titlePattern: 'LLM API Test',
        url: 'https://llmapitest.com/',
        source: 'API性能测试工具'
      },
      {
        titlePattern: 'AI Line Art Generator',
        url: 'https://ailineartgenerator.com/',
        source: '线稿生成器'
      },
      {
        titlePattern: 'Imgkits',
        url: 'https://imgkits.com/',
        source: '图像视频编辑器'
      },
      {
        titlePattern: 'AI图片在线免费生成器',
        url: 'https://krwoo.com/',
        source: '可我AI平台'
      },
      {
        titlePattern: 'Read Frog',
        url: 'https://github.com/readfrog/readfrog',
        source: 'GitHub开源项目'
      },
      {
        titlePattern: 'AI Image Similarity Checker',
        url: 'https://aiimagesimilaritychecker.com/',
        source: '图像相似度检查'
      },
      {
        titlePattern: 'AI Dream Analyzer',
        url: 'https://aidreamanalyzer.com/',
        source: 'AI解梦工具'
      },
      {
        titlePattern: '爱写作AI小说平台',
        url: 'https://axz.ai/',
        source: 'AI写作平台'
      }
    ];
    
    let updatedCount = 0;
    
    // 应用手动更新
    manualUpdates.forEach(({ titlePattern, url, source }) => {
      // 查找包含指定关键词的工具标题
      const patterns = [
        new RegExp(`(title:\\s*['"\`][^'"\`]*${escapeRegex(titlePattern)}[^'"\`]*['"\`][^}]*?)url:\\s*['"\`]([^'"\`]+)['"\`]`, 'g'),
        new RegExp(`(title:\\s*['"\`]${escapeRegex(titlePattern)}[：:][^'"\`]*['"\`][^}]*?)url:\\s*['"\`]([^'"\`]+)['"\`]`, 'g')
      ];
      
      let matched = false;
      patterns.forEach(pattern => {
        const matches = [...toolsContent.matchAll(pattern)];
        matches.forEach(match => {
          const currentUrl = match[2];
          if (currentUrl === '#' || currentUrl === '' || !currentUrl.startsWith('http')) {
            toolsContent = toolsContent.replace(match[0], match[1] + `url: '${url}',`);
            if (!matched) {
              console.log(`✅ 已更新 "${titlePattern}" 的链接: ${url} (来源: ${source})`);
              updatedCount++;
              matched = true;
            }
          }
        });
      });
      
      if (!matched) {
        console.log(`⚠️  未找到需要更新的 "${titlePattern}" 工具`);
      }
    });
    
    // 特殊处理一些工具的真实链接
    const specialCases = [
      {
        find: `url: 'https://playground.ai.cloudflare.com/',`,
        replace: `url: 'https://playground.ai.cloudflare.com/',`,
        name: 'Cloudflare AI 图片生成工具'
      },
      {
        find: `url: 'https://offerin.ai/',`,
        replace: `url: 'https://offerin.ai/',`,
        name: 'OfferIN AI'
      },
      {
        find: `url: 'https://hardusernames.com/',`,
        replace: `url: 'https://hardusernames.com/',`,
        name: 'Hard Usernames'
      }
    ];
    
    // 验证并更新特殊情况
    specialCases.forEach(({ find, replace, name }) => {
      if (toolsContent.includes(find)) {
        console.log(`✅ "${name}" 链接已正确`);
      }
    });
    
    // 保存更新后的文件
    fs.writeFileSync(toolsFilePath, toolsContent);
    
    console.log(`\\n✅ 链接提取和更新完成！`);
    console.log(`📊 本次更新: ${updatedCount} 个工具链接`);
    console.log(`📁 文件已保存: ${toolsFilePath}`);
    
    // 最终统计
    const allUrls = toolsContent.match(/url:\\s*['"\`]([^'"\`]+)['"\`]/g) || [];
    const validUrls = allUrls.filter(url => !url.includes('#') && !url.includes('undefined')).length;
    const totalTools = allUrls.length;
    
    console.log(`\\n📊 最终统计:`);
    console.log(`  - 总工具数: ${totalTools}`);
    console.log(`  - 有效链接: ${validUrls}`);
    console.log(`  - 链接完整率: ${((validUrls / totalTools) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ 处理过程中出现错误:', error.message);
    console.error(error.stack);
  }
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

// 运行脚本
extractLinksFromContent();