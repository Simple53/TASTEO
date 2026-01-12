# GitHub 部署指南

## 📦 将项目上传到 GitHub

### 1. 初始化 Git 仓库

在项目目录下打开终端,执行以下命令:

```bash
cd order-system
git init
git add .
git commit -m "Initial commit: 局域网点单系统"
```

### 2. 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息:
   - **Repository name**: `order-system` 或 `lan-ordering-system`
   - **Description**: `轻量级局域网点单系统 - 类似美团的点餐应用`
   - **Public/Private**: 根据需要选择
   - **不要**勾选 "Initialize this repository with a README"

### 3. 推送代码到 GitHub

复制 GitHub 提供的命令,或执行:

```bash
git remote add origin https://github.com/你的用户名/order-system.git
git branch -M main
git push -u origin main
```

---

## 🚀 在其他设备上部署

### Windows 设备

1. **克隆项目**
   ```bash
   git clone https://github.com/你的用户名/order-system.git
   cd order-system
   ```

2. **运行启动脚本**
   ```bash
   双击 start.bat
   ```
   或在命令行执行:
   ```bash
   .\start.bat
   ```

### Mac/Linux 设备

1. **克隆项目**
   ```bash
   git clone https://github.com/你的用户名/order-system.git
   cd order-system
   ```

2. **添加执行权限并运行**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

---

## 📱 打包成独立应用

### 方案 1: PyInstaller 打包 (推荐)

#### 安装 PyInstaller
```bash
pip install pyinstaller
```

#### 创建打包脚本

**Windows 打包脚本** (`build.bat`):
```batch
@echo off
echo 开始打包应用...
pyinstaller --onefile --noconsole ^
    --add-data "templates;templates" ^
    --add-data "static;static" ^
    --add-data "database.db;." ^
    --icon=icon.ico ^
    --name="点单系统" ^
    app.py

echo 打包完成！可执行文件位于 dist 目录
pause
```

**Mac/Linux 打包脚本** (`build.sh`):
```bash
#!/bin/bash
echo "开始打包应用..."
pyinstaller --onefile \
    --add-data "templates:templates" \
    --add-data "static:static" \
    --add-data "database.db:." \
    --name="点单系统" \
    app.py

echo "打包完成！可执行文件位于 dist 目录"
```

#### 执行打包
```bash
# Windows
.\build.bat

# Mac/Linux
chmod +x build.sh
./build.sh
```

打包后的可执行文件在 `dist` 目录中,可以直接分发给其他用户。

---

### 方案 2: Docker 容器化

#### 创建 Dockerfile

在项目根目录创建 `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

COPY . .

RUN python init_data.py

EXPOSE 5000

CMD ["python", "app.py"]
```

#### 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  order-system:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./database.db:/app/database.db
      - ./exports:/app/exports
    restart: unless-stopped
```

#### 使用 Docker 运行

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

### 方案 3: Electron 桌面应用

如果需要更专业的桌面应用体验,可以使用 Electron 包装:

1. **安装 Node.js**
2. **创建 Electron 包装器**
3. **打包成 .exe/.app/.dmg**

详细步骤可参考 [Electron 官方文档](https://www.electronjs.org/)。

---

## 🌐 云端部署选项

### 1. 内网穿透 (推荐用于临时演示)

使用 **ngrok** 或 **frp** 将本地服务暴露到公网:

```bash
# 使用 ngrok
ngrok http 5000
```

### 2. 云服务器部署

#### 阿里云/腾讯云/AWS

1. 购买云服务器 (最低配置即可)
2. 安装 Python 环境
3. 克隆项目并运行
4. 配置安全组开放 5000 端口

#### 免费托管平台

- **Render**: https://render.com (免费套餐)
- **Railway**: https://railway.app (免费额度)
- **Fly.io**: https://fly.io (免费额度)

---

## 📋 部署检查清单

部署前请确认:

- [ ] Python 3.8+ 已安装
- [ ] 所有依赖已安装 (`pip install -r requirements.txt`)
- [ ] 数据库已初始化 (`python init_data.py`)
- [ ] 防火墙允许 5000 端口
- [ ] 局域网设备可以访问服务器 IP
- [ ] 测试用户端和商家端页面

---

## 🔧 常见部署问题

### 问题 1: 端口被占用
```bash
# 修改 app.py 中的端口
app.run(host='0.0.0.0', port=8080, debug=False)
```

### 问题 2: 防火墙阻止访问
```bash
# Windows 防火墙
netsh advfirewall firewall add rule name="点单系统" dir=in action=allow protocol=TCP localport=5000

# Linux 防火墙 (ufw)
sudo ufw allow 5000
```

### 问题 3: 依赖安装失败
```bash
# 使用国内镜像源
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

---

## 📊 性能优化建议

### 生产环境部署

使用 **Gunicorn** 或 **uWSGI** 替代 Flask 自带服务器:

```bash
# 安装 Gunicorn
pip install gunicorn

# 启动服务 (4 个工作进程)
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static {
        alias /path/to/order-system/static;
    }
}
```

---

## 🎯 分发建议

### 给非技术用户

1. **打包成可执行文件** (PyInstaller)
2. 提供一键启动脚本
3. 附带简单的使用说明

### 给开发者

1. 上传到 GitHub
2. 提供详细的 README
3. 包含 Docker 配置

### 商业使用

1. 添加用户认证
2. 使用 HTTPS
3. 数据库升级到 PostgreSQL/MySQL
4. 添加日志和监控

---

## 📝 更新和维护

### 拉取最新代码
```bash
git pull origin main
```

### 备份数据库
```bash
# 定期备份 database.db
cp database.db database_backup_$(date +%Y%m%d).db
```

### 查看日志
```bash
# 如果使用 Gunicorn
tail -f gunicorn.log
```

---

**祝部署顺利! 🎉**
