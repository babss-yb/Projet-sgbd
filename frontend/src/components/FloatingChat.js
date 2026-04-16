import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles, Trash2, Copy, Check, X, Minus } from 'lucide-react';

const MAX_CHARS = 500;

/* ── Helpers ── */
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
    <button onClick={copy}
      className="flex items-center gap-1 text-[10px] text-textMuted hover:text-accentPrimary transition-colors mt-1"
      title="Copier SQL"
    >
      {copied ? <Check size={11} className="text-[#00d4aa]" /> : <Copy size={11} />}
      {copied ? 'Copié !' : 'Copier'}
    </button>
  );
}

/* ── FAB pulse ring ── */
function PulseRing() {
  return (
    <>
      <span className="absolute inset-0 rounded-full bg-accentPrimary opacity-30 animate-ping"></span>
      <span className="absolute inset-0 rounded-full bg-accentPrimary opacity-10 animate-pulse scale-125"></span>
    </>
  );
}

export default function FloatingChat({ apiUrl }) {
  const WELCOME = {
    role: 'assistant',
    content: 'Bonjour, je suis TranspoBot à votre service !',
    ts: new Date(),
  };

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { if (open && !minimized) { setUnread(0); inputRef.current?.focus(); } }, [open, minimized]);

  const handleOpen = () => { setOpen(true); setMinimized(false); setUnread(0); };
  const handleClose = () => setOpen(false);
  const handleMinimize = () => setMinimized(m => !m);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: text, ts: new Date() }]);

    try {
      const res = await axios.post(`${apiUrl}/chat`, { message: text });
      const msg = {
        role: 'assistant',
        content: res.data.natural_answer,
        sql: res.data.sql_query,
        explanation: res.data.explanation,
        results: res.data.results,
        sqlError: res.data.sql_error,
        ts: new Date(),
      };
      setMessages(prev => [...prev, msg]);
      if (!open || minimized) setUnread(n => n + 1);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Une erreur est survenue. Veuillez réessayer.',
        sqlError: err.response?.data?.error || err.message,
        ts: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMessages([{ ...WELCOME, ts: new Date() }]);
  const charCount = input.length;
  const overLimit = charCount > MAX_CHARS;

  const examples = [
    "Trajets terminés cette semaine ?",
    "Véhicules en maintenance ?",
    "Chauffeurs actifs ?",
  ];

  return (
    <>
      {/* ── Chat Panel ── */}
      <div
        className={`fixed bottom-20 right-6 z-[9999] w-[320px] max-w-[calc(100vw-3rem)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}
      >
        <div className="flex flex-col bg-bgSecondary/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(124,91,255,0.1)] overflow-hidden"
          style={{ height: minimized ? 'auto' : '540px' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#7c5bff]/20 to-[#00d4aa]/10 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-[0_0_15px_rgba(124,91,255,0.4)]">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-textPrimary text-sm">TranspoBot IA</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#7c5bff]/25 border border-[#7c5bff]/40 rounded-full text-[#7c5bff] font-bold uppercase tracking-wider">Beta</span>
                </div>
                <p className="text-[10px] text-textSecondary">Assistant intelligence artificielle</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={handleMinimize}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-textSecondary hover:text-textPrimary transition-all"
                title={minimized ? 'Agrandir' : 'Réduire'}
              >
                <Minus size={14} />
              </button>
              <button onClick={clearChat}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#ff6b9d]/20 flex items-center justify-center text-textSecondary hover:text-[#ff6b9d] transition-all"
                title="Effacer"
              >
                <Trash2 size={13} />
              </button>
              <button onClick={handleClose}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-textSecondary hover:text-textPrimary transition-all"
                title="Fermer"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Messages (caché si minimisé) */}
          {!minimized && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 max-w-[95%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-sm ${msg.role === 'user' ? 'bg-bgElevated border border-white/5 text-textSecondary' : 'bg-gradient-primary text-white shadow-[0_0_10px_rgba(124,91,255,0.3)]'}`}>
                      {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div className={`flex flex-col flex-1 min-w-0 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-3 py-2.5 text-[0.8rem] leading-relaxed text-textPrimary break-words overflow-hidden max-w-full
                        ${msg.role === 'user'
                          ? 'bg-[#7c5bff]/15 border border-[#7c5bff]/25 rounded-tl-2xl rounded-tr-sm rounded-b-2xl'
                          : 'bg-bgElevated border border-white/5 rounded-tl-sm rounded-tr-2xl rounded-b-2xl'}`}
                      >
                        <div className="flex justify-between items-start gap-4 mb-1">
                          <div className="flex-1">{msg.content}</div>
                          <div className="shrink-0"><MessageTime ts={msg.ts} /></div>
                        </div>

                        {msg.sql && (
                          <div className="mt-2.5 pt-2.5 border-t border-white/5 max-w-full">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[9px] uppercase tracking-widest text-accentPrimary font-semibold">SQL Exécuté</span>
                              <CopyButton text={msg.sql} />
                            </div>
                            <pre className="bg-[#0d1117] text-[#c9d1d9] px-2.5 py-2 rounded-lg border border-[#30363d] text-[9.5px] font-mono overflow-x-auto m-0 leading-relaxed whitespace-pre-wrap break-all">
                              {msg.sql}
                            </pre>
                          </div>
                        )}



                        {msg.results && msg.results.length > 0 && (
                          <div className="mt-2 bg-[#0d1117] border border-white/5 rounded-xl overflow-hidden max-w-full">
                            <div className="px-3 py-2 bg-white/[0.03] border-b border-white/5 text-[9px] text-textSecondary uppercase tracking-wider font-semibold">
                              {msg.results.length} résultat{msg.results.length > 1 ? 's' : ''}
                            </div>
                            <div className="overflow-x-auto w-full max-w-full block">
                              <table className="w-full border-collapse text-[10px] min-w-max">
                                <thead>
                                  <tr>{Object.keys(msg.results[0]).map(k => <th key={k} className="px-3 py-2 text-left border-b border-white/5 text-textSecondary font-semibold whitespace-nowrap">{k}</th>)}</tr>
                                </thead>
                                <tbody>
                                  {msg.results.slice(0, 4).map((row, j) => (
                                    <tr key={j} className="hover:bg-white/5">
                                      {Object.values(row).map((val, k) => <td key={k} className="px-3 py-1.5 border-b border-white/[0.03] text-textSecondary whitespace-nowrap">{val === null ? '—' : String(val)}</td>)}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            {msg.results.length > 4 && <p className="px-3 py-1.5 text-[9px] text-textMuted text-center">+{msg.results.length - 4} autres lignes</p>}
                          </div>
                        )}

                        {msg.sqlError && (
                          <div className="mt-2 px-3 py-2 bg-[#ff6b9d]/10 text-[#ff6b9d] border border-[#ff6b9d]/20 rounded-xl text-[10px]">
                            <strong>Erreur : </strong>{msg.sqlError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2.5 self-start">
                    <div className="w-8 h-8 rounded-xl bg-gradient-primary text-white flex items-center justify-center shrink-0">
                      <Bot size={14} />
                    </div>
                    <div className="px-4 py-3 bg-bgElevated border border-white/5 rounded-tl-sm rounded-tr-2xl rounded-b-2xl">
                      <div className="flex gap-1.5 items-center py-0.5">
                        <div className="w-1.5 h-1.5 bg-accentPrimary rounded-full animate-typing [animation-delay:-0.32s]"></div>
                        <div className="w-1.5 h-1.5 bg-accentPrimary rounded-full animate-typing [animation-delay:-0.16s]"></div>
                        <div className="w-1.5 h-1.5 bg-accentPrimary rounded-full animate-typing"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-white/5 shrink-0 bg-bgPrimary/50">
                {/* Suggestions */}
                <div className="flex gap-1.5 mb-2.5 overflow-x-auto scrollbar-none">
                  {examples.map((q, i) => (
                    <button key={i} type="button" onClick={() => setInput(q)}
                      className="bg-bgTertiary border border-white/5 text-textSecondary py-1 px-2.5 rounded-full text-[10px] whitespace-nowrap hover:border-accentPrimary hover:text-textPrimary transition-colors shrink-0"
                      disabled={loading}
                    >{q}</button>
                  ))}
                </div>

                <form onSubmit={sendMessage} className="relative flex items-center gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    maxLength={MAX_CHARS}
                    placeholder="Posez votre question..."
                    disabled={loading}
                    className={`flex-1 bg-bgTertiary border rounded-2xl py-2.5 px-3 pr-10 text-[0.8rem] text-textPrimary placeholder:text-textMuted focus:outline-none transition-all disabled:opacity-50
                      ${overLimit ? 'border-[#ff6b9d]/40 focus:shadow-[0_0_0_2px_rgba(255,107,157,0.2)]' : 'border-white/5 focus:border-accentPrimary/40 focus:shadow-[0_0_0_2px_rgba(124,91,255,0.15)]'}`}
                  />
                  <button type="submit" disabled={loading || !input.trim() || overLimit}
                    className="absolute right-1.5 w-7 h-7 bg-gradient-primary rounded-xl flex items-center justify-center text-white transition-all hover:scale-105 disabled:opacity-40 disabled:transform-none shadow-[0_4px_12px_rgba(124,91,255,0.3)]"
                  >
                    <Send size={12} />
                  </button>
                </form>

                <div className="flex items-center justify-between mt-1.5 px-1">
                  <span className="text-[9px] text-textMuted">{messages.length - 1} message{messages.length > 2 ? 's' : ''} dans cette session</span>
                  <span className={`text-[9px] tabular-nums ${overLimit ? 'text-[#ff6b9d] font-bold' : charCount > MAX_CHARS * 0.8 ? 'text-[#ffb347]' : 'text-textMuted'}`}>
                    {charCount}/{MAX_CHARS}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── FAB Button ── */}
      <button
        onClick={open ? handleClose : handleOpen}
        aria-label="Ouvrir le chat IA"
        className={`fixed bottom-6 right-6 z-[9999] w-12 h-12 rounded-full flex items-center justify-center
          shadow-[0_8px_32px_rgba(124,91,255,0.5)] transition-all duration-300 ease-out
          ${open
            ? 'bg-bgElevated border border-white/10 text-textSecondary hover:text-textPrimary hover:bg-bgTertiary rotate-0'
            : 'bg-gradient-primary text-white hover:scale-110 hover:shadow-[0_12px_40px_rgba(124,91,255,0.6)]'}`}
      >
        {/* Pulse rings (visible uniquement si fermé) */}
        {!open && <PulseRing />}

        {/* Icon with smooth swap */}
        <div className={`relative transition-all duration-300 ${open ? 'rotate-90 scale-90' : 'rotate-0 scale-100'}`}>
          {open ? <X size={20} /> : <Sparkles size={20} />}
        </div>

        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff6b9d] border-2 border-bgPrimary rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </>
  );
}
