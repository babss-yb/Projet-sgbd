import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles, Trash2, Copy, Check } from 'lucide-react';

const MAX_CHARS = 500;

function MessageTime({ ts }) {
  if (!ts) return null;
  const isToday = new Date().toDateString() === ts.toDateString();
  const dateStr = ts.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  const timeStr = ts.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  
  return (
    <span className="text-[9px] text-textMuted font-medium opacity-50 whitespace-nowrap">
      {isToday ? timeStr : `${dateStr}. ${timeStr}`}
    </span>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      className="mt-2 flex items-center gap-1.5 text-[11px] text-textMuted hover:text-accentPrimary transition-colors"
      title="Copier la requête SQL"
    >
      {copied ? <Check size={12} className="text-[#00d4aa]" /> : <Copy size={12} />}
      {copied ? 'Copié !' : 'Copier'}
    </button>
  );
}

function Chat({ apiUrl }) {
  const WELCOME = {
    role: 'assistant',
    content: 'Bonjour, je suis TranspoBot à votre service !',
    ts: new Date()
  };

  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userMessage, ts: new Date() }]);

    try {
      const response = await axios.post(`${apiUrl}/chat`, { message: userMessage });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.natural_answer,
        sql: response.data.sql_query,
        explanation: response.data.explanation,
        results: response.data.results,
        sqlError: response.data.sql_error,
        ts: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Désolé, une erreur est survenue de mon côté.',
        sqlError: error.response?.data?.error || error.message,
        ts: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    "Trajets de cette semaine ?",
    "Véhicules en maintenance ?",
    "Chauffeurs actifs ?",
    "Recette totale ?"
  ];

  const clearChat = () => setMessages([{ ...WELCOME, ts: new Date() }]);

  const charCount = input.length;
  const overLimit = charCount > MAX_CHARS;

  return (
    <div className="animate-fade-slide-up opacity-0 flex flex-col lg:flex-row gap-6 h-full max-h-[calc(100vh-80px)]">
      
      {/* Sidebar - Context & Info */}
      <div className="hidden lg:flex flex-col w-80 shrink-0 gap-6">
        <div className="bg-bgSecondary/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center text-white mb-6 shadow-glow">
            <Bot size={24} />
          </div>
          <h3 className="text-xl font-bold text-textPrimary mb-2">Centre IA</h3>
          <p className="text-sm text-textSecondary leading-relaxed mb-6">
            Je suis connecté à votre base de données de transport urbain. Je peux analyser les flottes, les trajets, le personnel et les incidents en temps réel.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accentPrimary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={12} className="text-accentPrimary" />
              </div>
              <p className="text-xs text-textSecondary"><strong className="text-textPrimary block mb-0.5">Analyse SQL</strong> Conversion de requêtes naturelles en requêtes SQL optimisées.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accentSecondary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={12} className="text-accentSecondary" />
              </div>
              <p className="text-xs text-textSecondary"><strong className="text-textPrimary block mb-0.5">Export & Copie</strong> Exportez vos résultats ou copiez le SQL d'un clic.</p>
            </div>
          </div>
        </div>

        <div className="bg-bgSecondary/40 backdrop-blur-xl border border-white/5 rounded-3xl p-5 shadow-lg flex-1">
          <h4 className="text-[10px] uppercase tracking-widest text-textMuted font-bold mb-4 flex items-center gap-2">
            <Sparkles size={12} className="text-accentPrimary" />
            Conseils d'utilisation
          </h4>
          <ul className="space-y-3">
            {[
              "Soyez précis sur les périodes (ex: 'cette semaine').",
              "Mentionnez les statuts (ex: 'en maintenance').",
              "Utilisez des noms de colonnes explicites.",
              "Vérifiez toujours le SQL généré pour plus de précision."
            ].map((tip, i) => (
              <li key={i} className="text-[11px] text-textSecondary leading-relaxed flex gap-2">
                <span className="text-accentPrimary font-bold">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 bg-bgSurface backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.4)] overflow-hidden relative">
        {/* Header */}
        <div className="bg-bgSecondary/80 backdrop-blur-xl border-b border-borderColor/50 dark:border-white/5 px-6 py-5 shrink-0 flex items-center justify-between relative z-10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-glow relative">
              <Sparkles size={18} className="animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00d4aa] rounded-full border-2 border-bgSecondary"></div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-textPrimary">TranspoBot IA</h2>
                <span className="text-[9px] px-2 py-0.5 bg-accentPrimary/20 border border-accentPrimary/30 rounded-full text-accentPrimary font-bold uppercase tracking-wider">Operational</span>
              </div>
              <p className="text-[10px] text-textSecondary font-medium">NLP Core v2.4 · {messages.length - 1} interactions · Latence &lt; 120ms</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearChat}
              className="flex items-center gap-2 px-3 py-2 bg-bgTertiary hover:bg-accentTertiary/10 border border-borderColor/50 dark:border-white/5 rounded-xl text-[11px] font-bold text-textSecondary hover:text-accentTertiary transition-all duration-300"
            >
              <Trash2 size={13} />
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Messages space */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 scroll-smooth">
          {messages.map((msg, index) => (
            <div key={index} 
                 className={`flex gap-4 max-w-[90%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                 style={{ animation: `fadeSlideUp 0.4s ease-out forwards` }}>
              
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg border border-white/10 transition-all duration-300 ${msg.role === 'user' ? 'bg-bgTertiary text-textSecondary translate-y-2' : 'bg-gradient-primary text-white scale-110 shadow-glow'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>

              <div className={`flex flex-col flex-1 min-w-0 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-4 shadow-xl border overflow-hidden max-w-full relative transition-all duration-500
                    ${msg.role === 'user' 
                      ? 'bg-accentPrimary/10 border-accentPrimary/20 rounded-tl-2xl rounded-tr-sm rounded-b-2xl dark:bg-accentPrimary/5' 
                      : 'bg-bgElevated border-borderColor/50 dark:border-white/5 rounded-tl-sm rounded-tr-2xl rounded-b-2xl'}`}>
                  
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="text-[0.92rem] leading-relaxed text-textPrimary font-medium">{msg.content}</div>
                    <div className="shrink-0 mt-0.5"><MessageTime ts={msg.ts} /></div>
                  </div>

                  {msg.sql && (
                    <div className="mt-4 pt-4 border-t border-borderColor/30 dark:border-white/5">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-accentPrimary font-black">Structure SQL</span>
                        <CopyButton text={msg.sql} />
                      </div>
                      <pre className="bg-[#0d1117] text-[#c9d1d9] px-4 py-3.5 rounded-xl border border-[#30363d] text-[11px] font-mono overflow-x-auto m-0 leading-relaxed shadow-inner">
                        {msg.sql}
                      </pre>
                    </div>
                  )}

                  {msg.results && msg.results.length > 0 && (
                    <div className="mt-4 bg-[#0d1117] border border-white/5 rounded-2xl overflow-hidden max-w-full shadow-2xl">
                      <div className="flex items-center justify-between bg-white/[0.04] px-4 py-3 border-b border-white/5">
                        <span className="text-[10px] text-textSecondary uppercase tracking-widest font-black">Données Récupérées · {msg.results.length} lignes</span>
                      </div>
                      <div className="overflow-x-auto w-full max-w-full block scrollbar-thin">
                        <table className="w-full border-collapse text-[11px] min-w-max">
                          <thead>
                            <tr className="bg-white/[0.02]">
                              {Object.keys(msg.results[0]).map(k => (
                                <th key={k} className="px-5 py-3 text-left border-b border-white/5 text-textSecondary font-bold uppercase tracking-wider">{k}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {msg.results.slice(0, 10).map((row, i) => (
                              <tr key={i} className="hover:bg-white/[0.03] transition-colors border-b border-white/[0.02] last:border-0 text-textSecondary/80">
                                {Object.values(row).map((val, j) => (
                                  <td key={j} className="px-5 py-2.5 whitespace-nowrap">
                                    {val === null ? <span className="opacity-20 italic">null</span> : String(val)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {msg.results.length > 10 && (
                        <div className="px-4 py-2 text-[10px] text-accentPrimary text-center bg-white/[0.02] font-bold border-t border-white/5">
                          + {msg.results.length - 10} lignes supplémentaires masquées
                        </div>
                      )}
                    </div>
                  )}

                  {msg.sqlError && (
                    <div className="mt-4 px-4 py-3 bg-accentTertiary/10 text-accentTertiary border border-accentTertiary/20 rounded-xl text-xs flex gap-3 items-center">
                      <div className="w-2 h-2 rounded-full bg-accentTertiary animate-pulse"></div>
                      <span className="flex-1"><strong>Système :</strong> {msg.sqlError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 self-start">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary text-white flex items-center justify-center shrink-0 shadow-glow animate-bounce">
                <Bot size={18} />
              </div>
              <div className="px-6 py-5 bg-bgElevated border border-borderColor/50 dark:border-white/5 rounded-tl-sm rounded-tr-2xl rounded-b-2xl shadow-xl">
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-accentPrimary rounded-full animate-typing [animation-delay:-0.32s]"></div>
                  <div className="w-2 h-2 bg-accentPrimary rounded-full animate-typing [animation-delay:-0.16s]"></div>
                  <div className="w-2 h-2 bg-accentPrimary rounded-full animate-typing"></div>
                  <span className="text-[10px] text-textMuted uppercase tracking-widest ml-2 font-bold italic">Analyse en cours</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-6 py-5 bg-bgSecondary/85 backdrop-blur-3xl border-t border-borderColor/50 dark:border-white/5 shrink-0 relative z-10 transition-all duration-300">
          <form onSubmit={handleSubmit} className="relative flex items-center mb-4 group">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              maxLength={MAX_CHARS}
              placeholder="Ex: Liste des véhicules actifs à Casablanca..."
              className={`w-full py-4.5 pr-20 pl-6 bg-bgTertiary border rounded-2xl text-[0.95rem] text-textPrimary font-medium transition-all duration-500 focus:outline-none placeholder:text-textMuted/60 disabled:opacity-60 
                ${overLimit ? 'border-accentTertiary/50 focus:border-accentTertiary focus:shadow-[0_0_0_4px_rgba(255,107,157,0.1)]' : 'border-borderColor/50 focus:border-accentPrimary/50 focus:shadow-[0_0_0_4px_rgba(124,91,255,0.1)]'}`}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2.5 w-12 h-12 bg-gradient-primary border-none rounded-xl text-white flex items-center justify-center cursor-pointer transition-all duration-300 shadow-glow active:scale-95 disabled:opacity-30 disabled:grayscale disabled:scale-95"
              disabled={loading || !input.trim() || overLimit}
            >
              <Send size={20} />
            </button>
          </form>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              <span className="text-[9px] text-textMuted font-black uppercase tracking-[0.2em] whitespace-nowrap mr-2">Suggestions :</span>
              {exampleQuestions.map((q, i) => (
                <button key={i} type="button" onClick={() => setInput(q)}
                  className="bg-bgTertiary border border-borderColor/50 text-textSecondary py-1.5 px-4 rounded-xl text-[10px] font-bold cursor-pointer whitespace-nowrap hover:border-accentPrimary hover:scale-105 hover:text-textPrimary transition-all duration-300 disabled:opacity-40"
                  disabled={loading}>
                  {q}
                </button>
              ))}
            </div>
            <div className={`text-[10px] font-bold tabular-nums shrink-0 transition-colors px-2 py-1 rounded-md bg-bgTertiary border border-borderColor/20 ${charCount > MAX_CHARS * 0.85 ? (overLimit ? 'text-accentTertiary bg-accentTertiary/10' : 'text-accentWarning') : 'text-textMuted'}`}>
              {charCount} / {MAX_CHARS}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
