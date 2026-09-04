// Main Application Controller for Garpoo Cafe & Eatery Medan (Unified 1-Web App)
import { CAFE_INFO, CATEGORIES, VOUCHERS } from './data/garpooMenu.js';
import { 
  getTables, 
  getTable, 
  getFullMenuWithOverrides, 
  submitOrderToTable, 
  callWaiter, 
  dismissWaiterCall, 
  updateTableOrderStatus, 
  completeTableSession, 
  toggleMenuItemStock, 
  subscribeToEvents 
} from './data/mockDatabase.js';

import { renderGarpooLogo } from './components/Branding.js';
import { renderCustomizationModal } from './components/CustomizationModal.js';
import { renderTableBillModal } from './components/TableBillModal.js';
import { renderPaymentModal } from './components/PaymentModal.js';
import { renderOrderStatusModal } from './components/OrderStatusModal.js';
import { renderAdminPOS } from './components/AdminPOS.js';
import { renderQRGeneratorModal } from './components/QRGeneratorModal.js';

// Application State
const state = {
  tableNumber: '05', // Default table
  activeTab: 'menu', // 'menu' | 'bill' | 'pos' | 'qr'
  posTab: 'orders', // 'orders' | 'tables' | 'stock'
  activeCategory: 'all',
  searchQuery: '',
  filterTag: null,
  cart: [],
  appliedVoucher: null,
  activeModal: null, // null | 'custom' | 'cart' | 'payment' | 'status' | 'table_picker'
  selectedItem: null,
  editingCartIndex: null,
  theme: localStorage.getItem('garpoo_theme') || 'light'
};

// Initialize App
export function initApp() {
  document.documentElement.setAttribute('data-theme', state.theme);

  // Extract query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const urlTable = urlParams.get('meja') || urlParams.get('table');
  if (urlTable) {
    state.tableNumber = urlTable.toString().padStart(2, '0');
  }
  const urlTab = urlParams.get('tab') || urlParams.get('mode');
  if (urlTab === 'pos' || urlTab === 'admin') {
    state.activeTab = 'pos';
  } else if (urlTab === 'bill' || urlTab === 'tagihan') {
    state.activeTab = 'bill';
  } else if (urlTab === 'qr' || urlTab === 'cetak') {
    state.activeTab = 'qr';
  }

  // Real-time synchronization subscriber
  subscribeToEvents((event) => {
    renderApp();
  });

  renderApp();
}

