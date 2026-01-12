# 🚀 快速启动指南

## 第一次使用

### 1️⃣ 初始化数据库

已完成! ✅ 数据库已包含 26 个示例菜品

### 2️⃣ 启动服务

**Windows 用户:**
```bash
双击 start.bat
```

**Mac/Linux 用户:**
```bash
chmod +x start.sh
./start.sh
```

**或手动启动:**
```bash
python app.py
```

### 3️⃣ 访问系统

启动后会显示访问地址,例如:

```
============================================================
🍜 局域网点单系统已启动
============================================================
📱 用户点餐页面: http://192.168.1.100:5000/customer
💼 商家管理页面: http://192.168.1.100:5000/merchant
🌐 本机访问: http://127.0.0.1:5000
============================================================
提示: 局域网内其他设备可通过上述 IP 地址访问
按 Ctrl+C 停止服务
============================================================
```

---

## 📱 手机访问步骤

1. **确保手机和电脑在同一 WiFi**
2. **在手机浏览器输入地址**
   - 例如: `http://192.168.1.100:5000/customer`
3. **开始点餐!**

---

## 💡 使用场景演示

### 场景 1: 家庭聚会

1. **准备阶段**
   - 在电脑上启动系统
   - 打开商家端监控订单

2. **点餐阶段**
   - 客人用手机扫码或输入地址
   - 浏览菜单,添加到购物车
   - 输入桌号和姓名,提交订单

3. **后厨阶段**
   - 商家端实时显示新订单
   - 查看订单详情(桌号、菜品、总价)
   - 完成后点击"完成订单"

4. **结算阶段**
   - 导出 Excel 查看所有订单
   - 统计总营业额

### 场景 2: 小型餐厅测试

1. 在服务器上部署系统
2. 打印二维码放在餐桌上
3. 客人扫码点餐
4. 后厨实时接单
5. 每日导出数据分析

---

## 🎯 功能速览

### 用户端 (`/customer`)
- ✅ 浏览菜单 (支持分类筛选)
- ✅ 添加到购物车
- ✅ 调整数量
- ✅ 提交订单

### 商家端 (`/merchant`)
- ✅ 实时订单看板 (自动刷新)
- ✅ 订单统计
- ✅ 完成订单
- ✅ 导出 Excel/CSV

---

## 🔧 常见问题

### Q: 手机无法访问?
**A:** 检查以下几点:
1. 手机和电脑是否在同一 WiFi
2. 防火墙是否允许 5000 端口
3. IP 地址是否正确

### Q: 如何修改菜单?
**A:** 编辑 `init_data.py` 中的 `sample_menu` 列表,然后重新运行:
```bash
python init_data.py
```

### Q: 如何修改端口?
**A:** 编辑 `config.py` 文件:
```python
PORT = 8080  # 改为你想要的端口
```

### Q: 如何添加菜品图片?
**A:** 
1. 将图片放到 `static/images/` 目录
2. 在数据库中更新图片路径
3. 或使用默认图片 `default.jpg`

---

## 📊 数据管理

### 查看数据库
```bash
# 使用 SQLite 命令行工具
sqlite3 database.db

# 查看所有菜品
SELECT * FROM menu;

# 查看所有订单
SELECT * FROM orders;
```

### 备份数据
```bash
# 复制数据库文件
copy database.db database_backup.db
```

### 重置数据
```bash
# 删除数据库
del database.db  # Windows
rm database.db   # Mac/Linux

# 重新初始化
python init_data.py
```

---

## 🎨 自定义配置

### 修改主题颜色

编辑 `static/css/style.css`:

```css
:root {
    --primary-color: #ff6b35;  /* 主色调 */
    --secondary-color: #4ecdc4; /* 辅助色 */
    /* 修改为你喜欢的颜色 */
}
```

### 修改自动刷新间隔

编辑 `static/js/merchant.js`:

```javascript
// 修改刷新间隔 (毫秒)
autoRefreshInterval = setInterval(loadOrders, 3000); // 3秒
```

---

## 📦 下一步

### 上传到 GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/order-system.git
git push -u origin main
```

### 打包成应用
```bash
pip install pyinstaller
pyinstaller --onefile app.py
```

详细部署指南: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🆘 获取帮助

- 📖 查看 [README.md](README.md) 了解详细功能
- 🚀 查看 [DEPLOYMENT.md](DEPLOYMENT.md) 了解部署方案
- 💬 遇到问题可以提 Issue

---

**祝使用愉快! 🎉**
