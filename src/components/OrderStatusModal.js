// Live Order Status Timeline & Digital Receipt for Garpoo Cafe
import { CAFE_INFO } from '../data/garpooMenu.js';

export function renderOrderStatusModal(tableSession, currentRound = null) {
  if (!tableSession) return '';

  const tableNum = tableSession.number;
  const activeRound = currentRound || (tableSession.orders && tableSession.orders[tableSession.orders.length - 1]);
  const status = activeRound ? activeRound.status : tableSession.status;
  const isPaid = tableSession.paymentStatus.startsWith('paid');

  const steps = [
    { key: 'received', title: 'Pesanan Diterima', desc: 'Kasir telah menerima pesananmu', icon: '📝' },
    { key: 'cooking', title: 'Sedang Dimasak', desc: 'Dapur & Barista Garpoo sedang menyiapkan hidangan', icon: '🍳' },
    { key: 'served', title: 'Siap Disajikan', desc: 'Pelayan sedang mengantarkan makanan ke mejamu', icon: '🍽️' },
    { key: 'completed', title: 'Selesai', desc: 'Selamat menikmati santapan di Garpoo Cafe!', icon: '✨' }
  ];

  let currentStepIdx = 1; // Default cooking
  if (status === 'received') currentStepIdx = 0;
  if (status === 'cooking') currentStepIdx = 1;
  if (status === 'served') currentStepIdx = 2;
  if (status === 'completed' || tableSession.status === 'completed') currentStepIdx = 3;

  return `
    <div class="modal-overlay" id="order-status-modal-overlay">
      <div class="modal-sheet">
        <!-- Header -->
        <div class="modal-header-sticky">
          <div>
            <div class="modal-header-title">Status Pesanan Meja ${tableNum}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">
              Sesi #${tableSession.activeSessionId || 'SES-' + tableNum} • Ronde #${activeRound ? activeRound.roundNumber : 1}
            </div>
          </div>
          <button class="icon-btn" id="btn-close-status-modal" aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="modal-scrollable-body">
          <!-- Animated Status Banner -->
          <div style="background: linear-gradient(135deg, #1E150F, #32251B); color: #FFFFFF; border-radius: var(--radius-lg); padding: 18px; text-align: center; border: 1.5px solid rgba(234, 160, 35, 0.35); box-shadow: var(--shadow-md);">
            <div style="font-size: 2.8rem; margin-bottom: 6px; animation: pulse 2s infinite;">
              ${steps[currentStepIdx].icon}
            </div>
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: var(--color-amber); margin-bottom: 4px;">
              ${steps[currentStepIdx].title}
            </h3>
            <p style="font-size: 0.82rem; color: rgba(255,255,255,0.8); line-height: 1.4;">
              ${steps[currentStepIdx].desc}
            </p>
          </div>

          <!-- Step Timeline -->
          <div style="display: flex; flex-direction: column; gap: 14px; padding: 10px 4px;">
            ${steps.map((step, idx) => {
              const isPassed = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return `
                <div style="display: flex; gap: 14px; align-items: flex-start; position: relative;">
                  <!-- Line connector -->
                  ${idx < steps.length - 1 ? `
                    <div style="position: absolute; left: 15px; top: 30px; bottom: -14px; width: 2px; background: ${idx < currentStepIdx ? 'var(--color-caramel)' : 'var(--color-border)'};"></div>
                  ` : ''}

                  <!-- Circle badge -->
                  <div style="width: 32px; height: 32px; border-radius: var(--radius-full); background: ${isCurrent ? 'var(--color-caramel)' : isPassed ? 'var(--color-espresso)' : 'var(--color-bg-alt)'}; color: ${isPassed ? '#FFF' : 'var(--color-text-light)'}; border: 2px solid ${isCurrent ? 'var(--color-amber)' : isPassed ? 'var(--color-caramel)' : 'var(--color-border)'}; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 800; flex-shrink: 0; z-index: 2;">
                    ${isPassed && !isCurrent ? '✓' : idx + 1}
                  </div>

                  <div>
                    <h4 style="font-size: 0.88rem; font-weight: 700; color: ${isPassed ? 'var(--color-text-main)' : 'var(--color-text-muted)'}; margin-bottom: 2px;">
                      ${step.title}
                    </h4>
                    <p style="font-size: 0.75rem; color: var(--color-text-muted);">
                      ${step.desc}
                    </p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Ordered Items Summary -->
          ${activeRound ? `
            <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 12px 14px;">
              <div style="font-size: 0.8rem; font-weight: 700; margin-bottom: 8px; color: var(--color-text-muted);">
                Item Dalam Ronde Ini (${activeRound.items.length} Menu):
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${activeRound.items.map(it => `
                  <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
                    <span><strong>${it.qty}x</strong> ${it.name}</span>
                    <span style="font-family: var(--font-mono); font-weight: 600;">Rp ${it.itemTotal.toLocaleString('id-ID')}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Sticky Footer -->
        <div class="modal-footer-sticky" style="display: flex; gap: 10px;">
          <button type="button" id="btn-status-view-bill" style="flex: 1; padding: 12px; border-radius: var(--radius-full); background: var(--color-espresso); color: #FFFFFF; font-weight: 700; font-size: 0.85rem; border: none; cursor: pointer;">
            🧾 Cek Tagihan Meja
          </button>
          <button type="button" id="btn-status-order-more" style="flex: 1; padding: 12px; border-radius: var(--radius-full); background: var(--color-caramel); color: #FFFFFF; font-weight: 800; font-size: 0.85rem; border: none; cursor: pointer;">
            ➕ Pesan Tambahan
          </button>
        </div>
      </div>
    </div>
  `;
}
