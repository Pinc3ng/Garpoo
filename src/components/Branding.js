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
      <div class="brand-logo-badge" style="width: ${logoWidth}px; height: ${logoHeight}px; border-radius: 50%; padding: 0; background: #FFFFFF; border: 1.5px solid #B8621B; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(30, 21, 15, 0.12); flex-shrink: 0;">
        <img src="./images/garpoo-logo.png" alt="Garpoo Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" />
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
