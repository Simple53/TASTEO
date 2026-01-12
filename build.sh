#!/bin/bash

echo "========================================"
echo "   点点鲜 - 打包脚本"
echo "========================================"
echo ""

# 检查 PyInstaller
if ! python3 -c "import PyInstaller" &> /dev/null; then
    echo "[1/3] 安装 PyInstaller..."
    pip3 install pyinstaller
else
    echo "[1/3] PyInstaller 已安装"
fi

echo "[2/3] 清理旧文件..."
rm -rf dist build *.spec

echo "[3/3] 开始打包..."
pyinstaller --clean \
    --onefile \
    --add-data "templates:templates" \
    --add-data "static:static" \
    --add-data "database.db:." \
    --name "点点鲜" \
    app.py

echo ""
echo "========================================"
echo "   打包完成！"
echo "========================================"
echo ""
echo "可执行文件位置: dist/点点鲜"
echo ""

# 创建发布包
echo "创建发布包..."
mkdir -p release
cp "dist/点点鲜" "release/"
cp "README.md" "release/"
cp "QUICKSTART.md" "release/"
cp "database.db" "release/"

echo "发布包已创建: release/"
echo ""
