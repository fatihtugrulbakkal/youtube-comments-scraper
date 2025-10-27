# YouTube API Anahtarı Alma Rehberi

Bu rehber, YouTube Data API v3 anahtarını nasıl alacağınızı adım adım açıklar.

## 📋 Adım 1: Google Cloud Console'a Giriş

1. Tarayıcınızda [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Google hesabınızla giriş yapın

## 📝 Adım 2: Yeni Proje Oluşturma

1. Üstteki proje seçici menüden **"YENİ PROJE"** butonuna tıklayın
2. Proje adınızı girin (örnek: "YouTube Yorum Çekici")
3. İsteğe bağlı: Organizasyon seçin
4. **"Oluştur"** butonuna tıklayın

## 🔧 Adım 3: YouTube Data API'yi Etkinleştirme

1. Sol menüden **"API'ler ve Hizmetler"** > **"Kütüphane"** seçeneğine gidin
2. Arama kutusuna **"YouTube Data API v3"** yazın
3. **"YouTube Data API v3"** seçeneğine tıklayın
4. **"ETKİNLEŞTİR"** butonuna tıklayın

## 🔑 Adım 4: API Anahtarı Oluşturma

1. Sol menüden **"API'ler ve Hizmetler"** > **"Kimlik Bilgileri"** seçeneğine gidin
2. Sayfanın üstünde **"+ KİMLİK BİLGİSİ OLUŞTUR"** butonuna tıklayın
3. Açılan menüden **"API anahtarı"** seçeneğini seçin
4. Oluşturulan API anahtarını görüntüleyin

## 🔐 Adım 5: API Anahtarı Kısıtlamalarını Ayarlama (ÖNERİLİR)

Güvenlik için API anahtarınızı kısıtlamalısınız:

1. Oluşturduğunuz API anahtarının yanındaki **"Düzenle"** (kalem) ikonuna tıklayın
2. **"Uygulama kısıtlamaları"** bölümünde **"HTTP başvuruları (web siteleri)"** seçin
3. Web sitelerini ekleyin (örn: `localhost:5173`, `http://localhost:5173`)
4. **"API kısıtlamaları"** bölümünde **"Belirli API'lere anahtarı sınırla"** seçin
5. **"YouTube Data API v3"** seçeneğini işaretleyin
6. **"Kaydet"** butonuna tıklayın

## ✅ Adım 6: API Anahtarınızı Kullanma

1. Oluşturduğunuz API anahtarını kopyalayın
2. Uygulamanızda ilgili alana yapıştırın

## 📊 API Kota Limitleri

- **Ücretsiz günlük kota:** 10,000 birim
- **İstek başına birim kullanımı:**
  - Yorum listesi: 1 birim
  - Maksimum sonuç: 100 yorum/istek

## ⚠️ Önemli Notlar

1. **API anahtarınızı asla paylaşmayın!**
2. API anahtarını GitHub'a yüklemeyin
3. Kullanım kotanızı düzenli olarak kontrol edin
4. Gerekirse yeni bir API anahtarı oluşturun

## 🆘 Sorun Giderme

### "API not enabled" Hatası
- YouTube Data API v3'ün etkinleştirildiğinden emin olun

### "API key not valid" Hatası
- API anahtarınızın doğru kopyalandığından emin olun

### "Quota exceeded" Hatası
- Günlük kotanızı aştınız, 24 saat bekleyin veya yeni bir API anahtarı oluşturun

## 🌐 Alternatif Yöntemler

### OAuth 2.0 (Gelişmiş)
Daha fazla kota ve özellik için OAuth 2.0 kullanabilirsiniz. Bu yöntem daha karmaşık olduğundan bu uygulama için API anahtarı yeterlidir.

## 📞 Yardım

Daha fazla bilgi için:
- [YouTube Data API Dokümantasyonu](https://developers.google.com/youtube/v3)
- [Google Cloud Console Yardım](https://support.google.com/cloud/answer/6168847)
