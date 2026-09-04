// Standee QR Code Table Generator for Garpoo Cafe Medan
import { CAFE_INFO } from '../data/garpooMenu.js';

export function renderQRGeneratorModal(initialTable = '01') {
  const tablePad = initialTable.toString().padStart(2, '0');
  const targetUrl = `${window.location.origin}${window.location.pathname}?meja=${tablePad}`;

  return `
    <div class="modal-overlay" id="qr-generator-modal-overlay">
      <div class="modal-sheet" style="max-width: 480px;">
        <!-- Header -->
        <div class="modal-header-sticky">
          <div class="modal-header-title">Generator QR Code Meja</div>
          <button class="icon-btn" id="btn-close-qr-modal" aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="modal-scrollable-body" style="align-items: center;">
          <!-- Table Selector -->
          <div style="width: 100%; display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <label style="font-size: 0.85rem; font-weight: 700;">Pilih Nomor Meja:</label>
            <select id="select-qr-table-num" style="padding: 8px 16px; border-radius: var(--radius-full); border: 1.5px solid var(--color-caramel); background: var(--color-surface); font-weight: 800; font-family: var(--font-mono); color: var(--color-caramel); outline: none;">
              ${Array.from({ length: 20 }, (_, i) => {
                const num = (i + 1).toString().padStart(2, '0');
                return `<option value="${num}" ${num === tablePad ? 'selected' : ''}>Meja ${num}</option>`;
              }).join('')}
            </select>
          </div>

          <!-- Printable Standee Card Preview -->
          <div class="qr-standee-preview printable-area" id="qr-printable-standee">
            <!-- Header Brand -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <div class="brand-logo-badge" style="width: 36px; height: 36px; border-radius: 50%;">
                <img src="./images/garpoo-logo.png" alt="Garpoo Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" />
              </div>
              <div style="text-align: left;">
                <div style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 900; letter-spacing: 0.5px; line-height: 1;">
                  GARPOO
                </div>
                <div style="font-size: 0.6rem; text-transform: uppercase; color: #EAA023; font-weight: 700;">
                  Cafe & Eatery Medan
                </div>
              </div>
            </div>

            <!-- Table Indicator -->
            <div style="background: linear-gradient(90deg, #B8621B, #EAA023); color: #18110B; font-family: var(--font-display); font-size: 1.4rem; font-weight: 900; padding: 4px 24px; border-radius: 9999px; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" id="standee-table-display">
              MEJA ${tablePad}
            </div>

            <p style="font-size: 0.72rem; opacity: 0.85; margin: 2px 0;">
              Scan QR untuk melihat menu & memesan langsung dari HP
            </p>

            <!-- QR Frame -->
            <div class="standee-qr-frame">
              <svg id="standee-qr-svg" width="160" height="160" viewBox="0 0 160 160" fill="none">
                <rect width="160" height="160" fill="white"/>
                <!-- Corner 1 -->
                <rect x="10" y="10" width="36" height="36" rx="4" fill="#18110B"/>
                <rect x="16" y="16" width="24" height="24" rx="2" fill="white"/>
                <rect x="20" y="20" width="16" height="16" rx="2" fill="#B8621B"/>
                <!-- Corner 2 -->
                <rect x="114" y="10" width="36" height="36" rx="4" fill="#18110B"/>
                <rect x="120" y="16" width="24" height="24" rx="2" fill="white"/>
                <rect x="124" y="20" width="16" height="16" rx="2" fill="#B8621B"/>
                <!-- Corner 3 -->
                <rect x="10" y="114" width="36" height="36" rx="4" fill="#18110B"/>
                <rect x="16" y="120" width="24" height="24" rx="2" fill="white"/>
                <rect x="20" y="124" width="16" height="16" rx="2" fill="#B8621B"/>
                <!-- Data blocks -->
                <rect x="55" y="15" width="8" height="8" fill="#18110B"/>
                <rect x="70" y="15" width="8" height="8" fill="#18110B"/>
                <rect x="85" y="15" width="8" height="8" fill="#18110B"/>
                <rect x="55" y="30" width="8" height="8" fill="#18110B"/>
                <rect x="85" y="30" width="8" height="8" fill="#18110B"/>

                <rect x="15" y="55" width="8" height="8" fill="#18110B"/>
                <rect x="35" y="55" width="8" height="8" fill="#18110B"/>
                <rect x="55" y="55" width="8" height="8" fill="#18110B"/>
                <rect x="75" y="55" width="8" height="8" fill="#18110B"/>
                <rect x="95" y="55" width="8" height="8" fill="#18110B"/>
                <rect x="115" y="55" width="8" height="8" fill="#18110B"/>
                <rect x="135" y="55" width="8" height="8" fill="#18110B"/>

                <!-- Center Emblem -->
                <circle cx="80" cy="80" r="16" fill="#18110B"/>
                <circle cx="80" cy="80" r="14" fill="#EAA023"/>
                <text x="80" y="84" font-size="9" font-weight="900" font-family="sans-serif" text-anchor="middle" fill="#18110B">GRP</text>

                <rect x="15" y="95" width="8" height="8" fill="#18110B"/>
                <rect x="35" y="95" width="8" height="8" fill="#18110B"/>
                <rect x="115" y="95" width="8" height="8" fill="#18110B"/>
                <rect x="135" y="95" width="8" height="8" fill="#18110B"/>

                <rect x="55" y="115" width="8" height="8" fill="#18110B"/>
                <rect x="75" y="115" width="8" height="8" fill="#18110B"/>
                <rect x="95" y="115" width="8" height="8" fill="#18110B"/>
                <rect x="125" y="115" width="8" height="8" fill="#18110B"/>

                <rect x="55" y="135" width="8" height="8" fill="#18110B"/>
                <rect x="85" y="135" width="8" height="8" fill="#18110B"/>
                <rect x="115" y="135" width="8" height="8" fill="#18110B"/>
              </svg>
            </div>

            <!-- Steps Guide -->
            <div style="font-size: 0.68rem; line-height: 1.4; opacity: 0.9; text-align: center; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 8px; width: 100%;">
              1. Buka Kamera / QR Scanner<br/>
              2. Pilih Menu & Kustomisasi Rasa<br/>
              3. Tambah Pesanan Kapan Saja!
            </div>

            <!-- Wi-Fi Details -->
            <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 4px 10px; font-size: 0.65rem; display: flex; gap: 8px; width: 100%; justify-content: center;">
              <span>📶 Wi-Fi: <strong>${CAFE_INFO.wifiSsid}</strong></span>
              <span>Pass: <strong>${CAFE_INFO.wifiPass}</strong></span>
            </div>
          </div>
        </div>

        <!-- Sticky Footer -->
        <div class="modal-footer-sticky" style="display: flex; gap: 10px;">
          <button type="button" id="btn-print-standee" style="flex: 1; padding: 12px; border-radius: var(--radius-full); background: var(--color-caramel); color: #FFFFFF; font-weight: 800; font-size: 0.85rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <span>🖨️ Cetak Kartu Standee Meja</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
