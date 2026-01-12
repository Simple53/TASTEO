# 配置文件

# 服务器配置
HOST = '0.0.0.0'  # 监听所有网络接口
PORT = 5000        # 服务端口

# 数据库配置
DATABASE = 'database.db'

# 应用配置
DEBUG = False      # 生产环境设为 False
SECRET_KEY = 'your-secret-key-change-this-in-production'

# 导出文件配置
EXPORT_DIR = 'exports'  # 导出文件保存目录

# 自动刷新间隔 (毫秒)
AUTO_REFRESH_INTERVAL = 3000  # 商家端订单自动刷新间隔
