import { KnowledgeRow } from '../types';

const DB_KEY = 'sql_simulation_db_v1';

// Initial seed data (Pre-taught knowledge)
// Genişletilmiş bilgi havuzu: +20 Matematik, +20 Türkçe/Genel Kültür
const SEED_DATA: KnowledgeRow[] = [
  // --- TEMEL SOHBET (Mevcut) ---
  { id: 1, pattern: 'merhaba', response: 'Merhaba! Ben senin yerel veritabanında çalışan asistanınım.', type: 'chat', created_at: new Date().toISOString() },
  { id: 2, pattern: 'selam', response: 'Selamlar! Bugün sana nasıl yardım edebilirim?', type: 'chat', created_at: new Date().toISOString() },
  { id: 3, pattern: 'nasılsın', response: 'Ben bir yazılımım, duygularım yok ama sistemlerim %100 çalışıyor!', type: 'chat', created_at: new Date().toISOString() },
  { id: 4, pattern: 'adın ne', response: 'Benim adım LocalBot. API kullanmıyorum, her şeyi veritabanımdan öğreniyorum.', type: 'chat', created_at: new Date().toISOString() },
  { id: 5, pattern: 'günaydın', response: 'Günaydın! Umarım harika bir gün geçirirsin.', type: 'chat', created_at: new Date().toISOString() },
  { id: 6, pattern: 'iyi geceler', response: 'İyi geceler! Sistemlerimi rölantiye alıyorum.', type: 'chat', created_at: new Date().toISOString() },
  
  // --- YENİ EKLENEN MATEMATİK SORULARI (20 Adet) ---
  { id: 101, pattern: 'en küçük asal sayı', response: 'En küçük asal sayı 2\'dir.', type: 'math', created_at: new Date().toISOString() },
  { id: 102, pattern: 'bir düzine kaç eder', response: 'Bir düzine 12 adettir.', type: 'math', created_at: new Date().toISOString() },
  { id: 103, pattern: 'bir deste kaç eder', response: 'Bir deste 10 adettir.', type: 'math', created_at: new Date().toISOString() },
  { id: 104, pattern: 'karenin alanı nasıl bulunur', response: 'Karenin alanı, bir kenar uzunluğunun karesi alınarak (a x a) bulunur.', type: 'math', created_at: new Date().toISOString() },
  { id: 105, pattern: 'üçgenin iç açıları toplamı', response: 'Üçgenin iç açıları toplamı 180 derecedir.', type: 'math', created_at: new Date().toISOString() },
  { id: 106, pattern: 'pi sayısı kaçtır', response: 'Pi sayısı matematikte yaklaşık olarak 3,14 kabul edilir.', type: 'math', created_at: new Date().toISOString() },
  { id: 107, pattern: '1 saat kaç dakika', response: '1 saat 60 dakikadır.', type: 'math', created_at: new Date().toISOString() },
  { id: 108, pattern: '1 gün kaç saat', response: '1 gün 24 saattir.', type: 'math', created_at: new Date().toISOString() },
  { id: 109, pattern: 'sıfır çift sayı mı', response: 'Evet, 0 (sıfır) bir çift sayıdır.', type: 'math', created_at: new Date().toISOString() },
  { id: 110, pattern: '9 kere 9', response: '9 x 9 = 81 eder.', type: 'math', created_at: new Date().toISOString() },
  { id: 111, pattern: '7 kere 8', response: '7 x 8 = 56 eder.', type: 'math', created_at: new Date().toISOString() },
  { id: 112, pattern: '1 metre kaç cm', response: '1 metre 100 santimetredir.', type: 'math', created_at: new Date().toISOString() },
  { id: 113, pattern: '1 km kaç m', response: '1 kilometre 1000 metredir.', type: 'math', created_at: new Date().toISOString() },
  { id: 114, pattern: 'yarım artı yarım', response: 'Yarım artı yarım 1 tam eder.', type: 'math', created_at: new Date().toISOString() },
  { id: 115, pattern: '5in karesi', response: '5\'in karesi 25\'tir.', type: 'math', created_at: new Date().toISOString() },
  { id: 116, pattern: '3ün küpü', response: '3\'ün küpü (3x3x3) 27\'dir.', type: 'math', created_at: new Date().toISOString() },
  { id: 117, pattern: 'dik açı kaç derece', response: 'Dik açı 90 derecedir.', type: 'math', created_at: new Date().toISOString() },
  { id: 118, pattern: 'doğru açı kaç derece', response: 'Doğru açı 180 derecedir.', type: 'math', created_at: new Date().toISOString() },
  { id: 119, pattern: '100 ün yarısı', response: '100\'ün yarısı 50\'dir.', type: 'math', created_at: new Date().toISOString() },
  { id: 120, pattern: 'bir sayı sıfıra bölünürse', response: 'Bir sayının sıfıra bölümü matematikte tanımsızdır.', type: 'math', created_at: new Date().toISOString() },

  // --- YENİ EKLENEN TÜRKÇE/GENEL KÜLTÜR SORULARI (20 Adet) ---
  { id: 201, pattern: 'türkiyenin başkenti', response: 'Türkiye\'nin başkenti Ankara\'dır.', type: 'general', created_at: new Date().toISOString() },
  { id: 202, pattern: 'en kalabalık şehir', response: 'Türkiye\'nin nüfus bakımından en kalabalık şehri İstanbul\'dur.', type: 'general', created_at: new Date().toISOString() },
  { id: 203, pattern: 'istiklal marşı yazarı', response: 'İstiklal Marşımızın şairi Mehmet Akif Ersoy\'dur.', type: 'general', created_at: new Date().toISOString() },
  { id: 204, pattern: 'türkiye kaç bölge', response: 'Türkiye\'de 7 coğrafi bölge bulunmaktadır.', type: 'general', created_at: new Date().toISOString() },
  { id: 205, pattern: 'en yüksek dağ', response: 'Türkiye\'nin en yüksek dağı Ağrı Dağı\'dır.', type: 'general', created_at: new Date().toISOString() },
  { id: 206, pattern: 'cumhuriyet ne zaman kuruldu', response: 'Türkiye Cumhuriyeti 29 Ekim 1923 tarihinde kurulmuştur.', type: 'general', created_at: new Date().toISOString() },
  { id: 207, pattern: 'atatürk nerede doğdu', response: 'Mustafa Kemal Atatürk 1881 yılında Selanik\'te doğmuştur.', type: 'general', created_at: new Date().toISOString() },
  { id: 208, pattern: 'istanbulun plakası', response: 'İstanbul ilinin plaka kodu 34\'tür.', type: 'general', created_at: new Date().toISOString() },
  { id: 209, pattern: 'ankaranın plakası', response: 'Ankara ilinin plaka kodu 06\'dır.', type: 'general', created_at: new Date().toISOString() },
  { id: 210, pattern: 'izmirin plakası', response: 'İzmir ilinin plaka kodu 35\'tir.', type: 'general', created_at: new Date().toISOString() },
  { id: 211, pattern: 'türkiyenin en uzun nehri', response: 'Türkiye sınırları içindeki en uzun nehir Kızılırmak\'tır.', type: 'general', created_at: new Date().toISOString() },
  { id: 212, pattern: 'anitkabir nerede', response: 'Anıtkabir, başkent Ankara\'dadır.', type: 'general', created_at: new Date().toISOString() },
  { id: 213, pattern: 'bir yıl kaç ay', response: 'Bir yıl 12 aydır.', type: 'general', created_at: new Date().toISOString() },
  { id: 214, pattern: 'bir hafta kaç gün', response: 'Bir hafta 7 gündür.', type: 'general', created_at: new Date().toISOString() },
  { id: 215, pattern: 'gökkuşağı kaç renk', response: 'Gökkuşağında temel olarak 7 renk bulunur.', type: 'general', created_at: new Date().toISOString() },
  { id: 216, pattern: 'su kaç derecede kaynar', response: 'Su, deniz seviyesinde 100 santigrat derecede kaynar.', type: 'general', created_at: new Date().toISOString() },
  { id: 217, pattern: 'su kaç derecede donar', response: 'Su, 0 santigrat derecede donar.', type: 'general', created_at: new Date().toISOString() },
  { id: 218, pattern: 'en hızlı kara hayvanı', response: 'Dünyanın en hızlı kara hayvanı Çita\'dır.', type: 'general', created_at: new Date().toISOString() },
  { id: 219, pattern: 'türkiyenin para birimi', response: 'Türkiye\'nin para birimi Türk Lirası\'dır (TL).', type: 'general', created_at: new Date().toISOString() },
  { id: 220, pattern: 'istanbul ne zaman fethedildi', response: 'İstanbul 1453 yılında Fatih Sultan Mehmet tarafından fethedilmiştir.', type: 'general', created_at: new Date().toISOString() }
];

