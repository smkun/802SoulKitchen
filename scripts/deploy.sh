#!/bin/bash

# Deployment script for 802 Soul Kitchen to iFastNet

set -e

echo "🚀 Deploying 802 Soul Kitchen to iFastNet..."

# Check if build directory exists
if [ ! -d "apps/web/dist" ]; then
    echo "❌ Build directory not found. Run 'npm run build' first."
    exit 1
fi

# Create deployment package
echo "📦 Creating deployment package..."
cd apps/web/dist
tar -czf ../../../802sk-deploy-$(date +%Y%m%d-%H%M%S).tar.gz .
cd ../../..

echo "✅ Deployment package created successfully!"
echo ""
echo "📋 Manual deployment steps for iFastNet:"
echo "1. Extract the .tar.gz file to your local machine"
echo "2. Upload all contents to your iFastNet htdocs directory"
echo "3. Ensure file permissions are set correctly (644 for files, 755 for directories)"
echo "4. Test the website at your domain"
echo ""
echo "💡 Tip: You can use FTP, SFTP, or iFastNet's file manager to upload files"

# Optional: Display file structure for verification
echo "📁 Deployment package contents:"
tar -tzf 802sk-deploy-*.tar.gz | head -20
if [ $(tar -tzf 802sk-deploy-*.tar.gz | wc -l) -gt 20 ]; then
    echo "... and $(expr $(tar -tzf 802sk-deploy-*.tar.gz | wc -l) - 20) more files"
fi