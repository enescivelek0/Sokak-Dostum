/**
 * SokakDostum - Store (Single Source of Truth - SSOT)
 * Veri yönetimi, yerel depolama, gizlilik ve arşivleme altyapısı
 */

const STORAGE_KEY_REPORTS = 'sokakdostum_reports_v4';

function createAnimalSVG(type) {
  let icon = '🐾';
  let bg = '#e2e8f0';
  if (type === 'kedi') { icon = '🐱'; bg = '#e0e7ff'; }
  else if (type === 'kopek') { icon = '🐶'; bg = '#fef3c7'; }
  else if (type === 'kus') { icon = '🕊️'; bg = '#e0f2fe'; }
  else if (type === 'diger') { icon = '🦔'; bg = '#f3e8ff'; }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="${bg}"/>
    <circle cx="200" cy="150" r="75" fill="white" opacity="0.95" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.06))"/>
    <text x="50%" y="54%" font-size="70" dominant-baseline="middle" text-anchor="middle">${icon}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const INITIAL_REPORTS = [
  {
    id: 'rep-1',
    title: 'Araba çarpmış yavru kedi - Acil nakil lazım',
    type: 'kedi',
    urgency: 'critical',
    lat: 41.0255,
    lng: 28.9742,
    locationName: 'Beyoğlu, İstiklal Cd.',
    description: 'Arka bacağında kırık şüphesi var. Bir kutunun içine aldık, acil kliniğe nakil desteği aranıyor.',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    instagram: 'beyoglupatileri',
    contactName: 'Ahmet',
    status: 'active', // active, in_progress, adopted, archived
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    supportCount: 3,
    supports: ['Geçici korumaya alındı', 'Klinik aranıyor']
  },
  {
    id: 'rep-2',
    title: 'Terkedilmiş golden kırması köpek - Yuva Aranıyor',
    type: 'kopek',
    urgency: 'shelter',
    lat: 40.9882,
    lng: 29.0255,
    locationName: 'Kadıköy, Moda Sahil Parkı',
    description: 'Kırmızı tasması var, çok uysal ve insan canlısı. Yağmurda sığınacak sıcak bir yuva arıyor.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80',
    instagram: 'modacanlari',
    contactName: 'Selin',
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    supportCount: 5,
    supports: ['Mama verildi', 'İlan paylaşıldı']
  },
  {
    id: 'rep-3',
    title: 'Kanadı kırık güvercin',
    type: 'kus',
    urgency: 'injured',
    lat: 41.0112,
    lng: 28.9818,
    locationName: 'Fatih, Sultanahmet',
    description: 'Uçamıyor, karton kutuda korumada. Kanat cerrahisinden anlayan bir hekime götürülmesi gerek.',
    image: 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=600&auto=format&fit=crop&q=80',
    instagram: 'fatih_kus_destek',
    contactName: 'Burak',
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    supportCount: 2,
    supports: ['Kutuya alındı']
  },
  {
    id: 'rep-4',
    title: '5 yavru ve anne kedi mama bekliyor',
    type: 'kedi',
    urgency: 'hungry',
    lat: 41.0601,
    lng: 28.9950,
    locationName: 'Şişli, Mecidiyeköy',
    description: 'Kuru ve yaş mama desteği lazım. Su kabı bırakıldı ama anne çok zayıf kalmış.',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&auto=format&fit=crop&q=80',
    instagram: 'sisli_besleme',
    contactName: 'Murat',
    status: 'active',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    supportCount: 4,
    supports: ['Mama bırakıldı']
  },
  {
    id: 'rep-5',
    title: 'Pamuk Kedi Sıcak Yuvasına Kavuştu 🎉',
    type: 'kedi',
    urgency: 'shelter',
    lat: 41.0421,
    lng: 29.0080,
    locationName: 'Beşiktaş, Akaretler',
    description: 'Soğuk kış gününde bulunan tekir yavrumuz sevgi dolu bir aileye sahiplendirildi.',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    instagram: 'besiktas_pati_ailesi',
    contactName: 'Zeynep',
    status: 'adopted',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    supportCount: 6,
    supports: ['Geçici yuva sağlandı', 'Sahiplendirildi 🎉']
  },
  {
    id: 'rep-6',
    title: 'Acil araç desteği lazım - Kliniğe nakil edilecek',
    type: 'kedi',
    urgency: 'transit',
    lat: 41.0360,
    lng: 28.9870,
    locationName: 'Beyoğlu, Taksim Gezi Parkı civarı',
    description: 'Araba motorundan yavru kedi çıkarıldı. En yakın kliniğe acil araçla götürülmesi gerek, taşıma kutusu mevcut.',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80',
    instagram: 'taksim_patileri',
    contactName: 'Can',
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    supportCount: 2,
    supports: ['Kedi güvene alındı, araç bekleniyor']
  }
];

