import { KnowledgeRow } from '../types';

const DB_KEY = 'sql_simulation_db_v1';

// Initial seed data (Pre-taught knowledge)
// Genişletilmiş bilgi havuzu
const SEED_DATA: KnowledgeRow[] = [
  // --- SOHBET ---
  { id: 1, pattern: 'merhaba', response: 'Merhaba! Ben senin yerel veritabanında çalışan asistanınım.', type: 'chat', created_at: new Date().toISOString() },
  { id: 2, pattern: 'selam', response: 'Selamlar! Bugün sana nasıl yardım edebilirim?', type: 'chat', created_at: new Date().toISOString() },
  { id: 3, pattern: 'nasılsın', response: 'Ben bir yazılımım, duygularım yok ama sistemlerim %100 çalışıyor!', type: 'chat', created_at: new Date().toISOString() },
  { id: 4, pattern: 'adın ne', response: 'Benim adım LocalBot. API kullanmıyorum, her şeyi veritabanımdan öğreniyorum.', type: 'chat', created_at: new Date().toISOString() },
  { id: 5, pattern: 'günaydın', response: 'Günaydın! Umarım harika bir gün geçirirsin.', type: 'chat', created_at: new Date().toISOString() },
  { id: 6, pattern: 'iyi geceler', response: 'İyi geceler! Sistemlerimi rölantiye alıyorum.', type: 'chat', created_at: new Date().toISOString() },
  { id: 7, pattern: 'kimsin', response: 'Ben React ve TypeScript ile yazılmış, tarayıcıda yaşayan bir SQL simülasyonuyum.', type: 'chat', created_at: new Date().toISOString() },
  
  // --- MATEMATİK ---
  { id: 8, pattern: '2+2', response: 'Matematik işlemim sonucunda: 4', type: 'math', created_at: new Date().toISOString() },
  { id: 9, pattern: '5*5', response: 'Çarpma işlemi sonucu: 25', type: 'math', created_at: new Date().toISOString() },
  { id: 10, pattern: 'pi sayısı', response: 'Pi sayısı yaklaşık olarak 3.14159', type: 'math', created_at: new Date().toISOString() },
  { id: 11, pattern: '10/2', response: 'Bölme işlemi sonucu: 5', type: 'math', created_at: new Date().toISOString() },
  { id: 12, pattern: 'karekök 64', response: '64 sayısının karekökü 8\'dir.', type: 'math', created_at: new Date().toISOString() },
  { id: 13, pattern: '100 ün yarısı', response: '100 sayısının yarısı 50 eder.', type: 'math', created_at: new Date().toISOString() },
  { id: 14, pattern: 'üçgenin iç açıları', response: 'Bir üçgenin iç açıları toplamı 180 derecedir.', type: 'math', created_at: new Date().toISOString() },
  
  // --- GENEL KÜLTÜR ---
  { id: 15, pattern: 'türkiyenin başkenti', response: 'Türkiye\'nin başkenti Ankara\'dır.', type: 'general', created_at: new Date().toISOString() },
  { id: 16, pattern: 'atatürk kaç yılında doğdu', response: 'Mustafa Kemal Atatürk 1881 yılında Selanik\'te doğmuştur.', type: 'general', created_at: new Date().toISOString() },
  { id: 17, pattern: 'en hızlı hayvan', response: 'Kara üzerindeki en hızlı hayvan Çita\'dır.', type: 'general', created_at: new Date().toISOString() },
  { id: 18, pattern: 'su kaç derecede kaynar', response: 'Su, deniz seviyesinde 100 santigrat derecede kaynar.', type: 'general', created_at: new Date().toISOString() },
  { id: 19, pattern: 'istanbulun fethi', response: 'İstanbul 1453 yılında Fatih Sultan Mehmet tarafından fethedilmiştir.', type: 'general', created_at: new Date().toISOString() },
  { id: 20, pattern: 'güneş nedir', response: 'Güneş, Güneş Sistemi\'nin merkezinde yer alan orta büyüklükte bir yıldızdır.', type: 'general', created_at: new Date().toISOString() }
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