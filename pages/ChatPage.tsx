
import React, { useState, useRef, useEffect } from 'react';
import { User, Friend, Message } from '../types';
import { moderateContent } from '../geminiService';

interface ChatPageProps {
  user: User;
  friends: Friend[];
  onAddFriend: (f: Friend) => void;
  dmMessages: Record<string, Message[]>;
  onSaveDMs: (friendId: string, messages: Message[]) => void;
}

const AddRivalModal: React.FC<{ isOpen: boolean; onClose: () => void; onAdd: (name: string, code: string) => void; currentUserCode: string }> = ({ isOpen, onClose, onAdd, currentUserCode }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.trim() === currentUserCode) {
      setError("Cannot add yourself as a rival.");
      return;
    }
    
    onAdd(name, code);
    setName('');
    setCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111] border border-[#222] w-full max-w-md rounded-3xl p-8 space-y-6 shadow-2xl">
        <h2 className="text-2xl font-bold">Initialize Direct Comm</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Rival Identity (Name)</label>
            <input 
              required
              className="w-full bg-black border border-[#333] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-900 outline-none transition-all"
              placeholder="e.g. Oracle_X"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Transmission Code</label>
            <input 
              required
              className="w-full bg-black border border-[#333] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-900 outline-none transition-all"
              placeholder="RAVEN-XXXX"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-xs font-bold px-1">{error}</p>}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-[#222] font-bold text-gray-400 hover:bg-[#1a1a1a]">Abort</button>
            <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-red-900 text-white font-bold hover:bg-red-800">Add Rival</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ChatPage: React.FC<ChatPageProps> = ({ user, friends, onAddFriend, dmMessages, onSaveDMs }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedFriend, dmMessages]);

  const handleAddRival = (name: string, code: string) => {
    const newFriend: Friend = {
      id: `u-${Date.now()}`,
      username: name,
      avatar: `https://picsum.photos/seed/${code}/200`,
      commsCode: code,
      lastMessage: "Secure link established."
    };
    onAddFriend(newFriend);
    setSelectedFriend(newFriend);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFriend || !inputText.trim()) return;

    const content = inputText.trim();
    const newMessage: Message = {
      id: `dm-${Date.now()}`,
      senderId: user.id,
      senderName: user.username,
      senderAvatar: user.avatar,
      content: content,
      timestamp: Date.now(),
      recipientId: selectedFriend.id,
      status: 'sending'
    };

    const currentMsgs = dmMessages[selectedFriend.id] || [];
    const updatedMsgs = [...currentMsgs, newMessage];
    onSaveDMs(selectedFriend.id, updatedMsgs);
    setInputText('');

    // Background Moderation
    moderateContent(content).then(modResult => {
      const finalMsgs = (dmMessages[selectedFriend.id] || []).map(m => {
        if (m.id === newMessage.id) {
          return modResult.isSafe 
            ? { ...m, status: 'sent' as const } 
            : { ...m, content: '[FLAGGED: VULGARITY]', status: 'flagged' as const };
        }
        return m;
      });
      onSaveDMs(selectedFriend.id, finalMsgs);
    }).catch(() => {
      const finalMsgs = (dmMessages[selectedFriend.id] || []).map(m => 
        m.id === newMessage.id ? { ...m, status: 'sent' as const } : m
      );
      onSaveDMs(selectedFriend.id, finalMsgs);
    });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(user.commsCode);
    alert("Comms Code copied to secure clipboard.");
  };

  if (selectedFriend) {
    const messages = dmMessages[selectedFriend.id] || [];
    return (
      <div className="flex flex-col h-screen bg-[#050505]">
        <header className="p-4 border-b border-[#222] bg-[#0a0a0a] flex items-center gap-4">
          <button onClick={() => setSelectedFriend(null)} className="p-2 hover:bg-[#222] rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <img src={selectedFriend.avatar} className="w-8 h-8 rounded-full border border-[#333]" alt="" />
          <div>
            <h2 className="font-bold text-sm tracking-widest uppercase">{selectedFriend.username}</h2>
            <p className="text-[10px] text-green-500 font-bold uppercase">Encrypted Connection Active</p>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-center py-10 opacity-50 space-y-2">
            <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-gray-500">End-to-End Encrypted Session</p>
            <p className="text-xs text-gray-600">Established {new Date().toLocaleDateString()}</p>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.senderId === user.id ? 'flex-row-reverse' : ''} ${msg.status === 'sending' ? 'opacity-70' : ''}`}>
              <div className={`px-4 py-2 rounded-2xl text-sm ${msg.senderId === user.id ? 'bg-red-900/20 text-red-100 rounded-tr-none' : 'bg-[#1a1a1a] text-gray-200 rounded-tl-none'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-[#0a0a0a] border-t border-[#222]">
          <div className="flex items-center gap-3 bg-black border border-[#333] rounded-2xl px-4 py-1">
            <input
              type="text"
              className="flex-1 bg-transparent border-none focus:outline-none text-sm py-3"
              placeholder="Type secure transmission..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" disabled={!inputText.trim()} className="text-white disabled:opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-12">
      <AddRivalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddRival}
        currentUserCode={user.commsCode}
      />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Direct Comms</h1>
          <p className="text-gray-500">Secure one-to-one encrypted transmissions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-800 transition-all shadow-lg"
        >
          Add Rival
        </button>
      </header>

      {/* Identity Card */}
      <div className="bg-[#111] border border-[#222] p-6 rounded-3xl flex items-center justify-between group hover:border-gray-700 transition-all">
        <div className="space-y-1">
          <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Your Transmission ID</h4>
          <p className="text-2xl font-mono font-bold tracking-tighter text-white">{user.commsCode}</p>
        </div>
        <button 
          onClick={copyCode}
          className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all"
          title="Copy Code"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {friends.length === 0 ? (
          <div className="text-center p-12 bg-[#080808] border border-[#111] rounded-3xl space-y-4">
            <div className="text-4xl opacity-20">📡</div>
            <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">No active rivals detected in this sector.</p>
          </div>
        ) : (
          friends.map((dm) => (
            <div 
              key={dm.id} 
              onClick={() => setSelectedFriend(dm)}
              className="flex items-center gap-4 p-4 bg-[#111] border border-[#222] rounded-2xl hover:border-gray-500 transition-all cursor-pointer group"
            >
              <div className="relative">
                <img src={dm.avatar} className="w-12 h-12 rounded-full bg-gray-800 border border-[#333]" alt="" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white group-hover:text-red-400 transition-colors">{dm.username}</span>
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">{dm.commsCode}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1 italic">{dm.lastMessage}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 text-center p-8 border-2 border-dashed border-[#222] rounded-3xl">
        <div className="text-3xl mb-4">🤐</div>
        <h3 className="text-lg font-bold mb-1 uppercase tracking-tight">Zero-Knowledge Comms</h3>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">RAVEN uses end-to-end encryption. Only the intended recipient can decrypt your transmissions.</p>
      </div>
    </div>
  );
};

export default ChatPage;
