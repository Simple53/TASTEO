// 食刻 v2.0 - 用户端脚本
// 全局变量
let menuData = [];
let cart = [];
let currentCategory = 'all';
let currentLayout = 'list'; // 'list' or 'grid'

// DOM 元素
const menuContainer = document.getElementById('menuContainer');
const categoryNav = document.getElementById('categoryNav');
const cartBadge = document.getElementById('cartBadge');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.getElementById('closeModal');
const cartItems = document.getElementById('cartItems');
const modalSubtotal = document.getElementById('modalSubtotal');
const modalTotal = document.getElementById('modalTotal');
const orderForm = document.getElementById('orderForm');
const detailModal = document.getElementById('detailModal');
const closeDetailModal = document.getElementById('closeDetailModal');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    setupLayoutSwitch();
    setupEventListeners();
});

// 设置布局切换
function setupLayoutSwitch() {
    const layoutBtns = document.querySelectorAll('.layout-btn');
    layoutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const layout = btn.dataset.layout;
            switchLayout(layout);
            
            // 更新按钮状态
            layoutBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// 切换布局
function switchLayout(layout) {
    currentLayout = layout;
    menuContainer.className = `menu-container ${layout}-layout`;
    renderMenu();
}

// 设置事件监听
function setupEventListeners() {
    // 关闭模态框
    closeModal.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
    });
    
    closeDetailModal.addEventListener('click', () => {
        detailModal.classList.remove('active');
    });
    
    // 点击背景关闭
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('active');
        }
    });
    
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            detailModal.classList.remove('active');
        }
    });
    
    // 结算按钮
    checkoutBtn.addEventListener('click', openCheckout);
    
    // 提交订单
    orderForm.addEventListener('submit', submitOrder);
}

// 加载菜单
async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        menuData = await response.json();
        
        // 提取分类
        const categories = [...new Set(menuData.map(item => item.category))];
        renderCategories(categories);
        renderMenu();
    } catch (error) {
        console.error('加载菜单失败:', error);
        showToast('加载菜单失败,请刷新页面', 'error');
    }
}

// 渲染分类
function renderCategories(categories) {
    const categoryIcons = {
        '热菜': '🔥',
        '海鲜': '🦐',
        '家常菜': '🥘',
        '凉菜': '🥗',
        '主食': '🍚',
        '汤类': '🍲',
        '饮料': '🥤'
    };
    
    const categoryScroll = categoryNav.querySelector('.category-scroll');
    categoryScroll.innerHTML = `
        <button class="category-tab active" data-category="all">
            <span class="category-icon">🔥</span>
            <span>热销</span>
        </button>
        ${categories.map(cat => `
            <button class="category-tab" data-category="${cat}">
                <span class="category-icon">${categoryIcons[cat] || '🍽️'}</span>
                <span>${cat}</span>
            </button>
        `).join('')}
    `;
    
    // 绑定分类点击事件
    categoryScroll.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            currentCategory = tab.dataset.category;
            categoryScroll.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderMenu();
        });
    });
}

// 渲染菜单
function renderMenu() {
    const filteredMenu = currentCategory === 'all' 
        ? menuData 
        : menuData.filter(item => item.category === currentCategory);
    
    if (currentLayout === 'list') {
        renderListLayout(filteredMenu);
    } else {
        renderGridLayout(filteredMenu);
    }
}

