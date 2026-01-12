# 食刻 v2.0 测试脚本

## 测试环境设置

### 创建虚拟环境
```bash
python -m venv venv
```

### 激活虚拟环境
**Windows:**
```bash
.\venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 安装依赖
```bash
pip install -r requirements.txt
```

### 升级数据库
```bash
python upgrade_db.py
```

## 功能测试清单

### 1. 数据库测试
- [x] 运行 upgrade_db.py
- [ ] 检查新字段是否添加
- [ ] 检查用户表是否创建
- [ ] 验证默认管理员账号

### 2. 用户端测试
- [ ] 访问 /customer
- [ ] 测试布局切换 (列表/网格)
- [ ] 测试菜品详情页
- [ ] 测试购物车功能
- [ ] 测试订单提交 (只需桌号)

### 3. 商家端测试
- [ ] 访问 /merchant
- [ ] 测试订单列表
- [ ] 测试订单完成
- [ ] 测试数据导出

### 4. 登录系统测试
- [ ] 访问 /login
- [ ] 测试商家登录 (admin/admin123)
- [ ] 测试游客模式
- [ ] 测试登出功能

### 5. 图片系统测试
- [ ] 运行 image_service.py
- [ ] 检查图片下载
- [ ] 验证图片显示

## 启动服务
```bash
python app.py
```

## 访问地址
- 登录页: http://localhost:5000/login
- 用户端: http://localhost:5000/customer
- 商家端: http://localhost:5000/merchant

## 退出虚拟环境
```bash
deactivate
```
