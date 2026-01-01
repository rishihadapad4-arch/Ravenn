
import React from 'react';

const ModerationPage: React.FC = () => {
  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-12">
      <header className="space-y-4">
        <div className="w-16 h-16 bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-900/30 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">The Guardian Protocol</h1>
        <p className="text-gray-500 text-lg">AI-powered safety for high-stakes communities.</p>
      </header>

      <section className="prose prose-invert max-w-none space-y-8">
        <div className="bg-[#111] border border-[#222] p-8 rounded-3xl space-y-4">
          <h3 className="text-xl font-bold">Automatic Filtering</h3>
          <p className="text-gray-400">RAVEN utilizes the latest Gemini-3 flash models to analyze transmissions in real-time. Content containing hate speech, illegal activities, or extreme harassment is automatically flagged and restricted to maintain community integrity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span> Zero Tolerance
            </h3>
            <ul className="text-gray-500 space-y-2 text-sm">
              <li>• Targeted harassment of members</li>
              <li>• Exposure of real-world identities (Doxxing)</li>
              <li>• Incitement of violence or physical harm</li>
              <li>• Spam or malicious phishing links</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Best Practices
            </h3>
            <ul className="text-gray-500 space-y-2 text-sm">
              <li>• Use respectful aliases</li>
              <li>• Report suspicious House requests</li>
              <li>• Keep House-specific intel within the House</li>
              <li>• Rotate your access codes regularly</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-900/10 border border-blue-900/20 p-6 rounded-2xl">
          <p className="text-blue-200 text-sm">
            <strong>Note:</strong> While we use AI for safety, RAVEN remains a free-speech zone for critical discussion and community organization. Our goal is safety from harm, not censorship of ideas.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ModerationPage;
