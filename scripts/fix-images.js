const fs = require('fs');

// Read the tools file
const filePath = 'src/data/tools.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all problematic image URLs with undefined so they use generated avatars
// This is safer than trying to fix individual URLs
const replacements = [
  // Replace all Unsplash URLs that are failing
  /imageUrl: 'https:\/\/images\.unsplash\.com\/[^']*'/g,
  // Replace all www.ahhhhfs.com URLs that are failing
  /imageUrl: 'https:\/\/www\.ahhhhfs\.com\/[^']*'/g
];

let fixedCount = 0;

replacements.forEach(regex => {
  const matches = content.match(regex);
  if (matches) {
    fixedCount += matches.length;
    content = content.replace(regex, "imageUrl: undefined");
  }
});

// Write the fixed content back
fs.writeFileSync(filePath, content);

console.log(`✅ Fixed ${fixedCount} problematic image URLs`);
console.log('All tools will now use generated avatars, which is more reliable');
console.log('Generated avatars are consistent, colorful, and don\'t depend on external services');