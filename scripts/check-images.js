const { tools } = require('../src/data/tools.ts');

async function checkImageUrls() {
  console.log('Checking image URLs for all tools...\n');
  
  let totalTools = 0;
  let validImages = 0;
  let undefinedImages = 0;
  let failedImages = 0;
  const failedUrls = [];
  
  for (const tool of tools) {
    totalTools++;
    
    if (!tool.imageUrl || tool.imageUrl === undefined) {
      undefinedImages++;
      console.log(`❓ ${tool.title}: No image URL (will use generated avatar)`);
      continue;
    }
    
    try {
      const response = await fetch(tool.imageUrl, { method: 'HEAD' });
      if (response.ok) {
        validImages++;
        console.log(`✅ ${tool.title}: Image OK`);
      } else {
        failedImages++;
        failedUrls.push({ tool: tool.title, url: tool.imageUrl, status: response.status });
        console.log(`❌ ${tool.title}: Image failed (${response.status})`);
      }
    } catch (error) {
      failedImages++;
      failedUrls.push({ tool: tool.title, url: tool.imageUrl, error: error.message });
      console.log(`❌ ${tool.title}: Image error - ${error.message}`);
    }
  }
  
  console.log('\n=== SUMMARY ===');
  console.log(`Total tools: ${totalTools}`);
  console.log(`Valid images: ${validImages}`);
  console.log(`Undefined images: ${undefinedImages}`);
  console.log(`Failed images: ${failedImages}`);
  
  if (failedUrls.length > 0) {
    console.log('\n=== FAILED URLS ===');
    failedUrls.forEach(item => {
      console.log(`${item.tool}: ${item.url}`);
      console.log(`  Status: ${item.status || 'Error'}`);
      if (item.error) console.log(`  Error: ${item.error}`);
    });
  }
}

checkImageUrls().catch(console.error);