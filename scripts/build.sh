#!/bin/bash

# Production build script for 802 Soul Kitchen

set -e

echo "🏭 Building 802 Soul Kitchen for production..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build shared types
echo "🔧 Building shared types..."
npm run build --workspace=packages/shared-types

# Type check
echo "🔍 Running type checks..."
npm run type-check

# Lint
echo "🧹 Running linter..."
npm run lint

# Format check
echo "💅 Checking code formatting..."
npm run format:check

# Build web app
echo "🚀 Building web application..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm run test

echo "✅ Build completed successfully!"
echo "📁 Output directory: apps/web/dist"
echo "📦 Ready for deployment to iFastNet htdocs"