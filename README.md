# 802 Soul Kitchen - Tools & Development Files

This folder contains development tools and files that are **NOT** needed for website deployment.

## 📁 Folder Structure

### `scripts/`

- `optimize_images.sh` - Bash script to optimize images
- `optimize_images.bat` - Windows batch script to optimize images

**Usage**: Run these scripts from the project root to create optimized image versions.

### `docs/`

- `README.md` - Project documentation
- `Color Palet.txt` - Color palette reference

### `backups/`

- Previous versions of core files for reference/rollback

## 🚀 Deployment Instructions

To deploy the website, upload only the files in the **project root**:

```text
├── index.html          ← Upload
├── script.js           ← Upload
├── styles.css          ← Upload
├── 802Logo.png         ← Upload
├── optimized/          ← Upload (entire folder)
└── PHOTOS/             ← Upload (optional fallback)
```

**Do NOT upload the `tools/` folder** - it's only for development.

## 🛠️ Adding New Images

1. Add new images to the `PHOTOS/` folder (naming: `16.jpg`, `17.jpg`, etc.)
2. Run the optimization script from **anywhere** in the project:

   ```bash
   # From project root
   tools/scripts/optimize_images.sh         # Linux/Mac
   tools\scripts\optimize_images.bat        # Windows

   # Or from tools/scripts directory
   cd tools/scripts
   ./optimize_images.sh                     # Linux/Mac
   optimize_images.bat                      # Windows
   ```

3. Scripts automatically navigate to project root and process all images
4. Upload the new optimized images to your web server

## 📊 Image Optimization Results

The scripts create multiple optimized versions:

- **WebP**: 20-35% smaller than JPEG
- **Medium**: 800px max dimension
- **Thumbnails**: 300x300px
- **Optimized JPEG**: 85% quality, metadata stripped
