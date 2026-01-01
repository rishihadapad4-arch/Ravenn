
import React from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="p-6 md:p-12 max-w-3xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-red-800 to-black p-1 shadow-2xl">
          <img src={user.avatar} className="w-full h-full rounded-[1.4rem] object-cover" alt="" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold">{user.username}</h1>
          <p className="text-gray-400 italic">"{user.bio}"</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] uppercase font-bold tracking-widest text-gray-600">
            <span className="bg-[#111] border border-[#222] px-3 py-1 rounded-full">Member Since {new Date(user.joinedAt).toLocaleDateString()}</span>
            <span className="bg-[#111] border border-[#222] px-3 py-1 rounded-full">Level: Operative</span>
          </div>
        </div>
      </header>

      <section className="space-y-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold border-b border-[#222] pb-2">Account Intelligence</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Notification Protocol", value: "Real-time" },
            { label: "Data Leak Protection", value: "Active" },
            { label: "Encryption Grade", value: "Military (AES-256)" },
            { label: "Linked Comms", value: "Disconnected" }
          ].map((item, i) => (
            <div key={i} className="bg-[#111] border border-[#222] p-4 rounded-xl flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">{item.label}</span>
              <span className="text-sm text-white font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="pt-12 flex gap-4">
        <button className="flex-1 bg-[#111] border border-[#222] text-white py-3 rounded-xl font-bold hover:bg-[#1a1a1a] transition-all">
          Edit Profile
        </button>
        <button onClick={onLogout} className="flex-1 bg-red-900/20 text-red-500 border border-red-900/30 py-3 rounded-xl font-bold hover:bg-red-900/40 transition-all">
          Terminate Session
        </button>
      </footer>
    </div>
  );
};

export default Profile;
