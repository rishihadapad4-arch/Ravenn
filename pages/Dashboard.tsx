
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icons, MOCK_USER, MOCK_ROLES } from '../constants';
import { House } from '../types';

interface DashboardProps {
  houses: House[];
  addHouse: (house: House) => void;
}

const CreateHouseModal: React.FC<{ isOpen: boolean; onClose: () => void; onCreate: (h: House) => void }> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHouse: House = {
      id: `h-${Date.now()}`,
      name,
      description: desc,
      emblem: `https://picsum.photos/seed/${name}/200`,
      ownerId: MOCK_USER.id,
      membersCount: 1,
      isPrivate: true,
      roles: [...MOCK_ROLES],
      members: [{ id: MOCK_USER.id, username: MOCK_USER.username, avatar: MOCK_USER.avatar, roleId: 'r1', joinedAt: Date.now() }]
    };
    onCreate(newHouse);
    setName('');
    setDesc('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111] border border-[#222] w-full max-w-md rounded-3xl p-8 space-y-6 shadow-2xl">
        <h2 className="text-2xl font-bold">Initialize New House</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">House Name</label>
            <input 
              required
              className="w-full bg-black border border-[#333] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-900 outline-none transition-all"
              placeholder="e.g. Order of the Phoenix"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Purpose/Description</label>
            <textarea 
              className="w-full bg-black border border-[#333] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-900 outline-none transition-all min-h-[100px]"
              placeholder="What is the mission of this collective?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-[#222] font-bold text-gray-400 hover:bg-[#1a1a1a]">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const JoinHouseModal: React.FC<{ isOpen: boolean; onClose: () => void; onJoin: (h: House) => void }> = ({ isOpen, onClose, onJoin }) => {
  // Static simulation of public houses you haven't joined
  const publicHouses = [
    { id: 'p1', name: 'Cyber Runners', desc: 'Fast. Anonymous. Global.', emblem: 'https://picsum.photos/seed/cyber/200' },
    { id: 'p2', name: 'The Mint', desc: 'Secure asset management group.', emblem: 'https://picsum.photos/seed/mint/200' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111] border border-[#222] w-full max-w-md rounded-3xl p-8 space-y-6 shadow-2xl">
        <h2 className="text-2xl font-bold">Intercept Transmissions</h2>
        <div className="space-y-3">
          {publicHouses.map(ph => (
            <div key={ph.id} className="p-4 bg-black border border-[#222] rounded-2xl flex items-center justify-between hover:border-blue-900/50 transition-all cursor-pointer group"
              onClick={() => {
                const h: House = {
                  id: ph.id,
                  name: ph.name,
                  description: ph.desc,
                  emblem: ph.emblem,
                  ownerId: 'npc',
                  membersCount: 42,
                  isPrivate: false,
                  roles: [...MOCK_ROLES],
                  members: [{ id: MOCK_USER.id, username: MOCK_USER.username, avatar: MOCK_USER.avatar, roleId: 'r4', joinedAt: Date.now() }]
                };
                onJoin(h);
                onClose();
              }}>
              <div className="flex items-center gap-3">
                <img src={ph.emblem} className="w-10 h-10 rounded-lg" alt="" />
                <div>
                  <h4 className="font-bold text-sm">{ph.name}</h4>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">{ph.desc}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-500 group-hover:underline">Join</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl border border-[#222] font-bold text-gray-400 hover:bg-[#1a1a1a]">Close</button>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ houses, addHouse }) => {
  const navigate = useNavigate();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isJoinOpen, setJoinOpen] = useState(false);

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-12 pb-24">
      <CreateHouseModal 
        isOpen={isCreateOpen} 
        onClose={() => setCreateOpen(false)} 
        onCreate={(h) => {
          addHouse(h);
          navigate(`/house/${h.id}`);
        }} 
      />
      <JoinHouseModal 
        isOpen={isJoinOpen} 
        onClose={() => setJoinOpen(false)} 
        onJoin={(h) => addHouse(h)} 
      />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Intelligence Feed</h1>
          <p className="text-gray-500">Updates from your active sectors and houses.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setJoinOpen(true)}
            className="flex items-center gap-2 bg-[#111] border border-[#222] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1a1a1a] transition-all"
          >
            <Icons.Plus /> Join House
          </button>
          <button 
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all"
          >
            <Icons.Plus /> New House
          </button>
        </div>
      </header>

      <section className="space-y-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold border-b border-[#222] pb-2">Active Houses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {houses.map((house) => (
            <Link key={house.id} to={`/house/${house.id}`} className="block group">
              <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden hover:border-gray-500 transition-all duration-300">
                <div className="h-24 bg-gradient-to-r from-gray-900 to-black relative">
                  <img src={house.emblem} alt={house.name} className="absolute -bottom-6 left-6 w-16 h-16 rounded-xl border-4 border-[#111] shadow-xl group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-6 pt-10">
                  <h3 className="text-xl font-bold mb-1">{house.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{house.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-600 font-bold uppercase tracking-wider">
                    <span>{house.membersCount} Members</span>
                    <span className={house.isPrivate ? 'text-red-900' : 'text-blue-900'}>
                      {house.isPrivate ? 'Private' : 'Public'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold border-b border-[#222] pb-2">Recent Transmission</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl hover:bg-[#0f0f0f] transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">GhostAgent</span>
                  <span className="text-[10px] text-gray-600 uppercase font-bold">In Iron Vanguard • 2h ago</span>
                </div>
                <p className="text-sm text-gray-400">The latest security protocols have been uploaded to the vault. Please review your access keys before the next cycle starts...</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
