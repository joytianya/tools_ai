#!/usr/bin/env python3
import re

def fix_published_at():
    with open('/home/zxw/projects/tools_ai/src/data/tools.ts', 'r') as f:
        content = f.read()
    
    # Split content by tool objects
    lines = content.split('\n')
    new_lines = []
    
    i = 0
    while i < len(lines):
        new_lines.append(lines[i])
        
        # Look for the end of a detailedContent field
        if 'detailedContent: `' in lines[i] and lines[i].strip().endswith('`,'):
            # Check if next line is a closing brace without publishedAt before it
            j = i + 1
            found_published_at = False
            while j < len(lines) and not lines[j].strip().startswith('}'):
                if 'publishedAt:' in lines[j]:
                    found_published_at = True
                    break
                j += 1
            
            # If no publishedAt found, add it
            if not found_published_at and j < len(lines):
                new_lines.append('    publishedAt: \'2025-08-19T10:00:00.000Z\',')
        
        i += 1
    
    with open('/home/zxw/projects/tools_ai/src/data/tools.ts', 'w') as f:
        f.write('\n'.join(new_lines))
    
    print("Fixed publishedAt fields")

if __name__ == "__main__":
    fix_published_at()