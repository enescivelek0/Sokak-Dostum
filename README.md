# 🐾 SokakDostum - Sokak Hayvanları Acil Haritası & Dayanışma Ağı

Sokak hayvanlarının acil tedavi, mama, su ve yuva ihtiyaçlarını doğrudan harita üzerinde bir araya getiren; üyelik ve kayıt engeli olmadan saniyeler içinde vaka açılabilen, ultra modern ve harita öncelikli (Map-First) açık kaynaklı web uygulamasıdır.

---

## 🚀 Yeni Tasarım ve Mimarinin Getirdikleri

1. **Harita Öncelikli Tam Ekran Deneyim (Map-First Canvas)**:
   - Tüm ekran interaktif Leaflet haritasıdır. Ekranı gereksiz bölen, haritayı gizleyen hantal menüler ve uzun metin blokları tamamen kaldırıldı.
2. **Yüzen Cam Kapsül Kontroller (Glassmorphism Floating Bar)**:
   - Üstte yüzen kompakt arama çubuğu, anlık GPS ile konum bulma, ilk yardım rehberi ve "+ Vaka Bildir" butonu.
   - Aktif hayati acil vaka olduğunda ekranı kaplamayan, tek tıkla o canlıya odaklanan yüzen acil durum hapı (`🚨 Acil Vaka: Moda Sahil`).
3. **Mobil İçin Akıcı Çekmece (Sliding Bottom Sheet)**:
   - Dokunmatik ekranlarda Apple/Google Maps tarzı Peek (76px), Half (48vh) ve Full (88vh) modları arasında kayan veya tıklanan çekmece.
   - Masaüstünde ise sol tarafta şık, istenildiğinde tek tıkla gizlenebilen yüzen yan panel.
4. **Hızlı 3 Sekmeli Gezinme**:
   - `🚨 Vakalar`: Hayati, yaralı, aç veya yuva arayan dostlarımızın güncel durumu.
   - `🏥 Klinikler`: 7/24 nöbetçi veterinerler, tek tıkla doğrudan arama (`tel:`) ve yol tarifi.
   - `🥣 Mama Noktaları`: Bölgedeki düzenli mama ve su odakları, askıda mama sağlayan dayanışmacı petshoplar.
5. **Kayıtsız Hızlı Vaka Bildirimi**:
   - Görsel hayvan türü seçimi (Kedi, Köpek, Kuş, Diğer).
   - Aciliyet seçimi (🚨 Hayati, 🩹 Yaralı, 🥣 Mama, 🏠 Yuva).
   - Haritaya dokunarak konum seçme veya GPS koordinatı alma.
   - Fotoğraf yükleme ve kamera önizleme.
6. **Kırık Görsel Koruması**:
   - Harici bağlantı kopmalarına karşı otomatik gömülü SVG hayvan illüstrasyonları.

---

## 💻 Nasıl Çalıştırılır?

Herhangi bir kurulum gerekmez. [index.html](file:///c:/Users/enesc/OneDrive/Masaüstü/Projects/Sokak%20Dostum/index.html) dosyasını çift tıklayarak tarayıcınızda açabilir veya yerel sunucu başlatabilirsiniz:

```bash
python -m http.server 3000
```
Tarayıcınızda: `http://localhost:3000`
