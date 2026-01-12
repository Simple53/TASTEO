#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
食刻 - 图片服务
自动搜索并下载菜品图片
"""

import requests
import os
import hashlib
from urllib.parse import quote

# Unsplash API 配置 (免费,无需 API Key 的备用方案)
# 使用 Lorem Picsum 作为占位图片服务
PLACEHOLDER_API = "https://picsum.photos/400/300"

# 使用免费的食物图片 API
FOODISH_API = "https://foodish-api.com/api/"

def download_image(dish_name, save_path='static/images'):
    """
    下载菜品图片
    
    Args:
        dish_name: 菜品名称
        save_path: 保存路径
    
    Returns:
        图片文件名
    """
    # 创建保存目录
    os.makedirs(save_path, exist_ok=True)
    
    # 生成文件名 (使用 MD5 避免重复)
    filename = f"{hashlib.md5(dish_name.encode()).hexdigest()}.jpg"
    filepath = os.path.join(save_path, filename)
    
    # 如果文件已存在,直接返回
    if os.path.exists(filepath):
        return filename
    
    try:
        # 尝试从 Foodish API 获取随机食物图片
        response = requests.get(FOODISH_API, timeout=5)
        if response.status_code == 200:
            data = response.json()
            image_url = data.get('image')
            
            if image_url:
                # 下载图片
                img_response = requests.get(image_url, timeout=10)
                if img_response.status_code == 200:
                    with open(filepath, 'wb') as f:
                        f.write(img_response.content)
                    print(f"✅ 下载图片: {dish_name} -> {filename}")
                    return filename
    except Exception as e:
        print(f"⚠️  下载失败: {dish_name} - {e}")
    
    # 如果失败,使用占位图片
    try:
        response = requests.get(PLACEHOLDER_API, timeout=5)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            print(f"📷 使用占位图片: {dish_name} -> {filename}")
            return filename
    except:
        pass
    
    # 如果都失败,返回默认图片
    return 'default.jpg'


def batch_download_images(menu_items):
    """
    批量下载菜品图片
    
    Args:
        menu_items: 菜品列表 [(id, name), ...]
    
    Returns:
        {id: filename} 字典
    """
    results = {}
    total = len(menu_items)
    
    print(f"🔄 开始下载 {total} 个菜品图片...")
    
    for i, (item_id, name) in enumerate(menu_items, 1):
        print(f"[{i}/{total}] 下载: {name}")
        filename = download_image(name)
        results[item_id] = filename
    
    print(f"✅ 下载完成! 成功: {len(results)}/{total}")
    return results


def update_menu_images():
    """
    更新数据库中的菜品图片
    """
    import sqlite3
    
    DATABASE = 'database.db'
    
    if not os.path.exists(DATABASE):
        print("❌ 数据库不存在")
        return
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # 获取所有菜品
    cursor.execute('SELECT id, name FROM menu')
    menu_items = cursor.fetchall()
    
    # 批量下载图片
    image_map = batch_download_images(menu_items)
    
    # 更新数据库
    print("\n📝 更新数据库...")
    for item_id, filename in image_map.items():
        cursor.execute(
            'UPDATE menu SET image = ?, image_url = ? WHERE id = ?',
            (filename, f'/static/images/{filename}', item_id)
        )
    
    conn.commit()
    conn.close()
    
    print("✅ 数据库更新完成!")


if __name__ == '__main__':
    update_menu_images()
