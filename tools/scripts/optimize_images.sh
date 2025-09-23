#!/bin/bash

echo "==============================================="
echo "           Image Optimization Script"
echo "==============================================="

# Set PATH to include ImageMagick and WebP tools
export PATH="/c/Program Files/ImageMagick-7.1.2-Q16-HDRI:/c/Users/Owner/AppData/Local/Microsoft/WinGet/Packages/Google.Libwebp_Microsoft.Winget.Source_8wekyb3d8bbwe/libwebp-1.6.0-windows-x64/bin:$PATH"

# Navigate to project root (scripts are now in tools/scripts/)
cd "$(dirname "$0")/../.." || exit 1

# Create output directories
mkdir -p optimized/{webp,thumbnails,medium}

echo "Creating optimized versions of your images..."
echo

# Initialize counters
processed=0
original_size=0
optimized_size=0

# Process each JPG file in PHOTOS directory
for file in PHOTOS/*.jpg; do
    if [[ -f "$file" ]]; then
        filename=$(basename "$file")
        name="${filename%.*}"

        echo "Processing: $filename"

        # Get original file size
        size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null || wc -c < "$file")
        original_size=$((original_size + size))

        # 1. Create optimized JPEG (85% quality, strip metadata)
        if magick "$file" -quality 85 -strip "optimized/$filename"; then
            echo "  ✓ Optimized JPEG created"
            opt_size=$(stat -c%s "optimized/$filename" 2>/dev/null || stat -f%z "optimized/$filename" 2>/dev/null || wc -c < "optimized/$filename")
            optimized_size=$((optimized_size + opt_size))
        else
            echo "  ✗ Failed to create optimized JPEG"
        fi

        # 2. Create WebP version (80% quality)
        if cwebp -q 80 "$file" -o "optimized/webp/${name}.webp" >/dev/null 2>&1; then
            echo "  ✓ WebP version created"
        else
            echo "  ✗ Failed to create WebP version"
        fi

        # 3. Create thumbnail (300x300)
        if magick "$file" -resize 300x300^ -gravity center -extent 300x300 -quality 85 "optimized/thumbnails/$filename" >/dev/null 2>&1; then
            echo "  ✓ Thumbnail created"
        else
            echo "  ✗ Failed to create thumbnail"
        fi

        # 4. Create medium size (800px max width/height)
        if magick "$file" -resize '800x800>' -quality 85 "optimized/medium/$filename" >/dev/null 2>&1; then
            echo "  ✓ Medium size created"
        else
            echo "  ✗ Failed to create medium size"
        fi

        ((processed++))
        echo
    fi
done

# Calculate space savings
if [[ $original_size -gt 0 ]]; then
    savings=$((original_size - optimized_size))
    percent_saved=$((savings * 100 / original_size))
else
    savings=0
    percent_saved=0
fi

echo "==============================================="
echo "                  Summary"
echo "==============================================="
echo "Images processed: $processed"
echo "Original total size: $(numfmt --to=iec $original_size) ($original_size bytes)"
echo "Optimized total size: $(numfmt --to=iec $optimized_size) ($optimized_size bytes)"
echo "Space saved: $(numfmt --to=iec $savings) ($savings bytes) - ${percent_saved}% reduction"
echo
echo "Output directories:"
echo "  optimized/           - Optimized JPEG files (85% quality)"
echo "  optimized/webp/      - WebP versions (80% quality)"
echo "  optimized/thumbnails/ - 300x300 thumbnails"
echo "  optimized/medium/    - 800px max dimension versions"
echo "==============================================="

# Show file size comparison
echo
echo "Individual file comparison:"
echo "File                    Original    Optimized   WebP        Saved"
echo "----------------------------------------------------------------"
for file in PHOTOS/*.jpg; do
    if [[ -f "$file" ]]; then
        filename=$(basename "$file")
        name="${filename%.*}"

        orig_size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null || wc -c < "$file")

        if [[ -f "optimized/$filename" ]]; then
            opt_size=$(stat -c%s "optimized/$filename" 2>/dev/null || stat -f%z "optimized/$filename" 2>/dev/null || wc -c < "optimized/$filename")
        else
            opt_size=0
        fi

        if [[ -f "optimized/webp/${name}.webp" ]]; then
            webp_size=$(stat -c%s "optimized/webp/${name}.webp" 2>/dev/null || stat -f%z "optimized/webp/${name}.webp" 2>/dev/null || wc -c < "optimized/webp/${name}.webp")
        else
            webp_size=0
        fi

        if [[ $orig_size -gt 0 && $opt_size -gt 0 ]]; then
            saved=$((orig_size - opt_size))
            percent=$((saved * 100 / orig_size))
            printf "%-20s %8s %10s %8s %6d%%\n" "$filename" "$(numfmt --to=iec $orig_size)" "$(numfmt --to=iec $opt_size)" "$(numfmt --to=iec $webp_size)" "$percent"
        fi
    fi
done