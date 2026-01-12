#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
数据库初始化脚本
创建示例菜单数据
"""

import sqlite3
import os

DATABASE = 'database.db'

def init_database():
    """初始化数据库和示例数据"""
    
    # 如果数据库已存在,询问是否重置
    if os.path.exists(DATABASE):
        print(f"⚠️  数据库文件 {DATABASE} 已存在")
        choice = input("是否重置数据库? (y/N): ").strip().lower()
        if choice != 'y':
            print("❌ 取消初始化")
            return
        os.remove(DATABASE)
        print("🗑️  已删除旧数据库")
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    print("📦 创建数据表...")
    
    # 创建菜单表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            image TEXT DEFAULT 'default.jpg',
            category TEXT DEFAULT '主食',
            available INTEGER DEFAULT 1
        )
    ''')
    
    # 创建订单表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            table_number TEXT NOT NULL,
            customer_name TEXT NOT NULL,
            items TEXT NOT NULL,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP
        )
    ''')
    
    print("🍽️  插入示例菜单数据...")
    
    # 示例菜单数据
    sample_menu = [
        # 热菜
        ('宫保鸡丁', 38.0, 'default.jpg', '热菜'),
        ('鱼香肉丝', 35.0, 'default.jpg', '热菜'),
        ('麻婆豆腐', 28.0, 'default.jpg', '热菜'),
        ('糖醋里脊', 42.0, 'default.jpg', '热菜'),
        ('红烧排骨', 48.0, 'default.jpg', '热菜'),
        ('回锅肉', 45.0, 'default.jpg', '热菜'),
        ('青椒肉丝', 32.0, 'default.jpg', '热菜'),
        
        # 海鲜
        ('清蒸鲈鱼', 68.0, 'default.jpg', '海鲜'),
        ('蒜蓉粉丝蒸虾', 58.0, 'default.jpg', '海鲜'),
        ('香辣蟹', 78.0, 'default.jpg', '海鲜'),
        
        # 家常菜
        ('西红柿炒蛋', 22.0, 'default.jpg', '家常菜'),
        ('青菜豆腐', 18.0, 'default.jpg', '家常菜'),
        ('蒜蓉空心菜', 20.0, 'default.jpg', '家常菜'),
        
        # 凉菜
        ('酸辣土豆丝', 18.0, 'default.jpg', '凉菜'),
        ('拍黄瓜', 15.0, 'default.jpg', '凉菜'),
        ('凉拌木耳', 20.0, 'default.jpg', '凉菜'),
        
        # 主食
        ('米饭', 3.0, 'default.jpg', '主食'),
        ('炒饭', 15.0, 'default.jpg', '主食'),
        ('面条', 12.0, 'default.jpg', '主食'),
        
        # 汤类
        ('紫菜蛋花汤', 15.0, 'default.jpg', '汤类'),
        ('西红柿蛋汤', 18.0, 'default.jpg', '汤类'),
        ('酸辣汤', 20.0, 'default.jpg', '汤类'),
        
        # 饮料
        ('可乐', 8.0, 'default.jpg', '饮料'),
        ('雪碧', 8.0, 'default.jpg', '饮料'),
        ('橙汁', 12.0, 'default.jpg', '饮料'),
        ('酸梅汤', 10.0, 'default.jpg', '饮料'),
    ]
    
    cursor.executemany(
        'INSERT INTO menu (name, price, image, category) VALUES (?, ?, ?, ?)',
        sample_menu
    )
    
    conn.commit()
    conn.close()
    
    print("✅ 数据库初始化完成!")
    print(f"📊 已添加 {len(sample_menu)} 个菜品")
    print("\n可以运行以下命令启动服务:")
    print("  Windows: start.bat")
    print("  Mac/Linux: ./start.sh")
    print("  或直接运行: python app.py")

if __name__ == '__main__':
    init_database()
