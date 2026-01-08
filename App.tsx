import React, { useState, useEffect, useCallback } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { DatabaseView } from './components/DatabaseView';
import { BotState, Message, KnowledgeRow } from './types';
import * as dbService from './services/dbService';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeRow[]>([]);
  const [botState, setBotState] = useState<BotState>(BotState.IDLE);
  const [learningTrigger, setLearningTrigger] = useState<string | null>(null);
  const [showDbMobile, setShowDbMobile] = useState(false);

  // Initialize DB on mount
  useEffect(() => {
    refreshData();
    addMessage('bot', 'Sistem başlatıldı. SQL Veritabanı bağlandı. Hazırım!', true);
    addMessage('bot', 'Merhaba! Bana bir şeyler sor. Bilmiyorsam öğretmeni isteyeceğim.');
  }, []);

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

    // If we are in learning mode, this input is the ANSWER to the previous unknown question
    if (botState === BotState.LEARNING && learningTrigger) {
      // Save to DB
      const newRow = dbService.insertKnowledge(learningTrigger, text, 'general');
      
      // Update UI state
      refreshData(); // Refresh DB view
      addMessage('bot', `INSERT INTO knowledge (pattern, response) VALUES ('${learningTrigger}', '${text}');`, true);
      addMessage('bot', 'Teşekkürler! Bu bilgiyi veritabanıma kalıcı olarak kaydettim. Artık bunu biliyorum.');
      
      // Reset state
      setBotState(BotState.IDLE);
      setLearningTrigger(null);
      return;
    }

    // Normal Mode: Search DB
    addMessage('bot', `SELECT * FROM knowledge WHERE pattern LIKE '%${text}%'`, true);
    
    // 1. Try DB Match
    const found = dbService.findResponse(text);
    if (found) {
      setTimeout(() => {
        addMessage('bot', found.response);
      }, 400); // Slight delay for realism
      return;
    }

    // 2. Try Math Engine (if no DB match)
    const mathResult = dbService.tryMathEvaluation(text);
    if (mathResult) {
       // Auto-learn math result? Let's verify with user first or just show it.
       // User asked for "learning", so let's save this calculated result automatically if it's math
       const newRow = dbService.insertKnowledge(text, mathResult, 'math');
       refreshData();
       
       addMessage('bot', `Otomatik Hesaplama Algılandı. Sonuç DB'ye işleniyor...`, true);
       setTimeout(() => {
        addMessage('bot', mathResult);
       }, 400);
       return;
    }

    // 3. Unknown -> Trigger Learning Mode
    setTimeout(() => {
      setLearningTrigger(text);
      setBotState(BotState.LEARNING);
      addMessage('bot', `Sorgu sonucu boş döndü (0 rows). \n\n"${text}" ne demek? Veya buna nasıl cevap vermeliyim? Lütfen bana öğret.`);
    }, 500);

  }, [botState, learningTrigger]);

  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      
      {/* Mobile Toggle for DB */}
      <button 
        onClick={() => setShowDbMobile(!showDbMobile)}
        className="md:hidden absolute top-4 right-4 z-50 bg-gray-800 p-2 rounded text-white border border-gray-700"
      >
        {showDbMobile ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Database Sidebar (Left Menu) */}
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
      
      {/* Overlay for mobile when DB is open */}
      {showDbMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setShowDbMobile(false)}
        />
      )}
    </div>
  );
}