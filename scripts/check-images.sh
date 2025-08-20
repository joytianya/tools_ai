#!/bin/bash

echo "=== Checking Image URLs ==="
echo ""

# Extract all unique image URLs
URLS=$(grep -o "imageUrl: 'https://[^']*'" src/data/tools.ts | cut -d"'" -f2 | sort -u)

total=0
success=0
failed=0

echo "Found $(echo "$URLS" | wc -l) unique image URLs to check..."
echo ""

for url in $URLS; do
    total=$((total + 1))
    echo -n "[$total] Checking: $url ... "
    
    # Use curl to check the URL
    if curl -s --head "$url" | head -n 1 | grep -q "200 OK"; then
        echo "✅ OK"
        success=$((success + 1))
    else
        echo "❌ FAILED"
        failed=$((failed + 1))
    fi
done

echo ""
echo "=== SUMMARY ==="
echo "Total URLs checked: $total"
echo "Successful: $success"
echo "Failed: $failed"

# Count undefined imageUrls
undefined=$(grep -c "imageUrl: undefined" src/data/tools.ts)
echo "Undefined imageUrls: $undefined"