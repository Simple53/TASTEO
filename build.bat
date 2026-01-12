@echo off
chcp 65001 >nul
echo ========================================
echo    点点鲜 - 打包脚本
echo ========================================
echo.

REM 检查 PyInstaller
pip show pyinstaller >nul 2>&1
if errorlevel 1 (
    echo [1/3] 安装 PyInstaller...
    pip install pyinstaller
) else (
    echo [1/3] PyInstaller 已安装
)

echo [2/3] 清理旧文件...
if exist "dist" rmdir /s /q dist
if exist "build" rmdir /s /q build
if exist "*.spec" del /q *.spec

echo [3/3] 开始打包...
pyinstaller --clean ^
    --onefile ^
    --add-data "templates;templates" ^
    --add-data "static;static" ^
    --add-data "database.db;." ^
    --name "点点鲜" ^
    --console ^
    app.py

echo.
echo ========================================
echo    打包完成！
echo ========================================
echo.
echo 可执行文件位置: dist\点点鲜.exe
echo.

REM 创建发布包
echo 创建发布包...
mkdir release 2>nul
copy "dist\点点鲜.exe" "release\" >nul
copy "README.md" "release\" >nul
copy "QUICKSTART.md" "release\" >nul
copy "database.db" "release\" >nul

echo 发布包已创建: release\
echo.
pause
