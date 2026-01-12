#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
食刻 - 用户认证模块
"""

import hashlib
import sqlite3
from functools import wraps
from flask import session, jsonify, redirect, url_for

DATABASE = 'database.db'

def hash_password(password):
    """密码哈希"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, password_hash):
    """验证密码"""
    return hash_password(password) == password_hash

def authenticate_user(username, password, role):
    """
    验证用户
    
    Args:
        username: 用户名
        password: 密码
        role: 角色 (merchant/customer)
    
    Returns:
        用户信息字典或 None
    """
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute(
        'SELECT * FROM users WHERE username = ? AND role = ?',
        (username, role)
    )
    user = cursor.fetchone()
    conn.close()
    
    if user and verify_password(password, user['password_hash']):
        return {
            'id': user['id'],
            'username': user['username'],
            'role': user['role']
        }
    
    return None

def create_user(username, password, role):
    """
    创建用户
    
    Args:
        username: 用户名
        password: 密码
        role: 角色
    
    Returns:
        成功返回 True,失败返回 False
    """
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        password_hash = hash_password(password)
        cursor.execute(
            'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
            (username, password_hash, role)
        )
        
        conn.commit()
        conn.close()
        return True
    except sqlite3.IntegrityError:
        return False

def login_required(role=None):
    """
    登录装饰器
    
    Args:
        role: 要求的角色,None 表示任何角色都可以
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user' not in session:
                return jsonify({'error': '请先登录'}), 401
            
            if role and session['user']['role'] != role:
                return jsonify({'error': '权限不足'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
