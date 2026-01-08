import React, { useState, useEffect, useCallback } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { DatabaseView } from './components/DatabaseView';
import { BotState, Message, KnowledgeRow } from './types';
import * as dbService from './services/dbService';
import { Menu, X, Cloud, CloudOff, Link as LinkIcon, AlertTriangle } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeRow[]>([]);
  const [botState, setBotState] = useState<BotState>(BotState.IDLE);
  const [learningTrigger, setLearningTrigger] = useState<string | null>(null);
  const [showDbMobile, setShowDbMobile] = useState(false);
  
  // Cloud State
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [showCloudSetup, setShowCloudSetup] = useState(false);
  const [cloudConfig, setCloudConfig] = useState({ url: '', key: '' });
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'error' | 'success'>('idle');

  // Initialize DB on mount
  useEffect(() => {
    // 1. Load Local Data first
    refreshData();
    
    // 2. Check for Cloud Credentials
    const creds = dbService.getStoredCredentials();
    if (creds) {
        connectToCloud(creds.url, creds.key);
    } else {
        addMessage('bot', 'Sistem başlatıldı. Yerel modda çalışıyor.', true);
        addMessage('bot', 'Online ortak hafızayı kullanmak için sağ üstteki Bulut ikonuna tıkla!');
    }
  }, []);

  const connectToCloud = async (url: string, key: string) => {
      setConnectionStatus('connecting');
      const success = await dbService.initCloudConnection(url, key, (updatedData) => {
          setKnowledgeBase(updatedData);
          addMessage('bot', '🔔 Veritabanı güncellendi! Başka biri yeni bir şey öğretti.', true);
      });

      if (success) {
          setIsCloudConnected(true);
          setConnectionStatus('success');
          refreshData(); // Pull initial cloud data
          setTimeout(() => setShowCloudSetup(false), 1000);
          addMessage('bot', '✅ ONLINE BAĞLANTI BAŞARILI! Artık herkesin öğrettiği bilgileri anlık olarak biliyorum.', true);
      } else {
          setConnectionStatus('error');
          setIsCloudConnected(false);
      }
  };

  const refreshData = () => {
    const data = dbService.getKnowledgeBase();
    setKnowledgeBase(data);
  };

  const addMessage = (sender: 'user' | 'bot', text: string, isSystem = false) => {
    const newMsg: Message = {
      id: Date.now().toString() + Math.random().toString(),
      sender,
      text,
      timestamp: new Date(),
      isSystem
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleSendMessage = useCallback((text: string) => {
    addMessage('user', text);

    // LEARNING MODE
    if (botState === BotState.LEARNING && learningTrigger) {
      dbService.insertKnowledge(learningTrigger, text, 'general');
      refreshData();
      
      addMessage('bot', `INSERT INTO knowledge (pattern, response) VALUES ('${learningTrigger}', '${text}');`, true);
      addMessage('bot', isCloudConnected 
        ? 'Bilgiyi Buluta kaydettim! Artık diğer kullanıcılar da bunu biliyor.' 
        : 'Yerel hafızaya kaydedildi.'
      );
      
      setBotState(BotState.IDLE);
      setLearningTrigger(null);
      return;
    }

    // NORMAL MODE
    const tableSource = isCloudConnected ? 'CLOUD_DB' : 'LOCAL_DB';
    addMessage('bot', `SELECT * FROM ${tableSource} WHERE pattern LIKE '%${text}%'`, true);
    
    // 1. Try DB Match
    const found = dbService.findResponse(text);
    if (found) {
      setTimeout(() => {
        addMessage('bot', found.response);
      }, 400); 
      return;
    }

    // 2. Try Math
    const mathResult = dbService.tryMathEvaluation(text);
    if (mathResult) {
       dbService.insertKnowledge(text, mathResult, 'math');
       refreshData();
       addMessage('bot', `Otomatik Hesaplama Algılandı. Sonuç ${isCloudConnected ? 'Buluta' : 'DB\'ye'} işleniyor...`, true);
       setTimeout(() => {
        addMessage('bot', mathResult);
       }, 400);
       return;
    }

    // 3. Unknown -> Trigger Learning
    setTimeout(() => {
      setLearningTrigger(text);
      setBotState(BotState.LEARNING);
      addMessage('bot', `Bilgi bulunamadı. "${text}" ne demek? Bana öğretirsen veritabanına yazarım.`);
    }, 500);

  }, [botState, learningTrigger, isCloudConnected]);

  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      
      {/* Cloud Setup Modal */}
      {showCloudSetup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                          <Cloud className="text-blue-400" />
                          Online Veritabanı Kurulumu
                      </h2>
                      <button onClick={() => setShowCloudSetup(false)} className="text-gray-400 hover:text-white"><X /></button>
                  </div>
                  
                  <div className="space-y-4">
                      <p className="text-sm text-gray-300">
                          Uygulamanın "Online" ve "Çok Oyunculu" çalışması için ücretsiz bir 
                          <span className="text-green-400 font-bold"> Supabase</span> projesi bağlamalısın.
                      </p>
                      
                      <div className="text-xs bg-gray-900 p-3 rounded border border-gray-700">
                          <ol className="list-decimal list-inside space-y-1 text-gray-400">
                              <li>Supabase.com'da ücretsiz proje oluştur.</li>
                              <li>SQL Editörüne gir ve şu kodu çalıştır: <br/>
                                  <code className="text-green-300 select-all block mt-1 bg-black p-1 rounded">
                                    create table knowledge (
                                      id bigint generated by default as identity primary key,
                                      pattern text,
                                      response text,
                                      type text,
                                      created_at timestamp with time zone default timezone('utc'::text, now())
                                    );
                                  </code>
                              </li>
                              <li>Project Settings -> API bölümünden URL ve Anon Key'i al.</li>
                          </ol>
                      </div>

                      <div>
                          <label className="text-xs text-gray-500 uppercase font-bold">Project URL</label>
                          <input 
                            value={cloudConfig.url}
                            onChange={e => setCloudConfig({...cloudConfig, url: e.target.value})}
                            type="text" 
                            placeholder="https://xyz.supabase.co" 
                            className="w-full bg-black border border-gray-600 rounded p-2 text-sm text-white"
                          />
                      </div>
                      <div>
                          <label className="text-xs text-gray-500 uppercase font-bold">Anon Public Key</label>
                          <input 
                            value={cloudConfig.key}
                            onChange={e => setCloudConfig({...cloudConfig, key: e.target.value})}
                            type="password" 
                            placeholder="eyJhbGci..." 
                            className="w-full bg-black border border-gray-600 rounded p-2 text-sm text-white"
                          />
                      </div>

                      {connectionStatus === 'error' && (
                          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-2 rounded">
                              <AlertTriangle size={16} /> Bağlantı hatası! Bilgileri kontrol et.
                          </div>
                      )}

                      <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => connectToCloud(cloudConfig.url, cloudConfig.key)}
                            disabled={connectionStatus === 'connecting'}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold transition-all disabled:opacity-50"
                          >
                              {connectionStatus === 'connecting' ? 'Bağlanıyor...' : 'Bağlan ve Eşitle'}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Header Buttons (Mobile & Desktop) */}
      <div className="absolute top-4 right-4 z-40 flex gap-2">
         <button 
            onClick={() => setShowCloudSetup(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                isCloudConnected 
                ? 'bg-green-900/80 border-green-500 text-green-400' 
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            {isCloudConnected ? <Cloud size={16} /> : <CloudOff size={16} />}
            <span className="hidden md:inline">{isCloudConnected ? 'Online (Canlı)' : 'Offline (Yerel)'}</span>
         </button>
         
         <button 
            onClick={() => setShowDbMobile(!showDbMobile)}
            className="md:hidden bg-gray-800 p-2 rounded text-white border border-gray-700"
         >
            {showDbMobile ? <X size={20} /> : <Menu size={20} />}
         </button>
      </div>

      {/* Database Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-20 w-80 transform transition-transform duration-300 md:relative md:transform-none md:w-96
        ${showDbMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <DatabaseView data={knowledgeBase} onDataChange={refreshData} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 relative z-10 h-full flex flex-col">
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage}
          botState={botState}
          currentLearningTrigger={learningTrigger}
        />
      </div>
      
      {showDbMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setShowDbMobile(false)}
        />
      )}
    </div>
  );
}