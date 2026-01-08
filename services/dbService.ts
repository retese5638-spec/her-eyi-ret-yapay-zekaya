import { KnowledgeRow } from '../types';

// Declare GUN types since we are using CDN
declare global {
  interface Window {
    Gun: any;
  }
}

const DB_KEY = 'sql_ai_local_v2';
const MESH_CHANNEL = 'knowledge_mesh_v1';

// Public Relay Peers (Free community servers to help handshake)
// We are NOT using an API key. These are public nodes.
const PEERS = [
  'https://gun-manhattan.herokuapp.com/gun',
  'https://gun-amsterdam.herokuapp.com/gun',
  'https://plato.design/gun'
];

let gun: any = null;
let isConnected = false;

// Initial seed data
const SEED_DATA: KnowledgeRow[] = [
  { id: 1, pattern: 'merhaba', response: 'Merhaba! Ben Merkeziyetsiz P2P Ağına bağlıyım.', type: 'chat', created_at: new Date().toISOString() },
  { id: 2, pattern: 'sen kimsin', response: 'Ben tüm kullanıcıların oluşturduğu ortak bir yapay zekayım.', type: 'chat', created_at: new Date().toISOString() },
  { id: 3, pattern: 'nasıl çalışıyorsun', response: 'API yok. Veriler tarayıcıdan tarayıcıya (P2P) aktarılıyor.', type: 'chat', created_at: new Date().toISOString() },
  { id: 101, pattern: 'en küçük asal sayı', response: 'En küçük asal sayı 2\'dir.', type: 'math', created_at: new Date().toISOString() },
  { id: 110, pattern: '9 kere 9', response: '81', type: 'math', created_at: new Date().toISOString() }
];

// --- P2P CLOUD CONNECTION ---

export const initP2PNetwork = (onNewData: (data: KnowledgeRow[]) => void) => {
  if (gun) return;

  console.log("P2P Ağına Bağlanılıyor...");
  
  // Initialize Gun with peers and localStorage adapter
  gun = window.Gun({
    peers: PEERS,
    localStorage: true
  });

  isConnected = true;

  // Subscribe to the shared graph
  gun.get(MESH_CHANNEL).map().on((node: any, key: string) => {
    if (!node || !node.pattern || !node.response) return;

    // Convert Gun node to KnowledgeRow
    const newItem: KnowledgeRow = {
      id: node.customId || Date.now(), // Gun uses UUIDs, but we map back to our ID system if needed
      pattern: node.pattern,
      response: node.response,
      type: node.type || 'general',
      created_at: node.created_at || new Date().toISOString()
    };

    // Merge into LocalStorage logic
    const currentDB = getKnowledgeBase();
    
    // Check if exists by pattern to avoid duplicates from mesh
    const exists = currentDB.some(item => 
      item.pattern.toLowerCase() === newItem.pattern.toLowerCase() && 
      item.response === newItem.response
    );

    if (!exists) {
      console.log("P2P Ağından Yeni Veri Geldi:", newItem.pattern);
      const updatedDB = [...currentDB, newItem];
      localStorage.setItem(DB_KEY, JSON.stringify(updatedDB));
      onNewData(updatedDB);
    }
  });

  return true;
};

export const isMeshConnected = () => isConnected;

// --- CRUD OPERATIONS ---

export const getKnowledgeBase = (): KnowledgeRow[] => {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    localStorage.setItem(DB_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  let parsed = JSON.parse(existing);
  // Ensure we sort by ID or Date
  return parsed.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

// Insert now broadcasts to the Mesh
export const insertKnowledge = async (pattern: string, response: string, type: 'general' | 'math' | 'chat' = 'general'): Promise<KnowledgeRow> => {
  const localDb = getKnowledgeBase();
  
  const newId = Date.now(); // Use timestamp for unique ID in P2P
  const newRow: KnowledgeRow = {
    id: newId,
    pattern: pattern.trim(),
    response: response.trim(),
    type,
    created_at: new Date().toISOString()
  };

  // 1. Save Local
  const updatedDb = [newRow, ...localDb];
  localStorage.setItem(DB_KEY, JSON.stringify(updatedDb));

  // 2. Broadcast to P2P Mesh (The "Own Cloud")
  if (gun) {
    // Generate a unique key for the node
    const nodeKey = `item_${newId}_${Math.random().toString(36).substr(2, 5)}`;
    
    gun.get(MESH_CHANNEL).get(nodeKey).put({
      customId: newId,
      pattern: newRow.pattern,
      response: newRow.response,
      type: newRow.type,
      created_at: newRow.created_at
    });
    console.log("Veri P2P Ağına Gönderildi (Syncing to Mesh)");
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

  // Updating in GunDB is harder without the original Key reference. 
  // For this simulation, we just treat it as a new insert or local update.
  // In a full app, we would track the GUN Soul (ID).
};

export const resetDB = (): KnowledgeRow[] => {
  // We don't delete from Mesh, only local view
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
    return `P2P Hesaplama: ${result}`;
  }
  return null;
};