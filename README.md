# Öğrenen AI - P2P Mesh Network

Bu proje, **hiçbir merkezi sunucu veya API (Google, OpenAI, Supabase vb.) kullanmadan**, kullanıcıların tarayıcıları arasında kurulan **P2P (Eşten Eşe)** bağlantı ile çalışan ortak bir yapay zeka hafızasıdır.

"Kendi bulutunu oluştur" felsefesiyle, siteye giren herkes bulutun bir parçası olur.

![P2P AI Network](https://images.unsplash.com/photo-1558494949-efc025708dc7?auto=format&fit=crop&q=80&w=1000)

## 🌐 Nasıl Çalışır? (Teknik Altyapı)

Bu proje **Gun.js** motorunu kullanır.
1.  Siteyi açtığınızda tarayıcınız "Relay Peer" adı verilen halka açık ücretsiz sinyal sunucularına bağlanır.
2.  Diğer kullanıcılarla aranızda şifreli bir **WebRTC** köprüsü kurulur.
3.  Birisi yapay zekaya "Elma nedir?" diye öğrettiğinde, bu veri **anında** ağdaki diğer tüm bilgisayarlara gönderilir.
4.  Veriler `localStorage` üzerinde de yedeklenir, böylece siteyi kapatsanız bile veriler kaybolmaz.

## 🌟 Özellikler

*   **%100 API'siz:** API Key, Login, Şifre gerekmez. Tıkla ve bağlan.
*   **Merkeziyetsiz Bulut:** Veritabanı tek bir şirketin sunucusunda değil, kullanıcıların bilgisayarlarında dağınık halde durur.
*   **Canlı Eşitleme:** Dünyanın öbür ucundaki biri bir soru öğrettiğinde saniyeler içinde ekranınızda belirir.
*   **Öğrenen Algoritma:** Bilmediği soruları sorar, öğrendiğini asla unutmaz (silinmez).
*   **Matematik:** İşlemleri yerel işlemci gücüyle yapar.

## 🚀 Kurulum ve Yayınlama

Projeyi GitHub Pages üzerinde yayınlayabilirsiniz. Statik bir site olduğu için sunucu maliyeti yoktur. P2P ağı istemci tarafında çalışır.

1.  Repoyu klonlayın.
2.  `npm install`
3.  `npm run dev` (Test için)
4.  `npm run build` (Yayınlamak için)

## ⚠️ Notlar
*   P2P ağı halka açık kanallar kullanır. Hassas verilerinizi (şifre, kimlik vb.) girmeyiniz.
*   "Kayıtlar asla silinmesin" özelliği gereği, kötü niyetli veriler de ağda yayılabilir, ancak yerel olarak temizleyebilirsiniz.

---
*Powered by GunDB & React*