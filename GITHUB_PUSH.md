# 点点鲜 - 快速推送到 GitHub

## 🚀 一键推送

### 步骤 1: 在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 仓库名: `diandianxian` (或其他名称)
3. 描述: `轻量级局域网点单系统`
4. 选择 Public 或 Private
5. **不要**勾选任何初始化选项
6. 点击 "Create repository"

### 步骤 2: 复制仓库地址

创建后会显示类似这样的地址:

```
https://github.com/你的用户名/diandianxian.git
```

### 步骤 3: 运行推送命令

打开命令行,进入项目目录,执行:

```bash
# 设置远程仓库推送代码
git remote add origin https://github.com/Simple53/TASTEO.git
git branch -M main
git push -u origin main

# 创建 v1.0.0 标签并推送
git tag v1.0.0
git push origin v1.0.0
```

### 步骤 4: 等待自动构建

推送 Tag 后:

1. 访问 GitHub 仓库的 "Actions" 标签
2. 查看 "Build and Release" 工作流
3. 等待 5-10 分钟构建完成
4. 访问 "Releases" 查看发布的文件

---

## 📦 Release 文件

构建完成后会生成:

- `diandianxian-windows.zip` - Windows 版本
- `diandianxian-linux.tar.gz` - Linux 版本
- `diandianxian-macos.tar.gz` - macOS 版本

---

## 🎯 或使用辅助脚本

### Windows

```bash
.\push-to-github.bat
```

### Mac/Linux

```bash
chmod +x push-to-github.sh
./push-to-github.sh
```

脚本会自动引导您完成所有步骤!
