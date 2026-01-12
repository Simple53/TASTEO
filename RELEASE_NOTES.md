# 食刻 v2.0.0 Release Notes

## 🎉 重大更新

**食刻 (TASTEO) v2.0.0** - 从"点点鲜"全面升级!

---

## ✨ 新功能

### 1. 双布局系统
- 🍱 **美团风格竖排布局**: 大图展示,详细信息,月售/评分
- 📸 **Instagram网格布局**: 紧凑排列,快速浏览
- 🔄 **一键切换**: 右上角按钮轻松切换

### 2. 登录系统
- 👤 食客登录
- 💼 商家登录 (默认: admin/admin123)
- 🎫 游客模式 (可跳过登录)
- 🔐 Session管理

### 3. 菜品详情页
- 🖼️ 大图展示
- 📖 菜品介绍
- 👨‍🍳 做法说明
- ⭐ 评分和销量

### 4. 简化点餐流程
- ❌ 移除姓名输入
- ✅ 只需输入桌号
- 🤖 自动生成顾客名称

### 5. 图片系统
- 🌐 在线图片API
- 💾 本地缓存
- 🔄 批量下载

### 6. 界面优化
- 🎯 修复页面跳动
- ✨ 平滑过渡动画
- 📱 响应式设计优化

---

## 📦 下载

### 桌面版
- **Windows**: `tasteo-v2.0.0-windows.zip`
- **Linux**: `tasteo-v2.0.0-linux.tar.gz`
- **macOS**: `tasteo-v2.0.0-macos.tar.gz`

### 移动端
- **PWA**: 通过浏览器访问并"添加到主屏幕"
- **说明**: 查看 [MOBILE_BUILD.md](MOBILE_BUILD.md)

---

## 🚀 快速开始

### 桌面版
1. 下载对应平台的压缩包
2. 解压
3. 运行可执行文件
4. 访问显示的地址

### 从源码运行
```bash
# 克隆仓库
git clone https://github.com/Simple53/TASTEO.git
cd TASTEO

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 升级数据库
python upgrade_db.py

# 启动服务
python app.py
```

### 移动端 (PWA)
1. 在手机浏览器访问: `http://服务器IP:5000`
2. 点击浏览器菜单 → "添加到主屏幕"
3. 应用图标会出现在桌面

---

## 🔧 升级指南

### 从 v1.0 升级

```bash
# 1. 拉取最新代码
git pull

# 2. 升级数据库
python upgrade_db.py

# 3. 重启服务
python app.py
```

---

## 📝 更新日志

### v2.0.0 (2026-01-12)

#### 新增
- ✅ 双布局系统 (美团风格 + Instagram网格)
- ✅ 登录系统 (商家/食客/游客)
- ✅ 菜品详情页
- ✅ 图片自动下载服务
- ✅ PWA支持

#### 改进
- ✅ 简化点餐流程 (移除姓名输入)
- ✅ 修复页面跳动
- ✅ 优化响应式设计
- ✅ 平滑过渡动画

#### 数据库
- ✅ 新增字段: description, cooking_method, image_url, sales_count, rating
- ✅ 新增表: users
- ✅ 默认管理员: admin/admin123

---

## 🛠️ 技术栈

- **后端**: Flask 3.1.2
- **数据库**: SQLite
- **前端**: HTML5 + CSS3 + JavaScript
- **数据导出**: openpyxl + pandas
- **图片服务**: Foodish API

---

## 📚 文档

- [README.md](README.md) - 项目说明
- [QUICKSTART_V2.md](QUICKSTART_V2.md) - 快速开始
- [MOBILE_BUILD.md](MOBILE_BUILD.md) - 移动端打包
- [DEPLOYMENT.md](DEPLOYMENT.md) - 部署指南

---

## 🐛 已知问题

暂无

---

## 🙏 致谢

感谢所有使用食刻的用户!

---

## 📄 许可证

MIT License

---

**享受美食,享受生活! 🍽️**
