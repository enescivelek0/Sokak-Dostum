/**
 * SokakDostum - Leaflet & Mapbox Harita Kontrolörü
 * Tam ekran interaktif harita, çoklu katman (Sokak, Uydu, Gece), özel pinler ve reaktif senkronizasyon
 */

class SokakDostumMap {
  constructor(containerId = 'map-container') {
    this.containerId = containerId;
    this.map = null;
    this.currentTileLayer = null;
    this.currentStyle = 'streets'; // 'streets' | 'satellite' | 'dark'
    this.markers = [];
    this.pickMarker = null;
    this.isPickMode = false;
    this.onLocationPicked = null;
  }

  init() {
    const el = document.getElementById(this.containerId);
    if (!el) return;

    // Harita oluşturma
    this.map = L.map(this.containerId, {
      zoomControl: false,
      attributionControl: false
    }).setView([41.015, 28.99], 13);

    // Zoom kontrolü sağ üst köşeye
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // İlk katmanı yükle (Mapbox veya Açık Kaynak Yedek)
    const initialStyle = (window.APP_CONFIG && window.APP_CONFIG.DEFAULT_MAP_STYLE) || 'streets';
    this.setMapStyle(initialStyle);

    // Harita tıklama dinleyicisi
    this.map.on('click', (e) => {
      if (this.isPickMode) {
        this.handlePickedCoordinate(e.latlng.lat, e.latlng.lng);
      }
    });

    // İlk markerları çiz
    this.renderMarkers();

    // Store değişikliklerinde markerları güncelle
    window.sokakStore.subscribe(() => {
      this.renderMarkers();
    });

    // Pencere boyutu değiştiğinde haritayı yenile
    window.addEventListener('resize', () => {
      if (this.map) this.map.invalidateSize();
    });
  }

  setMapStyle(styleName) {
    this.currentStyle = styleName;
    const config = window.APP_CONFIG || {};
    const token = (typeof config.getMapboxToken === 'function' ? config.getMapboxToken() : (config.MAPBOX_TOKEN || '')).trim();
    const providers = config.TILE_PROVIDERS || {};

    let tileUrl = '';
    let maxZoom = 19;
    let subdomains = 'abc';
    let isMapbox = false;

    // Mapbox Token tanımlıysa Mapbox Vektörel Katmanları Kullan
    if (token && token.startsWith('pk.')) {
      isMapbox = true;
      if (styleName === 'satellite') {
        tileUrl = providers.mapboxSatellite ? providers.mapboxSatellite(token) : '';
      } else if (styleName === 'dark') {
        tileUrl = providers.mapboxDark ? providers.mapboxDark(token) : '';
      } else {
        tileUrl = providers.mapboxStreets ? providers.mapboxStreets(token) : '';
      }
    } else {
      // Token yoksa veya geçersizse Kesintisiz Açık Kaynak Yedekler
      if (styleName === 'satellite') {
        tileUrl = providers.esriSatellite || 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      } else if (styleName === 'dark') {
        tileUrl = providers.cartoDark || 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png';
        subdomains = 'abcd';
      } else {
        tileUrl = providers.osmStreets || 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        subdomains = 'abcd';
      }
    }

    // Eski katmanı kaldır
    if (this.currentTileLayer) {
      this.map.removeLayer(this.currentTileLayer);
    }

    // Yeni katmanı ekle (Mapbox 512px retina desteği ile)
    this.currentTileLayer = L.tileLayer(tileUrl, {
      maxZoom: maxZoom,
      subdomains: subdomains,
      tileSize: isMapbox ? 512 : 256,
      zoomOffset: isMapbox ? -1 : 0
    }).addTo(this.map);

    // UI butonlarının aktiflik durumunu güncelle
    this.updateStyleButtonsUI(styleName);
  }

  updateStyleButtonsUI(activeStyle) {
    const btns = document.querySelectorAll('[data-map-layer]');
    btns.forEach(b => {
      if (b.getAttribute('data-map-layer') === activeStyle) {
        b.classList.add('bg-blue-600', 'text-white', 'shadow-xs');
        b.classList.remove('bg-white/90', 'text-slate-700');
      } else {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-xs');
        b.classList.add('bg-white/90', 'text-slate-700');
      }
    });
  }

