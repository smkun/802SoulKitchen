#!/bin/bash

# Development startup script for 802 Soul Kitchen

set -e

echo "🏗️  Starting 802 Soul Kitchen development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18 or later is required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build shared types
echo "🔧 Building shared types..."
npm run build --workspace=packages/shared-types

# Start development server
echo "🚀 Starting Astro development server..."
echo "📁 Web app will be available at: http://localhost:4321"
echo "🔍 Press Ctrl+C to stop the server"
echo ""

npm run dev