// 渲染列表布局
function renderListLayout(items) {
    menuContainer.innerHTML = items.map(item => {
        const cartItem = cart.find(c => c.id === item.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        return `
            <div class="menu-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="menu-item-image" 
                     onerror="this.src='/static/images/default.jpg'"
                     onclick="showDetail(${item.id})">
                <div class="menu-item-content">
                    <div class="menu-item-header">
                        <div>
                            <div class="menu-item-name">${item.name}</div>
                            ${item.description ? `<div class="menu-item-desc">${item.description}</div>` : ''}
                            <div class="menu-item-meta">
                                <span>月售${item.sales_count || 0}</span>
                                <span>⭐ ${item.rating || 5.0}</span>
                            </div>
                        </div>
                    </div>
                    <div class="menu-item-footer">
                        <div class="menu-item-price">${item.price}</div>
                        <div class="add-btn-wrapper">
                            ${quantity > 0 ? `
                                <div class="quantity-control">
                                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                    <span class="quantity-display">${quantity}</span>
                                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                                </div>
                            ` : `
                                <button class="add-btn" onclick="addToCart(${item.id})">+</button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 渲染网格布局
function renderGridLayout(items) {
    menuContainer.innerHTML = items.map(item => {
        return `
            <div class="menu-item" data-id="${item.id}" onclick="showDetail(${item.id})">
                <img src="${item.image}" alt="${item.name}" class="menu-item-image" 
                     onerror="this.src='/static/images/default.jpg'">
                <div class="menu-item-content">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-footer">
                        <div class="menu-item-price">${item.price}</div>
                        <button class="add-btn" onclick="event.stopPropagation(); addToCart(${item.id})">+</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 添加到购物车
function addToCart(itemId) {
    const item = menuData.find(m => m.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(c => c.id === itemId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCart();
    renderMenu(); // 重新渲染以更新数量显示
    showToast(`${item.name} 已加入购物车`, 'success');
}

// 更新数量
function updateQuantity(itemId, delta) {
    const item = cart.find(c => c.id === itemId);
    if (!item) return;
    
    item.quantity += delta;
    
    if (item.quantity <= 0) {
        cart = cart.filter(c => c.id !== itemId);
    }
    
    updateCart();
    renderMenu(); // 重新渲染以更新数量显示
}

// 更新购物车
function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    cartBadge.textContent = totalItems;
    cartTotal.textContent = totalPrice.toFixed(2);
    checkoutBtn.disabled = totalItems === 0;
}

// 打开结算
function openCheckout() {
    renderCartItems();
    checkoutModal.classList.add('active');
}

// 渲染购物车项
function renderCartItems() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 3.5;
    const total = subtotal + deliveryFee;
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">¥${item.price}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantityInModal(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantityInModal(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');
    
    modalSubtotal.textContent = subtotal.toFixed(2);
    modalTotal.textContent = total.toFixed(2);
}

// 在模态框中更新数量
function updateQuantityInModal(itemId, delta) {
    updateQuantity(itemId, delta);
    renderCartItems();
}

// 提交订单
async function submitOrder(e) {
    e.preventDefault();
    
    const tableNumber = document.getElementById('tableNumber').value.trim();
    
    if (!tableNumber) {
        showToast('请输入桌号', 'error');
        return;
    }
    
    const orderData = {
        table_number: tableNumber,
        customer_name: `桌${tableNumber}`, // 自动生成名称
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total_price: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 3.5
    };
    
    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast('订单提交成功!', 'success');
            cart = [];
            updateCart();
            checkoutModal.classList.remove('active');
            orderForm.reset();
            renderMenu();
        } else {
            showToast(result.error || '订单提交失败', 'error');
        }
    } catch (error) {
        console.error('提交订单失败:', error);
        showToast('网络错误,请重试', 'error');
    }
}

// 显示详情
function showDetail(itemId) {
    const item = menuData.find(m => m.id === itemId);
    if (!item) return;
    
    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="detail-image" 
             onerror="this.src='/static/images/default.jpg'">
        <div class="detail-title">${item.name}</div>
        <div class="detail-price">¥${item.price}</div>
        
        ${item.description ? `
            <div class="detail-section">
                <h3>菜品介绍</h3>
                <p>${item.description}</p>
            </div>
        ` : ''}
        
        ${item.cooking_method ? `
            <div class="detail-section">
                <h3>做法</h3>
                <p>${item.cooking_method}</p>
            </div>
        ` : ''}
        
        <div class="detail-section">
            <h3>评分</h3>
            <p>⭐ ${item.rating || 5.0} 分 | 月售 ${item.sales_count || 0} 份</p>
        </div>
        
        <button class="submit-order-btn" onclick="detailModal.classList.remove('active'); addToCart(${item.id})">
            加入购物车
        </button>
    `;
    
    detailModal.classList.add('active');
}

// 显示提示消息
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
