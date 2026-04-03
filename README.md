# 🎥 YouTube Yorum Çekme Aracı

React.js tabanlı bu web uygulaması, kullanıcıların bir YouTube video URL'si girerek o videodaki tüm yorumları çekmesine olanak tanır. Çekilen yorumlar üzerinde arama, filtreleme ve sıralama gibi işlemler yapılabilir. Ayrıca, yorumlar CSV, JSON ve Excel formatlarında dışa aktarılabilir ve temel duygu analizi yapılabilir.

## ✨ Özellikler

- YouTube videolarındaki tüm yorumları çekme
- Çekilen yorumları CSV, JSON ve Excel formatlarında dışa aktarma
- Yorumlar içinde anlık arama ve filtreleme yapma
- Yorumları beğeni sayısına, tarihe veya uzunluğa göre sıralama
- Temel duygu analizi (pozitif, negatif, nötr)
- API anahtarını `.env` dosyasında güvenli bir şekilde yönetme

## 🛠️ Teknoloji Yığını

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Axios](https://img.shields.io/badge/axios-purple?style=for-the-badge&logo=axios)
![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
![jsPDF](https://img.shields.io/badge/jsPDF-FF0000?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)

## 🚀 Kurulum

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Depoyu klonlayın:**

    ```bash
    git clone https://github.com/fatihtugrulbakkal/youtube-comments-scraper.git
    cd youtube-comments-scraper
    ```

2.  **Bağımlılıkları yükleyin:**

    ```bash
    npm install
    ```

3.  **Ortam değişkenlerini ayarlayın:**

    `.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun. Ardından kendi YouTube Data API v3 anahtarınızı bu dosyaya ekleyin.

    ```bash
    cp .env.example .env
    ```

    ```
    VITE_YOUTUBE_API_KEY=YOUR_API_KEY_HERE
    ```

4.  **Geliştirme sunucusunu başlatın:**

    ```bash
    npm run dev
    ```

    Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

## 📖 Kullanım

Uygulamayı başlattıktan sonra, yorumlarını çekmek istediğiniz YouTube videosunun URL'sini ilgili alana yapıştırın ve "Yorumları Çek" butonuna tıklayın. Yorumlar yüklendikten sonra arama, sıralama ve dışa aktarma özelliklerini kullanabilirsiniz.

## 📂 Proje Yapısı

```
/tmp/youtube-comments-scraper
├── API_ANAHTARI_REHBERI.md
├── GELISTIRME_FIKIRLERI.md
├── README.md
├── index.html
├── package-lock.json
├── package.json
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── vercel.json
└── vite.config.js
```

## 🤝 Katkıda Bulunma

Katkılarınız projeyi daha iyi hale getirmemize yardımcı olur. Katkıda bulunmak isterseniz, lütfen bir "pull request" açın. Her türlü geri bildirim ve öneriye açığız!

1.  Projeyi "fork" edin.
2.  Yeni bir "branch" oluşturun (`git checkout -b ozellik/yeni-ozellik`).
3.  Değişikliklerinizi "commit" edin (`git commit -m 'Yeni bir özellik eklendi'`).
4.  Oluşturduğunuz "branch"i "push" edin (`git push origin ozellik/yeni-ozellik`).
5.  Bir "Pull Request" açın.

## 📄 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.

---

İletişim: [Fatih Tuğrul Bakkal](https://github.com/fatihtugrulbakkal)