// Master Render Function (Unified 1-Web App)
export function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  const tableSession = getTable(state.tableNumber);
  const hasActiveSession = tableSession && tableSession.orders && tableSession.orders.length > 0;
  const menuItems = getFullMenuWithOverrides();

  // Bottom Navigation Bar
  const renderBottomNav = () => `
    <nav class="app-nav-bar">
      <div class="app-nav-inner">
        <button type="button" class="app-nav-item ${state.activeTab === 'menu' ? 'active' : ''}" data-nav="menu">
          <span class="app-nav-icon">🍽️</span>
          <span>Menu Cafe</span>
        </button>

        <button type="button" class="app-nav-item ${state.activeTab === 'bill' ? 'active' : ''}" data-nav="bill">
          <span class="app-nav-icon">🧾</span>
          <span>Tagihan Meja</span>
          ${hasActiveSession ? `<span class="nav-badge-dot"></span>` : ''}
        </button>

        <button type="button" class="app-nav-item ${state.activeTab === 'pos' ? 'active' : ''}" data-nav="pos">
          <span class="app-nav-icon">🧑‍🍳</span>
          <span>Kasir & POS</span>
        </button>

        <button type="button" class="app-nav-item ${state.activeTab === 'qr' ? 'active' : ''}" data-nav="qr">
          <span class="app-nav-icon">🖨️</span>
          <span>Cetak QR</span>
        </button>
      </div>
    </nav>
  `;

  // TAB 1: MENU & ORDERING
  if (state.activeTab === 'menu') {
    let filteredItems = menuItems.filter(item => {
      if (state.activeCategory === 'rekomendasi') {
        if (!item.isPopular && !item.isChefPick) return false;
      } else if (state.activeCategory !== 'all' && item.category !== state.activeCategory) {
        return false;
      }

      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      }

      return true;
    });

    const cartTotalQty = state.cart.reduce((sum, it) => sum + it.qty, 0);
    const cartSubtotal = state.cart.reduce((sum, it) => {
      const toppingTotal = (it.selectedToppings || []).reduce((tSum, t) => tSum + (t.price || 0), 0);
      return sum + (it.price + toppingTotal) * it.qty;
    }, 0);

    root.innerHTML = `
      <div class="customer-view">
        <!-- Header -->
        <header class="main-header">
          <div id="btn-brand-home">
            ${renderGarpooLogo({ size: 'medium', showTagline: true, showInstagram: false })}
          </div>

          <div class="header-actions">
            <!-- Table Pill -->
            <button type="button" class="table-pill-btn ${hasActiveSession ? 'active-session' : ''}" id="btn-open-table-picker">
              <span>Meja ${state.tableNumber}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            <!-- Theme Switcher -->
            <button type="button" class="icon-btn" id="btn-toggle-theme" title="Ubah Tema">
              ${state.theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <!-- Hero Ambiance -->
        <div class="cafe-hero">
          <div class="hero-image-wrap">
            <img src="./images/hero-banner.jpg" alt="Garpoo Cafe Medan" onerror="this.src='https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80'" />
            <div class="hero-overlay">
              <div class="hero-badges">
                <span class="hero-badge-item badge-location">📍 Jl. Sutomo No.13, Medan</span>
                <a href="${CAFE_INFO.instagramUrl}" target="_blank" rel="noopener noreferrer" class="hero-badge-item badge-instagram">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  ${CAFE_INFO.instagram}
                </a>
              </div>
              <div class="hero-title">Santapan & Kopi Khas Medan</div>
              <div class="hero-subtitle">
                <span>Buka: ${CAFE_INFO.operatingHours}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Action Strip -->
        <div class="quick-action-strip">
          <button type="button" class="quick-card-btn" id="btn-quick-call-waiter">
            <div class="quick-card-icon waiter">🔔</div>
            <div class="quick-card-texts">
              <strong>Panggil Pelayan</strong>
              <span>Bantuan di Meja ${state.tableNumber}</span>
            </div>
          </button>

          <button type="button" class="quick-card-btn" id="btn-quick-view-bill">
            <div class="quick-card-icon bill">🧾</div>
            <div class="quick-card-texts">
              <strong>Tagihan Meja</strong>
              <span>${hasActiveSession ? 'Total: Rp ' + tableSession.totalBill.toLocaleString('id-ID') : 'Belum ada pesanan'}</span>
            </div>
          </button>
        </div>

        <!-- Active Order Notice -->
        ${hasActiveSession ? `
          <div style="margin: 0 14px 14px; padding: 12px 14px; border-radius: var(--radius-md); background: linear-gradient(135deg, #1E150F, #32251B); color: #FFFFFF; display: flex; align-items: center; justify-content: space-between; gap: 10px; border: 1.5px solid rgba(234, 160, 35, 0.4); box-shadow: var(--shadow-sm); box-sizing: border-box;">
            <div>
              <div style="font-size: 0.72rem; color: var(--color-amber); font-weight: 700; text-transform: uppercase;">Pesanan Meja ${state.tableNumber} Sedang Diproses</div>
              <div style="font-size: 0.85rem; font-weight: 700;">${tableSession.totalItems} Porsi (${tableSession.orders.length} Ronde) • Rp ${tableSession.totalBill.toLocaleString('id-ID')}</div>
            </div>
            <button type="button" id="btn-banner-view-status" style="padding: 6px 12px; border-radius: var(--radius-full); background: var(--color-caramel); color: #FFF; font-size: 0.75rem; font-weight: 800; border: none; cursor: pointer;">
              Lihat Status
            </button>
          </div>
        ` : ''}

        <!-- Search & Filter -->
        <section class="search-filter-section">
          <div class="search-input-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" class="search-input" id="menu-search-input" placeholder="Cari Nasi Goreng, Kopi Sanger, Sate..." value="${state.searchQuery}" />
            ${state.searchQuery ? `<button id="btn-clear-search" style="position: absolute; right: 14px; background: none; border: none; font-size: 1rem; color: var(--color-text-light); cursor: pointer;">✕</button>` : ''}
          </div>

          <div class="categories-scroll">
            ${CATEGORIES.map(cat => `
              <button type="button" class="category-chip ${state.activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
                <span>${cat.icon}</span>
                <span>${cat.name}</span>
              </button>
            `).join('')}
          </div>
        </section>

        <!-- Catalog Grid -->
        <main class="menu-catalog-container">
          <div class="catalog-section-header">
            <h2 class="catalog-section-title">
              ${CATEGORIES.find(c => c.id === state.activeCategory)?.name || 'Daftar Menu'}
            </h2>
            <span class="catalog-items-count">${filteredItems.length} Menu</span>
          </div>

          <div class="menu-grid">
            ${filteredItems.map(item => `
              <div class="menu-card" data-item-id="${item.id}" style="${!item.isAvailable ? 'opacity: 0.55; filter: grayscale(0.8);' : ''}">
                <div class="menu-card-img-wrap">
                  <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80'" />
                  ${item.isChefPick ? `<span class="badge-chef-pick">⭐ FAVORIT</span>` : ''}
                </div>

                <div class="menu-card-content">
                  <div class="menu-card-top">
                    <div class="menu-card-badges">
                      ${item.isPopular ? `<span class="badge-mini-popular">🔥 Best Seller</span>` : ''}
                      ${item.isSpicy ? `<span class="badge-mini-spicy">🌶️ Pedas</span>` : ''}
                    </div>
                    <h3 class="menu-card-title">${item.name}</h3>
                    <p class="menu-card-desc">${item.description}</p>
                  </div>

                  <div class="menu-card-bottom">
                    <div>
                      <span class="menu-card-price">Rp ${item.price.toLocaleString('id-ID')}</span>
                      ${item.originalPrice ? `<span class="original-price">Rp ${item.originalPrice.toLocaleString('id-ID')}</span>` : ''}
                    </div>

                    ${item.isAvailable ? `
                      <button type="button" class="btn-add-quick btn-open-custom-trigger" data-item-id="${item.id}">
                        <span>+ Tambah</span>
                      </button>
                    ` : `
                      <span style="font-size: 0.72rem; color: var(--color-red); font-weight: 800; background: var(--color-red-light); padding: 4px 8px; border-radius: var(--radius-full);">Habis</span>
                    `}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </main>

        <!-- Floating Cart Bar -->
        ${cartTotalQty > 0 ? `
          <div class="floating-cart-bar">
            <div class="floating-cart-inner" id="btn-open-cart-drawer">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div class="cart-icon-bubble">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  <span class="cart-badge-count">${cartTotalQty}</span>
                </div>
                <div class="cart-summary-text">
                  <span>${cartTotalQty} Menu di Keranjang</span>
                  <strong>Rp ${cartSubtotal.toLocaleString('id-ID')}</strong>
                </div>
              </div>

              <div class="btn-view-order">
                <span>Pesan Sekarang</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </div>
          </div>
        ` : ''}

        ${renderBottomNav()}
        <div id="modal-container"></div>
      </div>
    `;
    bindCustomerEvents();
    renderModals();
    return;
  }

  // TAB 2: ACTIVE TABLE BILL
  if (state.activeTab === 'bill') {
    root.innerHTML = `
      <div class="customer-view">
        <header class="main-header">
          <div id="btn-brand-home">
            ${renderGarpooLogo({ size: 'medium', showTagline: true, showInstagram: false })}
          </div>
          <div class="header-actions">
            <button type="button" class="table-pill-btn ${hasActiveSession ? 'active-session' : ''}" id="btn-open-table-picker">
              <span>Meja ${state.tableNumber}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </div>
        </header>

        <div style="padding: 16px;">
          ${renderTableBillModal(tableSession)}
        </div>

        ${renderBottomNav()}
        <div id="modal-container"></div>
      </div>
    `;
    bindTableBillEvents();
    bindNavEvents();
    renderModals();
    return;
  }

  // TAB 3: ADMIN & KITCHEN POS
  if (state.activeTab === 'pos') {
    root.innerHTML = `
      <div style="max-width: 1440px; margin: 0 auto;">
        ${renderAdminPOS({ activeTab: state.posTab })}
        ${renderBottomNav()}
        <div id="modal-container"></div>
      </div>
    `;
    bindPosEvents();
    bindNavEvents();
    renderModals();
    return;
  }

  // TAB 4: PRINTABLE QR GENERATOR
  if (state.activeTab === 'qr') {
    root.innerHTML = `
      <div class="customer-view">
        <header class="main-header">
          <div id="btn-brand-home">
            ${renderGarpooLogo({ size: 'medium', showTagline: true, showInstagram: false })}
          </div>
        </header>

        <div style="padding: 16px;">
          ${renderQRGeneratorModal(state.tableNumber)}
        </div>

        ${renderBottomNav()}
        <div id="modal-container"></div>
      </div>
    `;
    bindQRGeneratorEvents();
    bindNavEvents();
    renderModals();
    return;
  }
}

// Global Nav Events
function bindNavEvents() {
  document.querySelectorAll('.app-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const navTarget = btn.getAttribute('data-nav');
      state.activeTab = navTarget;
      renderApp();
    });
  });

  document.getElementById('btn-brand-home')?.addEventListener('click', () => {
    state.activeTab = 'menu';
    state.activeCategory = 'all';
    renderApp();
  });
}

function bindCustomerEvents() {
  bindNavEvents();

  // Table selector
  document.getElementById('btn-open-table-picker')?.addEventListener('click', () => {
    state.activeModal = 'table_picker';
    renderModals();
  });

  // Toggle Theme
  document.getElementById('btn-toggle-theme')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('garpoo_theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
    renderApp();
  });

  // Quick Call Waiter
  document.getElementById('btn-quick-call-waiter')?.addEventListener('click', () => {
    callWaiter(state.tableNumber, 'Panggil Pelayan');
    alert(`🔔 Pelayan Garpoo Cafe telah dipanggil ke Meja ${state.tableNumber}!`);
    renderApp();
  });

  // Quick View Bill
  document.getElementById('btn-quick-view-bill')?.addEventListener('click', () => {
    state.activeTab = 'bill';
    renderApp();
  });

  // Banner View Status
  document.getElementById('btn-banner-view-status')?.addEventListener('click', () => {
    state.activeModal = 'status';
    renderModals();
  });

  // Search Input
  const searchInput = document.getElementById('menu-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderApp();
    });
  }

  document.getElementById('btn-clear-search')?.addEventListener('click', () => {
    state.searchQuery = '';
    renderApp();
  });

  // Category Pills
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      state.activeCategory = chip.getAttribute('data-category');
      renderApp();
    });
  });

  // Open Customization Modal on Dish Card click
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const itemId = card.getAttribute('data-item-id');
      const menuItems = getFullMenuWithOverrides();
      const item = menuItems.find(it => it.id === itemId);
      if (item && item.isAvailable) {
        state.selectedItem = item;
        state.editingCartIndex = null;
        state.activeModal = 'custom';
        renderModals();
      }
    });
  });

  // Open Cart Drawer
  document.getElementById('btn-open-cart-drawer')?.addEventListener('click', () => {
    state.activeModal = 'cart';
    renderModals();
  });
}

function renderModals() {
  const container = document.getElementById('modal-container');
  if (!container) return;

  if (!state.activeModal) {
    container.innerHTML = '';
    return;
  }

  if (state.activeModal === 'custom' && state.selectedItem) {
    const existingCartItem = state.editingCartIndex !== null ? state.cart[state.editingCartIndex] : null;
    container.innerHTML = renderCustomizationModal(state.selectedItem, existingCartItem);
    bindCustomizationModalEvents();
    return;
  }

  if (state.activeModal === 'cart') {
    container.innerHTML = renderCartDrawerModal();
    bindCartDrawerEvents();
    return;
  }

  if (state.activeModal === 'payment') {
    const rawSubtotal = state.cart.reduce((sum, it) => {
      const toppingTotal = (it.selectedToppings || []).reduce((tSum, t) => tSum + (t.price || 0), 0);
      return sum + (it.price + toppingTotal) * it.qty;
    }, 0);

    let discount = 0;
    if (state.appliedVoucher) {
      if (state.appliedVoucher.discountPercent) {
        discount = Math.min((rawSubtotal * state.appliedVoucher.discountPercent) / 100, state.appliedVoucher.maxDiscount || 999999);
      } else if (state.appliedVoucher.discountAmount) {
        discount = state.appliedVoucher.discountAmount;
      }
    }

    const taxableAmount = Math.max(0, rawSubtotal - discount);
    const tax = Math.round(taxableAmount * CAFE_INFO.taxRate);
    const grandTotal = taxableAmount + tax;

    const tableSession = getTable(state.tableNumber);
    const isAddon = tableSession && tableSession.orders && tableSession.orders.length > 0;

    container.innerHTML = renderPaymentModal({
      tableNumber: state.tableNumber,
      totalAmount: grandTotal,
      orderSummary: state.cart,
      isAddon
    });
    bindPaymentModalEvents(grandTotal);
    return;
  }

  if (state.activeModal === 'status') {
    const tableSession = getTable(state.tableNumber);
    container.innerHTML = renderOrderStatusModal(tableSession);
    bindOrderStatusEvents();
    return;
  }

  if (state.activeModal === 'table_picker') {
    container.innerHTML = renderTablePickerModal();
    bindTablePickerEvents();
    return;
  }
}

// Render Cart Drawer Modal
function renderCartDrawerModal() {
  const rawSubtotal = state.cart.reduce((sum, it) => {
    const toppingTotal = (it.selectedToppings || []).reduce((tSum, t) => tSum + (t.price || 0), 0);
    return sum + (it.price + toppingTotal) * it.qty;
  }, 0);

  let discount = 0;
  if (state.appliedVoucher) {
    if (state.appliedVoucher.discountPercent) {
      discount = Math.min((rawSubtotal * state.appliedVoucher.discountPercent) / 100, state.appliedVoucher.maxDiscount || 999999);
    } else if (state.appliedVoucher.discountAmount) {
      discount = state.appliedVoucher.discountAmount;
    }
  }

  const taxableAmount = Math.max(0, rawSubtotal - discount);
  const tax = Math.round(taxableAmount * CAFE_INFO.taxRate);
  const grandTotal = taxableAmount + tax;

  const tableSession = getTable(state.tableNumber);
  const isAddon = tableSession && tableSession.orders && tableSession.orders.length > 0;

  return `
    <div class="modal-overlay" id="cart-drawer-overlay">
      <div class="modal-sheet">
        <div class="modal-header-sticky">
          <div>
            <div class="modal-header-title">
              ${isAddon ? '➕ Pesanan Tambahan' : 'Keranjang Pesanan'}
            </div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">
              Pesanan untuk <strong>Meja ${state.tableNumber}</strong>
            </div>
          </div>
          <button class="icon-btn" id="btn-close-cart-drawer" aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="modal-scrollable-body">
          ${isAddon ? `
            <div style="background: var(--color-caramel-light); border: 1px solid var(--color-caramel); border-radius: var(--radius-md); padding: 10px 14px; font-size: 0.8rem; color: var(--color-caramel);">
              💡 <strong>Pesan Tambahan:</strong> Menu ini akan diakumulasikan ke total tagihan Meja ${state.tableNumber}.
            </div>
          ` : ''}

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${state.cart.map((it, idx) => {
              const toppingTotal = (it.selectedToppings || []).reduce((tSum, t) => tSum + (t.price || 0), 0);
              const lineTotal = (it.price + toppingTotal) * it.qty;

              return `
                <div style="display: flex; gap: 12px; padding: 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface);">
                  <img src="${it.image}" alt="${it.name}" style="width: 60px; height: 60px; border-radius: var(--radius-sm); object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80'" />
                  <div style="flex-grow: 1;">
                    <div style="display: flex; justify-content: space-between;">
                      <h4 style="font-size: 0.9rem; font-weight: 700;">${it.name}</h4>
                      <button class="btn-remove-cart-item" data-index="${idx}" style="background: none; border: none; color: var(--color-text-light); font-size: 0.9rem; cursor: pointer;">✕</button>
                    </div>
                    ${Object.values(it.selectedVariants || {}).filter(Boolean).length > 0 ? `
                      <div style="font-size: 0.72rem; color: var(--color-text-muted);">${Object.values(it.selectedVariants).join(' • ')}</div>
                    ` : ''}
                    ${(it.selectedToppings || []).length > 0 ? `
                      <div style="font-size: 0.72rem; color: var(--color-caramel);">+ ${(it.selectedToppings || []).map(t => t.name).join(', ')}</div>
                    ` : ''}
                    ${it.notes ? `<div style="font-size: 0.7rem; font-style: italic; color: var(--color-text-light);">"${it.notes}"</div>` : ''}

                    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                      <span style="font-family: var(--font-mono); font-weight: 700; color: var(--color-caramel); font-size: 0.9rem;">
                        Rp ${lineTotal.toLocaleString('id-ID')}
                      </span>
                      
                      <div class="qty-stepper" style="padding: 2px 8px;">
                        <button type="button" class="btn-cart-qty" data-action="minus" data-index="${idx}">-</button>
                        <span style="font-size: 0.85rem;">${it.qty}</span>
                        <button type="button" class="btn-cart-qty" data-action="plus" data-index="${idx}">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div style="background: var(--color-bg-alt); padding: 12px; border-radius: var(--radius-md); border: 1px dashed var(--color-border);">
            <div style="font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">🎟️ Voucher Promo:</div>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="voucher-input" placeholder="GARPOOPERDANA" value="${state.appliedVoucher ? state.appliedVoucher.code : ''}" style="flex-grow: 1; padding: 8px 12px; border-radius: var(--radius-full); border: 1px solid var(--color-border); font-size: 16px; text-transform: uppercase; font-family: var(--font-mono); font-weight: 700;" />
              <button type="button" id="btn-apply-voucher" style="padding: 8px 16px; border-radius: var(--radius-full); background: var(--color-espresso); color: #FFF; font-weight: 700; font-size: 0.8rem; border: none; cursor: pointer;">
                Pakai
              </button>
            </div>
            ${state.appliedVoucher ? `
              <div style="font-size: 0.72rem; color: var(--color-sage); font-weight: 700; margin-top: 4px;">
                ✅ Promo aktif: ${state.appliedVoucher.desc}
              </div>
            ` : ''}
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.82rem; padding: 4px 0;">
            <div style="display: flex; justify-content: space-between; color: var(--color-text-muted);">
              <span>Subtotal:</span>
              <span style="font-family: var(--font-mono);">Rp ${rawSubtotal.toLocaleString('id-ID')}</span>
            </div>
            ${discount > 0 ? `
              <div style="display: flex; justify-content: space-between; color: var(--color-sage); font-weight: 700;">
                <span>Potongan Promo:</span>
                <span style="font-family: var(--font-mono);">-Rp ${discount.toLocaleString('id-ID')}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; color: var(--color-text-muted);">
              <span>Pajak Resto PB1 (10%):</span>
              <span style="font-family: var(--font-mono);">Rp ${tax.toLocaleString('id-ID')}</span>
            </div>
            <div style="border-top: 1px solid var(--color-border); padding-top: 8px; margin-top: 4px; display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-weight: 800; font-size: 0.95rem;">Total:</span>
              <span style="font-family: var(--font-mono); font-size: 1.25rem; font-weight: 900; color: var(--color-caramel);">
                Rp ${grandTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        <div class="modal-footer-sticky">
          <button type="button" id="btn-proceed-to-payment" style="width: 100%; padding: 14px; border-radius: var(--radius-full); background: var(--color-caramel); color: #FFFFFF; font-weight: 800; font-size: 0.95rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 14px rgba(184, 98, 27, 0.35);">
            <span>Pilih Pembayaran</span>
            <span style="font-family: var(--font-mono);">Rp ${grandTotal.toLocaleString('id-ID')} →</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Render Table Picker Modal
function renderTablePickerModal() {
  return `
    <div class="modal-overlay" id="table-picker-overlay">
      <div class="modal-sheet" style="max-width: 440px;">
        <div class="modal-header-sticky">
          <div class="modal-header-title">Pilih Nomor Meja Kamu</div>
          <button class="icon-btn" id="btn-close-table-picker" aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="modal-scrollable-body">
          <p style="font-size: 0.8rem; color: var(--color-text-muted);">
            Pilih nomor meja tempat kamu duduk di Garpoo Cafe Medan:
          </p>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px;">
            ${Array.from({ length: 20 }, (_, i) => {
              const num = (i + 1).toString().padStart(2, '0');
              const isSelected = state.tableNumber === num;
              return `
                <button type="button" class="btn-select-table-num" data-table="${num}" style="padding: 14px 6px; border-radius: var(--radius-md); border: 2px solid ${isSelected ? 'var(--color-caramel)' : 'var(--color-border)'}; background: ${isSelected ? 'var(--color-caramel-light)' : 'var(--color-surface)'}; color: ${isSelected ? 'var(--color-caramel)' : 'var(--color-text-main)'}; font-family: var(--font-mono); font-weight: 800; font-size: 1.1rem; cursor: pointer;">
                  ${num}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindCustomizationModalEvents() {
  const item = state.selectedItem;
  let qty = state.editingCartIndex !== null ? state.cart[state.editingCartIndex].qty : 1;

  const updateDynamicTotal = () => {
    const toppingCheckboxes = document.querySelectorAll('input[name="topping_item"]:checked');
    let toppingsSum = 0;
    toppingCheckboxes.forEach(cb => {
      toppingsSum += parseInt(cb.getAttribute('data-price') || '0', 10);
    });

    const total = (item.price + toppingsSum) * qty;
    const totalElem = document.getElementById('modal-dynamic-total');
    if (totalElem) totalElem.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    const qtyElem = document.getElementById('modal-qty-value');
    if (qtyElem) qtyElem.textContent = qty;
  };

  document.getElementById('btn-close-custom-modal')?.addEventListener('click', () => {
    state.activeModal = null;
    renderModals();
  });

  document.getElementById('customization-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'customization-modal-overlay') {
      state.activeModal = null;
      renderModals();
    }
  });

  document.querySelectorAll('.custom-option-label input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const parentGroup = radio.closest('.radio-group');
      if (parentGroup) {
        parentGroup.querySelectorAll('.custom-option-label').forEach(lbl => lbl.classList.remove('selected'));
        radio.closest('.custom-option-label').classList.add('selected');
      }
      updateDynamicTotal();
    });
  });

  document.querySelectorAll('.custom-option-label input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        cb.closest('.custom-option-label').classList.add('selected');
      } else {
        cb.closest('.custom-option-label').classList.remove('selected');
      }
      updateDynamicTotal();
    });
  });

  document.getElementById('btn-modal-qty-minus')?.addEventListener('click', () => {
    if (qty > 1) {
      qty--;
      updateDynamicTotal();
    }
  });

  document.getElementById('btn-modal-qty-plus')?.addEventListener('click', () => {
    qty++;
    updateDynamicTotal();
  });

  document.getElementById('btn-confirm-add-cart')?.addEventListener('click', () => {
    const selectedVariants = {};
    document.querySelectorAll('.modal-sheet input[type="radio"]:checked').forEach(radio => {
      const varName = radio.name.replace('var_', '');
      selectedVariants[varName] = radio.value;
    });

    const selectedToppings = [];
    document.querySelectorAll('input[name="topping_item"]:checked').forEach(cb => {
      selectedToppings.push({
        name: cb.value,
        price: parseInt(cb.getAttribute('data-price') || '0', 10)
      });
    });

    const notes = document.getElementById('item-special-notes')?.value || '';

    const cartItem = {
      ...item,
      qty,
      selectedVariants,
      selectedToppings,
      notes
    };

    if (state.editingCartIndex !== null) {
      state.cart[state.editingCartIndex] = cartItem;
    } else {
      state.cart.push(cartItem);
    }

    state.activeModal = null;
    renderApp();
  });
}

