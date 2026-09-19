/**
 * SokakDostum - Store (Single Source of Truth - SSOT)
 * Veri yönetimi, yerel depolama, gizlilik ve arşivleme altyapısı
 */

const STORAGE_KEY_REPORTS = 'sokakdostum_reports_v10';

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
  // 1. BEYOĞLU
  {
    id: 'rep-1',
    title: 'Araba çarpmış yavru kedi - Acil nakil lazım',
    type: 'kedi',
    urgency: 'critical',
    lat: 41.0345,
    lng: 28.9785,
    locationName: 'Beyoğlu, İstiklal Cd.',
    description: 'Arka bacağında kırık şüphesi var. Bir kutunun içine aldık, acil kliniğe nakil desteği aranıyor.',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    instagram: 'beyoglupatileri',
    contactName: 'Ahmet',
    status: 'active',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    supportCount: 3,
    supports: ['Geçici korumaya alındı', 'Klinik aranıyor']
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
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    supportCount: 2,
    supports: ['Kedi güvene alındı, araç bekleniyor']
  },
  {
    id: 'rep-12',
    title: 'Terkedilmiş yaşlı kedi için koruyucu yuva aranıyor',
    type: 'kedi',
    urgency: 'shelter',
    lat: 41.0315,
    lng: 28.9822,
    locationName: 'Beyoğlu, Cihangir Sanatkarlar Parkı',
    description: 'Çok sevecen, kısırlaştırılmış yaşlı ev kedisi parka bırakılmış. Sokakta yapamıyor, acil geçici veya kalıcı yuva lazım.',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&auto=format&fit=crop&q=80',
    instagram: 'cihangirkedileri',
    contactName: 'Deniz',
    status: 'active',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    supportCount: 4,
    supports: ['Veteriner kontrolü yapıldı', 'İlan paylaşıldı']
  },

  // 2. KADIKÖY
  {
    id: 'rep-2',
    title: 'Terkedilmiş golden kırması köpek - Yuva Aranıyor',
    type: 'kopek',
    urgency: 'shelter',
    lat: 40.9850,
    lng: 29.0315,
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
    id: 'rep-7',
    title: 'Sahil fırtınasında kulübeleri yıkılan canlar için mama desteği',
    type: 'kopek',
    urgency: 'hungry',
    lat: 40.9710,
    lng: 29.0650,
    locationName: 'Kadıköy, Caddebostan Sahil',
    description: 'Sahildeki besleme alanındaki mama kapları fırtınada uçmuş. Acil kuru mama takviyesi yapacak gönüllüler aranıyor.',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    instagram: 'caddebostan_pati',
    contactName: 'Tolga',
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    supportCount: 3,
    supports: ['Su kabı yenilendi', 'Mama siparişi verildi']
  },
  {
    id: 'rep-8',
    title: 'İnşaat temelinde mahsur kalan kedi yavrusu',
    type: 'kedi',
    urgency: 'critical',
    lat: 40.9995,
    lng: 29.0435,
    locationName: 'Kadıköy, Fikirtepe Kentsel Dönüşüm Alanı',
    description: 'Yaklaşık 3 metre çukurda ağlıyor, kendi başına çıkamıyor. Uzun sepet veya merdivenle kurtarma desteği gerekiyor.',
    image: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600&auto=format&fit=crop&q=80',
    instagram: 'kadikoy_acil_kurtarma',
    contactName: 'Eren',
    status: 'active',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    supportCount: 1,
    supports: ['Gönüllü yolda']
  },

  // 3. BEŞİKTAŞ
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
    id: 'rep-9',
    title: 'Göz enfeksiyonlu 2 yavru kedi - Damla & Geçici Bakım',
    type: 'kedi',
    urgency: 'injured',
    lat: 41.0460,
    lng: 29.0020,
    locationName: 'Beşiktaş, Abbasağa Parkı',
    description: 'Gözleri tamamen kapanmış, göremeyen 2 minik yavru. Antibiyotikli damla tedavisi başlandı ama güvenli bir alana alınmaları şart.',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&auto=format&fit=crop&q=80',
    instagram: 'abbasaga_canlari',
    contactName: 'Melis',
    status: 'active',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    supportCount: 4,
    supports: ['İlk doz damla yapıldı', 'Kutuya alındı']
  },
  {
    id: 'rep-10',
    title: 'Sahil kayalıklarında ayağı misinaya dolanmış martı',
    type: 'kus',
    urgency: 'critical',
    lat: 41.0500,
    lng: 29.0210,
    locationName: 'Beşiktaş, Ortaköy Sahili',
    description: 'Ayağına olta ipi ve kanca dolanmış, uçamıyor. Yakalayıp ipi kesecek veya veterinere götürecek yardımsever aranıyor.',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&auto=format&fit=crop&q=80',
    instagram: 'ortakoy_dostlari',
    contactName: 'Serdar',
    status: 'active',
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    supportCount: 2,
    supports: ['Gözlem altında tutuluyor']
  },

  // 4. ŞİŞLİ
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
    id: 'rep-14',
    title: 'Parkta terkedilmiş cocker cinsi uysal köpek',
    type: 'kopek',
    urgency: 'shelter',
    lat: 41.0450,
    lng: 28.9920,
    locationName: 'Şişli, Maçka Demokrasi Parkı',
    description: 'Tasması boynunda, çok hüzünlü bekliyor. İnsanlardan korkmuyor, acil geçici yuva veya sahiplendirme gerekiyor.',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
    instagram: 'mackaparkicanlari',
    contactName: 'Gizem',
    status: 'active',
    createdAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    supportCount: 5,
    supports: ['Mama verildi', 'Tasması kontrol edildi']
  },
  {
    id: 'rep-15',
    title: 'Kaput içine saklanmış yavru kedi kurtarıldı',
    type: 'kedi',
    urgency: 'transit',
    lat: 41.0570,
    lng: 28.9780,
    locationName: 'Şişli, Bomonti Tarihi Bira Fabrikası Civarı',
    description: 'Usta yardımıyla kaputtan çıkarıldı, hafif yağ lekesi dışında durumu iyi. Kliniğe genel kontrole götürecek araç aranıyor.',
    image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&auto=format&fit=crop&q=80',
    instagram: 'bomonti_pati',
    contactName: 'Kaan',
    status: 'active',
    createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    supportCount: 2,
    supports: ['Kutuya alındı, araç bekleniyor']
  },

  // 5. FATİH
  {
    id: 'rep-3',
    title: 'Kanadı kırık güvercin',
    type: 'kus',
    urgency: 'injured',
    lat: 41.0065,
    lng: 28.9765,
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
    id: 'rep-16',
    title: 'Tarihi sokakta aç kalan 4 yavru kedi için yaş mama',
    type: 'kedi',
    urgency: 'hungry',
    lat: 41.0300,
    lng: 28.9480,
    locationName: 'Fatih, Balat Merdivenli Yokuş',
    description: 'Anneleri 2 gündür görünmüyor. Yavrular çok ufak, yaş yavru kedi maması ve kedi süt tozu takviyesi çok acil.',
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&auto=format&fit=crop&q=80',
    instagram: 'balat_kedileri',
    contactName: 'Emine',
    status: 'active',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    supportCount: 3,
    supports: ['İlk süt verildi', 'Takip ediliyor']
  },
  {
    id: 'rep-17',
    title: 'Ön patisine basamayan sokak köpeği - Röntgen Lazım',
    type: 'kopek',
    urgency: 'critical',
    lat: 41.0140,
    lng: 28.9390,
    locationName: 'Fatih, Çapa Tıp Fakültesi Yanı',
    description: 'Topallayarak ilerlemeye çalışıyor, patiğinde şişlik ve acı var. Acil röntgen çektirilmesi için araç ve klinik desteği gerekiyor.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
    instagram: 'capa_hayvan_dostlari',
    contactName: 'Oğuz',
    status: 'active',
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    supportCount: 3,
    supports: ['Hekimle görüşüldü', 'Nakil bekleniyor']
  },

  // 6. ÜSKÜDAR
  {
    id: 'rep-18',
    title: 'Bostan kenarında 3 minik yavru kedi - Süt Anne Aranıyor',
    type: 'kedi',
    urgency: 'critical',
    lat: 41.0320,
    lng: 29.0290,
    locationName: 'Üsküdar, Kuzguncuk Bostanı',
    description: 'Henüz gözleri yeni açılmış yavrular bir kutu içinde bırakılmış. Acil süt anne kedi veya şırıngayla besleyecek gönüllü aranıyor.',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&auto=format&fit=crop&q=80',
    instagram: 'kuzguncuk_pati',
    contactName: 'Hande',
    status: 'active',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    supportCount: 4,
    supports: ['Sıcak su torbası koyuldu', 'Gönüllü evine aldı']
  },
  {
    id: 'rep-19',
    title: 'Validebağ Korusunda terkedilmiş sevimli terrier',
    type: 'kopek',
    urgency: 'shelter',
    lat: 41.0150,
    lng: 29.0420,
    locationName: 'Üsküdar, Validebağ Korusu',
    description: 'Korumasız bir şekilde tek başına dolaşıyor, ev köpeği olduğu çok belli. Geçici/kalıcı güvenli bir yuva arıyoruz.',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&auto=format&fit=crop&q=80',
    instagram: 'validebag_canlari',
    contactName: 'Banu',
    status: 'active',
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    supportCount: 6,
    supports: ['Korumaya alındı', 'Çip taraması yapıldı']
  },
  {
    id: 'rep-20',
    title: 'Kuyruğu yaralı tekir kedi tedavi edildi ve sahiplendirildi 🎉',
    type: 'kedi',
    urgency: 'shelter',
    lat: 41.0520,
    lng: 29.0550,
    locationName: 'Üsküdar, Çengelköy Çınaraltı',
    description: 'Tedavisi tamamlanan uysal Çengelköy kedimiz yeni yuvasında çok mutlu!',
    image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=600&auto=format&fit=crop&q=80',
    instagram: 'cengelpatileri',
    contactName: 'Yusuf',
    status: 'adopted',
    createdAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
    supportCount: 5,
    supports: ['Tedavi bitti', 'Sahiplendirildi 🎉']
  },

  // 7. SARIYER
  {
    id: 'rep-21',
    title: 'Orman yolunda zayıf kalmış 3 yavru köpek mama bekliyor',
    type: 'kopek',
    urgency: 'hungry',
    lat: 41.1390,
    lng: 29.0480,
    locationName: 'Sarıyer, Kireçburnu - Tarabya Orman Yolu',
    description: 'Oldukça açlar, anne ortalıkta yok. Kuru yavru köpek maması ve temiz su takviyesi acil gerekmektedir.',
    image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&auto=format&fit=crop&q=80',
    instagram: 'sariyer_orman_besleme',
    contactName: 'Volkan',
    status: 'active',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    supportCount: 3,
    supports: ['10 kg mama bırakıldı', 'Kulübe yapıldı']
  },
  {
    id: 'rep-22',
    title: 'Trafikte ezilme tehlikesi atlatan yavru kedi - Acil Nakil',
    type: 'kedi',
    urgency: 'transit',
    lat: 41.1095,
    lng: 29.0460,
    locationName: 'Sarıyer, Emirgan Sahil Yolu',
    description: 'Sahil yolunda orta refüjde sıkışmış halde bulundu. Taşıma çantasına aldık, kliniğe götürecek araç desteği rica ediyoruz.',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&auto=format&fit=crop&q=80',
    instagram: 'emirgan_patileri',
    contactName: 'Derya',
    status: 'active',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    supportCount: 2,
    supports: ['Refüjden alındı', 'Araç bekleniyor']
  },

  // 8. BAKIRKÖY
  {
    id: 'rep-24',
    title: 'Sahil kayalıklarında düşüp sıkışan yaralı kedi',
    type: 'kedi',
    urgency: 'critical',
    lat: 40.9680,
    lng: 28.8320,
    locationName: 'Bakırköy, Yeşilköy Sahil Parkı',
    description: 'Kayaların arasına düşmüş, arka bacağı ezilmiş. Çevredekilerce çıkarıldı, acil cerrahi müdahale gerekiyor.',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    instagram: 'yesilkoy_hayvanseverler',
    contactName: 'Arda',
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    supportCount: 3,
    supports: ['İlk pansuman yapıldı', 'Klinik yolunda']
  },
  {
    id: 'rep-25',
    title: 'Güzel Kızımız Tarçın Yeni Ailesine Kavuştu 🎉',
    type: 'kopek',
    urgency: 'shelter',
    lat: 40.9780,
    lng: 28.8650,
    locationName: 'Bakırköy, Ataköy 5. Kısım',
    description: 'Parkta terkedilmiş olan can dostumuz Tarçın ömürlük yuvasını buldu!',
    image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&auto=format&fit=crop&q=80',
    instagram: 'atakoy_canlari',
    contactName: 'Sevgi',
    status: 'adopted',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    supportCount: 8,
    supports: ['Aşıları yapıldı', 'Sahiplendirildi 🎉']
  },

  // 9. MALTEPE
  {
    id: 'rep-27',
    title: 'Bacağında derin kesik olan sokak canı - Acil Dikiş & Tedavi',
    type: 'kopek',
    urgency: 'critical',
    lat: 40.9350,
    lng: 29.1410,
    locationName: 'Maltepe, Maltepe Sahil Dolgu Parkı',
    description: 'Kırık cam veya tele takılmış, bacağında ciddi kanama var. Baskı yapıldı ama kliniğe acil dikiş için nakil gerekiyor.',
    image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&auto=format&fit=crop&q=80',
    instagram: 'maltepe_pati_dayanisma',
    contactName: 'Serkan',
    status: 'active',
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    supportCount: 4,
    supports: ['Tampon yapıldı', 'Ambulans arandı']
  },
  {
    id: 'rep-28',
    title: 'Balkondan düşen ev kedisi için acil röntgen desteği',
    type: 'kedi',
    urgency: 'injured',
    lat: 40.9480,
    lng: 29.1120,
    locationName: 'Maltepe, Küçükyalı Bağdat Cd. Civarı',
    description: 'İkinci kattan düşmüş, çene ve patisinde zedelenme var. En yakın kliniğe acil ulaştırılması lazım.',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&auto=format&fit=crop&q=80',
    instagram: 'kucukyali_patileri',
    contactName: 'Nilüfer',
    status: 'active',
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    supportCount: 2,
    supports: ['Sabitlendi, klinikte']
  },

  // 10. ATAŞEHİR
  {
    id: 'rep-29',
    title: 'Rezidanslar arasında kalmış korkmuş köpek - Geçici Yuva',
    type: 'kopek',
    urgency: 'shelter',
    lat: 40.9930,
    lng: 29.1180,
    locationName: 'Ataşehir, Batı Ataşehir Varyap Civarı',
    description: 'Trafiğin yoğun olduğu kavşakta korkudan titriyor. İnsan canlısı, tasma izi var. Koruyucu geçici yuva aranıyor.',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    instagram: 'atasehir_pati_kurtarma',
    contactName: 'Cem',
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    supportCount: 3,
    supports: ['Trafikten alındı', 'Geçici bahçede']
  },
  {
    id: 'rep-30',
    title: 'Kutu içinde bırakılmış 3 yavru kedi mama ihtiyacı',
    type: 'kedi',
    urgency: 'hungry',
    lat: 40.9720,
    lng: 29.0980,
    locationName: 'Ataşehir, İçerenköy Hal Civarı',
    description: 'Karton kutu içinde sütten yeni kesilmiş yavrular. Yaş mama ve kuru yavru kedi maması takviyesi gerekiyor.',
    image: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600&auto=format&fit=crop&q=80',
    instagram: 'icerenkoy_canlari',
    contactName: 'Fatma',
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    supportCount: 2,
    supports: ['Mama verildi']
  },

  // 11. KARTAL
  {
    id: 'rep-31',
    title: 'Sahil kayalıklarında titreyen yavru köpek için barınma',
    type: 'kopek',
    urgency: 'shelter',
    lat: 40.8985,
    lng: 29.1930,
    locationName: 'Kartal, Sahil Kordonboyu',
    description: 'Yağmurda ıslanmış ve üşümüş halde bulundu. Kurulandı, karnı doyuruldu ancak acil başını sokacak bir yuva lazım.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80',
    instagram: 'kartal_pati_dostlari',
    contactName: 'Kemal',
    status: 'active',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    supportCount: 4,
    supports: ['Battaniye sağlandı', 'İlan paylaşıldı']
  },

  // 12. BEYKOZ
  {
    id: 'rep-32',
    title: 'Ormanlık alanda aç kalan sürü için acil mama bağışı',
    type: 'kopek',
    urgency: 'hungry',
    lat: 41.0890,
    lng: 29.1120,
    locationName: 'Beykoz, Kavacık Orman Girişi',
    description: 'Orman sınırındaki yaklaşık 12 köpeğin maması bitmiş durumda. Kuru mama ulaştırabilecek araçlı gönüllüler bekleniyor.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
    instagram: 'beykoz_orman_besleme',
    contactName: 'Barış',
    status: 'active',
    createdAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    supportCount: 5,
    supports: ['2 çuval mama yollandı']
  },
  {
    id: 'rep-33',
    title: 'Ağaçta mahsur kalan yavru kedi',
    type: 'kedi',
    urgency: 'transit',
    lat: 41.1150,
    lng: 29.0980,
    locationName: 'Beykoz, Paşabahçe Parkı',
    description: 'Yüksek çınar ağacında sabahtan beri inemiyor. İtfaiyeye haber verildi, indirilince veterinere kontrole götürecek araç aranıyor.',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80',
    instagram: 'pasabahce_patileri',
    contactName: 'Aylin',
    status: 'active',
    createdAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
    supportCount: 2,
    supports: ['İtfaiye bekleniyor']
  },

  // 13. EYÜPSULTAN
  {
    id: 'rep-34',
    title: 'Gözleri açılmamış 4 yavru kedi - Acil Süt Tozu',
    type: 'kedi',
    urgency: 'critical',
    lat: 41.0490,
    lng: 28.9340,
    locationName: 'Eyüpsultan, Pierre Loti Tepesi Yolu',
    description: 'Poşet içinde çalılıkta bulundu. Donmak üzerelerdi, eve alındı ancak acil kedi biberonu ve süt tozu gerekiyor.',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    instagram: 'eyup_patileri',
    contactName: 'Hacer',
    status: 'active',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    supportCount: 3,
    supports: ['Isıtıcı altına alındı', 'Biberon temin edildi']
  },
  {
    id: 'rep-35',
    title: 'Göktürk yolunda araç çarpmış sokak canı - Acil Müdahale',
    type: 'kopek',
    urgency: 'critical',
    lat: 41.1820,
    lng: 28.8950,
    locationName: 'Eyüpsultan, Göktürk Orman Yolu',
    description: 'Yol kenarında yatıyor, bilinci açık ama kalkamıyor. Acil veteriner hekim veya nakil ambulansı gerekiyor.',
    image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&auto=format&fit=crop&q=80',
    instagram: 'gokturk_pati_acil',
    contactName: 'Mert',
    status: 'active',
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    supportCount: 4,
    supports: ['Yol güvenliği alındı', 'Klinik arandı']
  },

  // 14. PENDİK
  {
    id: 'rep-37',
    title: 'Marina civarında terkedilmiş yaşlı can için sıcak yuva',
    type: 'kopek',
    urgency: 'shelter',
    lat: 40.8845,
    lng: 29.2380,
    locationName: 'Pendik, Pendik Marina Sahil Parkı',
    description: 'Gözleri az görüyor, çok sakin ve uslu. Sokak köpeklerinden korkuyor, kalan ömrünü sıcak bir evde geçirmeli.',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    instagram: 'pendik_canlari',
    contactName: 'Süleyman',
    status: 'active',
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    supportCount: 5,
    supports: ['Yemek verildi', 'İlan paylaşıldı']
  },

  // 15. ZEYTİNBURNU
  {
    id: 'rep-36',
    title: 'Tarihi sur dibinde yaralı kirpi - Koruma altına alındı',
    type: 'diger',
    urgency: 'injured',
    lat: 41.0020,
    lng: 28.9180,
    locationName: 'Zeytinburnu, Kazlıçeşme Marmaray Civarı',
    description: 'Dikenleri ezilmiş, yavaş hareket ediyor. Egzotik/yaban hekimi olan kliniğe nakli için destek bekleniyor.',
    image: 'https://images.unsplash.com/photo-1584553421349-3557471bed79?w=600&auto=format&fit=crop&q=80',
    instagram: 'zeytinburnu_pati',
    contactName: 'Tuncay',
    status: 'active',
    createdAt: new Date(Date.now() - 130 * 60 * 1000).toISOString(),
    supportCount: 2,
    supports: ['Kutuya alındı']
  },

  // 16. ÜMRANİYE
  {
    id: 'rep-38',
    title: 'Soğukta dükkan önüne sığınan anne kedi ve 2 yavrusu',
    type: 'kedi',
    urgency: 'hungry',
    lat: 41.0250,
    lng: 29.1150,
    locationName: 'Ümraniye, Alemdağ Cd. Yamanevler',
    description: 'Dükkan saçak altına sığınmışlar. Kuru kedi maması ve strafor kedi evi desteği aranıyor.',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&auto=format&fit=crop&q=80',
    instagram: 'umraniye_patileri',
    contactName: 'Sedat',
    status: 'active',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    supportCount: 3,
    supports: ['Mama kabı konuldu']
  },

  // 17. KAĞITHANE
  {
    id: 'rep-39',
    title: 'Şantiye kenarında aç kalmış anne köpek için kuru mama',
    type: 'kopek',
    urgency: 'hungry',
    lat: 41.0820,
    lng: 28.9750,
    locationName: 'Kağıthane, Cendere Vadisi',
    description: 'İnşaat personeli yemek veriyordu, şantiye tatil olunca aç kalmışlar. Acil kuru mama desteği rica olunur.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
    instagram: 'kagithane_patileri',
    contactName: 'Uğur',
    status: 'active',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    supportCount: 3,
    supports: ['15 kg mama bırakıldı']
  },

  // 18. ADALAR (BÜYÜKADA)
  {
    id: 'rep-40',
    title: 'İskele meydanında kanadı incinmiş martı',
    type: 'kus',
    urgency: 'injured',
    lat: 40.8725,
    lng: 29.1240,
    locationName: 'Adalar, Büyükada İskele Meydanı',
    description: 'Yere inmiş, kalkamıyor. Adaya gelen veya adadaki veteriner hekimle irtibat kurulması rica olunur.',
    image: 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=600&auto=format&fit=crop&q=80',
    instagram: 'adalar_pati_gonulluleri',
    contactName: 'Kıvanç',
    status: 'active',
    createdAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    supportCount: 2,
    supports: ['Kutuya alındı']
  }
];