const VETERINARIANS = [
  {
    id: 'vet-1',
    name: 'Pati 7/24 Acil Hayvan Hastanesi',
    address: 'Moda Cad. No:114, Kadıköy',
    phone: '0216 330 00 11',
    isOpen247: true,
    lat: 40.9840,
    lng: 29.0270,
    badge: 'Ambulans Servisi'
  },
  {
    id: 'vet-2',
    name: 'Cihangir Nöbetçi Veteriner Kliniği',
    address: 'Sıraselviler Cad. No:45, Beyoğlu',
    phone: '0212 244 55 66',
    isOpen247: true,
    lat: 41.0335,
    lng: 28.9835,
    badge: 'Yoğun Bakım Ünitesi'
  },
  {
    id: 'vet-3',
    name: 'Beşiktaş Dostlar Veteriner Kliniği',
    address: 'Şair Nedim Cad. No:28, Beşiktaş',
    phone: '0212 260 12 34',
    isOpen247: false,
    hours: '09:00 - 22:00',
    lat: 41.0445,
    lng: 29.0040,
    badge: 'Sokak Hayvanı İndirimi'
  },
  {
    id: 'vet-4',
    name: 'Şişli Hayat Veteriner Tıp Merkezi',
    address: 'Halaskargazi Cad. No:92, Şişli',
    phone: '0212 231 99 88',
    isOpen247: true,
    lat: 41.0550,
    lng: 28.9880,
    badge: 'Cerrahi Acil Servis'
  }
];

const SOLIDARITY_POINTS = [
  {
    id: 'point-1',
    name: 'Kadıköy Sahil Mama Odağı',
    type: 'mama_noktasi',
    address: 'Moda İskelesi yanı, Kadıköy',
    lat: 40.9805,
    lng: 29.0245,
    status: 'Dolu (Bugün 08:30)'
  },
  {
    id: 'point-2',
    name: 'Dost Pati Petshop & Dayanışma',
    type: 'petshop',
    address: 'Bahariye Cad. No:60, Kadıköy',
    phone: '0216 414 20 20',
    lat: 40.9902,
    lng: 29.0310,
    status: 'Askıda Mama & Taşıma Kutusu'
  },
  {
    id: 'point-3',
    name: 'Gezi Parkı Mama & Kuş Su Noktası',
    type: 'mama_noktasi',
    address: 'Taksim Gezi Parkı, Beyoğlu',
    lat: 41.0375,
    lng: 28.9870,
    status: 'Gönüllülerce Kontrol Edildi'
  },
  {
    id: 'point-4',
    name: 'Yıldız Parkı Yaşam Noktası',
    type: 'mama_noktasi',
    address: 'Yıldız Parkı İçi, Beşiktaş',
    lat: 41.0490,
    lng: 29.0150,
    status: 'Mama Takviyesi Yapıldı'
  }
];