  renderMarkers() {
    if (!this.map) return;

    // Önceki markerları kaldır
    this.markers.forEach(m => this.map.removeLayer(m.marker));
    this.markers = [];

    const state = window.sokakStore.getState();

    // 1. Vaka Markerları
    if (state.activeTab === 'reports' || state.activeTab === 'all') {
      state.reports.forEach(report => {
        const marker = this.createReportMarker(report);
        marker.addTo(this.map);
        this.markers.push({ id: report.id, type: 'report', marker });
      });
    }

    // 2. Veteriner Markerları
    if (state.activeTab === 'vets' || state.activeTab === 'all') {
      state.vets.forEach(vet => {
        const marker = this.createVetMarker(vet);
        marker.addTo(this.map);
        this.markers.push({ id: vet.id, type: 'vet', marker });
      });
    }

    // 3. Dayanışma & Mama Noktaları
    if (state.activeTab === 'points' || state.activeTab === 'all') {
      state.solidarityPoints.forEach(point => {
        const marker = this.createPointMarker(point);
        marker.addTo(this.map);
        this.markers.push({ id: point.id, type: 'point', marker });
      });
    }
  }

  createReportMarker(report) {
    let pinColor = 'bg-amber-500';
    let pulseClass = '';
    let icon = '🥣';

    if (report.urgency === 'critical') {
      pinColor = 'bg-red-500';
      pulseClass = 'pin-pulse-critical';
      icon = '🚨';
    } else if (report.urgency === 'transit') {
      pinColor = 'bg-indigo-600';
      icon = '🚗';
    } else if (report.urgency === 'injured') {
      pinColor = 'bg-orange-500';
      icon = '🩹';
    } else if (report.urgency === 'shelter') {
      pinColor = 'bg-blue-500';
      icon = '🏠';
    }

    if (report.status === 'adopted') {
      pinColor = 'bg-purple-600';
      pulseClass = '';
      icon = '🎉';
    } else if (report.status === 'archived' || report.status === 'resolved') {
      pinColor = 'bg-slate-400';
      pulseClass = '';
      icon = '✓';
    }

    let popupBadge = '🥣 Mama';
    if (report.status === 'adopted') popupBadge = '🎉 Yuva Buldu';
    else if (report.urgency === 'critical') popupBadge = '🚨 Hayati';
    else if (report.urgency === 'transit') popupBadge = '🚗 Araç Lazım';
    else if (report.urgency === 'injured') popupBadge = '🩹 Yaralı';
    else if (report.urgency === 'shelter') popupBadge = '🏠 Yuva';

    const pinIcon = L.divIcon({
      className: 'custom-pin',
      html: `<div class="pin-bubble ${pinColor} ${pulseClass} text-white">${icon}</div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const marker = L.marker([report.lat, report.lng], { icon: pinIcon });

    const popupHtml = `
      <div class="overflow-hidden font-sans">
        <div class="relative h-28 w-full bg-slate-100">
          <img src="${report.image}" alt="${report.title}" class="w-full h-full object-cover" onerror="this.src='${window.sokakStore.getAnimalPlaceholder(report.type)}'"/>
          <div class="absolute top-2 left-2">
            <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/95 text-slate-800 shadow-sm">
              ${popupBadge}
            </span>
          </div>
        </div>
        <div class="p-3">
          <h4 class="font-bold text-slate-900 text-xs line-clamp-1 mb-1">${report.title}</h4>
          <p class="text-[11px] text-slate-500 line-clamp-2 mb-2.5">${report.description}</p>
          <div class="flex items-center gap-1.5 pt-2 border-t border-slate-100">
            <button onclick="window.sokakUI.openReportDetailModal('${report.id}')" class="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition text-center shadow-xs">
              İncele & Destek
            </button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${report.lat},${report.lng}" target="_blank" rel="noopener noreferrer" class="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition text-center">
              Yol Tarifi
            </a>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml, { maxWidth: 280 });
    return marker;
  }

  createVetMarker(vet) {
    const pinIcon = L.divIcon({
      className: 'custom-pin',
      html: `<div class="pin-bubble bg-blue-600 text-white font-black text-sm">🏥</div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const marker = L.marker([vet.lat, vet.lng], { icon: pinIcon });

    const popupHtml = `
      <div class="p-3.5 font-sans">
        <div class="flex items-center justify-between gap-1 mb-1">
          <span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full ${vet.isOpen247 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}">
            ${vet.isOpen247 ? '7/24 Nöbetçi' : (vet.hours || 'Açık')}
          </span>
          <span class="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">${vet.badge || 'Klinik'}</span>
        </div>
        <h4 class="font-bold text-slate-900 text-sm mb-1">${vet.name}</h4>
        <p class="text-[11px] text-slate-500 mb-3">${vet.address}</p>
        <div class="grid grid-cols-2 gap-1.5">
          <a href="tel:${vet.phone.replace(/\s+/g, '')}" class="py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold text-center transition">
            📞 Kliniği Ara
          </a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${vet.lat},${vet.lng}" target="_blank" rel="noopener noreferrer" class="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold text-center transition">
            🧭 Yol Tarifi
          </a>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml, { maxWidth: 280 });
    return marker;
  }

  createPointMarker(point) {
    const isPetshop = point.type === 'petshop';
    const pinIcon = L.divIcon({
      className: 'custom-pin',
      html: `<div class="pin-bubble ${isPetshop ? 'bg-purple-600' : 'bg-amber-600'} text-white text-sm">${isPetshop ? '🏪' : '🥣'}</div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const marker = L.marker([point.lat, point.lng], { icon: pinIcon });

    const popupHtml = `
      <div class="p-3 font-sans">
        <span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${isPetshop ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-800'} mb-1 inline-block">
          ${isPetshop ? 'Petshop Dayanışma' : 'Mama / Su İstasyonu'}
        </span>
        <h4 class="font-bold text-slate-900 text-xs mb-1">${point.name}</h4>
        <p class="text-[11px] text-slate-700 font-medium mb-1">✓ ${point.status}</p>
        <p class="text-[10px] text-slate-400 mb-2.5">${point.address}</p>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}" target="_blank" rel="noopener noreferrer" class="block w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold text-center transition">
          🧭 Rota Al
        </a>
      </div>
    `;

    marker.bindPopup(popupHtml, { maxWidth: 260 });
    return marker;
  }

  flyTo(lat, lng, zoom = 15) {
    if (!this.map) return;
    this.map.flyTo([lat, lng], zoom, {
      animate: true,
      duration: 1
    });

    setTimeout(() => {
      const found = this.markers.find(m => {
        const pos = m.marker.getLatLng();
        return Math.abs(pos.lat - lat) < 0.0005 && Math.abs(pos.lng - lng) < 0.0005;
      });
      if (found) found.marker.openPopup();
    }, 1050);
  }

  enablePickLocationMode(callback) {
    this.isPickMode = true;
    this.onLocationPicked = callback;
    const el = document.getElementById(this.containerId);
    if (el) el.classList.add('map-crosshair');
  }

  disablePickLocationMode() {
    this.isPickMode = false;
    const el = document.getElementById(this.containerId);
    if (el) el.classList.remove('map-crosshair');
    if (this.pickMarker) {
      this.map.removeLayer(this.pickMarker);
      this.pickMarker = null;
    }
  }

  handlePickedCoordinate(lat, lng) {
    if (this.pickMarker) {
      this.map.removeLayer(this.pickMarker);
    }

    const pinIcon = L.divIcon({
      className: 'custom-pin',
      html: `<div class="pin-bubble bg-blue-600 text-white font-bold text-base shadow-lg animate-bounce">📍</div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 38]
    });

    this.pickMarker = L.marker([lat, lng], { icon: pinIcon }).addTo(this.map);
    window.sokakStore.setSelectedLocation({ lat, lng });

    if (this.onLocationPicked) {
      this.onLocationPicked({ lat, lng });
    }
  }

  locateUser(onSuccess, onError) {
    if (!navigator.geolocation) {
      if (onError) onError('Tarayıcınız konum servisini desteklemiyor.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        this.flyTo(latitude, longitude, 15);

        const myPin = L.divIcon({
          className: 'custom-pin',
          html: `<div class="pin-bubble bg-indigo-600 text-white shadow-lg animate-pulse text-xs font-black">BEN</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        L.marker([latitude, longitude], { icon: myPin })
          .addTo(this.map)
          .bindPopup('<b class="text-xs p-1 block">Şu An Buradasınız</b>')
          .openPopup();

        if (onSuccess) onSuccess({ lat: latitude, lng: longitude });
      },
      (err) => {
        if (onError) onError('Konum alınamadı. Lütfen konum iznini kontrol edin.');
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  }
}

window.sokakMap = new SokakDostumMap();