const VETERINARIANS = [
  // 1. KADIKÖY
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
    id: 'vet-5',
    name: 'Suadiye 7/24 Acil Veteriner Kliniği',
    address: 'Bağdat Cad. No:380, Suadiye, Kadıköy',
    phone: '0216 411 22 33',
    isOpen247: true,
    lat: 40.9610,
    lng: 29.0830,
    badge: 'Cerrahi Yoğun Bakım'
  },

  // 2. BEYOĞLU
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
    id: 'vet-7',
    name: 'Galata & Karaköy Veteriner Kliniği',
    address: 'Kemeraltı Cad. No:18, Karaköy, Beyoğlu',
    phone: '0212 292 34 50',
    isOpen247: false,
    hours: '08:30 - 22:30',
    lat: 41.0265,
    lng: 28.9765,
    badge: 'Sokak Hayvanı Desteği'
  },

  // 3. BEŞİKTAŞ
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
    id: 'vet-6',
    name: 'Ortaköy 7/24 Hayvan Hastanesi',
    address: 'Muallim Naci Cad. No:52, Ortaköy, Beşiktaş',
    phone: '0212 258 77 88',
    isOpen247: true,
    lat: 41.0495,
    lng: 29.0225,
    badge: '7/24 Nöbetçi Cerrah'
  },

  // 4. ŞİŞLİ
  {
    id: 'vet-4',
    name: 'Şişli Hayat Veteriner Tıp Merkezi',
    address: 'Halaskargazi Cad. No:92, Şişli',
    phone: '0212 231 99 88',
    isOpen247: true,
    lat: 41.0550,
    lng: 28.9880,
    badge: 'Cerrahi Acil Servis'
  },
  {
    id: 'vet-8',
    name: 'Nişantaşı Acil Pati Kliniği',
    address: 'Teşvikiye Cad. No:44, Nişantaşı, Şişli',
    phone: '0212 240 10 20',
    isOpen247: true,
    lat: 41.0490,
    lng: 28.9940,
    badge: 'Tomografi & Röntgen'
  },

  // 5. FATİH
  {
    id: 'vet-9',
    name: 'Fatih Vatan 7/24 Hayvan Polikliniği',
    address: 'Vatan Cad. No:78, Fatih',
    phone: '0212 534 88 90',
    isOpen247: true,
    lat: 41.0180,
    lng: 28.9410,
    badge: 'Tarihi Yarımada Nöbetçi'
  },

  // 6. ÜSKÜDAR
  {
    id: 'vet-10',
    name: 'Üsküdar Doğancılar Veteriner Tıp Merkezi',
    address: 'Doğancılar Cad. No:62, Üsküdar',
    phone: '0216 341 55 66',
    isOpen247: true,
    lat: 41.0210,
    lng: 29.0190,
    badge: '7/24 Açık Klinik'
  },
  {
    id: 'vet-11',
    name: 'Çengelköy Boğaziçi Veteriner Kliniği',
    address: 'Çengelköy Cad. No:84, Üsküdar',
    phone: '0216 422 11 22',
    isOpen247: false,
    hours: '09:00 - 21:30',
    lat: 41.0515,
    lng: 29.0550,
    badge: 'Kanatlı & Egzotik Uzmanı'
  },

  // 7. SARIYER
  {
    id: 'vet-12',
    name: 'Sarıyer Boğaziçi Veteriner Polikliniği',
    address: 'Çayırbaşı Cad. No:110, Sarıyer',
    phone: '0212 242 33 44',
    isOpen247: true,
    lat: 41.1550,
    lng: 29.0440,
    badge: '7/24 Acil Müdahale'
  },
  {
    id: 'vet-13',
    name: 'Tarabya Hayvan Hastanesi',
    address: 'Tarabya Bayırı No:35, Sarıyer',
    phone: '0212 299 80 80',
    isOpen247: true,
    lat: 41.1370,
    lng: 29.0425,
    badge: 'Tam Donanımlı Hastane'
  },

  // 8. BAKIRKÖY
  {
    id: 'vet-14',
    name: 'Bakırköy 7/24 Acil Hayvan Hastanesi',
    address: 'İncirli Cad. No:85, Bakırköy',
    phone: '0212 571 60 70',
    isOpen247: true,
    lat: 40.9820,
    lng: 28.8710,
    badge: '7/24 Nöbetçi Ekip'
  },
  {
    id: 'vet-15',
    name: 'Yeşilköy Sahil Veteriner Kliniği',
    address: 'İstasyon Cad. No:42, Yeşilköy, Bakırköy',
    phone: '0212 663 12 12',
    isOpen247: false,
    hours: '09:00 - 22:00',
    lat: 40.9650,
    lng: 28.8310,
    badge: 'Sokak Hayvanı Kliniği'
  },

  // 9. MALTEPE
  {
    id: 'vet-16',
    name: 'Maltepe Sahil 7/24 Nöbetçi Veteriner',
    address: 'Bağdat Cad. No:190, Maltepe',
    phone: '0216 442 80 90',
    isOpen247: true,
    lat: 40.9320,
    lng: 29.1350,
    badge: 'Gece Nöbetçi Hekim'
  },

  // 10. ATAŞEHİR
  {
    id: 'vet-17',
    name: 'Ataşehir Anadolu Hayvan Hastanesi',
    address: 'Ataşehir Bulvarı No:14, Ataşehir',
    phone: '0216 456 70 80',
    isOpen247: true,
    lat: 40.9910,
    lng: 29.1170,
    badge: '7/24 Yoğun Bakım'
  },

  // 11. KARTAL
  {
    id: 'vet-18',
    name: 'Kartal Kordonboyu Veteriner Kliniği',
    address: 'Kordonboyu Mah. Ankara Cad. No:55, Kartal',
    phone: '0216 353 40 50',
    isOpen247: true,
    lat: 40.8985,
    lng: 29.1910,
    badge: 'Sahil Acil Servis'
  },

  // 12. BEYKOZ
  {
    id: 'vet-19',
    name: 'Beykoz Acil Veteriner Polikliniği',
    address: 'Kavacık Rüzgarlıbahçe No:24, Beykoz',
    phone: '0216 413 77 99',
    isOpen247: true,
    lat: 41.0920,
    lng: 29.1050,
    badge: 'Orman Canları Birimi'
  },

  // 13. EYÜPSULTAN
  {
    id: 'vet-20',
    name: 'Göktürk 7/24 Hayvan Hastanesi',
    address: 'İstanbul Cad. No:68, Göktürk, Eyüpsultan',
    phone: '0212 322 55 66',
    isOpen247: true,
    lat: 41.1850,
    lng: 28.8920,
    badge: 'Ambulans & Cerrahi'
  },

  // 14. PENDİK
  {
    id: 'vet-21',
    name: 'Pendik Marina Nöbetçi Veteriner Kliniği',
    address: 'Batı Mah. Erol Kaya Cad. No:32, Pendik',
    phone: '0216 390 12 34',
    isOpen247: true,
    lat: 40.8815,
    lng: 29.2325,
    badge: '7/24 Açık Nöbetçi'
  },

  // 15. ÜMRANİYE
  {
    id: 'vet-22',
    name: 'Ümraniye Merkez Hayvan Kliniği',
    address: 'Alemdağ Cad. No:142, Ümraniye',
    phone: '0216 335 90 00',
    isOpen247: true,
    lat: 41.0260,
    lng: 29.1090,
    badge: 'Acil Müdahale Ünitesi'
  }
];

