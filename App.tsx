import React, { useState } from 'react';
import { View } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { IdeaGenerator } from './pages/IdeaGenerator';
import { CaptionGenerator } from './pages/CaptionGenerator';
import { HashtagAssistant } from './pages/HashtagAssistant';
import { ContentCalendar } from './pages/ContentCalendar';
import { RepurposeContent } from './pages/RepurposeContent';
import { BrandVoiceTrainer } from './pages/BrandVoiceTrainer';
import { Analytics } from './pages/Analytics';
import { Settings } from 'lucide-react';

// Simplified Landing Page Component inline for single-file constraints if needed, but structured here
const LandingPage = ({ onLogin }: { onLogin: () => void }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
    <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
      <div className="text-2xl font-bold text-indigo-600 tracking-tight flex items-center gap-2">
         <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg">C</span>
         CreatorFlow
      </div>
      <div className="flex gap-4">
        <button onClick={onLogin} className="text-slate-600 font-medium hover:text-indigo-600">Log In</button>
        <button onClick={onLogin} className="px-5 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          Get Started Free
        </button>
      </div>
    </nav>

    <header className="max-w-5xl mx-auto text-center py-24 px-6">
      <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm mb-6 border border-indigo-100">
        ✨ AI-Powered for 10x Growth
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
        Your complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Content AI</span> workspace.
      </h1>
      <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Plan, generate, and optimize social media content in seconds. Stop staring at a blank page and start creating viral hits.
      </p>
      <button onClick={onLogin} className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-full hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-300">
        Start Creating for Free
      </button>
    </header>

    <div className="bg-white py-20 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
         {[
           { title: 'Idea Generation', desc: 'Get infinite personalized content ideas based on your niche.' },
           { title: 'Smart Captions', desc: 'Write engaging, human-like captions tailored to each platform.' },
           { title: 'Auto-Repurpose', desc: 'Turn one YouTube video into a week of Tweets and LinkedIn posts.' }
         ].map((f, i) => (
           <div key={i} className="p-6">
             <h3 className="text-xl font-bold mb-3 text-slate-900">{f.title}</h3>
             <p className="text-slate-500 leading-relaxed">{f.desc}</p>
           </div>
         ))}
      </div>
    </div>
  </div>
);

// Placeholder for Settings
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
       <Settings size={32} className="opacity-50" />
    </div>
    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
    <p>This module is under construction in the demo.</p>
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  if (!isAuthenticated) {
    return <LandingPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard onNavigate={setCurrentView} />;
      case View.IDEAS: return <IdeaGenerator />;
      case View.CAPTIONS: return <CaptionGenerator />;
      case View.HASHTAGS: return <HashtagAssistant />;
      case View.CALENDAR: return <ContentCalendar />;
      case View.REPURPOSE: return <RepurposeContent />;
      case View.BRAND_VOICE: return <BrandVoiceTrainer />;
      case View.ANALYTICS: return <Analytics />;
      case View.SETTINGS: return <PlaceholderPage title="Settings" />;
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        onLogout={() => setIsAuthenticated(false)} 
      />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