function bindCartDrawerEvents() {
  document.getElementById('btn-close-cart-drawer')?.addEventListener('click', () => {
    state.activeModal = null;
    renderModals();
  });

  document.getElementById('cart-drawer-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'cart-drawer-overlay') {
      state.activeModal = null;
      renderModals();
    }
  });

  document.querySelectorAll('.btn-cart-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      const action = btn.getAttribute('data-action');
      if (action === 'plus') {
        state.cart[idx].qty++;
      } else if (action === 'minus') {
        if (state.cart[idx].qty > 1) {
          state.cart[idx].qty--;
        } else {
          state.cart.splice(idx, 1);
        }
      }
      renderModals();
    });
  });

  document.querySelectorAll('.btn-remove-cart-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      state.cart.splice(idx, 1);
      if (state.cart.length === 0) {
        state.activeModal = null;
        renderApp();
      } else {
        renderModals();
      }
    });
  });

  document.getElementById('btn-apply-voucher')?.addEventListener('click', () => {
    const inputVal = document.getElementById('voucher-input')?.value.trim().toUpperCase();
    const foundVoucher = VOUCHERS.find(v => v.code === inputVal);
    if (foundVoucher) {
      state.appliedVoucher = foundVoucher;
      alert(`🎉 Voucher "${foundVoucher.code}" aktif!`);
    } else {
      state.appliedVoucher = null;
      alert('⚠️ Kode voucher tidak valid.');
    }
    renderModals();
  });

  document.getElementById('btn-proceed-to-payment')?.addEventListener('click', () => {
    state.activeModal = 'payment';
    renderModals();
  });
}

