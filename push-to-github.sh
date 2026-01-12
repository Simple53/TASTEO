#!/bin/bash

echo "========================================"
echo "   点点鲜 - GitHub 推送脚本"
echo "========================================"
echo ""

# 检查是否已设置远程仓库
if ! git remote -v | grep -q origin; then
    echo "[提示] 请先在 GitHub 创建仓库,然后输入仓库地址"
    echo "例如: https://github.com/yourusername/diandianxian.git"
    echo ""
    read -p "GitHub 仓库地址: " REPO_URL
    
    echo ""
    echo "[1/4] 添加远程仓库..."
    git remote add origin "$REPO_URL"
else
    echo "[1/4] 远程仓库已配置"
fi

echo "[2/4] 添加新文件..."
git add .

echo "[3/4] 提交更改..."
git commit -m "Add GitHub Actions workflow and release files"

echo "[4/4] 推送到 GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "========================================"
echo "   推送完成！"
echo "========================================"
echo ""
echo "下一步:"
echo "1. 访问 GitHub 仓库"
echo "2. 创建一个新的 Tag: v1.0.0"
echo "3. GitHub Actions 将自动构建并发布 Release"
echo ""
echo "创建 Tag 命令:"
echo "  git tag v1.0.0"
echo "  git push origin v1.0.0"
echo ""
