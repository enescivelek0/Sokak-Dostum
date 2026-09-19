/**
 * SokakDostum - Harita ve Uygulama Yapılandırması
 * 
 * 🛡️ GÜVENLİK NOTU:
 * Mapbox Public Token ('pk.eyJ...' ile başlayan), tarayıcıda çalışmak üzere tasarlanmış genel bir anahtardır.
 * Başkalarının bu anahtarı kendi sitelerinde kullanmasını engellemek için Mapbox paneli üzerinden
 * 'URL Restriction' (İzin Verilen Siteler) alanına:
 *   - https://enescivelek0.github.io/*
 *   - http://localhost:*
 * adreslerini eklemeniz yeterlidir.
 */

const APP_CONFIG = {
  // Mapbox hesabınızdan aldığınız Public Token'ı buraya yapıştırabilirsiniz.
  // Boş bırakılırsa sistem otomatik olarak kesintisiz ücretsiz açık kaynak haritayı kullanır.
  MAPBOX_TOKEN: '',

  // Varsayılan Harita Stili: 'streets' | 'satellite' | 'dark'
  DEFAULT_MAP_STYLE: 'streets',

  // Harita Katman URL Tanımları
  TILE_PROVIDERS: {
    // Mapbox Stilleri (Token varsa aktifleşir)
    mapboxStreets: (token) => `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${token}`,
    mapboxSatellite: (token) => `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${token}`,
    mapboxDark: (token) => `https://api.mapbox.com/styles/v1/mapbox/navigation-night-v1/tiles/{z}/{x}/{y}?access_token=${token}`,

    // Ücretsiz Açık Kaynak Yedek Katmanlar (Token olmasa da çalışan yedekler)
    osmStreets: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    esriSatellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    cartoDark: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
  }
};

window.APP_CONFIG = APP_CONFIG;
