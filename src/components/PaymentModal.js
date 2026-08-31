// Payment & Dynamic QRIS Modal for Garpoo Cafe Medan
import { CAFE_INFO } from '../data/garpooMenu.js';

export function renderPaymentModal({ tableNumber, totalAmount, orderSummary, isAddon = false }) {
  const tablePad = tableNumber.toString().padStart(2, '0');
  const invoiceId = `INV-GRP-${tablePad}-${Date.now().toString().slice(-6)}`;

  return `
    <div class="modal-overlay" id="payment-modal-overlay">
      <div class="modal-sheet">
        <!-- Header -->
        <div class="modal-header-sticky">
          <div class="modal-header-title">
            ${isAddon ? 'Pembayaran Pesanan Tambahan' : 'Pilih Metode Pembayaran'}
          </div>
          <button class="icon-btn" id="btn-close-payment-modal" aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="modal-scrollable-body">
          <!-- Total Price Callout -->
          <div style="background: var(--color-bg-alt); border: 2px solid var(--color-border); border-radius: var(--radius-lg); padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 700; text-transform: uppercase;">Total Tagihan (${tableNumber ? 'Meja ' + tablePad : 'Meja'})</div>
              <div style="font-size: 0.72rem; color: var(--color-text-light);">No. Inv: ${invoiceId}</div>
            </div>
            <div style="font-family: var(--font-mono); font-size: 1.4rem; font-weight: 900; color: var(--color-caramel);">
              Rp ${totalAmount.toLocaleString('id-ID')}
            </div>
          </div>

          <!-- Payment Methods Tab -->
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; margin-bottom: 10px;">Metode Pembayaran:</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;" id="payment-method-selector">
              <button type="button" class="pay-method-chip active" data-method="QRIS" style="padding: 10px 6px; border-radius: var(--radius-md); border: 2px solid var(--color-caramel); background: var(--color-caramel-light); color: var(--color-caramel); font-weight: 800; font-size: 0.82rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <span style="font-size: 1.2rem;">📱</span>
                <span>QRIS Dinamis</span>
              </button>

              <button type="button" class="pay-method-chip" data-method="KASIR" style="padding: 10px 6px; border-radius: var(--radius-md); border: 1.5px solid var(--color-border); background: var(--color-surface); color: var(--color-text-main); font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <span style="font-size: 1.2rem;">💵</span>
                <span>Tunai di Kasir</span>
              </button>

              <button type="button" class="pay-method-chip" data-method="EWALLET" style="padding: 10px 6px; border-radius: var(--radius-md); border: 1.5px solid var(--color-border); background: var(--color-surface); color: var(--color-text-main); font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <span style="font-size: 1.2rem;">💳</span>
                <span>E-Wallet / VA</span>
              </button>
            </div>
          </div>

          <!-- QRIS Container (Default) -->
          <div id="payment-content-qris" class="qris-box">
            <div class="qris-header">
              <div class="qris-logo">QRIS</div>
              <div style="font-size: 0.72rem; font-weight: 700; color: #475569;">
                NMID: ID1024398102941<br/>
                <span style="color: var(--color-caramel);">${CAFE_INFO.legalName}</span>
              </div>
            </div>

            <!-- Dynamic QR Canvas Container -->
            <div class="qris-canvas-wrapper" style="text-align: center;">
              <svg id="qris-svg-render" width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- QR Code Authentic Simulated Pattern -->
                <rect width="180" height="180" fill="white"/>
                <!-- Corner 1 -->
                <rect x="10" y="10" width="40" height="40" rx="6" fill="#1E150F"/>
                <rect x="18" y="18" width="24" height="24" rx="2" fill="white"/>
                <rect x="22" y="22" width="16" height="16" rx="2" fill="#B8621B"/>
                <!-- Corner 2 -->
                <rect x="130" y="10" width="40" height="40" rx="6" fill="#1E150F"/>
                <rect x="138" y="18" width="24" height="24" rx="2" fill="white"/>
                <rect x="142" y="22" width="16" height="16" rx="2" fill="#B8621B"/>
                <!-- Corner 3 -->
                <rect x="10" y="130" width="40" height="40" rx="6" fill="#1E150F"/>
                <rect x="18" y="138" width="24" height="24" rx="2" fill="white"/>
                <rect x="22" y="142" width="16" height="16" rx="2" fill="#B8621B"/>
                <!-- Grid Matrix Dots -->
                <rect x="60" y="20" width="8" height="8" fill="#1E150F"/>
                <rect x="75" y="20" width="8" height="8" fill="#1E150F"/>
                <rect x="90" y="20" width="8" height="8" fill="#1E150F"/>
                <rect x="105" y="20" width="8" height="8" fill="#1E150F"/>
                
                <rect x="60" y="35" width="8" height="8" fill="#1E150F"/>
                <rect x="90" y="35" width="8" height="8" fill="#1E150F"/>
                <rect x="105" y="35" width="8" height="8" fill="#1E150F"/>
                
                <rect x="20" y="60" width="8" height="8" fill="#1E150F"/>
                <rect x="35" y="60" width="8" height="8" fill="#1E150F"/>
                <rect x="60" y="60" width="8" height="8" fill="#1E150F"/>
                <rect x="75" y="60" width="8" height="8" fill="#1E150F"/>
                <rect x="90" y="60" width="8" height="8" fill="#1E150F"/>
                <rect x="105" y="60" width="8" height="8" fill="#1E150F"/>
                <rect x="135" y="60" width="8" height="8" fill="#1E150F"/>
                <rect x="150" y="60" width="8" height="8" fill="#1E150F"/>

                <rect x="20" y="75" width="8" height="8" fill="#1E150F"/>
                <rect x="45" y="75" width="8" height="8" fill="#1E150F"/>
                <rect x="65" y="75" width="8" height="8" fill="#1E150F"/>
                <rect x="120" y="75" width="8" height="8" fill="#1E150F"/>
                <rect x="145" y="75" width="8" height="8" fill="#1E150F"/>

                <!-- Center Logo Badge -->
                <circle cx="90" cy="90" r="18" fill="#1E150F"/>
                <circle cx="90" cy="90" r="16" fill="#EAA023"/>
                <text x="90" y="94" font-size="10" font-weight="900" font-family="sans-serif" text-anchor="middle" fill="#1E150F">GRP</text>

                <rect x="20" y="105" width="8" height="8" fill="#1E150F"/>
                <rect x="40" y="105" width="8" height="8" fill="#1E150F"/>
                <rect x="130" y="105" width="8" height="8" fill="#1E150F"/>
                <rect x="150" y="105" width="8" height="8" fill="#1E150F"/>

                <rect x="60" y="125" width="8" height="8" fill="#1E150F"/>
                <rect x="75" y="125" width="8" height="8" fill="#1E150F"/>
                <rect x="105" y="125" width="8" height="8" fill="#1E150F"/>
                <rect x="135" y="125" width="8" height="8" fill="#1E150F"/>
                <rect x="150" y="125" width="8" height="8" fill="#1E150F"/>

                <rect x="60" y="145" width="8" height="8" fill="#1E150F"/>
                <rect x="90" y="145" width="8" height="8" fill="#1E150F"/>
                <rect x="120" y="145" width="8" height="8" fill="#1E150F"/>
                <rect x="145" y="145" width="8" height="8" fill="#1E150F"/>
              </svg>
            </div>

            <div class="qris-timer-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Berlaku hingga <strong id="qris-countdown-timer">14:59</strong></span>
            </div>

            <div style="font-size: 0.75rem; color: var(--color-text-muted); line-height: 1.4;">
              Buka aplikasi BCA, Mandiri, GoPay, OVO, ShopeePay, atau DANA kamu lalu scan kode QR di atas.
            </div>
          </div>

          <!-- Cashier Option Container -->
          <div id="payment-content-kasir" style="display: none; background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: var(--radius-lg); padding: 18px; text-align: center;">
            <div style="font-size: 2.4rem; margin-bottom: 8px;">🧑‍🍳</div>
            <h4 style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 800; margin-bottom: 4px;">Bayar Tunai di Kasir</h4>
            <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 12px;">
              Pesanan kamu akan langsung diteruskan ke Dapur & Barista Garpoo Cafe. Pembayaran tunai dapat dilakukan di meja kasir setelah selesai bersantap.
            </p>
            <div style="background: #FEF3C7; color: #92400E; padding: 8px 12px; border-radius: var(--radius-md); font-size: 0.78rem; font-weight: 600;">
              💡 Tunjukkan nomor meja <strong>Meja ${tablePad}</strong> ke kasir saat pembayaran.
            </div>
          </div>

          <!-- E-Wallet List -->
          <div id="payment-content-ewallet" style="display: none; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--color-border); background: var(--color-surface);">
              <div style="display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 0.85rem;">
                <span style="font-size: 1.3rem;">🟢</span> GoPay / GoPay Later
              </div>
              <span style="font-size: 0.75rem; color: var(--color-caramel); font-weight: 700;">Instan</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--color-border); background: var(--color-surface);">
              <div style="display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 0.85rem;">
                <span style="font-size: 1.3rem;">🟣</span> OVO Cash
              </div>
              <span style="font-size: 0.75rem; color: var(--color-caramel); font-weight: 700;">Instan</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: var(--radius-md); border: 1px solid var(--color-border); background: var(--color-surface);">
              <div style="display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 0.85rem;">
                <span style="font-size: 1.3rem;">🟠</span> ShopeePay
              </div>
              <span style="font-size: 0.75rem; color: var(--color-caramel); font-weight: 700;">Instan</span>
            </div>
          </div>
        </div>

        <!-- Sticky Footer with Action -->
        <div class="modal-footer-sticky" style="flex-direction: column; gap: 8px;">
          <!-- Pitching/Demo Simulation Button -->
          <button type="button" id="btn-confirm-payment-action" style="width: 100%; padding: 14px; border-radius: var(--radius-full); background: var(--color-caramel); color: #FFFFFF; font-weight: 800; font-size: 0.95rem; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(184, 98, 27, 0.35); display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>✨ Konfirmasi & Kirim Pesanan ke Dapur</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