export const initDB = (): KnowledgeRow[] => {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    console.log('Veritabanı başlatılıyor... Varsayılan veriler yükleniyor.');
    localStorage.setItem(DB_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return JSON.parse(existing);
};

export const resetDB = (): KnowledgeRow[] => {
  localStorage.setItem(DB_KEY, JSON.stringify(SEED_DATA));
  return SEED_DATA;
};

export const getKnowledgeBase = (): KnowledgeRow[] => {
  const existing = localStorage.getItem(DB_KEY);
  return existing ? JSON.parse(existing) : [];
};

export const findResponse = (input: string): KnowledgeRow | null => {
  const db = getKnowledgeBase();
  const normalizedInput = input.toLocaleLowerCase('tr-TR').trim();
  
  // 1. Exact match attempt
  const exactMatch = db.find(row => row.pattern.toLocaleLowerCase('tr-TR') === normalizedInput);
  if (exactMatch) return exactMatch;

  // 2. Fuzzy match / Contains
  // Sort by length to match the most specific phrase first if possible, generally simpler logic here
  const fuzzyMatch = db.find(row => normalizedInput.includes(row.pattern.toLocaleLowerCase('tr-TR')));
  
  return fuzzyMatch || null;
};

export const insertKnowledge = (pattern: string, response: string, type: 'general' | 'math' | 'chat' = 'general'): KnowledgeRow => {
  const db = getKnowledgeBase();
  
  // Calculate simple auto-increment ID
  const newId = db.length > 0 ? Math.max(...db.map(r => r.id)) + 1 : 1;
  
  const newRow: KnowledgeRow = {
    id: newId,
    pattern: pattern.trim(),
    response: response.trim(),
    type,
    created_at: new Date().toISOString()
  };

  const updatedDb = [...db, newRow];
  localStorage.setItem(DB_KEY, JSON.stringify(updatedDb));
  return newRow;
};

export const updateKnowledge = (id: number, newPattern: string, newResponse: string): void => {
  const db = getKnowledgeBase();
  const updatedDb = db.map(row => 
    row.id === id 
      ? { ...row, pattern: newPattern.trim(), response: newResponse.trim() } 
      : row
  );
  localStorage.setItem(DB_KEY, JSON.stringify(updatedDb));
};

// Advanced: Simple math parser if no DB match found but looks like math
export const tryMathEvaluation = (input: string): string | null => {
  // Regex to check for simple math expressions like "123 + 456" or "10 * 5"
  // Allow spaces, integers, basic operators
  const mathRegex = /^(\d+)\s*([\+\-\*\/])\s*(\d+)$/;
  const match = input.match(mathRegex);

  if (match) {
    const n1 = parseFloat(match[1]);
    const operator = match[2];
    const n2 = parseFloat(match[3]);
    
    let result = 0;
    switch(operator) {
      case '+': result = n1 + n2; break;
      case '-': result = n1 - n2; break;
      case '*': result = n1 * n2; break;
      case '/': 
        if(n2 === 0) return "Sıfıra bölünemez.";
        result = n1 / n2; 
        break;
    }
    return `Otomatik Hesaplama: ${result}`;
  }
  return null;
};