function bindTableBillEvents() {
  document.getElementById('btn-close-bill-modal')?.addEventListener('click', () => {
    state.activeTab = 'menu';
    renderApp();
  });
  document.getElementById('btn-close-empty-bill')?.addEventListener('click', () => {
    state.activeTab = 'menu';
    renderApp();
  });

  document.getElementById('btn-add-more-orders')?.addEventListener('click', () => {
    state.activeTab = 'menu';
    renderApp();
  });

  document.getElementById('btn-bill-pay-now')?.addEventListener('click', () => {
    const tableSession = getTable(state.tableNumber);
    if (tableSession && tableSession.totalBill > 0) {
      state.activeModal = 'payment';
      renderModals();
    }
  });

  document.getElementById('btn-bill-print-receipt')?.addEventListener('click', () => {
    window.print();
  });
}

function bindPaymentModalEvents(grandTotal) {
  let selectedMethod = 'QRIS';

  document.getElementById('btn-close-payment-modal')?.addEventListener('click', () => {
    state.activeModal = null;
    renderModals();
  });

  document.getElementById('payment-modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'payment-modal-overlay') {
      state.activeModal = null;
      renderModals();
    }
  });

  document.querySelectorAll('.pay-method-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pay-method-chip').forEach(b => {
        b.classList.remove('active');
        b.style.border = '1.5px solid var(--color-border)';
        b.style.background = 'var(--color-surface)';
        b.style.color = 'var(--color-text-main)';
      });

      btn.classList.add('active');
      btn.style.border = '2px solid var(--color-caramel)';
      btn.style.background = 'var(--color-caramel-light)';
      btn.style.color = 'var(--color-caramel)';

      selectedMethod = btn.getAttribute('data-method');

      const qrisBox = document.getElementById('payment-content-qris');
      const kasirBox = document.getElementById('payment-content-kasir');
      const ewalletBox = document.getElementById('payment-content-ewallet');

      if (selectedMethod === 'QRIS') {
        if (qrisBox) qrisBox.style.display = 'flex';
        if (kasirBox) kasirBox.style.display = 'none';
        if (ewalletBox) ewalletBox.style.display = 'none';
      } else if (selectedMethod === 'KASIR') {
        if (qrisBox) qrisBox.style.display = 'none';
        if (kasirBox) kasirBox.style.display = 'block';
        if (ewalletBox) ewalletBox.style.display = 'none';
      } else {
        if (qrisBox) qrisBox.style.display = 'none';
        if (kasirBox) kasirBox.style.display = 'none';
        if (ewalletBox) ewalletBox.style.display = 'flex';
      }
    });
  });

  document.getElementById('btn-confirm-payment-action')?.addEventListener('click', () => {
    try {
      submitOrderToTable({
        tableNumber: state.tableNumber,
        items: state.cart,
        paymentMethod: selectedMethod,
        voucher: state.appliedVoucher
      });

      state.cart = [];
      state.appliedVoucher = null;
      state.activeModal = 'status';
      renderApp();
    } catch (err) {
      alert('Gagal memproses: ' + err.message);
    }
  });
}

