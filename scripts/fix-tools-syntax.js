#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const toolsFilePath = path.join(__dirname, '../src/data/tools.ts');

console.log('🔧 Fixing syntax errors in tools.ts...');

try {
  let content = fs.readFileSync(toolsFilePath, 'utf8');
  
  // Fix SVG data URLs by properly escaping quotes
  content = content.replace(
    /imageUrl: 'data:image\/svg\+xml,[^']*'/g,
    (match) => {
      // Replace single quotes inside the SVG with double quotes or remove problematic parts
      const cleanedMatch = match.replace(/xmlns='([^']*)'/g, 'xmlns="$1"')
                                 .replace(/viewBox='([^']*)'/g, 'viewBox="$1"');
      return cleanedMatch;
    }
  );
  
  // Additional cleanup for any other problematic quotes in strings
  // Handle cases where there might be unescaped single quotes in string values
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Fix imageUrl lines that might have syntax issues
    if (line.includes('imageUrl:') && line.includes("'http://") && line.includes("svg")) {
      // Remove the problematic imageUrl entirely for SVG data URLs
      if (line.includes('data:image/svg+xml')) {
        lines[i] = line.replace(/imageUrl: '[^']*',?/, '');
        if (lines[i].trim() === '') {
          lines.splice(i, 1);
          i--;
        }
      }
    }
  }
  
  content = lines.join('\n');
  
  fs.writeFileSync(toolsFilePath, content);
  console.log('✅ Successfully fixed syntax errors in tools.ts');
  
} catch (error) {
  console.error('❌ Failed to fix syntax errors:', error.message);
  process.exit(1);
}

console.log('🎉 Syntax fix completed!');