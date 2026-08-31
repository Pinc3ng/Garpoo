// Admin, Cashier & Kitchen Live POS Dashboard for Garpoo Cafe
import { CAFE_INFO } from '../data/garpooMenu.js';
import { getTables, getFullMenuWithOverrides, completeTableSession, updateTableOrderStatus, toggleMenuItemStock, dismissWaiterCall } from '../data/mockDatabase.js';

export function renderAdminPOS({ activeTab = 'orders', selectedTableNum = null } = {}) {
  const tables = getTables();
  const menuItems = getFullMenuWithOverrides();

  // Compute live statistics
  const activeTables = tables.filter(t => t.orders && t.orders.length > 0 && t.status !== 'idle');
  const occupiedCount = activeTables.length;
  const cookingOrdersCount = tables.reduce((acc, t) => acc + (t.orders || []).filter(o => o.status === 'cooking').length, 0);
  const waiterCalls = tables.filter(t => t.waiterCallTime);
  const totalRevenue = tables.reduce((acc, t) => acc + (t.totalBill || 0), 0);

  // Flatten all order rounds for live feed
  const allLiveOrders = [];
  tables.forEach(table => {
    (table.orders || []).forEach((round, roundIdx) => {
      allLiveOrders.push({
        tableNumber: table.number,
        tableName: table.name,
        customerName: table.customerName,
        paymentStatus: table.paymentStatus,
        paymentMethod: table.paymentMethod,
        roundIndex: roundIdx,
        roundNumber: round.roundNumber || (roundIdx + 1),
        roundId: round.roundId,
        timestamp: round.timestamp,
        status: round.status,
        items: round.items,
        subtotal: round.subtotal,
        tax: round.tax,
        total: round.total
      });
    });
  });

  // Sort newest first
  allLiveOrders.sort((a, b) => b.timestamp - a.timestamp);

  return `
    <div class="pos-view">
      <!-- POS Top Bar -->
      <div class="pos-header">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div class="brand-logo-badge" style="width: 48px; height: 48px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V12M12 12V22M12 12H8V6C8 4 9 2 9 2M12 12H16V6C16 4 15 2 15 2" stroke="#EAA023" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div>
            <div style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 900; display: flex; align-items: center; gap: 8px;">
              GARPOO POS & KITCHEN DASHBOARD
              <span style="font-size: 0.65rem; background: var(--color-sage); color: #FFF; padding: 2px 8px; border-radius: var(--radius-full);">LIVE SYNC</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--color-text-muted);">
              ${CAFE_INFO.address}
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <!-- QR Generator Button -->
          <button type="button" id="btn-open-qr-generator" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--radius-full); border: 1.5px solid var(--color-caramel); background: var(--color-caramel-light); color: var(--color-caramel); font-weight: 800; font-size: 0.82rem; cursor: pointer;">
            <span>🖨️ Cetak QR Meja</span>
          </button>

          <!-- Back to Customer Mode -->
          <button type="button" id="btn-switch-to-customer" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--radius-full); background: var(--color-espresso); color: #FFFFFF; font-weight: 700; font-size: 0.82rem; border: none; cursor: pointer;">
            <span>📱 Tampilan Pelanggan</span>
          </button>
        </div>
      </div>

      <!-- Live Statistics KPI -->
      <div class="pos-stats-grid">
        <div class="pos-stat-card">
          <div class="pos-stat-icon" style="background: #FEF3C7; color: #B45309;">💰</div>
          <div class="pos-stat-info">
            <h4>Total Omset Hari Ini</h4>
            <strong>Rp ${totalRevenue.toLocaleString('id-ID')}</strong>
          </div>
        </div>

        <div class="pos-stat-card">
          <div class="pos-stat-icon" style="background: #DBEAFE; color: #1D4ED8;">🪑</div>
          <div class="pos-stat-info">
            <h4>Meja Terisi Saat Ini</h4>
            <strong>${occupiedCount} / 20 Meja</strong>
          </div>
        </div>

        <div class="pos-stat-card">
          <div class="pos-stat-icon" style="background: #FEE2E2; color: #B91C1C;">🍳</div>
          <div class="pos-stat-info">
            <h4>Antrian Masak Dapur</h4>
            <strong>${cookingOrdersCount} Pesanan</strong>
          </div>
        </div>

        <div class="pos-stat-card">
          <div class="pos-stat-icon" style="background: #E0E7FF; color: #4338CA;">🔔</div>
          <div class="pos-stat-info">
            <h4>Panggilan Pelayan</h4>
            <strong>${waiterCalls.length} Meja</strong>
          </div>
        </div>
      </div>

      <!-- Waiter Call Alert Banner if any -->
      ${waiterCalls.length > 0 ? `
        <div style="background: #FEF3C7; border: 2px solid #F59E0B; border-radius: var(--radius-lg); padding: 12px 18px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; animation: pulse 2s infinite;">
          <div style="display: flex; align-items: center; gap: 10px; font-weight: 800; color: #92400E;">
            <span style="font-size: 1.4rem;">🔔</span>
            <span>Perhatian: Meja ${waiterCalls.map(w => w.number).join(', ')} memanggil pelayan!</span>
          </div>
          <div style="display: flex; gap: 8px;">
            ${waiterCalls.map(w => `
              <button class="btn-dismiss-waiter" data-table="${w.number}" style="padding: 6px 12px; border-radius: var(--radius-full); background: #92400E; color: #FFF; font-size: 0.75rem; font-weight: 700; border: none; cursor: pointer;">
                Selesai Layani Meja ${w.number}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- POS Navigation Tabs -->
      <div class="pos-tabs">
        <button class="pos-tab-btn ${activeTab === 'orders' ? 'active' : ''}" data-tab="orders">
          🔴 Antrian Pesanan Masuk (${allLiveOrders.length})
        </button>
        <button class="pos-tab-btn ${activeTab === 'tables' ? 'active' : ''}" data-tab="tables">
          🪑 Denah & Status 20 Meja
        </button>
        <button class="pos-tab-btn ${activeTab === 'stock' ? 'active' : ''}" data-tab="stock">
          📋 Manajemen Stok Menu (${menuItems.length})
        </button>
      </div>

      <!-- TAB 1: LIVE ORDERS QUEUE -->
      ${activeTab === 'orders' ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px;">
          ${allLiveOrders.length === 0 ? `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--color-surface); border-radius: var(--radius-lg); color: var(--color-text-muted);">
              Belum ada pesanan yang masuk.
            </div>
          ` : allLiveOrders.map(order => {
            const orderTime = new Date(order.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            return `
              <div style="background: var(--color-surface); border: 2px solid ${order.status === 'cooking' ? '#F59E0B' : order.status === 'served' ? '#3B82F6' : '#E2E8F0'}; border-radius: var(--radius-lg); padding: 16px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <!-- Order Header -->
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 8px;">
                    <div>
                      <span style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 900; color: var(--color-espresso);">
                        MEJA ${order.tableNumber}
                      </span>
                      <span style="font-size: 0.72rem; background: var(--color-bg-alt); padding: 2px 6px; border-radius: 4px; margin-left: 6px; font-weight: 700;">
                        Ronde #${order.roundNumber}
                      </span>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600;">${orderTime} WIB</span>
                  </div>

                  <!-- Customer & Payment Status -->
                  <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 10px; color: var(--color-text-muted);">
                    <span>Pelanggan: <strong>${order.customerName || 'Tamu'}</strong></span>
                    <span style="font-weight: 700; color: ${order.paymentStatus === 'paid_qris' ? 'var(--color-sage)' : 'var(--color-red)'};">
                      ${order.paymentStatus === 'paid_qris' ? '✅ QRIS Lunas' : '⏳ Bayar Kasir'}
                    </span>
                  </div>

                  <!-- Items List -->
                  <div style="background: var(--color-bg-alt); border-radius: var(--radius-md); padding: 10px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px;">
                    ${order.items.map(it => `
                      <div style="font-size: 0.82rem;">
                        <div style="display: flex; justify-content: space-between; font-weight: 700;">
                          <span>${it.qty}x ${it.name}</span>
                          <span style="font-family: var(--font-mono);">Rp ${it.itemTotal.toLocaleString('id-ID')}</span>
                        </div>
                        ${Object.values(it.variants || {}).filter(Boolean).length > 0 ? `
                          <div style="font-size: 0.72rem; color: var(--color-text-muted);">${Object.values(it.variants).join(' • ')}</div>
                        ` : ''}
                        ${(it.toppings || []).length > 0 ? `
                          <div style="font-size: 0.72rem; color: var(--color-caramel);">+ ${(it.toppings || []).map(t => t.name).join(', ')}</div>
                        ` : ''}
                        ${it.notes ? `
                          <div style="font-size: 0.7rem; color: var(--color-red); font-weight: 600;">⚠️ "${it.notes}"</div>
                        ` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Action Controls -->
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 0.8rem; color: var(--color-text-muted);">Total Ronde:</span>
                    <strong style="font-family: var(--font-mono); font-size: 1.05rem; color: var(--color-caramel);">
                      Rp ${order.total.toLocaleString('id-ID')}
                    </strong>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    ${order.status === 'cooking' ? `
                      <button type="button" class="btn-pos-update-status" data-table="${order.tableNumber}" data-round="${order.roundIndex}" data-status="served" style="grid-column: 1 / -1; padding: 10px; border-radius: var(--radius-full); background: #3B82F6; color: #FFF; font-weight: 800; font-size: 0.82rem; border: none; cursor: pointer;">
                        🍽️ Tandai Siap Saji / Diantar
                      </button>
                    ` : `
                      <button type="button" class="btn-pos-update-status" data-table="${order.tableNumber}" data-round="${order.roundIndex}" data-status="cooking" style="padding: 8px; border-radius: var(--radius-full); background: var(--color-bg-alt); color: var(--color-text-main); font-weight: 700; font-size: 0.75rem; border: 1px solid var(--color-border); cursor: pointer;">
                        Kembali Masak
                      </button>
                    `}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- TAB 2: TABLES MANAGEMENT GRID -->
      ${activeTab === 'tables' ? `
        <div class="pos-table-grid">
          ${tables.map(table => {
            const hasActiveOrder = table.orders && table.orders.length > 0;
            return `
              <div class="table-card-item status-${table.status}">
                <div class="table-card-top">
                  <div class="table-number-title">${table.name}</div>
                  <span class="table-status-tag tag-${table.status}">
                    ${table.status === 'idle' ? 'Kosong' : table.status === 'cooking' ? 'Sedang Masak' : table.status === 'served' ? 'Disajikan' : 'Belum Bayar'}
                  </span>
                </div>

                <div style="margin: 12px 0;">
                  <div style="font-size: 0.8rem; color: var(--color-text-muted);">
                    Kapasitas: ${table.capacity} Orang
                  </div>
                  ${hasActiveOrder ? `
                    <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-text-main); margin-top: 4px;">
                      ${table.totalItems} Porsi (${table.orders.length} Ronde)
                    </div>
                    <div style="font-family: var(--font-mono); font-size: 1.15rem; font-weight: 800; color: var(--color-caramel); margin-top: 4px;">
                      Rp ${table.totalBill.toLocaleString('id-ID')}
                    </div>
                  ` : `
                    <div style="font-size: 0.78rem; color: var(--color-text-light); margin-top: 10px;">
                      Siap digunakan pelanggan
                    </div>
                  `}
                </div>

                <!-- Table Actions -->
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  ${hasActiveOrder ? `
                    <button type="button" class="btn-pos-complete-table" data-table="${table.number}" style="width: 100%; padding: 8px; border-radius: var(--radius-full); background: var(--color-sage); color: #FFF; font-weight: 800; font-size: 0.78rem; border: none; cursor: pointer;">
                      ✅ Selesaikan & Kosongkan Meja
                    </button>
                  ` : `
                    <button type="button" class="btn-pos-view-qr" data-table="${table.number}" style="width: 100%; padding: 8px; border-radius: var(--radius-full); background: var(--color-bg-alt); color: var(--color-text-main); font-weight: 700; font-size: 0.78rem; border: 1px solid var(--color-border); cursor: pointer;">
                      🔍 Tampilkan QR Meja
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- TAB 3: STOCK & MENU MANAGER -->
      ${activeTab === 'stock' ? `
        <div style="background: var(--color-surface); border-radius: var(--radius-lg); border: 1px solid var(--color-border); padding: 18px;">
          <h3 style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; margin-bottom: 14px;">
            Kontrol Ketersediaan Menu Garpoo Cafe
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px;">
            ${menuItems.map(item => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: ${item.isAvailable ? 'var(--color-surface)' : '#FEE2E2'};">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="${item.image}" style="width: 42px; height: 42px; border-radius: var(--radius-sm); object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80'" />
                  <div>
                    <div style="font-size: 0.85rem; font-weight: 700;">${item.name}</div>
                    <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-caramel);">Rp ${item.price.toLocaleString('id-ID')}</div>
                  </div>
                </div>
                <button type="button" class="btn-toggle-stock" data-item="${item.id}" data-available="${item.isAvailable ? 'true' : 'false'}" style="padding: 6px 12px; border-radius: var(--radius-full); border: none; font-size: 0.72rem; font-weight: 800; cursor: pointer; background: ${item.isAvailable ? 'var(--color-sage)' : 'var(--color-red)'}; color: #FFF;">
                  ${item.isAvailable ? 'Tersedia' : 'Habis'}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}
