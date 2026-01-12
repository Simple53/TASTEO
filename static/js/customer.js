// 全局变量
let menuData = [];
let cart = [];
let currentCategory = 'all';

// DOM 元素
const menuGrid = document.getElementById('menuGrid');
const categoryFilter = document.getElementById('categoryFilter');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.getElementById('closeModal');
const cartItems = document.getElementById('cartItems');
const modalTotal = document.getElementById('modalTotal');
const orderForm = document.getElementById('orderForm');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
});

// 加载菜单
async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        menuData = data;
        
        // 提取分类
        const categories = ['all', ...new Set(data.map(item => item.category))];
        renderCategories(categories);
        renderMenu();
    } catch (error) {
        console.error('加载菜单失败:', error);
        showToast('加载菜单失败,请刷新页面', 'error');
    }
}

// 渲染分类
function renderCategories(categories) {
    categoryFilter.innerHTML = categories.map(cat => `
        <button class="category-btn ${cat === 'all' ? 'active' : ''}" 
                data-category="${cat}">
            ${cat === 'all' ? '全部' : cat}
        </button>
    `).join('');

    // 绑定分类点击事件
    categoryFilter.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            categoryFilter.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMenu();
        });
    });
}

// 渲染菜单
function renderMenu() {
    const filteredMenu = currentCategory === 'all' 
        ? menuData 
        : menuData.filter(item => item.category === currentCategory);

    menuGrid.innerHTML = filteredMenu.map(item => `
        <div class="menu-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="menu-item-image" 
                 onerror="this.src='/static/images/default.jpg'">
            <div class="menu-item-info">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-price">${item.price}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                    加入购物车
                </button>
            </div>
        </div>
    `).join('');
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
    showToast(`${item.name} 已加入购物车`, 'success');
}

// 更新购物车
function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toFixed(2);
    checkoutBtn.disabled = totalItems === 0;
}

// 打开结算模态框
checkoutBtn.addEventListener('click', () => {
    renderCartItems();
    checkoutModal.classList.add('active');
});

// 关闭模态框
closeModal.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
});

checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.classList.remove('active');
    }
});

// 渲染购物车项
function renderCartItems() {
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">¥${item.price}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');

    modalTotal.textContent = totalPrice.toFixed(2);
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
    renderCartItems();
}

// 提交订单
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tableNumber = document.getElementById('tableNumber').value.trim();
    const customerName = document.getElementById('customerName').value.trim();

    if (!tableNumber || !customerName) {
        showToast('请填写完整信息', 'error');
        return;
    }

    const orderData = {
        table_number: tableNumber,
        customer_name: customerName,
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total_price: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
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
        } else {
            showToast(result.error || '订单提交失败', 'error');
        }
    } catch (error) {
        console.error('提交订单失败:', error);
        showToast('网络错误,请重试', 'error');
    }
});

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