const FIRST_AID_TIPS = [
  {
    id: 'aid-1',
    title: 'Trafik Kazası & Travma',
    severity: 'critical',
    icon: '🚨',
    steps: [
      'Öncelikle kendi güvenliğinizi alın ve trafiği yavaşlatın.',
      'Omurga hasarı riskine karşı hayvanı bacaklarından asılarak taşımayın; düz sert bir karton veya mont üzerinde kaldırın.',
      'Kanama varsa temiz bir bez ile baskı (tampon) yapın, turnike bağlamayın.',
      'Hemen en yakın nöbetçi kliniği arayın.'
    ]
  },
  {
    id: 'aid-2',
    title: 'Zehirlenme Şüphesi',
    severity: 'critical',
    icon: '☠️',
    steps: [
      'Belirtiler: Ağızdan köpük, titreme, nöbet, aşırı salya.',
      'Asla süt veya yoğurt içirmeye ÇALIŞMAYIN; akciğere kaçıp boğabilir.',
      'Kusturmaya çalışmayın (yakıcı madde yemek borusunu yakabilir).',
      'Hayvanı sıcak tutup derhal kliniğe ulaştırın.'
    ]
  },
  {
    id: 'aid-3',
    title: 'Yaralı veya Düşmüş Kuş',
    severity: 'moderate',
    icon: '🕊️',
    steps: [
      'Karanlık ve hava delikli bir ayakkabı kutusuna alın (karanlık şoku önler).',
      'Gagasına zorla su akıtmayın, boğulabilir.',
      'Kutu tabanına yumuşak bez serin ve kliniğe nakledin.'
    ]
  },
  {
    id: 'aid-4',
    title: 'Sıcak Çarpması',
    severity: 'moderate',
    icon: '☀️',
    steps: [
      'Buzlu su dökmeyin (şoka sokar).',
      'Ilık/serin ıslak bezle pati altlarını ve göbeğini ıslatın.',
      'Gölgeye alın ve azar azar su teklif edin.'
    ]
  }
];

class SokakDostumStore {
  constructor() {
    this.reports = [];
    this.vets = VETERINARIANS;
    this.solidarityPoints = SOLIDARITY_POINTS;
    this.firstAidTips = FIRST_AID_TIPS;
    this.subscribers = [];
    this.userLocation = null; // { lat, lng }
    
    // Filtreleme durumu
    this.activeTab = 'reports'; // 'reports' | 'vets' | 'points'
    this.viewArchive = false; // false: Yalnızca aktif vakalar, true: Sahiplendirilenler & Arşiv
    this.activeUrgency = 'all';
    this.activeAnimal = 'all';
    this.searchQuery = '';
    this.selectedLocationForReport = null;

    this.init();
  }

