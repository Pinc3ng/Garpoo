// Active Table Bill & Add-on Order Modal for Garpoo Cafe
import { CAFE_INFO } from '../data/garpooMenu.js';

export function renderTableBillModal(tableSession) {
  if (!tableSession || !tableSession.orders || tableSession.orders.length === 0) {
    return `
      <div class="modal-overlay" id="bill-modal-overlay">
        <div class="modal-sheet" style="text-align: center; padding: 30px 20px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">🧾</div>
          <h3 style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; margin-bottom: 6px;">Belum Ada Pesanan Aktif</h3>
          <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 20px;">
            Meja ${tableSession ? tableSession.number : '--'} belum memiliki pesanan aktif. Silakan pilih menu dan buat pesanan pertama kamu!
          </p>
          <button class="btn-add-quick" id="btn-close-empty-bill" style="padding: 10px 24px; font-size: 0.9rem; margin: 0 auto;">
            Lihat Menu Garpoo
          </button>
        </div>
      </div>
    `;
  }

  const tableNum = tableSession.number;
  const orders = tableSession.orders;
  const totalRounds = orders.length;
  const totalBill = tableSession.totalBill;
  const isPaid = tableSession.paymentStatus.startsWith('paid');

  const statusBadgeColor = {
    cooking: { bg: '#FEF3C7', color: '#D97706', label: '🍳 Sedang Dimasak' },
    served: { bg: '#DBEAFE', color: '#2563EB', label: '🍽️ Telah Disajikan' },
    unpaid: { bg: '#FEE2E2', color: '#DC2626', label: '⏳ Belum Bayar' },
    completed: { bg: '#E8F5EE', color: '#2D6A4F', label: '✅ Selesai Lunas' }
  }[tableSession.status] || { bg: '#F3ECE2', color: '#78716C', label: tableSession.status };

  return `
    <div class="modal-overlay" id="bill-modal-overlay">
      <div class="modal-sheet">
        <!-- Sticky Header -->
        <div class="modal-header-sticky">
          <div>
            <div class="modal-header-title" style="display: flex; align-items: center; gap: 8px;">
              <span>Tagihan Meja ${tableNum}</span>
              <span style="font-size: 0.72rem; padding: 3px 8px; border-radius: var(--radius-full); background: ${statusBadgeColor.bg}; color: ${statusBadgeColor.color}; font-weight: 800;">
                ${statusBadgeColor.label}
              </span>
            </div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">
              Sesi: ${tableSession.activeSessionId || 'SES-' + tableNum} • ${tableSession.customerName || 'Pelanggan'}
            </div>
          </div>
          <button class="icon-btn" id="btn-close-bill-modal" aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Scrollable Body with Orders List per Round -->
        <div class="modal-scrollable-body">
          <div style="background: var(--color-caramel-light); border: 1px solid var(--color-caramel); border-radius: var(--radius-md); padding: 10px 14px; font-size: 0.8rem; color: var(--color-caramel); display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <span>Semua pesanan ronde 1, 2, dst. otomatis terakumulasi dalam satu tagihan meja ini.</span>
          </div>

          <!-- Order Rounds Accordion -->
          ${orders.map((round, idx) => {
            const roundTime = new Date(round.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            return `
              <div class="bill-round-card">
                <div class="bill-round-header">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: var(--color-espresso); color: #FFF; font-size: 0.7rem; font-weight: 800; padding: 2px 7px; border-radius: 4px;">
                      Ronde #${round.roundNumber || (idx + 1)}
                    </span>
                    <span style="color: var(--color-text-muted); font-size: 0.75rem;">${roundTime} WIB</span>
                  </div>
                  <div style="font-family: var(--font-mono); font-weight: 700; color: var(--color-caramel);">
                    Rp ${round.total.toLocaleString('id-ID')}
                  </div>
                </div>

                <div class="bill-items-list">
                  ${round.items.map(it => `
                    <div class="bill-item-row">
                      <div>
                        <div class="item-name">
                          <strong>${it.qty}x</strong> ${it.name}
                        </div>
                        <!-- Variants -->
                        ${Object.values(it.variants || {}).filter(Boolean).length > 0 ? `
                          <div style="font-size: 0.72rem; color: var(--color-text-muted);">
                            ${Object.values(it.variants).join(' • ')}
                          </div>
                        ` : ''}
                        <!-- Toppings -->
                        ${(it.toppings || []).length > 0 ? `
                          <div style="font-size: 0.72rem; color: var(--color-caramel);">
                            + ${(it.toppings || []).map(t => t.name).join(', ')}
                          </div>
                        ` : ''}
                        <!-- Notes -->
                        ${it.notes ? `
                          <div style="font-size: 0.7rem; font-style: italic; color: var(--color-text-light);">
                            "${it.notes}"
                          </div>
                        ` : ''}
                      </div>
                      <div class="item-price">
                        Rp ${it.itemTotal.toLocaleString('id-ID')}
                      </div>
                    </div>
                  `).join('')}

                  <div style="border-top: 1px dashed var(--color-border); padding-top: 6px; margin-top: 4px; display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-text-muted);">
                    <span>Pajak Resto PB1 (10%):</span>
                    <span>Rp ${round.tax.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}

          <!-- Grand Total Calculation Card -->
          <div style="background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--radius-lg); padding: 14px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px; color: var(--color-text-muted);">
              <span>Total Menu Dipesan:</span>
              <strong>${tableSession.totalItems} Porsi (${totalRounds} Ronde)</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px; color: var(--color-text-muted);">
              <span>Status Pembayaran:</span>
              <strong style="color: ${isPaid ? 'var(--color-sage)' : 'var(--color-red)'};">
                ${isPaid ? '✅ Sudah Lunas (' + tableSession.paymentMethod + ')' : '⏳ Belum Dibayar'}
              </strong>
            </div>
            <div style="border-top: 2px dashed var(--color-border); padding-top: 10px; margin-top: 8px; display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 800;">TOTAL AKUMULASI:</span>
              <span style="font-family: var(--font-mono); font-size: 1.35rem; font-weight: 900; color: var(--color-caramel);">
                Rp ${totalBill.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        <!-- Sticky Footer -->
        <div class="modal-footer-sticky" style="flex-direction: column; gap: 8px;">
          <div style="display: flex; gap: 10px; width: 100%;">
            <!-- Add More Items Button (Key Feature!) -->
            <button type="button" id="btn-add-more-orders" style="flex: 1; padding: 12px; border-radius: var(--radius-full); background: var(--color-espresso); color: #FFFFFF; font-weight: 800; font-size: 0.85rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span>➕ Tambah Pesanan Lain</span>
            </button>

            <!-- Pay Now / Print Struk Button -->
            ${!isPaid ? `
              <button type="button" id="btn-bill-pay-now" style="flex: 1; padding: 12px; border-radius: var(--radius-full); background: var(--color-caramel); color: #FFFFFF; font-weight: 800; font-size: 0.85rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                <span>💳 Bayar Sekarang</span>
              </button>
            ` : `
              <button type="button" id="btn-bill-print-receipt" style="flex: 1; padding: 12px; border-radius: var(--radius-full); background: var(--color-sage); color: #FFFFFF; font-weight: 800; font-size: 0.85rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                <span>🖨️ Unduh Struk Digital</span>
              </button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}
