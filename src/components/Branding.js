// Garpoo Indonesia Branding & Official Vector Logo Component
import { CAFE_INFO } from '../data/garpooMenu.js';

export function renderGarpooLogo({ size = 'medium', showTagline = true, showInstagram = false } = {}) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';
  
  const logoWidth = isSmall ? 34 : isLarge ? 56 : 44;
  const logoHeight = isSmall ? 34 : isLarge ? 56 : 44;
  const titleSize = isSmall ? '1.05rem' : isLarge ? '1.5rem' : '1.25rem';

  return `
    <div class="brand-container">
      <div class="brand-logo-badge" style="width: ${logoWidth}px; height: ${logoHeight}px;">
        <!-- Stylized Fork & Coffee Cup Icon for Garpoo -->
        <svg width="${logoWidth * 0.6}" height="${logoHeight * 0.6}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Fork Symbol -->
          <path d="M12 2V12M12 12V22M12 12H8V6C8 4 9 2 9 2M12 12H16V6C16 4 15 2 15 2" stroke="#EAA023" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Coffee Sparkles / Steam -->
          <path d="M6 3C6 3 7 4 7 5C7 6 6 7 6 7" stroke="#F5B041" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M18 3C18 3 17 4 17 5C17 6 18 7 18 7" stroke="#F5B041" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="brand-texts">
        <div class="brand-title" style="font-size: ${titleSize};">
          GARPOO
          <span style="font-size: 0.65em; background: #B8621B; color: #FFF; padding: 2px 6px; border-radius: 6px; font-weight: 800; letter-spacing: 0.5px;">MEDAN</span>
        </div>
        ${showTagline ? `<span class="brand-tag">${CAFE_INFO.tagline}</span>` : ''}
        ${showInstagram ? `
          <a href="${CAFE_INFO.instagramUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 0.72rem; color: #D97706; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; margin-top: 2px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            ${CAFE_INFO.instagram}
          </a>
        ` : ''}
      </div>
    </div>
  `;
}
