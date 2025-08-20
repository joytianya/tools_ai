#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File paths
const filteredToolsPath = path.join(__dirname, 'converted-content/filtered-tools-v2.json');
const toolsFilePath = path.join(__dirname, '../src/data/tools.ts');
const backupPath = path.join(__dirname, '../src/data/tools.ts.backup');

console.log('🚀 Starting tool integration process...');

// Create backup of existing tools.ts
try {
  const existingContent = fs.readFileSync(toolsFilePath, 'utf8');
  fs.writeFileSync(backupPath, existingContent);
  console.log('✅ Created backup at:', backupPath);
} catch (error) {
  console.error('❌ Failed to create backup:', error.message);
  process.exit(1);
}

// Read filtered tools
let filteredToolsData;
try {
  const rawData = fs.readFileSync(filteredToolsPath, 'utf8');
  filteredToolsData = JSON.parse(rawData);
  console.log(`📊 Found ${filteredToolsData.count} filtered tools to integrate`);
} catch (error) {
  console.error('❌ Failed to read filtered tools:', error.message);
  process.exit(1);
}

// Read existing tools.ts file
let existingContent;
try {
  existingContent = fs.readFileSync(toolsFilePath, 'utf8');
  console.log('📖 Successfully read existing tools.ts file');
} catch (error) {
  console.error('❌ Failed to read tools.ts:', error.message);
  process.exit(1);
}

// Function to convert filtered tool to tools.ts format
function convertFilteredTool(filteredTool, newId) {
  // Map categories - ensure they match the ToolCategory type
  const categoryMap = {
    'ai': 'ai',
    'development': 'development', 
    'productivity': 'productivity',
    'tools': 'tools',
    'design': 'design'
  };

  const mappedCategory = categoryMap[filteredTool.category] || 'tools';

  // Generate a slug if not provided
  let slug = filteredTool.slug;
  if (!slug) {
    slug = filteredTool.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Ensure URL is valid
  let url = filteredTool.url;
  if (!url || url === '#') {
    url = 'https://example.com'; // Default fallback URL
  }

  return {
    id: newId.toString(),
    title: filteredTool.title,
    description: filteredTool.description,
    category: mappedCategory,
    subCategory: filteredTool.subCategory || undefined,
    tags: filteredTool.tags || [],
    url: url,
    imageUrl: filteredTool.imageUrl || undefined,
    rating: filteredTool.rating || 4.5,
    isFree: filteredTool.isFree !== false, // Default to true if not specified
    featured: filteredTool.featured || false,
    slug: slug,
    detailedContent: filteredTool.detailedContent || `# ${filteredTool.title}\n\n${filteredTool.description}`,
    publishedAt: filteredTool.publishedAt || new Date().toISOString(),
    updatedAt: filteredTool.updatedAt || undefined,
    originalSource: filteredTool.originalSource || undefined,
    metadata: filteredTool.metadata || undefined
  };
}

// Convert filtered tools to tools.ts format
const convertedTools = [];
let startingId = 31; // Start from 31 since we have 30 existing tools

for (const filteredTool of filteredToolsData.tools) {
  try {
    const convertedTool = convertFilteredTool(filteredTool, startingId);
    convertedTools.push(convertedTool);
    startingId++;
  } catch (error) {
    console.error(`⚠️  Failed to convert tool "${filteredTool.title}":`, error.message);
  }
}

console.log(`✅ Successfully converted ${convertedTools.length} tools`);

// Generate the new tools array content
function generateToolObjectString(tool, indent = '  ') {
  const lines = [];
  lines.push(`${indent}{`);
  lines.push(`${indent}  id: '${tool.id}',`);
  lines.push(`${indent}  title: '${tool.title.replace(/'/g, "\\'")}',`);
  lines.push(`${indent}  description: '${tool.description.replace(/'/g, "\\'")}',`);
  lines.push(`${indent}  category: '${tool.category}',`);
  
  if (tool.subCategory) {
    lines.push(`${indent}  subCategory: '${tool.subCategory}',`);
  }
  
  lines.push(`${indent}  tags: [${tool.tags.map(tag => `'${tag.replace(/'/g, "\\'")}'`).join(', ')}],`);
  lines.push(`${indent}  url: '${tool.url}',`);
  
  if (tool.imageUrl) {
    lines.push(`${indent}  imageUrl: '${tool.imageUrl}',`);
  }
  
  lines.push(`${indent}  rating: ${tool.rating},`);
  lines.push(`${indent}  isFree: ${tool.isFree},`);
  lines.push(`${indent}  featured: ${tool.featured},`);
  lines.push(`${indent}  slug: '${tool.slug}',`);
  lines.push(`${indent}  detailedContent: \`${tool.detailedContent.replace(/`/g, '\\`')}\`,`);
  lines.push(`${indent}  publishedAt: '${tool.publishedAt}',`);
  
  if (tool.updatedAt) {
    lines.push(`${indent}  updatedAt: '${tool.updatedAt}',`);
  }
  
  if (tool.originalSource) {
    lines.push(`${indent}  originalSource: '${tool.originalSource}',`);
  }
  
  if (tool.metadata) {
    lines.push(`${indent}  metadata: ${JSON.stringify(tool.metadata)},`);
  }
  
  lines.push(`${indent}},`);
  return lines.join('\n');
}

// Find the position to insert new tools (before the closing ];)
const closingBracketIndex = existingContent.lastIndexOf('];');
if (closingBracketIndex === -1) {
  console.error('❌ Could not find closing bracket of tools array');
  process.exit(1);
}

// Generate the new tools as string
const newToolsString = convertedTools.map(tool => generateToolObjectString(tool)).join('\n');

// Insert new tools before the closing bracket
const beforeClosing = existingContent.substring(0, closingBracketIndex);
const afterClosing = existingContent.substring(closingBracketIndex);

const newContent = beforeClosing + newToolsString + '\n' + afterClosing;

// Write the updated content
try {
  fs.writeFileSync(toolsFilePath, newContent);
  console.log('✅ Successfully updated tools.ts file');
  console.log(`📈 Total tools now: ${30 + convertedTools.length}`);
} catch (error) {
  console.error('❌ Failed to write updated tools.ts:', error.message);
  process.exit(1);
}

console.log('🎉 Tool integration completed successfully!');
console.log(`📊 Integration Summary:`);
console.log(`   - Original tools: 30`);
console.log(`   - New tools added: ${convertedTools.length}`);
console.log(`   - Total tools: ${30 + convertedTools.length}`);
console.log(`   - Backup created: ${backupPath}`);