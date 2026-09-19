# 🐾 SokakDostum - Sokak Hayvanları Acil Haritası & Dayanışma Ağı

Sokak hayvanlarının acil tedavi, mama, su ve yuva ihtiyaçlarını doğrudan harita üzerinde bir araya getiren; üyelik ve kayıt engeli olmadan saniyeler içinde vaka açılabilen, ultra modern ve harita öncelikli (Map-First) açık kaynaklı web uygulamasıdır.

🌐 **Canlı Uygulama Adresi:** [https://enescivelek0.github.io/Sokak-Dostum/](https://enescivelek0.github.io/Sokak-Dostum/)

---

## 🔒 Güvenlik, Gizlilik ve Ortam Değişkenleri (.env) Politikası

Bu depo **Herkese Açık (Public)** bir açık kaynak projesidir. Proje geliştirme ve dağıtım süreçlerinde aşağıdaki güvenlik ve gizlilik kuralları tavizsiz uygulanır:

1. **Sıfır Sızıntı İlkesi**: Kesinlikle hiçbir gizli API anahtarı, token, şifre veya özel kimlik bilgisi kaynak kodlara veya GitHub deposuna eklenemez.
2. **Kişisel Gizlilik (Telefon İfşası Engeli)**: Kullanıcıların kişisel telefon numaralarını açık bir şekilde internete yazması engellenmiştir. İletişim, kullanıcı güvenliğini korumak amacıyla güvenli **Instagram DM (`@kullanici`)** üzerinden sağlanır.
3. **.env Dosya İzolasyonu**: `.gitignore` dosyası, tüm `.env`, `.env.*`, `*.pem`, `*.key` ve yerel yapılandırma dosyalarını otomatik olarak takip dışı bırakır ve depoya push edilmesini engeller.
4. **Statik & Sunucusuz Mimari**: Hassas sunucu oturumları tutulmaz; veriler yerel tarayıcı hafızasında (LocalStorage) şifresiz/kullanıcı bazlı saklanır.

---

## 🚀 Temel Özellikler ve Mimari

1. **Harita Öncelikli Tam Ekran Deneyim (Map-First Canvas)**:
   - Tüm ekran interaktif Leaflet haritasıdır. Ekranı gereksiz bölen hantal menüler kaldırılmıştır.
2. **Yüzen Cam Kapsül Kontroller (Glassmorphism Floating Bar)**:
   - Üstte yüzen kompakt arama çubuğu, anlık GPS ile konum bulma, acil ilk yardım rehberi ve "+ Vaka Bildir" butonu.
   - Aktif hayati acil vaka olduğunda ekranı kaplamayan, tek tıkla o canlıya odaklanan yüzen acil durum hapı (`🚨 Acil Vaka: Moda Sahil`).
3. **Mobil İçin Akıcı Çekmece (Sliding Bottom Sheet)**:
   - Dokunmatik ekranlarda Apple/Google Maps tarzı Peek (76px), Half (48vh) ve Full (88vh) modları arasında kayan çekmece.
   - Masaüstünde ise sol tarafta şık, istenildiğinde tek tıkla gizlenebilen yüzen yan panel.
4. **Hızlı 3 Sekmeli Gezinme**:
   - `🚨 Vakalar`: Hayati, yaralı, aç veya yuva arayan dostlarımızın güncel durumu.
   - `🏥 Klinikler`: 7/24 nöbetçi veterinerler, tek tıkla doğrudan arama (`tel:`) ve yol tarifi.
   - `🥣 Mama Noktaları`: Bölgedeki düzenli mama ve su odakları, askıda mama sağlayan dayanışmacı petshoplar.
5. **Sahiplendirme ve Arşivleme Süreci**:
   - Sahiplendirilen veya tedavisi tamamlanan canlar tek tıkla `🎉 Yuva Buldu` statüsüyle arşive kaldırılır.
6. **Kayıtsız Hızlı Vaka Bildirimi**:
   - Görsel hayvan türü seçimi (Kedi, Köpek, Kuş, Diğer).
   - Aciliyet seçimi (🚨 Hayati, 🩹 Yaralı, 🥣 Mama, 🏠 Yuva).
   - Haritaya dokunarak konum seçme veya GPS koordinatı alma.
   - Fotoğraf yükleme ve kamera önizleme.
7. **Kırık Görsel Koruması**:
   - Harici bağlantı kopmalarına karşı otomatik gömülü SVG hayvan illüstrasyonları.

---

## 💻 Yerel Geliştirme

Projeyi yerel ortamda çalıştırmak için:

```bash
# Python ile yerel sunucu:
python -m http.server 3000
```
Tarayıcınızda: `http://localhost:3000`
