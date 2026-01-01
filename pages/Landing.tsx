
import React from 'react';
import { Link } from 'react-router-dom';

const RavenCrestSmall = () => (
  <svg viewBox="0 0 200 200" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 20L115 50H85L100 20Z" fill="white" />
    <path d="M40 60C40 60 60 140 100 170C140 140 160 60 160 60L100 40L40 60Z" stroke="white" strokeWidth="4" />
    <path d="M50 100H150V130C150 130 130 145 100 145C70 145 50 130 50 130V100Z" fill="black" stroke="white" strokeWidth="2" />
    <path d="M60 105C60 105 80 110 100 110C120 110 140 105 140 105" stroke="white" strokeWidth="1" strokeDasharray="4 2" />
    <path d="M30 50L60 80M170 50L140 80M30 150L60 120M170 150L140 120" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center relative overflow-x-hidden">
      {/* Top Navigation */}
      <nav className="w-full max-w-7xl px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <RavenCrestSmall />
          </div>
          <span className="font-black tracking-tighter text-xl">RAVEN</span>
        </div>
        <Link to="/auth" className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
          Log In
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-12 max-w-4xl mx-auto">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex justify-center mb-6">
            <div className="p-1 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-transform hover:scale-110 duration-500">
              <RavenCrestSmall />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
            RAVEN
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Private Communities. Secure Conversations. <br/>
            The elite platform for structured clans and groups.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <Link to="/auth" className="flex-1 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all text-lg shadow-lg">
              Join Raven
            </Link>
            <Link to="/auth" className="flex-1 border border-gray-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-all text-lg">
              Create a House
            </Link>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Already established? <Link to="/auth" className="text-white hover:underline decoration-red-900 underline-offset-4">Log In to your House</Link>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-24 pb-24">
          {[
            { title: "Encrypted", desc: "Your data is your own. We focus on true private networking.", icon: "🔒" },
            { title: "AI Moderation", desc: "Automated community safety powered by advanced LLMs.", icon: "🧠" },
            { title: "House Structure", desc: "Advanced roles, private channels, and group collaboration.", icon: "🛡️" }
          ].map((feat, i) => (
            <div key={i} className="bg-[#111] border border-[#222] p-8 rounded-2xl text-left hover:border-gray-500 transition-all group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{feat.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
              <p className="text-gray-500 font-light">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
