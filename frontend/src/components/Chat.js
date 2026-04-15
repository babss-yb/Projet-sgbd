import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles } from 'lucide-react';

function Chat({ apiUrl }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis TranspoBot. Demandez-moi de formuler des requêtes sur vos flottes, chauffeurs ou opérations. Je traduis tout en SQL pour vous.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await axios.post(`${apiUrl}/chat`, {
        message: userMessage
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.natural_answer,
        sql: response.data.sql_query,
        explanation: response.data.explanation,
        results: response.data.results,
        sqlError: response.data.sql_error
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Désolé, une erreur est survenue de mon côté.',
        sqlError: error.response?.data?.error || error.message
      }]);
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    "Nombre de trajets terminés cette semaine ?",
    "Quels chauffeurs ont eu un incident ce mois ?",
    "Véhicules nécessitant une maintenance ?",
    "Recette du jour de la ligne express ?"
  ];

  return (
    <div className="animate-fade-slide-up opacity-0 h-full flex flex-col">
      <div className="flex flex-col flex-1 bg-bgSurface backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] overflow-hidden max-h-[calc(100vh-80px)]">
        <div className="bg-[#161b22]/80 border-b border-white/5 p-6 shrink-0 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <div className="relative text-accentPrimary">
                <Sparkles size={20} className="animate-pulse-glow" />
              </div>
              <h2 className="text-xl font-bold m-0 bg-gradient-primary bg-clip-text text-transparent">TranspoBot IA</h2>
            </div>
            <p className="text-sm text-textSecondary m-0">Propulsé par NLP & Base de données en temps réel</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-4 max-w-[85%] animate-[messageSlideIn_0.3s_ease-out_forwards] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-bgTertiary text-textPrimary border border-white/5' : 'bg-gradient-primary text-white'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-5 flex-1 text-textPrimary shadow-sm relative ${msg.role === 'user' ? 'bg-[#7c5bff]/10 border border-[#7c5bff]/20 rounded-tl-2xl rounded-tr-sm rounded-b-2xl' : 'bg-bgElevated border border-white/5 rounded-tl-sm rounded-tr-2xl rounded-b-2xl'}`}>
                <div className="leading-relaxed text-[0.95rem]">{msg.content}</div>
                
                {msg.sql && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <h4 className="text-xs uppercase tracking-widest mb-2 text-accentPrimary">SQL Exécuté</h4>
                    <pre className="bg-[#0d1117] text-[#c9d1d9] p-4 rounded-lg border border-[#30363d] text-sm font-mono overflow-x-auto m-0">
                      {msg.sql}
                    </pre>
                  </div>
                )}
                
                {msg.explanation && (
                  <div className="mt-4 p-3 bg-[#00d4aa]/5 border-l-4 border-accentSecondary rounded-r-lg text-sm text-textSecondary">
                    <strong className="text-accentSecondary">Analyse :</strong> {msg.explanation}
                  </div>
                )}
                
                {msg.results && msg.results.length > 0 && (
                  <div className="mt-4 bg-[#0d1117] border border-white/5 rounded-lg overflow-hidden">
                    <h4 className="bg-white/5 p-3 px-4 text-xs text-textSecondary border-b border-white/5 m-0 font-semibold uppercase tracking-wider">Aperçu des données ({msg.results.length} lignes)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr>
                            {Object.keys(msg.results[0]).map(key => (
                              <th key={key} className="p-3 px-4 text-left border-b border-white/5 text-textPrimary font-semibold whitespace-nowrap">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {msg.results.slice(0, 5).map((row, i) => (
                            <tr key={i}>
                              {Object.values(row).map((val, j) => (
                                <td key={j} className="p-3 px-4 border-b border-white/5 text-textSecondary whitespace-nowrap last:border-b-0">{val === null ? 'null' : String(val)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {msg.results.length > 5 && (
                      <p className="p-3 px-4 text-xs text-textMuted text-center bg-white/5 m-0">+{msg.results.length - 5} autres enregistrements masqués</p>
                    )}
                  </div>
                )}
                
                {msg.sqlError && (
                  <div className="mt-4 p-3 px-4 bg-[#ff6b9d]/10 text-[#ff6b9d] border border-[#ff6b9d]/20 rounded-lg text-sm">
                    <strong>Erreur détectée :</strong> {msg.sqlError}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-4 max-w-[85%] self-start animate-[messageSlideIn_0.3s_ease-out_forwards]">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={20} />
              </div>
              <div className="p-3 px-5 bg-bgElevated border border-white/5 rounded-tl-sm rounded-tr-2xl rounded-b-2xl shadow-sm">
                <div className="flex gap-1.5 items-center py-2 relative">
                  <div className="w-2 h-2 bg-accentPrimary rounded-full animate-typing [animation-delay:-0.32s]"></div>
                  <div className="w-2 h-2 bg-accentPrimary rounded-full animate-typing [animation-delay:-0.16s]"></div>
                  <div className="w-2 h-2 bg-accentPrimary rounded-full animate-typing"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-[#161b22]/80 border-t border-white/5 shrink-0">
          <form onSubmit={handleSubmit} className="relative flex items-center mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: Montre-moi les véhicules en maintenance..."
              className="w-full py-5 pr-16 pl-6 bg-bgTertiary border border-white/5 rounded-full text-base text-textPrimary font-sans transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:border-accentPrimary focus:bg-bgElevated focus:shadow-[0_0_0_3px_rgba(124,91,255,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)] placeholder:text-textMuted disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
              autoFocus
            />
            <button 
              type="submit" 
              className="absolute right-2 w-12 h-12 bg-gradient-primary border-none rounded-full text-white flex items-center justify-center cursor-pointer transition-all duration-150 shadow-[0_4px_15px_rgba(124,91,255,0.3)] hover:scale-105 hover:shadow-[0_6px_20px_rgba(124,91,255,0.4)] disabled:bg-bgTertiary disabled:border disabled:border-white/5 disabled:text-textMuted disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading || !input.trim()}
              title="Envoyer à l'IA"
            >
              <Send size={20} />
            </button>
          </form>
          
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <span className="text-xs text-textMuted whitespace-nowrap font-medium">Suggestions :</span>
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(q)}
                className="bg-bgTertiary border border-white/5 text-textSecondary py-2 px-4 rounded-full text-xs cursor-pointer transition-colors whitespace-nowrap hover:border-accentPrimary hover:text-textPrimary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
