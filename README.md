# YouTube Yorum Çekme Aracı

React.js kullanarak YouTube videolarındaki tüm yorumları çekebileceğiniz modern bir web uygulaması.

## Özellikler

- 🎥 YouTube video yorumlarını çekme (tüm yorumları çekme desteği)
- 📊 CSV ve JSON formatında dışa aktarma
- 🔍 Arama ve filtreleme özellikleri
- 📊 Detaylı istatistikler (toplam yorum, ortalama beğeni, vb.)
- 📊 Sıralama seçenekleri (beğeni, tarih, uzunluk)
- 🎨 Modern ve kullanıcı dostu arayüz
- 📱 Responsive tasarım
- 🔐 API anahtarını .env dosyasında güvenli saklama

## Kurulum

1. Projeyi klonlayın veya indirin
2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. `.env.example` dosyasını `.env` olarak kopyalayın:

```bash
copy .env.example .env
```

veya Linux/Mac için:
```bash
cp .env.example .env
```

4. `.env` dosyasını açın ve API anahtarınızı ekleyin:

```env
VITE_YOUTUBE_API_KEY=YOUR_API_KEY_HERE
```

5. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

6. Tarayıcınızda `http://localhost:5173` adresini açın

## YouTube API Anahtarı Alma

📖 **Detaylı rehber:** [API_ANAHTARI_REHBERI.md](API_ANAHTARI_REHBERI.md) dosyasına bakın.

Kısa adımlar:
1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun
3. "API ve Hizmetler" > "Kütüphane" bölümüne gidin
4. "YouTube Data API v3"ü bulun ve etkinleştirin
5. "Kimlik Bilgileri" > "Kimlik Bilgileri Oluştur" > "API anahtarı" seçin
6. Oluşturulan API anahtarını kopyalayın ve `.env` dosyasına ekleyin

## Kullanım

1. `.env` dosyasına API anahtarınızı eklediğinizden emin olun
2. Yorumlarını çekmek istediğiniz YouTube video URL'sini yapıştırın
3. "İlk 100 Yorumu Çek" veya "📥 TÜM Yorumları Çek" butonuna tıklayın
4. İstiyorsanız yorumları CSV veya JSON olarak indirebilirsiniz

## Teknolojiler

- React 18
- Vite
- Axios
- YouTube Data API v3

## Notlar

- YouTube API'nin ücretsiz kotası var (günlük 10,000 istek)
- Tüm yorumları otomatik olarak çekme desteği
- `.env` dosyası GitHub'a yüklenmez (güvenlik için .gitignore'da tanımlı)
- API anahtarınızı asla paylaşmayın veya commit'lemeyin

## Lisans

MIT
