#!/bin/bash
# Note Whiteboard 同步安裝腳本
# 用途：拉取最新版本並打包成 VSIX

set -e

echo "📥 拉取最新版本..."
git pull

echo "📦 安裝依賴..."
npm install

echo "🔨 打包擴充套件..."
npm run package

# 找到最新的 vsix 檔案
VSIX=$(ls -t *.vsix 2>/dev/null | head -1)

if [ -n "$VSIX" ]; then
    echo ""
    echo "✅ 打包完成：$VSIX"
    echo ""
    echo "👉 安裝步驟："
    echo "   1. 在 Antigravity 按 Cmd+Shift+P"
    echo "   2. 輸入 'Extensions: Install from VSIX...'"
    echo "   3. 選擇：$(pwd)/$VSIX"
else
    echo "❌ 找不到 VSIX 檔案"
    exit 1
fi
