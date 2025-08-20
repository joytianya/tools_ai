const fs = require('fs');
const path = require('path');

const toolsFilePath = path.join(__dirname, '..', 'src', 'data', 'tools.ts');

function finalSlugFix() {
  try {
    console.log('\n🔧 最终slug修复...');
    
    let toolsContent = fs.readFileSync(toolsFilePath, 'utf8');
    
    // 手动修复特定的slug
    const manualFixes = [
      // 空slug或问题slug的手动修复
      { pattern: /title:\s*['"`]法律相关电子书['"`][^}]*?slug:\s*['"`]['"`]/, replacement: `title: '法律相关电子书',\n    description: '法律相关电子书是一款基于人工智能技术的实用工具，为用户提供智能化的解决方案。',\n    category: 'productivity',\n    tags: ['法律', '电子书'],\n    url: '#',\n    imageUrl: undefined,\n    rating: 4.5,\n    isFree: true,\n    featured: false,\n    slug: 'legal-ebooks'` },
      
      { pattern: /slug:\s*['"`]['"`]/, replacement: `slug: 'unknown-tool'` },
      { pattern: /slug:\s*['"`]-['"`]/, replacement: `slug: 'misc-tool'` },
      
      // 简化一些过长的slug
      { from: 'llm-api-test-llm-api-gpt-4gemini-api', to: 'llm-api-test' },
      { from: 'hard-usernames-ai-instagram', to: 'hard-usernames' },
      { from: 'ai-proxy-ai-api-url', to: 'ai-proxy' },
      { from: 'ai-line-art-generator-ai', to: 'ai-line-art-generator' },
      { from: 'ai-silhouette-generator-ai', to: 'ai-silhouette-generator' },
      { from: 'ai-image-similarity-checker-ai-ai', to: 'ai-image-similarity-checker' },
      { from: 'ai-dream-analyzer-ai', to: 'ai-dream-analyzer' },
      { from: 'read-frog-ai', to: 'read-frog' },
      { from: 'offerin-ai-ai', to: 'offerin-ai' },
      { from: 'cloudflare-ai-stable-diffusion-xl', to: 'cloudflare-ai-generator' },
      { from: 'new-api-ai-30', to: 'new-api' },
      { from: 'bigjpg-ai4k32', to: 'bigjpg' },
      { from: 'popoai-mmd', to: 'popo-ai' },
      { from: 'up-ai5', to: 'up-resume' },
      { from: 'ai-9', to: 'ai-novel-platform' },
      { from: 'imgkits-ai', to: 'imgkits' },
      { from: 'ai-40ai-krwoo', to: 'ai-image-generator' }
    ];
    
    // 应用模式替换
    manualFixes.forEach(fix => {
      if (fix.pattern && fix.replacement) {
        toolsContent = toolsContent.replace(fix.pattern, fix.replacement);
      } else if (fix.from && fix.to) {
        const regex = new RegExp(`slug: ['"\`]${escapeRegex(fix.from)}['"\`]`, 'g');
        toolsContent = toolsContent.replace(regex, `slug: '${fix.to}'`);
      }
    });
    
    // 为中文标题工具生成英文slug
    const chineseToolFixes = [
      { title: '法律相关电子书', slug: 'legal-ebooks' },
      { title: '全国独家研学手册', slug: 'study-handbook' },
      { title: '冷眼观爱 七天找到女朋友', slug: 'love-guide' },
      { title: '怎样打开自学之门', slug: 'self-study-guide' },
      { title: '完全图解恋爱心理学', slug: 'love-psychology' },
      { title: '如何让你爱的人爱上你', slug: 'love-tips' },
      { title: '如何利用下班时间写作', slug: 'writing-guide' },
      { title: '调qing一点通 – 晚熟青年', slug: 'youth-guide' },
      { title: '步某非烟第1-4季 合集', slug: 'novel-collection' },
      { title: '大学同学提升幸福感实用教程', slug: 'happiness-guide' }
    ];
    
    chineseToolFixes.forEach(fix => {
      const regex = new RegExp(`(title:\\s*['"\`]${escapeRegex(fix.title)}['"\`][^}]*?)slug:\\s*['"\`][^'"\`]*['"\`]`, 'g');
      toolsContent = toolsContent.replace(regex, `$1slug: '${fix.slug}'`);
    });
    
    // 保存修复后的文件
    fs.writeFileSync(toolsFilePath, toolsContent);
    
    console.log('✅ 最终slug修复完成！');
    console.log('📁 文件已保存:', toolsFilePath);
    
    // 验证所有slug
    console.log('\n🔍 验证所有slug...');
    const slugMatches = toolsContent.match(/slug:\s*['"`]([^'"`]+)['"`]/g);
    if (slugMatches) {
      const invalidSlugs = slugMatches.filter(slug => {
        const value = slug.match(/['"`]([^'"`]+)['"`]/)[1];
        return !value || value.length === 0 || value === '-' || value.includes('--') || value.endsWith('-') || value.startsWith('-');
      });
      
      if (invalidSlugs.length > 0) {
        console.log('⚠️  仍存在无效slug:');
        invalidSlugs.forEach(slug => console.log('  ', slug));
      } else {
        console.log('✅ 所有slug都有效！');
        console.log(`📊 总共 ${slugMatches.length} 个工具slug`);
      }
    }
    
  } catch (error) {
    console.error('❌ 修复过程中出现错误:', error.message);
  }
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

// 运行脚本
finalSlugFix();