function bindOrderStatusEvents() {
  document.getElementById('btn-close-status-modal')?.addEventListener('click', () => {
    state.activeModal = null;
    renderModals();
  });

  document.getElementById('btn-status-view-bill')?.addEventListener('click', () => {
    state.activeModal = null;
    state.activeTab = 'bill';
    renderApp();
  });

  document.getElementById('btn-status-order-more')?.addEventListener('click', () => {
    state.activeModal = null;
    state.activeTab = 'menu';
    renderApp();
  });
}

function bindQRGeneratorEvents() {
  document.getElementById('btn-close-qr-modal')?.addEventListener('click', () => {
    state.activeTab = 'menu';
    renderApp();
  });

  document.getElementById('select-qr-table-num')?.addEventListener('change', (e) => {
    const newNum = e.target.value;
    const display = document.getElementById('standee-table-display');
    if (display) display.textContent = `MEJA ${newNum}`;
  });

  document.getElementById('btn-print-standee')?.addEventListener('click', () => {
    window.print();
  });
}

function bindTablePickerEvents() {
  document.getElementById('btn-close-table-picker')?.addEventListener('click', () => {
    state.activeModal = null;
    renderModals();
  });

  document.getElementById('table-picker-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'table-picker-overlay') {
      state.activeModal = null;
      renderModals();
    }
  });

  document.querySelectorAll('.btn-select-table-num').forEach(btn => {
    btn.addEventListener('click', () => {
      state.tableNumber = btn.getAttribute('data-table');
      state.activeModal = null;
      const newUrl = `${window.location.pathname}?meja=${state.tableNumber}`;
      window.history.replaceState(null, '', newUrl);
      renderApp();
    });
  });
}

