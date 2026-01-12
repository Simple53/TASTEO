// 全局变量
let allOrders = [];
let currentFilter = 'all';
let autoRefreshInterval = null;

// DOM 元素
const ordersGrid = document.getElementById('ordersGrid');
const emptyState = document.getElementById('emptyState');
const totalOrdersEl = document.getElementById('totalOrders');
const pendingOrdersEl = document.getElementById('pendingOrders');
const totalRevenueEl = document.getElementById('totalRevenue');
const refreshBtn = document.getElementById('refreshBtn');
const exportExcelBtn = document.getElementById('exportExcelBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const autoRefreshCheckbox = document.getElementById('autoRefresh');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    setupEventListeners();
    startAutoRefresh();
});

// 设置事件监听
function setupEventListeners() {
    // 刷新按钮
    refreshBtn.addEventListener('click', loadOrders);

    // 导出按钮
    exportExcelBtn.addEventListener('click', () => exportData('excel'));
    exportCsvBtn.addEventListener('click', () => exportData('csv'));

    // 自动刷新开关
    autoRefreshCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            startAutoRefresh();
        } else {
            stopAutoRefresh();
        }
    });

    // 订单筛选
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.status;
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderOrders();
        });
    });
}

// 加载订单
async function loadOrders() {
    try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        allOrders = data;
        updateStats();
        renderOrders();
    } catch (error) {
        console.error('加载订单失败:', error);
        showToast('加载订单失败', 'error');
    }
}

// 更新统计信息
function updateStats() {
    const pending = allOrders.filter(o => o.status === 'pending').length;
    const revenue = allOrders.reduce((sum, o) => sum + o.total_price, 0);

    totalOrdersEl.textContent = allOrders.length;
    pendingOrdersEl.textContent = pending;
    totalRevenueEl.textContent = revenue.toFixed(2);
}

// 渲染订单
function renderOrders() {
    let filteredOrders = allOrders;

    if (currentFilter !== 'all') {
        filteredOrders = allOrders.filter(o => o.status === currentFilter);
    }

    // 按创建时间倒序排列,待处理订单优先
    filteredOrders.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.created_at) - new Date(a.created_at);
    });

    if (filteredOrders.length === 0) {
        ordersGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    ordersGrid.style.display = 'grid';
    emptyState.style.display = 'none';

    ordersGrid.innerHTML = filteredOrders.map(order => `
        <div class="order-card ${order.status}">
            <div class="order-header">
                <div class="order-id">#${order.id}</div>
                <div class="order-status status-${order.status}">
                    ${order.status === 'pending' ? '待处理' : '已完成'}
                </div>
            </div>

            <div class="order-info">
                <div class="order-info-item">
                    <span>桌号:</span>
                    <strong>${order.table_number}</strong>
                </div>
                <div class="order-info-item">
                    <span>顾客:</span>
                    <strong>${order.customer_name}</strong>
                </div>
                <div class="order-info-item">
                    <span>下单时间:</span>
                    <strong>${formatTime(order.created_at)}</strong>
                </div>
                ${order.completed_at ? `
                <div class="order-info-item">
                    <span>完成时间:</span>
                    <strong>${formatTime(order.completed_at)}</strong>
                </div>
                ` : ''}
            </div>

            <div class="order-items">
                <h4>订单详情</h4>
                ${JSON.parse(order.items).map(item => `
                    <div class="order-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>¥${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>

            <div class="order-total">
                总计: ¥${order.total_price.toFixed(2)}
            </div>

            ${order.status === 'pending' ? `
                <button class="complete-btn" onclick="completeOrder(${order.id})">
                    ✓ 完成订单
                </button>
            ` : ''}
        </div>
    `).join('');
}

// 完成订单
async function completeOrder(orderId) {
    try {
        const response = await fetch(`/api/order/${orderId}/complete`, {
            method: 'PUT'
        });

        const result = await response.json();

        if (response.ok) {
            showToast('订单已完成', 'success');
            loadOrders();
        } else {
            showToast(result.error || '操作失败', 'error');
        }
    } catch (error) {
        console.error('完成订单失败:', error);
        showToast('网络错误', 'error');
    }
}

// 导出数据
async function exportData(format) {
    try {
        const response = await fetch(`/api/export/${format}`);
        
        if (!response.ok) {
            throw new Error('导出失败');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        showToast(`${format.toUpperCase()} 导出成功`, 'success');
    } catch (error) {
        console.error('导出失败:', error);
        showToast('导出失败', 'error');
    }
}

// 自动刷新
function startAutoRefresh() {
    if (autoRefreshInterval) return;
    autoRefreshInterval = setInterval(loadOrders, 3000);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// 格式化时间
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // 如果是今天
    if (diff < 86400000 && date.getDate() === now.getDate()) {
        return date.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
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

// 页面卸载时清理定时器
window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
});
