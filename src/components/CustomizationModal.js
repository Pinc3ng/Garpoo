// Customization Modal for Garpoo Cafe Dish Selection
export function renderCustomizationModal(item, existingCartItem = null) {
  const isEdit = !!existingCartItem;
  const initialQty = existingCartItem ? existingCartItem.qty : 1;
  const initialNotes = existingCartItem ? existingCartItem.notes : '';
  const initialVariants = existingCartItem ? existingCartItem.selectedVariants : {};
  const initialToppings = existingCartItem ? (existingCartItem.selectedToppings || []).map(t => t.name) : [];

  const customizable = item.customizable || {};
  const hasSpiciness = !!customizable.spiciness;
  const hasEggOption = !!customizable.eggOption;
  const hasTemperature = !!customizable.temperature;
  const hasSweetness = !!customizable.sweetness;
  const hasMilkOption = !!customizable.milkOption;
  const hasRiceOption = !!customizable.riceOption;
  const hasSoupOption = !!customizable.soupOption;
  const hasSauceOption = !!customizable.sauceOption;
  const hasToppings = customizable.toppings && customizable.toppings.length > 0;

  return `
    <div class="modal-overlay" id="customization-modal-overlay">
      <div class="modal-sheet" id="customization-sheet">
        <!-- Sticky Header -->
        <div class="modal-header-sticky">
          <div class="modal-header-title">Kustomisasi Pesanan</div>
          <button class="icon-btn" id="btn-close-custom-modal" aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="modal-scrollable-body">
          <!-- Item Preview Header -->
          <div style="display: flex; gap: 14px; align-items: center; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 14px;">
            <div style="width: 72px; height: 72px; border-radius: var(--radius-md); overflow: hidden; background: var(--color-bg-alt); flex-shrink: 0;">
              <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'" />
            </div>
            <div style="flex-grow: 1;">
              <h3 style="font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; margin-bottom: 4px;">${item.name}</h3>
              <p style="font-size: 0.78rem; color: var(--color-text-muted); line-height: 1.3;">${item.description}</p>
              <div style="font-family: var(--font-mono); font-size: 1.05rem; font-weight: 800; color: var(--color-caramel); margin-top: 6px;">
                Rp ${item.price.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          <!-- Spiciness Level -->
          ${hasSpiciness ? `
            <div class="custom-group">
              <div class="custom-section-title">
                <span>🌶️ Tingkat Kepedasan</span>
                <span class="required">Wajib pilih 1</span>
              </div>
              <div class="radio-group" id="spiciness-options">
                ${customizable.spiciness.map((lvl, idx) => {
                  const isChecked = initialVariants.spiciness ? initialVariants.spiciness === lvl : idx === 1;
                  return `
                    <label class="custom-option-label ${isChecked ? 'selected' : ''}">
                      <span>${lvl}</span>
                      <input type="radio" name="var_spiciness" value="${lvl}" ${isChecked ? 'checked' : ''} style="accent-color: var(--color-caramel);" />
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Temperature Option (Ice / Hot) -->
          ${hasTemperature ? `
            <div class="custom-group">
              <div class="custom-section-title">
                <span>🌡️ Suhu Minuman</span>
                <span class="required">Wajib pilih 1</span>
              </div>
              <div class="radio-group" id="temperature-options">
                ${customizable.temperature.map((temp, idx) => {
                  const isChecked = initialVariants.temperature ? initialVariants.temperature === temp : idx === 0;
                  return `
                    <label class="custom-option-label ${isChecked ? 'selected' : ''}">
                      <span>${temp}</span>
                      <input type="radio" name="var_temperature" value="${temp}" ${isChecked ? 'checked' : ''} style="accent-color: var(--color-caramel);" />
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Sweetness Level -->
          ${hasSweetness ? `
            <div class="custom-group">
              <div class="custom-section-title">
                <span>🍯 Tingkat Kemanisan</span>
                <span class="required">Wajib pilih 1</span>
              </div>
              <div class="radio-group" id="sweetness-options">
                ${customizable.sweetness.map((sweet, idx) => {
                  const isChecked = initialVariants.sweetness ? initialVariants.sweetness === sweet : idx === 0;
                  return `
                    <label class="custom-option-label ${isChecked ? 'selected' : ''}">
                      <span>${sweet}</span>
                      <input type="radio" name="var_sweetness" value="${sweet}" ${isChecked ? 'checked' : ''} style="accent-color: var(--color-caramel);" />
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Egg Option -->
          ${hasEggOption ? `
            <div class="custom-group">
              <div class="custom-section-title">
                <span>🍳 Pilihan Telur</span>
                <span class="required">Pilih 1</span>
              </div>
              <div class="radio-group">
                ${customizable.eggOption.map((opt, idx) => {
                  const isChecked = initialVariants.eggOption ? initialVariants.eggOption === opt : idx === 0;
                  return `
                    <label class="custom-option-label ${isChecked ? 'selected' : ''}">
                      <span>${opt}</span>
                      <input type="radio" name="var_eggOption" value="${opt}" ${isChecked ? 'checked' : ''} style="accent-color: var(--color-caramel);" />
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Milk Option -->
          ${hasMilkOption ? `
            <div class="custom-group">
              <div class="custom-section-title">
                <span>🥛 Jenis Susu</span>
                <span class="required">Pilih 1</span>
              </div>
              <div class="radio-group">
                ${customizable.milkOption.map((milk, idx) => {
                  const isChecked = initialVariants.milkOption ? initialVariants.milkOption === milk : idx === 0;
                  return `
                    <label class="custom-option-label ${isChecked ? 'selected' : ''}">
                      <span>${milk}</span>
                      <input type="radio" name="var_milkOption" value="${milk}" ${isChecked ? 'checked' : ''} style="accent-color: var(--color-caramel);" />
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Toppings / Extra Add-ons -->
          ${hasToppings ? `
            <div class="custom-group">
              <div class="custom-section-title">
                <span>✨ Tambahan Topping / Ekstra</span>
                <span style="font-size: 0.72rem; color: var(--color-text-muted);">Opsional</span>
              </div>
              <div class="checkbox-group" id="toppings-options">
                ${customizable.toppings.map(top => {
                  const isChecked = initialToppings.includes(top.name);
                  return `
                    <label class="custom-option-label ${isChecked ? 'selected' : ''}">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" name="topping_item" value="${top.name}" data-price="${top.price}" ${isChecked ? 'checked' : ''} style="accent-color: var(--color-caramel);" />
                        <span>${top.name}</span>
                      </div>
                      <span style="font-family: var(--font-mono); font-weight: 700; color: var(--color-caramel);">+Rp ${top.price.toLocaleString('id-ID')}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Special Notes -->
          <div class="custom-group">
            <div class="custom-section-title">
              <span>📝 Catatan Khusus untuk Dapur/Barista</span>
            </div>
            <textarea class="custom-textarea" id="item-special-notes" placeholder="Contoh: jangan pakai daun bawang, es dipisah, ekstra jeruk nipis...">${initialNotes}</textarea>
          </div>
        </div>

        <!-- Sticky Footer with Dynamic Total & Add Button -->
        <div class="modal-footer-sticky">
          <div class="qty-stepper">
            <button type="button" id="btn-modal-qty-minus">-</button>
            <span id="modal-qty-value">${initialQty}</span>
            <button type="button" id="btn-modal-qty-plus">+</button>
          </div>

          <button type="button" id="btn-confirm-add-cart" style="flex-grow: 1; padding: 13px; border-radius: var(--radius-full); background: var(--color-caramel); color: #FFFFFF; font-weight: 800; font-size: 0.92rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 14px rgba(184, 98, 27, 0.35);">
            <span>${isEdit ? 'Simpan Perubahan' : 'Tambah ke Pesanan'}</span>
            <span id="modal-dynamic-total" style="font-family: var(--font-mono);">Rp ${(item.price * initialQty).toLocaleString('id-ID')}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
