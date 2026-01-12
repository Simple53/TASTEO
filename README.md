# 🍽️ 食刻 (TASTEO)

> 轻量级局域网点单系统 - 让美食触手可及

## ✨ 功能特性

### 👥 用户端

- 📱 响应式设计,支持手机和电脑访问
- 🍽️ 精美的菜单展示(支持图片和价格)
- 🛒 购物车功能(添加/删除/数量调整)
- 📝 订单提交(桌号和姓名)
- 🎨 现代化 UI 设计(渐变色、卡片布局、动画效果)

### 💼 商家端

- 📊 实时订单看板(自动刷新)
- 📈 营业数据统计(订单数、营业额)
- ✅ 订单管理(完成订单)
- 📥 数据导出(Excel/CSV 格式)
- 🔍 订单筛选(全部/待处理/已完成)

### 💾 数据管理

- 🗄️ SQLite 数据库存储
- 📦 所有订单历史保存
- 📊 一键导出 Excel 或 CSV

## 🚀 快速开始

### 环境要求

- Python 3.8 或更高版本
- 现代浏览器(Chrome/Edge/Safari)

### 安装步骤

#### Windows 用户

1. 双击运行 `start.bat`
2. 脚本会自动:
   - 检查 Python 环境
   - 安装依赖包
   - 初始化数据库
   - 启动服务

#### Mac/Linux 用户

1. 给启动脚本添加执行权限:

   ```bash
   chmod +x start.sh
   ```
2. 运行启动脚本:

   ```bash
   ./start.sh
   ```

### 手动安装(可选)

如果自动脚本无法运行,可以手动执行以下步骤:

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 初始化数据库
python init_data.py

# 3. 启动服务
python app.py
```

## 🌐 访问系统

服务启动后,会显示访问地址:

### 用户端(点餐页面)

- **本机访问**: http://localhost:5000/customer
- **局域网访问**: http://你的IP地址:5000/customer

### 商家端(管理后台)

- **本机访问**: http://localhost:5000/merchant
- **局域网访问**: http://你的IP地址:5000/merchant

> 💡 **提示**: 局域网内其他设备可以通过服务器的 IP 地址访问系统

## 📱 如何在手机上访问

1. 确保手机和电脑连接在同一个 WiFi 网络
2. 在电脑上运行 `ipconfig`(Windows) 或 `ifconfig`(Mac/Linux) 查看本机 IP
3. 在手机浏览器输入: `http://电脑IP:5000/customer`

### 示例

如果电脑 IP 是 `192.168.1.100`:

- 用户端: `http://192.168.1.100:5000/customer`
- 商家端: `http://192.168.1.100:5000/merchant`

## 🔧 配置说明

### 修改端口

编辑 `config.py` 文件:

```python
PORT = 5000  # 改为你想要的端口
```

### 添加菜品

编辑 `init_data.py` 文件中的 `sample_menu` 列表,然后重新运行:

```bash
python init_data.py
```

### 菜品图片

将菜品图片放到 `static/images/` 目录,然后在数据库中更新图片路径。

## 📂 项目结构

```
order-system/
├── app.py                 # Flask 主应用
├── models.py              # 数据库模型
├── config.py              # 配置文件
├── init_data.py           # 数据初始化脚本
├── requirements.txt       # Python 依赖
├── start.bat              # Windows 启动脚本
├── start.sh               # Linux/Mac 启动脚本
├── database.db            # SQLite 数据库(自动生成)
├── static/                # 静态资源
│   ├── css/
│   │   └── style.css     # 全局样式
│   ├── js/
│   │   ├── customer.js   # 用户端脚本
│   │   └── merchant.js   # 商家端脚本
│   └── images/           # 图片资源
│       └── default.jpg   # 默认菜品图片
└── templates/            # HTML 模板
    ├── customer.html     # 用户端页面
    └── merchant.html     # 商家端页面
```

## 🎯 使用场景

- 🏠 家庭聚会点餐
- 🍴 小型餐厅内部测试
- 🎉 活动现场订餐
- 📚 教学演示项目
- 🧪 快速原型开发

## 🛠️ 技术栈

- **后端**: Flask (Python)
- **数据库**: SQLite
- **前端**: HTML5 + CSS3 + JavaScript (原生)
- **数据导出**: openpyxl + pandas

## 📊 数据导出

在商家端点击导出按钮即可下载:

- **Excel 格式** (.xlsx): 包含所有订单详情
- **CSV 格式** (.csv): 纯文本格式,易于导入其他系统

导出文件包含:

- 订单 ID
- 桌号
- 顾客姓名
- 订单详情
- 总价
- 订单状态
- 创建时间
- 完成时间

## 🔒 安全提示

⚠️ **注意**: 此系统仅适用于局域网环境,不建议直接暴露到公网。

如需公网访问,请:

1. 添加用户认证
2. 使用 HTTPS
3. 配置防火墙
4. 使用反向代理(如 Nginx)

## 🐛 常见问题

### 1. 无法访问系统

- 检查防火墙是否允许 5000 端口
- 确认电脑和手机在同一局域网
- 尝试关闭防火墙测试

### 2. 依赖安装失败

```bash
# 使用国内镜像源
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 3. 数据库错误

删除 `database.db` 文件,重新运行 `python init_data.py`

### 4. 端口被占用

修改 `config.py` 中的 `PORT` 配置

## 📝 开发计划

未来可能添加的功能:

- [ ] 菜品库存管理
- [ ] 订单打印功能
- [ ] 营业数据图表
- [ ] 多商家支持
- [ ] 微信支付集成
- [ ] 桌台管理
- [ ] 会员系统

## 📄 许可证

MIT License - 自由使用和修改

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📧 联系方式

如有问题或建议,欢迎反馈!

---

**享受点餐的乐趣! 🎉**
