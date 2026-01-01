
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import HouseDetail from './pages/HouseDetail';
import ChatPage from './pages/ChatPage';
import Profile from './pages/Profile';
import ModerationPage from './pages/ModerationPage';
import HouseSettings from './pages/HouseSettings';
import { Icons, MOCK_USER, MOCK_HOUSES } from './constants';
import { User, House, Friend, Message } from './types';

const Sidebar: React.FC<{ user: User | null }> = ({ user }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#222] flex justify-around items-center py-3 md:relative md:w-20 md:h-screen md:flex-col md:border-t-0 md:border-r md:pt-8 md:pb-8 z-50">
      <Link to="/dashboard" className={`p-2 rounded-xl transition-all ${isActive('/dashboard') ? 'bg-red-900/20 text-red-500' : 'text-gray-500 hover:text-white'}`}>
        <Icons.House />
      </Link>
      <Link to="/chat" className={`p-2 rounded-xl transition-all ${isActive('/chat') ? 'bg-blue-900/20 text-blue-500' : 'text-gray-500 hover:text-white'}`}>
        <Icons.Message />
      </Link>
      <Link to="/moderation" className={`p-2 rounded-xl transition-all ${isActive('/moderation') ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white'}`}>
        <Icons.Shield />
      </Link>
      <Link to="/profile" className={`p-2 rounded-xl transition-all ${isActive('/profile') ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white'}`}>
        <Icons.Profile />
      </Link>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [houses, setHouses] = useState<House[]>(MOCK_HOUSES);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [dmMessages, setDmMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('raven_user');
    const savedFriends = localStorage.getItem('raven_friends');
    const savedDms = localStorage.getItem('raven_dms');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedFriends) {
      setFriends(JSON.parse(savedFriends));
    }
    if (savedDms) {
      setDmMessages(JSON.parse(savedDms));
    }
    setLoading(false);
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('raven_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('raven_user');
  };

  const addFriend = (f: Friend) => {
    const updated = [...friends, f];
    setFriends(updated);
    localStorage.setItem('raven_friends', JSON.stringify(updated));
  };

  const saveDMs = (friendId: string, msgs: Message[]) => {
    const updated = { ...dmMessages, [friendId]: msgs };
    setDmMessages(updated);
    localStorage.setItem('raven_dms', JSON.stringify(updated));
  };

  const addHouse = (newHouse: House) => {
    setHouses(prev => [...prev, newHouse]);
  };

  const updateHouse = (updatedHouse: House) => {
    setHouses(prev => prev.map(h => h.id === updatedHouse.id ? updatedHouse : h));
  };

  if (loading) return <div className="h-screen w-screen bg-black flex items-center justify-center text-white font-bold tracking-widest uppercase text-xs">Loading RAVEN...</div>;

  return (
    <HashRouter>
      <div className="flex h-screen overflow-hidden bg-[#050505]">
        <Sidebar user={user} />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
            <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
            <Route path="/dashboard" element={user ? <Dashboard houses={houses} addHouse={addHouse} /> : <Navigate to="/" />} />
            <Route path="/house/:id" element={user ? <HouseDetail houses={houses} user={user} setHouses={setHouses} /> : <Navigate to="/" />} />
            <Route path="/house/:id/settings" element={user ? <HouseSettings houses={houses} updateHouse={updateHouse} /> : <Navigate to="/" />} />
            <Route path="/chat" element={user ? <ChatPage user={user} friends={friends} onAddFriend={addFriend} dmMessages={dmMessages} onSaveDMs={saveDMs} /> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
            <Route path="/moderation" element={user ? <ModerationPage /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
