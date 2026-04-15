import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import DataViews from './components/DataViews';
import Chat from './components/Chat';
import FloatingChat from './components/FloatingChat';
import { LayoutDashboard, Database, Bus, MessageSquare, Sun, Moon } from 'lucide-react';

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');
  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());
  const dateStr = time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="hidden md:block px-4 py-3 bg-[var(--border-color)] border border-[var(--border-color)] rounded-2xl text-center">
      <div className="flex items-center justify-center gap-1 text-2xl font-mono font-bold tracking-wider text-textPrimary mb-1">
        <span className="text-accentPrimary">{hours}</span>
        <span className="animate-pulse text-textMuted">:</span>
        <span>{minutes}</span>
        <span className="text-xs text-textMuted self-end mb-1">:{seconds}</span>
      </div>
      <div className="text-xs text-textMuted capitalize">{dateStr}</div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const apiUrl = 'http://127.0.0.1:3000/api';

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'data', label: 'Données & Cartes', icon: Database },
    { id: 'chat', label: 'Assistant IA', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-screen overflow-hidden relative bg-bgPrimary text-textPrimary transition-colors duration-300">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute rounded-full blur-[80px] opacity-20 dark:opacity-40 animate-float w-[600px] h-[600px] 
            bg-[radial-gradient(circle,rgba(124,91,255,0.4)_0%,transparent_70%)] top-[-200px] left-[-200px] [animation-delay:0s]"></div>
        <div className="absolute rounded-full blur-[80px] opacity-20 dark:opacity-40 animate-float w-[500px] h-[500px] 
            bg-[radial-gradient(circle,rgba(0,212,170,0.3)_0%,transparent_70%)] bottom-[-100px] right-[-100px] [animation-duration:25s] [animation-delay:-5s]"></div>
        <div className="absolute rounded-full blur-[80px] opacity-20 dark:opacity-40 animate-float w-[400px] h-[400px] 
            bg-[radial-gradient(circle,rgba(255,107,157,0.25)_0%,transparent_70%)] top-[40%] left-[60%] [animation-duration:18s] [animation-delay:-10s]"></div>
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-[280px] bg-bgSecondary/90 backdrop-blur-[20px] border-b md:border-b-0 md:border-r border-borderColor flex flex-col z-10 relative shadow-lg">
        <div className="p-6 flex items-center gap-4 border-b border-borderColor">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-primary shadow-glow shrink-0">
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
                  ${isActive ? 'bg-gradient-primary text-white shadow-md' : 'text-textSecondary border border-transparent hover:bg-borderColor hover:text-textPrimary'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className={`flex items-center justify-center transition-colors duration-300 ${isActive ? 'text-white' : 'text-inherit'}`}>
                  <Icon size={18} />
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 md:p-6 border-t border-borderColor flex flex-col gap-4">
          <div className="flex justify-between items-center bg-bgTertiary p-2 rounded-xl border border-borderColor">
            <button
              onClick={() => {
                setIsDarkMode(false);
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                !isDarkMode ? 'bg-white shadow text-textPrimary' : 'text-textMuted hover:text-textPrimary'
              }`}
            >
              <Sun size={14} /> Clair
            </button>
            <button
              onClick={() => {
                setIsDarkMode(true);
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                isDarkMode ? 'bg-bgElevated border border-white/10 shadow text-textPrimary' : 'text-textMuted hover:text-textPrimary'
              }`}
            >
              <Moon size={14} /> Sombre
            </button>
          </div>

          <LiveClock />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative z-[5] scroll-smooth">
        <div className="max-w-[1600px] mx-auto p-6 md:p-12 min-h-full">
          <div className="h-full">
            {activeTab === 'dashboard' && <Dashboard apiUrl={apiUrl} />}
            {activeTab === 'data' && <DataViews apiUrl={apiUrl} />}
            {activeTab === 'chat' && <Chat apiUrl={apiUrl} />}
          </div>
        </div>
      </main>
      
      {/* Note: The floating chat still lives here so it can be accessed overlaid */}
      <FloatingChat apiUrl={apiUrl} />
    </div>
  );
}

export default App;
