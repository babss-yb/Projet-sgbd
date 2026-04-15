import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles, Trash2, Copy, Check } from 'lucide-react';

const MAX_CHARS = 500;

function MessageTime({ ts }) {
  return (
    <span className="text-[10px] text-textMuted mt-1 block">
      {ts.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
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
    content: 'Bonjour ! Je suis TranspoBot. Demandez-moi de formuler des requêtes sur vos flottes, chauffeurs ou opérations. Je traduis tout en SQL pour vous.',
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
    "Nombre de trajets terminés cette semaine ?",
    "Quels chauffeurs ont eu un incident ce mois ?",
    "Véhicules nécessitant une maintenance ?",
    "Recette totale des trajets terminés ?"
  ];

  const clearChat = () => setMessages([{ ...WELCOME, ts: new Date() }]);

  const charCount = input.length;
  const overLimit = charCount > MAX_CHARS;

  return (
    <div className="animate-fade-slide-up opacity-0 flex flex-col h-full">
      <div className="flex flex-col flex-1 bg-bgSurface backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] overflow-hidden max-h-[calc(100vh-80px)]">

        {/* Header */}
        <div className="bg-[#161b22]/80 border-b border-white/5 px-6 py-4 shrink-0 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <Sparkles size={18} className="text-accentPrimary animate-pulse" />
              <h2 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">TranspoBot IA</h2>
              <span className="text-[10px] px-2 py-0.5 bg-[#7c5bff]/20 border border-[#7c5bff]/30 rounded-full text-[#7c5bff] font-semibold uppercase tracking-wider">Beta</span>
            </div>
            <p className="text-xs text-textSecondary">Propulsé par NLP · {messages.length - 1} message{messages.length > 2 ? 's' : ''}</p>
          </div>
          <button
            onClick={clearChat}
            title="Effacer la conversation"
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-[#ff6b9d]/10 border border-white/5 hover:border-[#ff6b9d]/30 rounded-xl text-xs text-textSecondary hover:text-[#ff6b9d] transition-all duration-200"
          >
            <Trash2 size={13} />
            Effacer
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 max-w-[87%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              style={{ animation: `messageSlideIn 0.3s ease-out ${index === messages.length - 1 ? '0s' : '0s'} forwards` }}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-bgTertiary text-textSecondary border border-white/5' : 'bg-gradient-primary text-white'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-4 text-textPrimary shadow-sm ${msg.role === 'user' ? 'bg-[#7c5bff]/10 border border-[#7c5bff]/20 rounded-tl-2xl rounded-tr-sm rounded-b-2xl' : 'bg-bgElevated border border-white/5 rounded-tl-sm rounded-tr-2xl rounded-b-2xl'}`}>
                  <div className="text-[0.9rem] leading-relaxed">{msg.content}</div>

                  {msg.sql && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[10px] uppercase tracking-widest text-accentPrimary font-semibold">SQL Exécuté</h4>
                        <CopyButton text={msg.sql} />
                      </div>
                      <pre className="bg-[#0d1117] text-[#c9d1d9] px-4 py-3 rounded-lg border border-[#30363d] text-xs font-mono overflow-x-auto m-0 leading-relaxed">
                        {msg.sql}
                      </pre>
                    </div>
                  )}

                  {msg.explanation && (
                    <div className="mt-3 px-3 py-2.5 bg-[#00d4aa]/5 border-l-4 border-accentSecondary rounded-r-lg text-xs text-textSecondary leading-relaxed">
                      <strong className="text-accentSecondary">Analyse :</strong> {msg.explanation}
                    </div>
                  )}

                  {msg.results && msg.results.length > 0 && (
                    <div className="mt-3 bg-[#0d1117] border border-white/5 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between bg-white/[0.03] px-4 py-2.5 border-b border-white/5">
                        <span className="text-[10px] text-textSecondary uppercase tracking-wider font-semibold">Résultats · {msg.results.length} ligne{msg.results.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-xs">
                          <thead>
                            <tr>{Object.keys(msg.results[0]).map(k => <th key={k} className="px-4 py-2.5 text-left border-b border-white/5 text-textSecondary font-semibold whitespace-nowrap">{k}</th>)}</tr>
                          </thead>
                          <tbody>
                            {msg.results.slice(0, 5).map((row, i) => (
                              <tr key={i} className="hover:bg-white/5">
                                {Object.values(row).map((val, j) => <td key={j} className="px-4 py-2.5 border-b border-white/[0.03] text-textSecondary whitespace-nowrap">{val === null ? <span className="opacity-30">null</span> : String(val)}</td>)}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {msg.results.length > 5 && <p className="px-4 py-2 text-[10px] text-textMuted text-center bg-white/[0.02]">+{msg.results.length - 5} autres lignes</p>}
                    </div>
                  )}

                  {msg.sqlError && (
                    <div className="mt-3 px-4 py-3 bg-[#ff6b9d]/10 text-[#ff6b9d] border border-[#ff6b9d]/20 rounded-xl text-xs">
                      <strong>Erreur :</strong> {msg.sqlError}
                    </div>
                  )}
                </div>
                {msg.ts && <MessageTime ts={msg.ts} />}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 self-start">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary text-white flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="px-5 py-4 bg-bgElevated border border-white/5 rounded-tl-sm rounded-tr-2xl rounded-b-2xl">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-accentPrimary rounded-full animate-typing [animation-delay:-0.32s]"></div>
                  <div className="w-2 h-2 bg-accentPrimary rounded-full animate-typing [animation-delay:-0.16s]"></div>
                  <div className="w-2 h-2 bg-accentPrimary rounded-full animate-typing"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 bg-[#161b22]/80 border-t border-white/5 shrink-0">
          <form onSubmit={handleSubmit} className="relative flex items-center mb-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              maxLength={MAX_CHARS}
              placeholder="Ex: Montre-moi les véhicules en maintenance..."
              className={`w-full py-4 pr-16 pl-5 bg-bgTertiary border rounded-2xl text-sm text-textPrimary font-sans transition-all duration-300 focus:outline-none placeholder:text-textMuted disabled:opacity-60 disabled:cursor-not-allowed ${overLimit ? 'border-[#ff6b9d]/50 focus:border-[#ff6b9d] focus:shadow-[0_0_0_3px_rgba(255,107,157,0.15)]' : 'border-white/5 focus:border-accentPrimary/50 focus:shadow-[0_0_0_3px_rgba(124,91,255,0.15)]'}`}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 w-10 h-10 bg-gradient-primary border-none rounded-xl text-white flex items-center justify-center cursor-pointer transition-all duration-150 shadow-[0_4px_15px_rgba(124,91,255,0.3)] hover:scale-105 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading || !input.trim() || overLimit}
            >
              <Send size={16} />
            </button>
          </form>

          {/* Char counter */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] text-textMuted whitespace-nowrap">Suggestions :</span>
              {exampleQuestions.map((q, i) => (
                <button key={i} type="button" onClick={() => setInput(q)}
                  className="bg-bgTertiary border border-white/5 text-textSecondary py-1.5 px-3 rounded-full text-[11px] cursor-pointer whitespace-nowrap hover:border-accentPrimary hover:text-textPrimary transition-colors disabled:opacity-40"
                  disabled={loading}>
                  {q}
                </button>
              ))}
            </div>
            <span className={`text-[10px] tabular-nums shrink-0 ml-2 ${charCount > MAX_CHARS * 0.85 ? (overLimit ? 'text-[#ff6b9d] font-bold' : 'text-[#ffb347]') : 'text-textMuted'}`}>
              {charCount}/{MAX_CHARS}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
