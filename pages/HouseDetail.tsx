
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_USER, Icons } from '../constants';
import { Message, House, User, Permission } from '../types';
import { moderateContent } from '../geminiService';

interface HouseDetailProps {
  houses: House[];
  user: User;
  setHouses: React.Dispatch<React.SetStateAction<House[]>>;
}

const HouseDetail: React.FC<HouseDetailProps> = ({ houses, user, setHouses }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const house = houses.find(h => h.id === id);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      senderId: 'u2',
      senderName: 'Vanguard_Alpha',
      senderAvatar: 'https://picsum.photos/seed/vanguard/50',
      content: 'Welcome to the inner circle.',
      timestamp: Date.now() - 3600000,
    }
  ]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!house) return <div className="p-10 text-white font-bold text-center">House not found in current sector.</div>;

  const memberInfo = house.members.find(m => m.id === user.id);
  const userRole = house.roles.find(r => r.id === memberInfo?.roleId);
  const canDelete = userRole?.permissions.includes(Permission.DELETE_MESSAGES) || house.ownerId === user.id;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = inputText.trim();
    if (!content) return;

    // OPTIMISTIC UPDATE: Add message instantly
    const newMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: user.id,
      senderName: user.username,
      senderAvatar: user.avatar,
      content: content,
      timestamp: Date.now(),
      houseId: id,
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Background Moderation
    moderateContent(content).then(modResult => {
      setMessages(prev => prev.map(m => {
        if (m.id === newMessage.id) {
          return modResult.isSafe 
            ? { ...m, status: 'sent' as const } 
            : { ...m, content: '[TRANSMISSION BLOCKED]', status: 'flagged' as const };
        }
        return m;
      }));
    }).catch(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'sent' as const } : m));
    });
  };

  const deleteMessage = (msgId: string) => {
    if (!canDelete) return;
    setMessages(prev => prev.filter(m => m.id !== msgId));
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <div className="p-4 border-b border-[#222] bg-[#0a0a0a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#222] rounded-lg transition-all">
            {/* Removed the redundant rotated Plus icon that was causing the TypeScript error and UI clutter */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <img src={house.emblem} className="w-8 h-8 rounded-lg" alt="" />
          <div>
            <h2 className="font-bold text-sm uppercase tracking-wider">{house.name}</h2>
            <p className="text-[10px] text-gray-500 uppercase font-bold">{house.membersCount} Operatives</p>
          </div>
        </div>
        <div className="flex gap-2">
          {(house.ownerId === user.id) && (
            <Link to={`/house/${id}/settings`} className="flex items-center gap-1 p-2 hover:bg-[#222] rounded-lg text-gray-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
              <Icons.Settings />
              <span className="hidden md:inline">Manage</span>
            </Link>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        <div className="text-center py-10 space-y-4">
          <img src={house.emblem} className="w-24 h-24 mx-auto rounded-3xl border border-[#333]" alt="" />
          <div>
            <h1 className="text-2xl font-bold">{house.name}</h1>
            <p className="text-gray-500 max-w-sm mx-auto">{house.description}</p>
          </div>
          <div className="h-[1px] bg-[#222] w-full" />
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 group transition-opacity duration-200 ${msg.senderId === user.id ? 'flex-row-reverse' : ''} ${msg.status === 'sending' ? 'opacity-70' : 'opacity-100'}`}>
            <img src={msg.senderAvatar} className="w-8 h-8 rounded-full border border-[#333]" alt="" />
            <div className={`space-y-1 max-w-[80%] ${msg.senderId === user.id ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400">{msg.senderName}</span>
                <span className="text-[10px] text-gray-600">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="relative group">
                <div className={`px-4 py-2 rounded-2xl text-sm ${msg.status === 'flagged' ? 'bg-red-900/50 italic text-red-100' : msg.senderId === user.id ? 'bg-red-900/20 text-red-100 rounded-tr-none' : 'bg-[#1a1a1a] text-gray-200 rounded-tl-none'}`}>
                  {msg.content}
                </div>
                {canDelete && (
                  <button 
                    onClick={() => deleteMessage(msg.id)}
                    className="absolute -top-2 -right-2 bg-red-900 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-[#0a0a0a] border-t border-[#222]">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-black border border-[#333] rounded-2xl px-4 py-1">
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:outline-none text-sm py-3"
            placeholder="Secure transmission..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" disabled={!inputText.trim()} className="text-white disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default HouseDetail;
