import { KnowledgeRow } from '../types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DB_KEY = 'sql_simulation_db_v1';
const CREDENTIALS_KEY = 'sql_ai_cloud_credentials';

let supabase: SupabaseClient | null = null;
let isOnline = false;

// Initial seed data
const SEED_DATA: KnowledgeRow[] = [
  { id: 1, pattern: 'merhaba', response: 'Merhaba! Ben online ortak veritabanı kullanan asistanınım.', type: 'chat', created_at: new Date().toISOString() },
  { id: 2, pattern: 'selam', response: 'Selamlar! Ortak ağa hoş geldin.', type: 'chat', created_at: new Date().toISOString() },
  { id: 3, pattern: 'nasılsın', response: 'Tüm kullanıcıların verileriyle her an daha iyi oluyorum!', type: 'chat', created_at: new Date().toISOString() },
  { id: 4, pattern: 'adın ne', response: 'Ben Kolektif Zeka. Herkesin öğrettiğini bilirim.', type: 'chat', created_at: new Date().toISOString() },
  // ... Math and General basic data remains as fallback
  { id: 101, pattern: 'en küçük asal sayı', response: 'En küçük asal sayı 2\'dir.', type: 'math', created_at: new Date().toISOString() },
  { id: 110, pattern: '9 kere 9', response: '81', type: 'math', created_at: new Date().toISOString() }
];

// --- CLOUD CONNECTION SETUP ---
export const getStoredCredentials = () => {
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    return stored ? JSON.parse(stored) : null;
};

export const disconnectCloud = () => {
    localStorage.removeItem(CREDENTIALS_KEY);
    supabase = null;
    isOnline = false;
    window.location.reload();
};

export const initCloudConnection = async (url: string, key: string, onUpdateCallback: (data: KnowledgeRow[]) => void) => {
    try {
        supabase = createClient(url, key);
        
        // Test connection
        const { data, error } = await supabase.from('knowledge').select('count').limit(1);
        if (error) throw error;

        isOnline = true;
        localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ url, key }));

        // 1. Download ALL data from Cloud and replace/merge local
        await syncFromCloud();

        // 2. Setup Realtime Subscription (Listen for changes from other users)
        supabase
            .channel('public:knowledge')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'knowledge' }, async (payload) => {
                console.log('Realtime change received!', payload);
                // When anyone changes anything, re-fetch or append. 
                // For simplicity, we sync all to ensure consistency.
                const allData = await syncFromCloud();
                onUpdateCallback(allData);
            })
            .subscribe();

        return true;
    } catch (e) {
        console.error("Cloud connection failed:", e);
        isOnline = false;
        return false;
    }
};

export const isCloudConnected = () => isOnline;

// --- DATA SYNCING ---

const syncFromCloud = async (): Promise<KnowledgeRow[]> => {
    if (!supabase) return getKnowledgeBase();

    const { data, error } = await supabase
        .from('knowledge')
        .select('*')
        .order('id', { ascending: true });

    if (error || !data) {
        console.error("Error fetching from cloud:", error);
        return getKnowledgeBase();
    }

    // Update Local Storage with Cloud Data to act as a cache
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    return data as KnowledgeRow[];
};

// --- CRUD OPERATIONS ---

export const getKnowledgeBase = (): KnowledgeRow[] => {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    localStorage.setItem(DB_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return JSON.parse(existing);
};

// Async insert handling
export const insertKnowledge = async (pattern: string, response: string, type: 'general' | 'math' | 'chat' = 'general'): Promise<KnowledgeRow> => {
  const localDb = getKnowledgeBase();
  
  // Optimistic Update (Update local immediately for speed)
  const newId = localDb.length > 0 ? Math.max(...localDb.map(r => r.id)) + 1 : 1;
  const newRow: KnowledgeRow = {
    id: newId,
    pattern: pattern.trim(),
    response: response.trim(),
    type,
    created_at: new Date().toISOString()
  };

  // Save to Local
  const updatedDb = [...localDb, newRow];
  localStorage.setItem(DB_KEY, JSON.stringify(updatedDb));

  // Sync to Cloud (Fire and Forget)
  if (isOnline && supabase) {
      // We don't send ID, let Postgres handle ID auto-increment or UUID.
      // But for this simulation, assuming the table structure matches.
      // Ideally, the table should have columns: pattern, response, type.
      supabase.from('knowledge').insert({
          pattern: newRow.pattern,
          response: newRow.response,
          type: newRow.type
      }).then(({ error }) => {
          if (error) console.error("Cloud insert failed:", error);
      });
  }

  return newRow;
};

export const updateKnowledge = async (id: number, newPattern: string, newResponse: string): Promise<void> => {
  const db = getKnowledgeBase();
  const updatedDb = db.map(row => 
    row.id === id 
      ? { ...row, pattern: newPattern.trim(), response: newResponse.trim() } 
      : row
  );
  localStorage.setItem(DB_KEY, JSON.stringify(updatedDb));

  if (isOnline && supabase) {
      // Find row by pattern (since IDs might differ between local/cloud in this simple implementations)
      // OR assuming IDs are synced. Let's try to update by pattern/content match if ID fails, 
      // but for this demo, we'll try ID.
      supabase.from('knowledge').update({
          pattern: newPattern.trim(),
          response: newResponse.trim()
      }).eq('id', id).then(({ error }) => {
          if (error) console.error("Cloud update failed:", error);
      });
  }
};

export const resetDB = (): KnowledgeRow[] => {
  // Only reset local if online, or prevent reset if online?
  if (isOnline) {
      alert("Online moddasınız. Veritabanını sıfırlamak diğer kullanıcıların verisini etkileyebilir. Bu işlem online modda devre dışıdır.");
      return getKnowledgeBase();
  }
  localStorage.setItem(DB_KEY, JSON.stringify(SEED_DATA));
  return SEED_DATA;
};

export const findResponse = (input: string): KnowledgeRow | null => {
  const db = getKnowledgeBase();
  const normalizedInput = input.toLocaleLowerCase('tr-TR').trim();
  
  const exactMatch = db.find(row => row.pattern.toLocaleLowerCase('tr-TR') === normalizedInput);
  if (exactMatch) return exactMatch;

  const fuzzyMatch = db.find(row => normalizedInput.includes(row.pattern.toLocaleLowerCase('tr-TR')));
  return fuzzyMatch || null;
};

export const tryMathEvaluation = (input: string): string | null => {
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