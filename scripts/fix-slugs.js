const fs = require('fs');
const path = require('path');

const toolsFilePath = path.join(__dirname, '..', 'src', 'data', 'tools.ts');

function fixSlugs() {
  try {
    console.log('\n🔧 开始修复工具slug格式...');
    
    let toolsContent = fs.readFileSync(toolsFilePath, 'utf8');
    
    // 生成规范化的slug
    function generateSlug(title) {
      return title
        .toLowerCase()
        .replace(/[：:]/g, '-')                    // 冒号转连字符
        .replace(/[^\w\s\-]/g, '')                 // 移除特殊字符，保留字母数字空格连字符
        .replace(/\s+/g, '-')                      // 空格转连字符
        .replace(/[\-]+/g, '-')                    // 多个连字符合并为一个
        .replace(/^-+|-+$/g, '')                   // 移除开头和结尾的连字符
        .substring(0, 50);                         // 限制长度
    }
    
    // 提取所有工具的title和当前slug
    const toolMatches = [];
    const titleRegex = /title:\s*['"`]([^'"`]+)['"`][^}]*?slug:\s*['"`]([^'"`]+)['"`]/gs;
    let match;
    
    while ((match = titleRegex.exec(toolsContent)) !== null) {
      const title = match[1];
      const currentSlug = match[2];
      const newSlug = generateSlug(title);
      
      if (currentSlug !== newSlug) {
        toolMatches.push({
          title,
          currentSlug,
          newSlug
        });
      }
    }
    
    console.log(`\n📋 需要修复的slug数量: ${toolMatches.length}`);
    
    // 显示将要修复的slug
    toolMatches.forEach((tool, index) => {
      console.log(`${index + 1}. "${tool.title}"`);
      console.log(`   当前: ${tool.currentSlug}`);
      console.log(`   修复: ${tool.newSlug}`);
      console.log('');
    });
    
    // 应用修复
    let updatedCount = 0;
    toolMatches.forEach(tool => {
      const regex = new RegExp(`slug: ['"\`]${escapeRegex(tool.currentSlug)}['"\`]`, 'g');
      if (regex.test(toolsContent)) {
        toolsContent = toolsContent.replace(regex, `slug: '${tool.newSlug}'`);
        updatedCount++;
      }
    });
    
    // 特殊处理一些简化的slug
    const manualFixes = [
      { from: 'new-api-ai-30-', to: 'new-api' },
      { from: 'cloudflare-ai-stable-diffusion-xl-', to: 'cloudflare-ai-generator' },
      { from: 'hard-usernamesai-instagram', to: 'hard-usernames' },
      { from: 'llm-api-testllm-api-gpt-4gemini-api-', to: 'llm-api-test' },
      { from: 'ai-silhouette-generator-ai-', to: 'ai-silhouette-generator' },
      { from: 'ai-proxyai-api-url-', to: 'ai-proxy' },
      { from: 'ai-line-art-generatorai-', to: 'ai-line-art-generator' },
      { from: 'read-frog-ai-', to: 'read-frog' },
      { from: 'ai-image-similarity-checkerai-ai', to: 'ai-image-similarity-checker' },
      { from: 'ai-dream-analyzerai', to: 'ai-dream-analyzer' }
    ];
    
    manualFixes.forEach(fix => {
      const regex = new RegExp(`slug: ['"\`]${escapeRegex(fix.from)}['"\`]`, 'g');
      toolsContent = toolsContent.replace(regex, `slug: '${fix.to}'`);
    });
    
    // 保存修复后的文件
    fs.writeFileSync(toolsFilePath, toolsContent);
    
    console.log(`✅ Slug修复完成！共修复了 ${updatedCount} 个工具的slug`);
    console.log(`📁 文件已保存: ${toolsFilePath}`);
    
    // 验证修复结果
    console.log('\n🔍 验证修复结果...');
    const verifyContent = fs.readFileSync(toolsFilePath, 'utf8');
    const problematicSlugs = verifyContent.match(/slug:\s*['"`][^'"`]*[-]{2,}[^'"`]*['"`]/g) ||
                           verifyContent.match(/slug:\s*['"`][^'"`]*-$['"`]/g) ||
                           verifyContent.match(/slug:\s*['"`]$[^'"`]*['"`]/g);
    
    if (problematicSlugs && problematicSlugs.length > 0) {
      console.log('⚠️  仍存在问题的slug:');
      problematicSlugs.forEach(slug => console.log('  ', slug));
    } else {
      console.log('✅ 所有slug格式都已正确！');
    }
    
  } catch (error) {
    console.error('❌ 修复过程中出现错误:', error.message);
    console.error(error.stack);
  }
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

// 运行脚本
fixSlugs();