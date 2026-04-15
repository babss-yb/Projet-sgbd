import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import DataViews from './components/DataViews';
import { LayoutDashboard, Database, MessageSquare, Bus } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const apiUrl = 'http://127.0.0.1:3000/api';

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'data', label: 'Données', icon: Database },
    { id: 'chat', label: 'Assistant IA', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-screen overflow-hidden relative bg-bgPrimary">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute rounded-full blur-[80px] opacity-40 animate-float w-[600px] h-[600px] 
            bg-[radial-gradient(circle,rgba(124,91,255,0.4)_0%,transparent_70%)] top-[-200px] left-[-200px] [animation-delay:0s]"></div>
        <div className="absolute rounded-full blur-[80px] opacity-40 animate-float w-[500px] h-[500px] 
            bg-[radial-gradient(circle,rgba(0,212,170,0.3)_0%,transparent_70%)] bottom-[-100px] right-[-100px] [animation-duration:25s] [animation-delay:-5s]"></div>
        <div className="absolute rounded-full blur-[80px] opacity-40 animate-float w-[400px] h-[400px] 
            bg-[radial-gradient(circle,rgba(255,107,157,0.25)_0%,transparent_70%)] top-[40%] left-[60%] [animation-duration:18s] [animation-delay:-10s]"></div>
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-[280px] bg-bgSecondary/70 backdrop-blur-[20px] border-b md:border-b-0 md:border-r border-white/5 flex flex-col z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <div className="p-8 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-primary shadow-glow">
            <Bus size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-primary bg-clip-text text-transparent">TranspoBot</span>
            <span className="text-xs text-textSecondary font-medium uppercase tracking-wider">Intelligence Urbaine</span>
          </div>
        </div>

        <nav className="flex-1 p-4 md:p-6 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`relative flex items-center gap-4 px-5 py-4 rounded-xl cursor-pointer font-medium text-sm transition-all duration-300 overflow-hidden whitespace-nowrap
                  ${isActive ? 'bg-gradient-card-blue text-textPrimary border border-[#7c5bff]/20' : 'text-textSecondary border border-transparent hover:bg-white/5 hover:text-textPrimary'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className={`flex items-center justify-center transition-colors duration-300 ${isActive ? 'text-accentPrimary' : 'text-inherit'}`}>
                  <Icon size={18} />
                </div>
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[60%] bg-accentPrimary rounded-r shadow-[0_0_10px_#7c5bff]"></div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="hidden md:block p-6 border-t border-white/5">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00d4aa]/10 border border-[#00d4aa]/20 rounded-full text-xs font-medium text-textPrimary">
            <span className="w-2 h-2 rounded-full bg-accentSecondary shadow-[0_0_8px_#00d4aa] animate-pulse"></span>
            <span>Système actif</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative z-[5] scroll-smooth">
        <div className="max-w-[1600px] mx-auto p-6 md:p-12 min-h-full">
          {activeTab === 'dashboard' && <Dashboard apiUrl={apiUrl} />}
          {activeTab === 'data' && <DataViews apiUrl={apiUrl} />}
          {activeTab === 'chat' && <Chat apiUrl={apiUrl} />}
        </div>
      </main>
    </div>
  );
}

export default App;
