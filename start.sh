#!/bin/bash

echo "========================================"
echo "   点点鲜 - 启动脚本"
echo "========================================"
echo ""

# 检查 Python 是否安装
if ! command -v python3 &> /dev/null; then
    echo "[错误] 未检测到 Python，请先安装 Python 3.8+"
    exit 1
fi

echo "[1/4] 检查依赖..."
if ! python3 -c "import flask" &> /dev/null; then
    echo "[2/4] 安装依赖包..."
    pip3 install -r requirements.txt
else
    echo "[2/4] 依赖已安装"
fi

# 检查数据库是否存在
if [ ! -f "database.db" ]; then
    echo "[3/4] 初始化数据库..."
    python3 init_data.py
else
    echo "[3/4] 数据库已存在"
fi

echo "[4/4] 启动服务..."
echo ""
echo "========================================"
echo "   服务已启动！"
echo "========================================"

# 获取本机 IP
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IP=$(ipconfig getifaddr en0)
else
    # Linux
    IP=$(hostname -I | awk '{print $1}')
fi

echo ""
echo "📱 用户端访问地址:"
echo "   本机访问: http://localhost:5000/customer"
echo "   局域网访问: http://$IP:5000/customer"
echo ""
echo "💼 商家端访问地址:"
echo "   本机访问: http://localhost:5000/merchant"
echo "   局域网访问: http://$IP:5000/merchant"
echo ""
echo "========================================"
echo "按 Ctrl+C 停止服务"
echo "========================================"
echo ""

python3 app.py