const SOLIDARITY_POINTS = [
  // 1. KADIKÖY
  {
    id: 'point-1',
    name: 'Kadıköy Sahil Mama Odağı',
    type: 'mama_noktasi',
    address: 'Moda İskelesi yanı, Kadıköy',
    lat: 40.9855,
    lng: 29.0320,
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

  // 2. BEYOĞLU
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
    id: 'point-6',
    name: 'Cihangir Merdivenler Kedi Noktası',
    type: 'mama_noktasi',
    address: 'Sanatkarlar Parkı yanı, Cihangir, Beyoğlu',
    lat: 41.0320,
    lng: 28.9830,
    status: 'Mama ve Su Tazelendi'
  },

  // 3. BEŞİKTAŞ
  {
    id: 'point-4',
    name: 'Yıldız Parkı Yaşam Noktası',
    type: 'mama_noktasi',
    address: 'Yıldız Parkı İçi, Beşiktaş',
    lat: 41.0490,
    lng: 29.0150,
    status: 'Mama Takviyesi Yapıldı'
  },
  {
    id: 'point-5',
    name: 'Abbasağa Gönüllü Mama Odağı',
    type: 'mama_noktasi',
    address: 'Abbasağa Parkı havuz başı, Beşiktaş',
    lat: 41.0455,
    lng: 29.0030,
    status: 'Dolu (Sürekli Takipte)'
  },

  // 4. ŞİŞLİ
  {
    id: 'point-7',
    name: 'Maçka Demokrasi Parkı Mama & Kulübe Odağı',
    type: 'mama_noktasi',
    address: 'Maçka Demokrasi Parkı Kadırgalar Girişi, Şişli',
    lat: 41.0435,
    lng: 28.9930,
    status: 'Kedi Evleri Temizlendi'
  },
  {
    id: 'point-8',
    name: 'Bomonti Pati Dostu Petshop',
    type: 'petshop',
    address: 'Silahşör Cad. No:34, Bomonti, Şişli',
    phone: '0212 230 40 50',
    lat: 41.0580,
    lng: 28.9790,
    status: 'Askıda Yaş Mama ve Serum'
  },

  // 5. FATİH
  {
    id: 'point-9',
    name: 'Balat Sahil Parkı Kedi Evleri',
    type: 'mama_noktasi',
    address: 'Balat Sahil Parkı Haliç Kıyısı, Fatih',
    lat: 41.0305,
    lng: 28.9450,
    status: 'Gönüllülerce Dolduruldu'
  },

  // 6. ÜSKÜDAR
  {
    id: 'point-10',
    name: 'Validebağ Korusu Besleme Noktası',
    type: 'mama_noktasi',
    address: 'Validebağ Korusu Koşuyolu Kapısı, Üsküdar',
    lat: 41.0160,
    lng: 29.0410,
    status: 'Kuru Mama & Su Dolu'
  },
  {
    id: 'point-11',
    name: 'Kuzguncuk Çınaraltı Mama Kabı',
    type: 'mama_noktasi',
    address: 'İcadiye Cad. Bostan girişi, Kuzguncuk, Üsküdar',
    lat: 41.0330,
    lng: 29.0305,
    status: 'Mahalle Gönüllüleri Takip Ediyor'
  },

  // 7. SARIYER
  {
    id: 'point-12',
    name: 'Emirgan Korusu Girişi Mama Odağı',
    type: 'mama_noktasi',
    address: 'Emirgan Korusu alt kapı, Sarıyer',
    lat: 41.1090,
    lng: 29.0495,
    status: 'Mama ve Su Mevcut'
  },
  {
    id: 'point-13',
    name: 'Kireçburnu Sahil Pati Noktası',
    type: 'mama_noktasi',
    address: 'Haydar Aliyev Cad. Balıkçılar yanı, Sarıyer',
    lat: 41.1420,
    lng: 29.0460,
    status: 'Dolu (Bugün 10:00)'
  },

  // 8. BAKIRKÖY
  {
    id: 'point-14',
    name: 'Yeşilköy Sahil Parkı Kedi Parkı',
    type: 'mama_noktasi',
    address: 'Yeşilköy Sahil Yürüyüş Yolu, Bakırköy',
    lat: 40.9680,
    lng: 28.8330,
    status: 'Mama Kulübeleri Kontrol Edildi'
  },
  {
    id: 'point-15',
    name: 'Ataköy Doğa Parkı Mama İstasyonu',
    type: 'mama_noktasi',
    address: 'Ataköy 9. Kısım Park İçi, Bakırköy',
    lat: 40.9790,
    lng: 28.8620,
    status: 'Dolu & Temiz Su'
  },

  // 9. MALTEPE
  {
    id: 'point-16',
    name: 'Maltepe Şehir Parkı Pati Noktası',
    type: 'mama_noktasi',
    address: 'Maltepe Sahil Etkinlik Alanı Kıyı Bandı, Maltepe',
    lat: 40.9355,
    lng: 29.1415,
    status: 'Mama Bırakıldı'
  },

  // 10. ATAŞEHİR
  {
    id: 'point-17',
    name: 'Ataşehir Kent Parkı Askıda Mama Petshop',
    type: 'petshop',
    address: 'Barbaros Mah. Mor Sümbül Sok. No:12, Ataşehir',
    phone: '0216 688 33 44',
    lat: 40.9920,
    lng: 29.1190,
    status: 'Askıda Mama & Ücretsiz İlaç Kutusu'
  },

  // 11. KARTAL
  {
    id: 'point-18',
    name: 'Kartal Sahil Parkı Besleme Alanı',
    type: 'mama_noktasi',
    address: 'Kartal Sahil Şeridi İskele Yanı, Kartal',
    lat: 40.8990,
    lng: 29.1935,
    status: 'Su ve Mama Tazelendi'
  },

  // 12. BEYKOZ
  {
    id: 'point-19',
    name: 'Beykoz Ormanları Gönüllü Besleme Noktası',
    type: 'mama_noktasi',
    address: 'Rüzgarlıbahçe Orman Yolu Girişi, Beykoz',
    lat: 41.0910,
    lng: 29.1080,
    status: 'Gönüllü Ekiplerce Dolduruldu'
  },

  // 13. EYÜPSULTAN
  {
    id: 'point-20',
    name: 'Eyüp Haliç Kıyısı Mama İstasyonu',
    type: 'mama_noktasi',
    address: 'Feshane Caddesi Sahil Parkı, Eyüpsultan',
    lat: 41.0465,
    lng: 28.9340,
    status: 'Kedi ve Güvercin Yemi Mevcut'
  },

  // 14. PENDİK
  {
    id: 'point-22',
    name: 'Pendik Sahil Parkı Mama & Su İstasyonu',
    type: 'mama_noktasi',
    address: 'Pendik Sahil Yolu İDO İskelesi Civarı, Pendik',
    lat: 40.8850,
    lng: 29.2385,
    status: 'Dolu (Sabah Kontrol Edildi)'
  },

  // 15. ADALAR (BÜYÜKADA)
  {
    id: 'point-25',
    name: 'Büyükada Değirmenburnu Besleme Noktası',
    type: 'mama_noktasi',
    address: 'Değirmenburnu Tabiat Parkı Girişi, Büyükada',
    lat: 40.8720,
    lng: 29.1245,
    status: 'Ada Gönüllüleri Tarafından Takip Ediliyor'
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
      // Tüm eski sürümleri temizle
      for (let i = 1; i <= 9; i++) {
        localStorage.removeItem('sokakdostum_reports_v' + i);
      }
      localStorage.removeItem('sokak_dostum_reports');

      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Varsayılan vakaların koordinatlarını ZORUNLU olarak kara koordinatlarıyla ez
        const initialMap = new Map(INITIAL_REPORTS.map(r => [r.id, r]));
        this.reports = parsed.map(r => {
          if (initialMap.has(r.id)) {
            const fresh = initialMap.get(r.id);
            return { ...r, lat: fresh.lat, lng: fresh.lng, locationName: fresh.locationName };
          }
          return r;
        });
        this.persistReports();
      } else {
        this.reports = INITIAL_REPORTS.map(r => ({ ...r }));
        this.persistReports();
      }
    } catch (e) {
      this.reports = INITIAL_REPORTS.map(r => ({ ...r }));
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

  sanitizeText(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  addReport(data) {
    const fallbackImg = createAnimalSVG(data.type);
    
    // Instagram kullanıcı adı temizleme ve güvenli kılma
    let cleanInstagram = (data.instagram || '').trim().replace(/^@/, '').replace(/[^a-zA-Z0-9._]/g, '');

    const newReport = {
      id: 'rep-' + Date.now(),
      title: this.sanitizeText(data.title || 'İsimsiz Yardım Çağrısı'),
      type: data.type || 'kedi',
      urgency: data.urgency || 'hungry',
      lat: parseFloat(data.lat) || 41.0370,
      lng: parseFloat(data.lng) || 28.9850,
      locationName: this.sanitizeText(data.locationName || 'Konum belirtilmedi'),
      description: this.sanitizeText(data.description || ''),
      image: data.image || fallbackImg,
      instagram: cleanInstagram || null,
      contactName: this.sanitizeText(data.contactName || 'Pati Dostu'),
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
      const cleanAction = this.sanitizeText(actionText);
      report.supports.unshift(cleanAction);
      report.supportCount = (report.supportCount || 0) + 1;
      if (report.status === 'active' && cleanAction.includes('Klinik')) {
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
