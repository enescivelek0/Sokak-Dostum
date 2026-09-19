/**
 * SokakDostum - Uygulama Başlatıcı
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Harita başlat
  window.sokakMap.init();

  // 2. Arayüz başlat
  window.sokakUI.init();

  // Modal dışı tıklamayla kapatma
  const overlays = document.querySelectorAll('.modal-overlay');
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        if (window.sokakMap && window.sokakMap.isPickMode) {
          window.sokakMap.disablePickLocationMode();
        }
      }
    });
  });

  // ESC tuşuyla kapatma
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlays.forEach(m => m.classList.remove('active'));
      if (window.sokakMap && window.sokakMap.isPickMode) {
        window.sokakMap.disablePickLocationMode();
      }
    }
  });
});
