#!/bin/bash

# Manual deployment script for Panochord
# Usage: ./deploy-manual.sh

echo "🚀 Building Panochord..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📁 Built files are in the ./dist/ directory"
echo "🌐 You can now manually upload these files to:"
echo "   Server: ftp.yenzer.net"
echo "   Username: steven@yenzer.net"
echo "   Remote path: /public_html/chords/"
echo ""
echo "Files to upload:"
ls -la dist/

echo ""
echo "💡 Tip: You can use an FTP client like FileZilla or WinSCP"
echo "     or upload via Namecheap cPanel File Manager"