function bindPosEvents() {
  document.querySelectorAll('.pos-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.posTab = btn.getAttribute('data-tab');
      renderApp();
    });
  });

  document.getElementById('btn-open-qr-generator')?.addEventListener('click', () => {
    state.activeTab = 'qr';
    renderApp();
  });

  document.getElementById('btn-switch-to-customer')?.addEventListener('click', () => {
    state.activeTab = 'menu';
    renderApp();
  });

  document.querySelectorAll('.btn-dismiss-waiter').forEach(btn => {
    btn.addEventListener('click', () => {
      const tableNum = btn.getAttribute('data-table');
      dismissWaiterCall(tableNum);
      renderApp();
    });
  });

  document.querySelectorAll('.btn-pos-update-status').forEach(btn => {
    btn.addEventListener('click', () => {
      const tableNum = btn.getAttribute('data-table');
      const roundIdx = parseInt(btn.getAttribute('data-round'), 10);
      const newStatus = btn.getAttribute('data-status');
      updateTableOrderStatus(tableNum, roundIdx, newStatus);
      renderApp();
    });
  });

  document.querySelectorAll('.btn-pos-complete-table').forEach(btn => {
    btn.addEventListener('click', () => {
      const tableNum = btn.getAttribute('data-table');
      if (confirm(`Selesaikan pembayaran dan kosongkan Meja ${tableNum}?`)) {
        completeTableSession(tableNum, 'Kasir Tunai / QRIS');
        renderApp();
      }
    });
  });

  document.querySelectorAll('.btn-pos-view-qr').forEach(btn => {
    btn.addEventListener('click', () => {
      state.tableNumber = btn.getAttribute('data-table');
      state.activeTab = 'qr';
      renderApp();
    });
  });

  document.querySelectorAll('.btn-toggle-stock').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.getAttribute('data-item');
      const currentAvailable = btn.getAttribute('data-available') === 'true';
      toggleMenuItemStock(itemId, !currentAvailable);
      renderApp();
    });
  });
}
