# Öğrenen AI (SQL Simülasyonu)

Bu proje, harici bir API (OpenAI, Claude vb.) kullanmadan, tamamen tarayıcı hafızasında (**localStorage**) çalışan, kendi kendine öğrenebilen ve SQL benzeri bir veri yapısı kullanan bir React uygulamasıdır.

![AI Preview](https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000)

## 🌟 Özellikler

*   **API Gerektirmez:** Tamamen çevrimdışı (offline) çalışabilir (ilk yükleme hariç).
*   **Öğrenme Modu:** Bilmediği soruları size sorar, cevabı veritabanına kaydeder ve bir sonraki soruşunuzda hatırlar.
*   **SQL Simülasyonu:** Arka planda çalışan mantık, SQL sorgularını (SELECT, INSERT) simüle eder ve ekranda gösterir.
*   **Matematik Motoru:** Basit matematik işlemlerini veritabanında olmasa bile algılar ve hesaplar.
*   **Kalıcı Hafıza:** Sayfayı yenileseniz bile öğrettiğiniz bilgiler silinmez (LocalStorage).
*   **Veritabanı Yönetimi:** Sol panelden tüm bilgileri görebilir, düzenleyebilir, silebilir veya yeni veri ekleyebilirsiniz.

## 🚀 Kurulum ve Çalıştırma

Bu projeyi bilgisayarınızda çalıştırmak için:

1.  Depoyu klonlayın:
    ```bash
    git clone https://github.com/kullaniciadi/ogrenen-ai-sql.git
    ```
2.  Klasöre gidin:
    ```bash
    cd ogrenen-ai-sql
    ```
3.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
4.  Projeyi başlatın:
    ```bash
    npm run dev
    ```

## 🌐 GitHub Pages'de Yayınlama

Bu projeyi internette yayınlamak için:

1.  `vite.config.ts` dosyasındaki `base: './'` ayarının olduğundan emin olun.
2.  Projeyi derleyin:
    ```bash
    npm run build
    ```
3.  `dist` klasöründeki içeriği bir sunucuya veya GitHub Pages'e yükleyin.

## 🛠 Teknolojiler

*   React 18
*   TypeScript
*   Tailwind CSS
*   Vite
*   Lucide React (İkonlar)

---
*Bu proje eğitim ve simülasyon amaçlı geliştirilmiştir.*