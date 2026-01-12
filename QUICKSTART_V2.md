# 食刻 v2.0 快速启动指南

## 🚀 立即开始

### 1. 升级数据库
```bash
cd G:\onedrive\smallprjs\order-system
python upgrade_db.py
```

### 2. 安装依赖 (如果还没安装)
```bash
pip install -r requirements.txt
```

### 3. 下载菜品图片 (可选)
```bash
python image_service.py
```

### 4. 启动服务
```bash
python app.py
```

### 5. 访问系统
- 登录页: http://localhost:5000/login
- 用户端: http://localhost:5000/customer (可直接访问,游客模式)
- 商家端: http://localhost:5000/merchant

## 🔑 默认账号

**商家登录**:
- 用户名: `admin`
- 密码: `admin123`

## ✨ 新功能体验

### 布局切换
1. 访问用户端
2. 点击右上角的布局切换按钮
3. 在列表和网格布局间切换

### 菜品详情
1. 点击任意菜品
2. 查看大图、描述、做法
3. 点击"加入购物车"

### 简化点餐
1. 添加菜品到购物车
2. 点击"去结算"
3. 只需输入桌号即可提交

## 📝 注意事项

- 首次运行需要执行 `upgrade_db.py` 升级数据库
- 图片下载是可选的,系统会使用默认图片
- 游客模式可以直接访问用户端,无需登录
- 商家端建议登录后使用

## 🎯 下一步

运行系统后,可以:
1. 体验新的双布局系统
2. 测试简化的点餐流程
3. 查看菜品详情页
4. 使用登录系统

祝使用愉快! 🍽️
