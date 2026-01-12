@echo off
chcp 65001 >nul
echo ========================================
echo    点点鲜 - 启动脚本
echo ========================================
echo.

REM 检查 Python 是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Python，请先安装 Python 3.8+
    echo 下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [1/4] 检查依赖...
pip show Flask >nul 2>&1
if errorlevel 1 (
    echo [2/4] 安装依赖包...
    pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
) else (
    echo [2/4] 依赖已安装
)

REM 检查数据库是否存在
if not exist "database.db" (
    echo [3/4] 初始化数据库...
    python init_data.py
) else (
    echo [3/4] 数据库已存在
)

echo [4/4] 启动服务...
echo.
echo ========================================
echo    服务已启动！
echo ========================================

REM 获取本机 IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%

echo.
echo 📱 用户端访问地址:
echo    本机访问: http://localhost:5000/customer
echo    局域网访问: http://%IP%:5000/customer
echo.
echo 💼 商家端访问地址:
echo    本机访问: http://localhost:5000/merchant
echo    局域网访问: http://%IP%:5000/merchant
echo.
echo ========================================
echo 按 Ctrl+C 停止服务
echo ========================================
echo.

python app.py

pause
