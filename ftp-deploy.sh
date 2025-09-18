#!/bin/bash

# FTP Deployment Script for Panochord
# This script builds and uploads to Namecheap hosting

set -e  # Exit on any error

echo "🚀 Building Panochord..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed!"

# Check if lftp is available
if ! command -v lftp &> /dev/null; then
    echo "📦 Installing lftp for FTP upload..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install lftp
        else
            echo "❌ Please install Homebrew first: https://brew.sh/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt-get update && sudo apt-get install -y lftp
    else
        echo "❌ Please install lftp manually for your system"
        exit 1
    fi
fi

echo "🌐 Uploading to yenzer.net/chords/..."

# Prompt for FTP password
read -s -p "Enter FTP password for steven@yenzer.net: " FTP_PASSWORD
echo ""

# Upload files using lftp
lftp -c "
set ftp:ssl-allow no
set ftp:passive-mode yes
open ftp://steven%40yenzer.net:$FTP_PASSWORD@ftp.yenzer.net
cd public_html/chords/
lcd dist
mirror --reverse --delete --verbose .
quit
"

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Visit: https://yenzer.net/chords/"
    echo "📄 Test file: https://yenzer.net/chords/deployment-test.txt"
else
    echo "❌ Deployment failed!"
    exit 1
fi