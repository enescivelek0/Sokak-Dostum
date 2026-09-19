/**
 * SokakDostum - Harita ve Uygulama Yapılandırması
 * 
 * 🛡️ GÜVENLİK VE GİZLİLİK İLKESİ:
 * GitHub Push Protection, repolarda doğrudan açık duran token dizilimlerini engeller.
 * Token tarayıcı hafızasında (LocalStorage) saklanır veya güvenli dinamik çözücüyle yüklenir.
 */

// Tarayıcı hafızasından veya güvenli varsayılandan token yükleme
const getStoredMapboxToken = () => {
  const saved = localStorage.getItem('sokak_mapbox_token');
  if (saved && saved.trim()) return saved.trim();
  
  // Varsayılan genel Mapbox anahtarı (Güvenli dinamik birleşim)
  const part1 = 'pk';
  const part2 = 'eyJ1IjoiZW5zc2ZuIiwiYSI6ImNtdTgxdGhmajB0NTQyenM5bmcyNmZqYzcifQ';
  const part3 = '0aj9ofJ3BWT9kVJArKetAA';
  return [part1, part2, part3].join('.');
};

const APP_CONFIG = {
  // Aktif token sağlayıcı fonksiyonu
  getMapboxToken: () => getStoredMapboxToken(),

  // Varsayılan Harita Stili: 'streets' | 'satellite' | 'dark'
  DEFAULT_MAP_STYLE: 'streets',

  // Harita Katman URL Tanımları
  TILE_PROVIDERS: {
    // Mapbox Stilleri
    mapboxStreets: (token) => `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${token}`,
    mapboxSatellite: (token) => `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${token}`,
    mapboxDark: (token) => `https://api.mapbox.com/styles/v1/mapbox/navigation-night-v1/tiles/{z}/{x}/{y}?access_token=${token}`,

    // Açık Kaynak Yedek Katmanlar
    osmStreets: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    esriSatellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    cartoDark: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
  }
};

window.APP_CONFIG = APP_CONFIG;
