#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
食刻 (TASTEO) - 数据库升级脚本
从 v1.0 升级到 v2.0
"""

import sqlite3
import os

DATABASE = 'database.db'

def upgrade_database():
    """升级数据库到 v2.0"""
    
    if not os.path.exists(DATABASE):
        print("❌ 数据库文件不存在,请先运行 init_data.py")
        return
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    print("🔄 开始升级数据库...")
    
    try:
        # 检查并添加新字段到 menu 表
        print("📝 升级菜单表...")
        
        # 获取现有列
        cursor.execute("PRAGMA table_info(menu)")
        existing_columns = [col[1] for col in cursor.fetchall()]
        
        # 添加新列
        new_columns = {
            'description': 'TEXT',
            'cooking_method': 'TEXT',
            'image_url': 'TEXT',
            'sales_count': 'INTEGER DEFAULT 0',
            'rating': 'REAL DEFAULT 5.0'
        }
        
        for col_name, col_type in new_columns.items():
            if col_name not in existing_columns:
                cursor.execute(f'ALTER TABLE menu ADD COLUMN {col_name} {col_type}')
                print(f"  ✅ 添加字段: {col_name}")
        
        # 创建用户表
        print("📝 创建用户表...")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        print("  ✅ 用户表创建完成")
        
        # 添加默认管理员账号 (密码: admin123)
        # 使用简单的密码哈希 (生产环境应使用 bcrypt)
        import hashlib
        admin_password = hashlib.sha256('admin123'.encode()).hexdigest()
        
        try:
            cursor.execute(
                'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
                ('admin', admin_password, 'merchant')
            )
            print("  ✅ 创建默认管理员账号: admin / admin123")
        except sqlite3.IntegrityError:
            print("  ℹ️  管理员账号已存在")
        
        # 检查并添加 user_id 到 orders 表
        print("📝 升级订单表...")
        cursor.execute("PRAGMA table_info(orders)")
        order_columns = [col[1] for col in cursor.fetchall()]
        
        if 'user_id' not in order_columns:
            cursor.execute('ALTER TABLE orders ADD COLUMN user_id INTEGER')
            print("  ✅ 添加字段: user_id")
        
        # 使 customer_name 可为空
        if 'customer_name' in order_columns:
            print("  ℹ️  customer_name 字段已存在(保留兼容性)")
        
        conn.commit()
        print("\n✅ 数据库升级完成!")
        print("\n📊 当前数据库结构:")
        print("  - menu: 菜单表(包含图片、描述、做法等)")
        print("  - orders: 订单表(支持用户关联)")
        print("  - users: 用户表(商家和食客)")
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ 升级失败: {e}")
        raise
    finally:
        conn.close()

if __name__ == '__main__':
    upgrade_database()
