/**
 * SokakDostum - UI Kontrolörü
 * Kompakt kaydırma çekmecesi, gizlilik odaklı iletişim, Instagram DM ve arşiv yönetimi
 */

class SokakDostumUI {
  constructor() {
    this.sheetState = 'half'; // 'peek', 'half', 'full'
    this.isDesktopPanelOpen = true;
    this.selectedImageBase64 = null;
    this.selectedAnimalType = 'kedi';
    this.selectedUrgency = 'hungry';
  }

  init() {
    this.bindEvents();
    this.renderAll();

    // Store değişikliklerinde otomatik güncelle
    window.sokakStore.subscribe(() => {
      this.renderAll();
    });
  }

  bindEvents() {
    // Arama Çubuğu
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        window.sokakStore.setFilters({ query: e.target.value });
      });
    }

    // Mobil Çekmece Tutamaç Tıklaması (Peek <-> Half <-> Full)
    const dragHandle = document.getElementById('sheet-drag-handle');
    if (dragHandle) {
      dragHandle.addEventListener('click', () => {
        if (this.sheetState === 'peek') this.setSheetState('half');
        else if (this.sheetState === 'half') this.setSheetState('full');
        else this.setSheetState('peek');
      });
    }

    // Fotoğraf Seçimi & Önizleme
    const fileInput = document.getElementById('report-image-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            this.selectedImageBase64 = evt.target.result;
            const previewEl = document.getElementById('form-img-preview');
            const previewImg = document.getElementById('form-img-tag');
            if (previewEl && previewImg) {
              previewImg.src = evt.target.result;
              previewEl.classList.remove('hidden');
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Modal Dışına Tıklama ve Escape Tuşu ile Kapatma
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
          overlay.classList.remove('active');
        });
      }
    });
  }

  setSheetState(state) {
    this.sheetState = state;
    const sheet = document.getElementById('sliding-panel');
    if (!sheet) return;

    sheet.classList.remove('sheet-peek', 'sheet-half', 'sheet-full');
    sheet.classList.add(`sheet-${state}`);

    setTimeout(() => {
      if (window.sokakMap && window.sokakMap.map) {
        window.sokakMap.map.invalidateSize();
      }
    }, 250);
  }

  toggleDesktopPanel() {
    this.isDesktopPanelOpen = !this.isDesktopPanelOpen;
    const panel = document.getElementById('sliding-panel');
    const toggleBtn = document.getElementById('panel-toggle-btn');
    if (panel) {
      panel.classList.toggle('hidden', !this.isDesktopPanelOpen);
    }
    if (toggleBtn) {
      toggleBtn.innerHTML = this.isDesktopPanelOpen ? '◀ Paneli Gizle' : '▶ Listeyi Göster';
    }
    setTimeout(() => {
      if (window.sokakMap && window.sokakMap.map) {
        window.sokakMap.map.invalidateSize();
      }
    }, 200);
  }

  switchTab(tab) {
    window.sokakStore.setActiveTab(tab);

    const tabBtns = document.querySelectorAll('[data-tab-btn]');
    tabBtns.forEach(btn => {
      const bTab = btn.getAttribute('data-tab-btn');
      if (bTab === tab) {
        btn.classList.add('bg-blue-600', 'text-white', 'shadow-xs');
        btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
      } else {
        btn.classList.remove('bg-blue-600', 'text-white', 'shadow-xs');
        btn.classList.add('text-slate-600', 'hover:bg-slate-100');
      }
    });

    if (window.innerWidth < 768 && this.sheetState === 'peek') {
      this.setSheetState('half');
    }
  }

  toggleArchiveView(showArchive) {
    window.sokakStore.setViewArchive(showArchive);

    const activeBtn = document.getElementById('view-active-btn');
    const archiveBtn = document.getElementById('view-archive-btn');

    if (activeBtn && archiveBtn) {
      if (!showArchive) {
        activeBtn.className = 'px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white shadow-xs text-slate-900 transition';
        archiveBtn.className = 'px-2.5 py-1 text-[11px] font-semibold rounded-lg text-slate-500 hover:text-slate-700 transition';
      } else {
        activeBtn.className = 'px-2.5 py-1 text-[11px] font-semibold rounded-lg text-slate-500 hover:text-slate-700 transition';
        archiveBtn.className = 'px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white shadow-xs text-purple-900 transition';
      }
    }
  }

  setAnimalFilter(animal) {
    window.sokakStore.setFilters({ animal });

    const btns = document.querySelectorAll('[data-animal-btn]');
    btns.forEach(b => {
      if (b.getAttribute('data-animal-btn') === animal) {
        b.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
        b.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
      } else {
        b.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
        b.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      }
    });
  }

  renderAll() {
    this.renderCriticalAlert();
    this.renderTabContent();
    this.updateCounters();
  }

  updateCounters() {
    const state = window.sokakStore.getState();
    const repCountEl = document.getElementById('count-reports');
    const vetCountEl = document.getElementById('count-vets');
    const pointCountEl = document.getElementById('count-points');
    const adoptedBadgeCount = document.getElementById('count-adopted');

    if (repCountEl) repCountEl.textContent = state.reports.length;
    if (vetCountEl) vetCountEl.textContent = state.vets.length;
    if (pointCountEl) pointCountEl.textContent = state.solidarityPoints.length;
    if (adoptedBadgeCount) adoptedBadgeCount.textContent = state.stats.adoptedCount;
  }

  renderCriticalAlert() {
    const alertEl = document.getElementById('floating-alert-pill');
    if (!alertEl) return;

    const critical = window.sokakStore.getCriticalAlert();
    if (!critical) {
      alertEl.classList.add('hidden');
      return;
    }

    alertEl.classList.remove('hidden');
    alertEl.innerHTML = `
      <div onclick="window.sokakUI.focusItem(${critical.lat}, ${critical.lng}, '${critical.id}')" class="glass-pill px-3 py-1 rounded-full shadow-md border border-red-200 flex items-center gap-1.5 cursor-pointer hover:bg-red-50/90 transition text-xs max-w-xs sm:max-w-md">
        <span class="w-2 h-2 rounded-full bg-red-600 animate-ping shrink-0"></span>
        <span class="font-bold text-red-700 shrink-0">🚨 Acil:</span>
        <span class="font-semibold text-slate-800 truncate text-[11px] sm:text-xs">${critical.title}</span>
        <span class="text-[10px] font-bold text-blue-700 ml-0.5 shrink-0">Gör →</span>
      </div>
    `;
  }

  renderTabContent() {
    const container = document.getElementById('panel-items-container');
    if (!container) return;

    const state = window.sokakStore.getState();

    // 1. VAKALAR / SAHİPLENDİRME SEKME İÇERİĞİ
    if (state.activeTab === 'reports') {
      if (state.reports.length === 0) {
        container.innerHTML = `
          <div class="text-center py-8 text-slate-400">
            <span class="text-3xl block mb-2">${state.viewArchive ? '🏠' : '🐾'}</span>
            <p class="text-xs font-semibold">${state.viewArchive ? 'Henüz arşivde vaka bulunmuyor.' : 'Bu filtrelere uygun aktif vaka bulunamadı.'}</p>
            ${!state.viewArchive ? `
              <button onclick="window.sokakUI.openNewReportModal()" class="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs">
                + Yeni Vaka Bildir
              </button>
            ` : ''}
          </div>
        `;
        return;
      }

      container.innerHTML = state.reports.map(r => {
        const isCritical = r.urgency === 'critical';
        const isTransit = r.urgency === 'transit';
        const isAdopted = r.status === 'adopted';
        const isArchived = r.status === 'archived';

        let badgeClass = 'bg-amber-100 text-amber-800';
        let badgeText = '🥣 Mama/Su';
        if (r.urgency === 'critical') { badgeClass = 'bg-red-100 text-red-800 font-extrabold'; badgeText = '🚨 Hayati'; }
        if (r.urgency === 'transit') { badgeClass = 'badge-transit font-extrabold'; badgeText = '🚗 Araç Lazım'; }
        if (r.urgency === 'injured') { badgeClass = 'bg-orange-100 text-orange-800 font-bold'; badgeText = '🩹 Yaralı'; }
        if (r.urgency === 'shelter') { badgeClass = 'bg-blue-100 text-blue-800 font-semibold'; badgeText = '🏠 Yuva Arayan'; }
        if (isAdopted) { badgeClass = 'bg-purple-100 text-purple-800 font-extrabold'; badgeText = '🎉 Yuva Buldu'; }

        return `
          <div class="bg-white/95 rounded-2xl p-3 border border-slate-200/80 shadow-xs hover:shadow-md transition group ${isCritical ? 'ring-1 ring-red-400' : ''} ${isTransit ? 'ring-1 ring-indigo-300' : ''} ${isAdopted ? 'bg-purple-50/40 border-purple-200' : ''}">
            <div class="flex gap-3">
              <div class="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                <img src="${r.image}" alt="${r.title}" class="w-full h-full object-cover group-hover:scale-105 transition" onerror="this.src='${window.sokakStore.getAnimalPlaceholder(r.type)}'"/>
                ${isAdopted ? '<div class="absolute inset-0 bg-purple-900/60 flex items-center justify-center text-[10px] text-white font-extrabold">YUVADA 🎉</div>' : ''}
                ${isArchived ? '<div class="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-[10px] text-white font-bold">ARŞİV</div>' : ''}
              </div>

              <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between gap-1 mb-1">
                    <span class="px-2 py-0.5 text-[10px] rounded-full ${badgeClass}">
                      ${badgeText}
                    </span>
                    <span class="text-[10px] text-slate-400">${this.formatTimeAgo(r.createdAt)}</span>
                  </div>

                  <h4 onclick="window.sokakUI.openReportDetailModal('${r.id}')" class="font-bold text-slate-900 text-xs leading-snug line-clamp-1 cursor-pointer hover:text-blue-700 transition">
                    ${r.title}
                  </h4>
                  <p class="text-[11px] text-slate-500 line-clamp-1 mb-1 flex items-center gap-1">
                    ${r.distanceText ? `<span class="font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.2 rounded-md text-[10px] shrink-0">${r.distanceText}</span>` : ''}
                    <span class="truncate">📍 ${r.locationName}</span>
                  </p>
                  ${r.supportCount > 0 ? `
                    <div class="text-[10px] text-indigo-700 font-semibold flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                      <span>${r.supportCount} kişi sahada ilgilendi</span>
                    </div>
                  ` : ''}
                </div>

                <div class="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-100">
                  <div class="flex items-center gap-1 text-[11px] text-slate-600 truncate">
                    ${r.instagram ? `
                      <a href="https://instagram.com/${r.instagram}" target="_blank" rel="noopener noreferrer" class="text-purple-700 font-bold hover:underline flex items-center gap-0.5">
                        <span>📸</span>
                        <span>@${r.instagram}</span>
                      </a>
                    ` : `<span class="text-slate-400">👤 ${r.contactName || 'Anonim'}</span>`}
                  </div>

                  <div class="flex items-center gap-1">
                    <button onclick="window.sokakUI.openNavigation(${r.lat}, ${r.lng})" class="py-1 px-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-bold transition" title="Google Maps Rota">
                      🧭 Rota
                    </button>
                    <button onclick="window.sokakUI.focusItem(${r.lat}, ${r.lng}, '${r.id}')" class="py-1 px-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition" title="Haritada Odaklan">
                      Harita
                    </button>
                    <button onclick="window.sokakUI.openReportDetailModal('${r.id}')" class="py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition shadow-xs">
                      Detay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // 2. VETERİNERLER SEKME İÇERİĞİ
    else if (state.activeTab === 'vets') {
      container.innerHTML = state.vets.map(v => `
        <div class="bg-white/95 rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div class="flex items-start justify-between gap-2 mb-1">
            <span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full ${v.isOpen247 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}">
              ${v.isOpen247 ? '🚨 7/24 Nöbetçi' : (v.hours || 'Açık')}
            </span>
            <span class="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              ${v.badge || 'Klinik'}
            </span>
          </div>

          <h4 class="font-bold text-slate-900 text-xs mb-0.5">${v.name}</h4>
          <p class="text-[11px] text-slate-500 mb-2.5 flex items-center gap-1">
            ${v.distanceText ? `<span class="font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.2 rounded-md text-[10px] shrink-0">${v.distanceText}</span>` : ''}
            <span class="truncate">📍 ${v.address}</span>
          </p>

          <div class="grid grid-cols-3 gap-1">
            <a href="tel:${v.phone.replace(/\s+/g, '')}" class="py-1.5 px-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold text-center transition flex items-center justify-center gap-1">
              <span>📞</span> Ara
            </a>
            <button onclick="window.sokakUI.openNavigation(${v.lat}, ${v.lng})" class="py-1.5 px-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-[11px] font-bold text-center transition flex items-center justify-center gap-1">
              <span>🧭</span> Rota
            </button>
            <button onclick="window.sokakUI.focusItem(${v.lat}, ${v.lng})" class="py-1.5 px-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold text-center transition">
              Harita
            </button>
          </div>
        </div>
      `).join('');
    }

    // 3. MAMA VE DAYANIŞMA NOKTALARI
    else if (state.activeTab === 'points') {
      container.innerHTML = state.solidarityPoints.map(p => {
        const isPetshop = p.type === 'petshop';
        return `
          <div class="bg-white/95 rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${isPetshop ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}">
                ${isPetshop ? '🏪 Petshop Dayanışma' : '🥣 Mama/Su İstasyonu'}
              </span>
            </div>
            <h4 class="font-bold text-slate-900 text-xs mb-0.5">${p.name}</h4>
            <p class="text-[11px] text-blue-800 font-medium mb-1">✓ ${p.status}</p>
            <p class="text-[11px] text-slate-400 mb-2.5 flex items-center gap-1">
              ${p.distanceText ? `<span class="font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.2 rounded-md text-[10px] shrink-0">${p.distanceText}</span>` : ''}
              <span class="truncate">📍 ${p.address}</span>
            </p>
            <div class="grid grid-cols-2 gap-1.5">
              <button onclick="window.sokakUI.openNavigation(${p.lat}, ${p.lng})" class="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-[11px] font-bold text-center transition flex items-center justify-center gap-1">
                <span>🧭</span> Yol Tarifi
              </button>
              <button onclick="window.sokakUI.focusItem(${p.lat}, ${p.lng})" class="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold text-center transition">
                Haritada Gör
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  focusItem(lat, lng, reportId = null) {
    window.sokakMap.flyTo(lat, lng, 16);
    if (window.innerWidth < 768) {
      this.setSheetState('peek');
    }
  }

  // --- KAYITSIZ VAKA BİLDİRİM MODALI ---
  openNewReportModal() {
    const modal = document.getElementById('new-report-modal');
    if (modal) modal.classList.add('active');
  }

  closeNewReportModal() {
    const modal = document.getElementById('new-report-modal');
    if (modal) modal.classList.remove('active');
    this.selectedImageBase64 = null;
    const previewEl = document.getElementById('form-img-preview');
    if (previewEl) previewEl.classList.add('hidden');
  }

  selectFormAnimal(type) {
    this.selectedAnimalType = type;
    const btns = document.querySelectorAll('[data-form-animal]');
    btns.forEach(b => {
      if (b.getAttribute('data-form-animal') === type) {
        b.classList.add('ring-2', 'ring-blue-600', 'bg-blue-50');
      } else {
        b.classList.remove('ring-2', 'ring-blue-600', 'bg-blue-50');
      }
    });
  }

  selectFormUrgency(urgency) {
    this.selectedUrgency = urgency;
    const btns = document.querySelectorAll('[data-form-urgency]');
    btns.forEach(b => {
      if (b.getAttribute('data-form-urgency') === urgency) {
        b.classList.add('ring-2', 'ring-slate-900', 'font-extrabold');
      } else {
        b.classList.remove('ring-2', 'ring-slate-900', 'font-extrabold');
      }
    });
  }

  pickLocationOnMap() {
    this.closeNewReportModal();
    this.showToast('📍 Haritada vakanın bulunduğu noktaya dokunun');
    window.sokakMap.enablePickLocationMode((coords) => {
      this.showToast('✅ Konum seçildi!');
      window.sokakMap.disablePickLocationMode();
      this.openNewReportModal();
      const coordsInput = document.getElementById('form-coords-input');
      if (coordsInput) {
        coordsInput.value = `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;
      }
    });
  }

  getGPSLocation() {
    this.showToast('🛰️ Konumunuz alınıyor...');
    window.sokakMap.locateUser(
      (coords) => {
        this.showToast('✅ Konumunuz alındı! İlanlar mesafeye göre sıralandı.');
        window.sokakStore.setUserLocation(coords.lat, coords.lng);
        const coordsInput = document.getElementById('form-coords-input');
        if (coordsInput) {
          coordsInput.value = `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;
        }
      },
      (err) => {
        this.showToast(err, 'error');
      }
    );
  }

  submitReport(e) {
    e.preventDefault();

    const title = document.getElementById('form-title').value.trim();
    const locationName = document.getElementById('form-location-name').value.trim();
    const coordsStr = document.getElementById('form-coords-input').value.trim();
    const description = document.getElementById('form-description').value.trim();
    const instagram = document.getElementById('form-instagram').value.trim();
    const contactName = document.getElementById('form-contact-name').value.trim() || 'Pati Dostu';

    if (!title || !locationName) {
      this.showToast('Lütfen başlık ve konum alanlarını doldurun.', 'error');
      return;
    }

    let lat = 41.015 + (Math.random() - 0.5) * 0.03;
    let lng = 28.985 + (Math.random() - 0.5) * 0.03;

    if (coordsStr && coordsStr.includes(',')) {
      const parts = coordsStr.split(',');
      lat = parseFloat(parts[0]);
      lng = parseFloat(parts[1]);
    }

    const newReport = window.sokakStore.addReport({
      title,
      type: this.selectedAnimalType,
      urgency: this.selectedUrgency,
      locationName,
      lat,
      lng,
      description,
      instagram,
      contactName,
      image: this.selectedImageBase64
    });

    this.closeNewReportModal();
    document.getElementById('report-form').reset();
    this.showToast('🐾 Vaka başarıyla haritaya eklendi!');
    this.focusItem(lat, lng, newReport.id);
  }

  // --- VAKA DETAY VE DESTEK MODALI ---
  openReportDetailModal(reportId) {
    const report = window.sokakStore.getState().allReports.find(r => r.id === reportId);
    if (!report) return;

    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-modal-content');
    if (!modal || !content) return;

    const urgencyLabels = {
      critical: '🚨 Hayati Tehlike / Acil',
      transit: '🚗 Acil Nakil / Araç Lazım',
      injured: '🩹 Yaralı / Tedavi İhtiyacı',
      hungry: '🥣 Aç / Susuz',
      shelter: '🏠 Yuva Arayan Dost'
    };

    const isAdopted = report.status === 'adopted';
    const isArchived = report.status === 'archived';

    content.innerHTML = `
      <div class="relative h-48 w-full bg-slate-100">
        <img src="${report.image}" alt="${report.title}" class="w-full h-full object-cover" onerror="this.src='${window.sokakStore.getAnimalPlaceholder(report.type)}'"/>
        <button onclick="window.sokakUI.closeReportDetailModal()" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition">
          ✕
        </button>
        <div class="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span class="px-2.5 py-1 text-xs font-bold rounded-full bg-white/95 text-slate-900 shadow-md">
            ${isAdopted ? '🎉 Yuva Buldu' : urgencyLabels[report.urgency] || 'Yardım Çağrısı'}
          </span>
          ${isAdopted ? '<span class="px-2 py-0.5 text-[11px] font-extrabold bg-purple-600 text-white rounded-full shadow-md">Arşivde</span>' : ''}
        </div>
      </div>

      <div class="p-5">
        <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span>🕒 ${this.formatTimeAgo(report.createdAt)}</span>
          <span>👤 İlan Sahibi: ${report.contactName || 'Pati Dostu'}</span>
        </div>

        <h3 class="text-base font-extrabold text-slate-900 mb-1">${report.title}</h3>
        <p class="text-xs text-slate-500 mb-3 flex items-center gap-1">
          ${report.distanceText ? `<span class="font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.2 rounded-md text-[10px] shrink-0">${report.distanceText}</span>` : ''}
          <span class="truncate">📍 ${report.locationName}</span>
        </p>

        <p class="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3.5 leading-relaxed">
          ${report.description || 'Ek açıklama girilmedi.'}
        </p>

        <!-- GİZLİLİK ODAKLI İLETİŞİM ALANI -->
        <div class="mb-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <span>🔒 Güvenli İletişim</span>
            </span>
            <button type="button" onclick="window.sokakUI.openPolicyModal()" class="text-[10px] text-blue-600 hover:underline font-semibold flex items-center gap-0.5">
              <span>Gizlilik Politikamız</span> ↗
            </button>
          </div>

          ${report.instagram ? `
            <a href="https://instagram.com/${report.instagram}" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 px-3 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition">
              <span class="text-base">📸</span>
              <span>Instagram DM ile Ulaş (@${report.instagram})</span>
            </a>
          ` : `
            <div class="p-2 bg-white rounded-xl text-center text-xs text-slate-600 border border-slate-200">
              Bu ilana iletişim bilgisi bırakılmamış. Harita konumu üzerinden veya yorumlarla destek olabilirsiniz.
            </div>
          `}
        </div>

        <!-- Dayanışma Kayıtları -->
        <div class="mb-4">
          <h5 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Dayanışma & Süreç (${report.supports?.length || 0})</h5>
          <div class="space-y-1 max-h-24 overflow-y-auto">
            ${report.supports && report.supports.length > 0 ? report.supports.map(s => `
              <div class="text-xs text-blue-800 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100/60">
                ✓ ${s}
              </div>
            `).join('') : '<p class="text-xs text-slate-400 italic">Henüz bir eylem kaydı yok.</p>'}
          </div>
        </div>

        <!-- AKSİYON BUTONLARI -->
        <div class="space-y-2.5 pt-2 border-t border-slate-100">
          
          <!-- Hızlı İletişim & Navigasyon & Paylaşım Satırı -->
          <div class="grid grid-cols-2 gap-2">
            <button onclick="window.sokakUI.shareWhatsApp('${report.id}')" class="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm">
              <span class="text-sm">💬</span>
              <span>WhatsApp'ta Paylaş</span>
            </button>
            <button onclick="window.sokakUI.openNavigation(${report.lat}, ${report.lng})" class="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm">
              <span class="text-sm">🧭</span>
              <span>Yol Tarifi Al</span>
            </button>
          </div>

          <!-- Saha Dayanışması: Yoldayım & Mama Bıraktım -->
          ${!isAdopted && !isArchived ? `
            <div class="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span class="block text-[11px] font-bold text-slate-700 mb-1.5">🤝 Sahada mısınız? Durumu Bildirin:</span>
              <div class="grid grid-cols-2 gap-2">
                <button onclick="window.sokakUI.addSupport('${report.id}', '🚗 Kontrole gidiliyor / yolda')" class="py-2 px-2 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-indigo-950 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-2xs">
                  <span>🚗</span>
                  <span>Yoldayım / İlgileniyorum</span>
                </button>
                <button onclick="window.sokakUI.addSupport('${report.id}', '🥣 Mama ve su bırakıldı')" class="py-2 px-2 bg-white hover:bg-amber-50 hover:border-amber-300 text-amber-950 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-2xs">
                  <span>🥣</span>
                  <span>Mama Bıraktım</span>
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Sahiplendirme / Arşivleme Özel Butonu -->
          ${!isAdopted && !isArchived ? `
            <button onclick="window.sokakUI.markAdopted('${report.id}')" class="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs">
              <span>🎉</span>
              <span>Sahiplendirildi / Yuvaya Kavuştu (Arşive Kaldır)</span>
            </button>
          ` : `
            <div class="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-center text-xs text-purple-900 font-bold flex items-center justify-center gap-2">
              <span>🎉</span>
              <span>Bu can dostumuz sıcak bir yuvaya kavuştu! İlan arşivlendi.</span>
            </div>
          `}

        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  closeReportDetailModal() {
    const modal = document.getElementById('detail-modal');
    if (modal) modal.classList.remove('active');
  }

  openNavigation(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  }

  shareWhatsApp(reportId) {
    const report = window.sokakStore.getState().allReports.find(r => r.id === reportId);
    if (!report) return;

    const urgencyEmojis = {
      critical: '🚨 HAYATİ TEHLİKE',
      transit: '🚗 ACİL NAKİL LAZIM',
      injured: '🩹 YARALI CAN',
      hungry: '🥣 AÇ/SUSUZ',
      shelter: '🏠 YUVA ARANIYOR'
    };

    const text = `🐾 SokakDostum Acil Durum Çağrısı\n\n` +
      `Durum: ${urgencyEmojis[report.urgency] || 'Yardım Çağrısı'}\n` +
      `Başlık: ${report.title}\n` +
      `Konum: ${report.locationName}\n` +
      (report.description ? `Açıklama: ${report.description}\n` : '') +
      `\nHarita ve Detaylar: ${window.location.href}`;

    if (navigator.share) {
      navigator.share({
        title: 'SokakDostum - ' + report.title,
        text: text,
        url: window.location.href
      }).catch(() => {
        window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
      });
    } else {
      window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
    }
  }

  addSupport(reportId, text) {
    window.sokakStore.addSupportAction(reportId, text);
    this.showToast('🐾 Desteğiniz kaydedildi!');
    this.openReportDetailModal(reportId);
  }

  markAdopted(reportId) {
    window.sokakStore.markAdopted(reportId);
    this.showToast('🎉 Harika haber! Dostumuz sahiplendirildi ve arşive kaldırıldı.');
    this.openReportDetailModal(reportId);
  }

  // --- İLK YARDIM REHBERİ MODALI ---
  openFirstAidModal() {
    const modal = document.getElementById('firstaid-modal');
    const container = document.getElementById('firstaid-modal-content');
    if (!modal || !container) return;

    const { firstAidTips } = window.sokakStore.getState();

    container.innerHTML = firstAidTips.map(tip => `
      <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">${tip.icon}</span>
          <h4 class="font-extrabold text-slate-900 text-xs sm:text-sm">${tip.title}</h4>
        </div>
        <ul class="space-y-1 pl-1">
          ${tip.steps.map(s => `
            <li class="text-[11px] text-slate-600 flex items-start gap-1.5">
              <span class="text-blue-600 font-bold">•</span>
              <span>${s}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');

    modal.classList.add('active');
  }

  closeFirstAidModal() {
    const modal = document.getElementById('firstaid-modal');
    if (modal) modal.classList.remove('active');
  }

  // --- GİZLİLİK VE KULLANIM POLİTİKASI MODALI ---
  openPolicyModal() {
    const modal = document.getElementById('policy-modal');
    if (modal) modal.classList.add('active');
  }

  closePolicyModal() {
    const modal = document.getElementById('policy-modal');
    if (modal) modal.classList.remove('active');
  }

  // --- TOAST BİLDİRİMİ ---
  showToast(message, type = 'info') {
    const toast = document.getElementById('toast-notification');
    const textEl = document.getElementById('toast-text');
    if (!toast || !textEl) return;

    textEl.textContent = message;
    toast.className = `fixed top-18 right-1/2 translate-x-1/2 z-50 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold transition-all duration-300 ${type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900/90 backdrop-blur-md text-white'}`;
    toast.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
      toast.classList.remove('opacity-100', 'translate-y-0');
    }, 3200);
  }

  formatTimeAgo(dateStr) {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 2) return 'Az önce';
      if (mins < 60) return `${mins} dk önce`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} saat önce`;
      return `${Math.floor(hours / 24)} gün önce`;
    } catch (e) {
      return 'Yeni';
    }
  }
}

window.sokakUI = new SokakDostumUI();