  init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (saved) {
        this.reports = JSON.parse(saved);
      } else {
        this.reports = [...INITIAL_REPORTS];
        this.persistReports();
      }
    } catch (e) {
      this.reports = [...INITIAL_REPORTS];
    }
  }

  persistReports() {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(this.reports));
    } catch (e) {
      console.warn('LocalStorage hatası:', e);
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.getState()));
  }

  setUserLocation(lat, lng) {
    this.userLocation = { lat: parseFloat(lat), lng: parseFloat(lng) };
    this.notify();
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
    const R = 6371; // Dünya yarıçapı (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  formatDistance(distKm) {
    if (distKm == null || isNaN(distKm)) return '';
    if (distKm < 1) {
      return `${Math.round(distKm * 1000)} m`;
    }
    return `${distKm.toFixed(1)} km`;
  }

  getState() {
    const activeReports = this.reports.filter(r => r.status === 'active' || r.status === 'in_progress');
    const adoptedReports = this.reports.filter(r => r.status === 'adopted' || r.status === 'archived');

    return {
      activeTab: this.activeTab,
      viewArchive: this.viewArchive,
      activeUrgency: this.activeUrgency,
      activeAnimal: this.activeAnimal,
      searchQuery: this.searchQuery,
      userLocation: this.userLocation,
      reports: this.getFilteredReports(),
      allReports: this.reports,
      vets: this.getFilteredVets(),
      solidarityPoints: this.getFilteredPoints(),
      firstAidTips: this.firstAidTips,
      criticalAlert: this.getCriticalAlert(),
      stats: {
        activeCount: activeReports.length,
        adoptedCount: adoptedReports.length,
        criticalCount: activeReports.filter(r => r.urgency === 'critical').length,
        activeVets: this.vets.length,
        totalPoints: this.solidarityPoints.length
      }
    };
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.notify();
  }

  setViewArchive(showArchive) {
    this.viewArchive = showArchive;
    this.notify();
  }

  setFilters({ urgency, animal, query }) {
    if (urgency !== undefined) this.activeUrgency = urgency;
    if (animal !== undefined) this.activeAnimal = animal;
    if (query !== undefined) this.searchQuery = query;
    this.notify();
  }

  setSelectedLocation(latlng) {
    this.selectedLocationForReport = latlng;
    this.notify();
  }

  getCriticalAlert() {
    return this.reports.find(r => r.urgency === 'critical' && r.status === 'active') || null;
  }

  getFilteredReports() {
    let list = this.reports.filter(r => {
      // Arşiv vs Aktif görünüm
      const isArchivedOrAdopted = r.status === 'adopted' || r.status === 'archived';
      if (this.viewArchive) {
        if (!isArchivedOrAdopted) return false;
      } else {
        if (isArchivedOrAdopted) return false;
      }

      if (this.activeUrgency !== 'all' && r.urgency !== this.activeUrgency) return false;
      if (this.activeAnimal !== 'all' && r.type !== this.activeAnimal) return false;

      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase().trim();
        const inTitle = r.title.toLowerCase().includes(q);
        const inLoc = r.locationName.toLowerCase().includes(q);
        const inDesc = r.description.toLowerCase().includes(q);
        const inInsta = (r.instagram || '').toLowerCase().includes(q);
        if (!inTitle && !inLoc && !inDesc && !inInsta) return false;
      }
      return true;
    });

    if (this.userLocation) {
      list = list.map(r => {
        const d = this.calculateDistance(this.userLocation.lat, this.userLocation.lng, r.lat, r.lng);
        return {
          ...r,
          distanceKm: d,
          distanceText: this.formatDistance(d)
        };
      });
      list.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
    }

    return list;
  }

  getFilteredVets() {
    let list = this.vets;
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(v => v.name.toLowerCase().includes(q) || v.address.toLowerCase().includes(q));
    }

    if (this.userLocation) {
      list = list.map(v => {
        const d = this.calculateDistance(this.userLocation.lat, this.userLocation.lng, v.lat, v.lng);
        return {
          ...v,
          distanceKm: d,
          distanceText: this.formatDistance(d)
        };
      });
      list.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
    }

    return list;
  }

  getFilteredPoints() {
    let list = this.solidarityPoints;
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q));
    }

    if (this.userLocation) {
      list = list.map(p => {
        const d = this.calculateDistance(this.userLocation.lat, this.userLocation.lng, p.lat, p.lng);
        return {
          ...p,
          distanceKm: d,
          distanceText: this.formatDistance(d)
        };
      });
      list.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
    }

    return list;
  }

  addReport(data) {
    const fallbackImg = createAnimalSVG(data.type);
    
    // Instagram kullanıcı adı temizleme (@ işaretini ayıkla)
    let cleanInstagram = (data.instagram || '').trim();
    if (cleanInstagram.startsWith('@')) {
      cleanInstagram = cleanInstagram.substring(1);
    }

    const newReport = {
      id: 'rep-' + Date.now(),
      title: data.title || 'İsimsiz Yardım Çağrısı',
      type: data.type || 'kedi',
      urgency: data.urgency || 'hungry',
      lat: parseFloat(data.lat) || 41.015,
      lng: parseFloat(data.lng) || 28.98,
      locationName: data.locationName || 'Konum belirtilmedi',
      description: data.description || '',
      image: data.image || fallbackImg,
      instagram: cleanInstagram || null,
      contactName: data.contactName || 'Pati Dostu',
      status: 'active',
      createdAt: new Date().toISOString(),
      supportCount: 0,
      supports: []
    };

    this.reports.unshift(newReport);
    this.persistReports();
    this.notify();
    return newReport;
  }

  addSupportAction(reportId, actionText) {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      if (!report.supports) report.supports = [];
      report.supports.unshift(actionText);
      report.supportCount = (report.supportCount || 0) + 1;
      if (report.status === 'active' && actionText.includes('Klinik')) {
        report.status = 'in_progress';
      }
      this.persistReports();
      this.notify();
    }
  }

  // Sahiplendirme ve Arşive Taşıma
  markAdopted(reportId) {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      report.status = 'adopted';
      if (!report.supports) report.supports = [];
      report.supports.unshift('Tebrikler! Sahiplendirildi ve sıcak bir yuvaya kavuştu 🎉');
      this.persistReports();
      this.notify();
    }
  }

  archiveReport(reportId) {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      report.status = 'archived';
      if (!report.supports) report.supports = [];
      report.supports.unshift('İlan arşive kaldırıldı.');
      this.persistReports();
      this.notify();
    }
  }

  reopenReport(reportId) {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      report.status = 'active';
      this.persistReports();
      this.notify();
    }
  }

  getAnimalPlaceholder(type) {
    return createAnimalSVG(type);
  }
}

window.sokakStore = new SokakDostumStore();
