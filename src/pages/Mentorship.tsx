import { motion } from 'motion/react';
import {
  Bot,
  Send,
  Sparkles,
  Plus,
  Zap,
  Brain,
  TrendingUp,
  LineChart,
  Paperclip,
  Mic,
  MoreVertical,
  Trash2,
  Clock,
  MessageSquare,
  History,
  X,
  Search
} from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../lib/utils';
import { api } from '../lib/api';

const suggestedTopics = [
  { icon: TrendingUp, label: 'Apa saham blue chip?', color: 'text-primary' },
  { icon: LineChart, label: 'Cara baca grafik candle', color: 'text-secondary' },
  { icon: Brain, label: 'Psikologi investasi', color: 'text-primary' },
  { icon: Zap, label: 'Sektor cuan minggu ini', color: 'text-secondary' },
];

// Demo user ID — production: set this from your auth system
const DEMO_USER_ID = localStorage.getItem('investai_user_id') || '';

const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://localhost:8000' : '');

function renderContent(content: string) {
  const lines = content.split('\n');
  return lines.map((line, idx) => {
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
    let cleanLine = line;
    if (isBullet) {
      cleanLine = line.trim().replace(/^[-*]\s+/, '');
    }

    const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
    const parsedLine = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pIdx} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (isBullet) {
      return (
        <li key={idx} className="ml-4 list-disc list-outside mb-1 text-primary/95">
          {parsedLine}
        </li>
      );
    }

    return (
      <p key={idx} className={cn("mb-1.5 min-h-[1em]", line.trim() === "" ? "h-2" : "")}>
        {parsedLine}
      </p>
    );
  });
}

interface DbSession { id: string; title: string; updated_at: string; }

export default function Mentorship() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya InvestAI Mentor. Ada yang ingin kamu tanyakan seputar pasar saham hari ini? Saya bisa membantu memahami laporan keuangan, membaca grafik, atau memberikan edukasi strategi investasi.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [searchSession, setSearchSession] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── DB sessions state ─────────────────────────────────────────────────────
  const [sessions, setSessions] = useState<DbSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const userId = DEMO_USER_ID;

  // Load sessions from backend on mount
  useEffect(() => {
    if (!userId) return;
    api.mentorship.getSessions(userId)
      .then(data => setSessions(data.map(s => ({ id: s.id, title: s.title, updated_at: s.updated_at }))))
      .catch(() => { /* backend not reachable – silent */ });
  }, [userId]);

  // Load messages when switching to a session
  const loadSession = useCallback(async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setShowMobileSidebar(false);
    try {
      const msgs = await api.mentorship.getMessages(sessionId);
      if (msgs.length > 0) {
        setMessages(msgs.map(m => ({ role: m.sender_role === 'ai' ? 'assistant' : m.sender_role, content: m.content })));
      } else {
        setMessages([{ role: 'assistant', content: 'Sesi dimulai. Apa yang ingin kamu tanyakan?' }]);
      }
    } catch {
      setMessages([{ role: 'assistant', content: 'Gagal memuat riwayat sesi.' }]);
    }
  }, []);

  // Create a new session in DB
  const handleNewSession = useCallback(async () => {
    const welcomeMsg = 'Halo! Sesi baru dimulai. Ada yang ingin kamu tanyakan seputar investasi?';
    if (userId) {
      try {
        const session = await api.mentorship.createSession(userId, 'New Session');
        setSessions(prev => [{ id: session.id, title: session.title, updated_at: session.created_at }, ...prev]);
        setActiveSessionId(session.id);
        // Persist opening message
        api.mentorship.addMessage(session.id, 'ai', welcomeMsg).catch(() => {});
      } catch { setActiveSessionId(null); }
    }
    setMessages([{ role: 'assistant', content: welcomeMsg }]);
  }, [userId]);

  // Delete session from DB
  const handleDeleteSession = useCallback(async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.mentorship.deleteSession(sessionId);
    } catch { /* ignore */ }
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      setMessages([{ role: 'assistant', content: 'Halo! Ada yang ingin kamu tanyakan?' }]);
    }
  }, [activeSessionId]);

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchSession.toLowerCase())
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();

    const updatedMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      let currentSessionId = activeSessionId;

      // If there is no active session (first chat), create one!
      if (!currentSessionId && userId) {
        const autoTitle = userMsg.slice(0, 50);
        const session = await api.mentorship.createSession(userId, autoTitle);
        currentSessionId = session.id;
        setActiveSessionId(currentSessionId);
        setSessions(prev => [{ id: session.id, title: autoTitle, updated_at: session.created_at }, ...prev]);
        
        // Save the first welcome message to DB as well (so history isn't missing it)
        api.mentorship.addMessage(currentSessionId, 'ai', messages[0].content).catch(() => {});
      }

      // Save user message to DB
      if (currentSessionId) {
        api.mentorship.addMessage(currentSessionId, 'user', userMsg).catch(() => {});
      }

      const response = await fetch(`${API_BASE}/api/mentor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({ role: msg.role, content: msg.content }))
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const aiContent = data.content || 'Gagal memproses jawaban dari AI.';
      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);

      // Save AI reply to DB
      if (currentSessionId) {
        api.mentorship.addMessage(currentSessionId, 'ai', aiContent).catch(() => {});
        // Auto-update session title from first user message
        setSessions(prev => {
          const currentSession = prev.find(s => s.id === currentSessionId);
          if (currentSession?.title === 'New Session') {
            const autoTitle = userMsg.slice(0, 50);
            api.mentorship.updateTitle(currentSessionId, autoTitle).catch(() => {});
            return prev.map(s => s.id === currentSessionId ? { ...s, title: autoTitle } : s);
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error chatting with mentor:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ **Koneksi Error**: Gagal menghubungi AI Mentor. Pastikan server backend (`localhost:8000`) sudah berjalan.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-x-0 top-16 bottom-16 bg-white flex flex-col lg:relative lg:inset-auto lg:bg-transparent lg:h-[calc(100dvh-144px)] lg:flex-row gap-4">
      {/* Mobile Sidebar Backdrop */}
      {showMobileSidebar && (
        <div className="fixed inset-x-0 top-16 bottom-16 bg-black/40 z-[60] lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setShowMobileSidebar(false)} />
      )}

      {/* Sessions Sidebar */}
      <aside className={cn(
        "fixed top-16 bottom-16 left-0 z-[60] bg-slate-50 w-72 p-4 flex flex-col gap-3 transition-transform duration-300 shadow-2xl lg:relative lg:inset-auto lg:translate-x-0 lg:p-0 lg:shadow-none lg:z-auto lg:bg-transparent lg:flex shrink-0 lg:h-[calc(100dvh-144px)]",
        showMobileSidebar ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex lg:hidden items-center justify-between mb-1 mt-2">
          <h2 className="font-bold text-primary">Riwayat Diskusi</h2>
          <button onClick={() => setShowMobileSidebar(false)} className="p-2 -mr-2 text-on-surface-variant/50 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <button onClick={handleNewSession} className="flex items-center justify-center gap-2.5 w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all group">
          <div className="w-6 h-6 bg-white/15 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform">
            <Plus className="w-3.5 h-3.5" />
          </div>
          New Discussion
        </button>

        <div className="flex-1 card rounded-2xl p-4 flex flex-col overflow-hidden min-h-0">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-on-surface-variant/40" />
              <h3 className="stat-label">Recent Sessions</h3>
            </div>
            <Clock className="w-3.5 h-3.5 text-on-surface-variant/30" />
          </div>

          <div className="relative mb-3 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
            <input
              type="text"
              placeholder="Cari riwayat obrolan..."
              value={searchSession}
              onChange={(e) => setSearchSession(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs text-primary placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => loadSession(session.id)}
                  className={cn(
                    "group cursor-pointer p-3 rounded-xl border transition-all",
                    activeSessionId === session.id
                      ? "bg-primary/5 border-primary/15"
                      : "hover:bg-slate-50 border-transparent hover:border-slate-100"
                  )}
                >
                  <h4 className="text-xs font-semibold text-primary truncate mb-0.5">{session.title}</h4>
                  <div className="flex items-center justify-between">
                    <p className="stat-label">{new Date(session.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</p>
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-error/50 hover:text-error hover:bg-error/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-on-surface-variant/50">Tidak ada riwayat ditemukan.</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 bg-white lg:card rounded-none lg:rounded-2xl flex flex-col overflow-hidden border-t border-slate-100 lg:border-none">
        {/* Chat Header */}
        <header className="px-3 sm:px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="lg:hidden p-2 -ml-1 text-on-surface-variant/40 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              onClick={() => setShowMobileSidebar(true)}
            >
              <History className="w-5 h-5" />
            </button>
            <div className="relative shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-secondary border-2 border-white rounded-full" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm font-bold text-primary truncate">InvestAI Mentor</h2>
                <span className="px-1.5 py-0.5 rounded-md bg-secondary/10 text-[8px] font-bold text-secondary uppercase tracking-wider shrink-0">AI Expert</span>
              </div>
              <p className="stat-label mt-0.5 truncate max-w-[200px]">Always ready to guide your trades</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <button className="p-1.5 sm:p-2 text-on-surface-variant/40 hover:text-primary hover:bg-slate-100 rounded-lg transition-all">
              <Sparkles className="w-4 h-4" />
            </button>
            <button className="p-1.5 sm:p-2 text-on-surface-variant/40 hover:text-error hover:bg-red-50 rounded-lg transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-5 custom-scrollbar bg-slate-50/30">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
            >
              <div className={cn(
                "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold",
                msg.role === 'assistant' ? "bg-primary text-white shadow-md shadow-primary/15" : "bg-white text-primary border border-slate-200 shadow-sm"
              )}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : 'U'}
              </div>
              <div className={cn(
                "px-4 py-3 text-sm leading-relaxed max-w-[80%] lg:max-w-[65%] rounded-2xl shadow-sm",
                msg.role === 'assistant'
                  ? "bg-white text-primary rounded-tl-none border border-slate-100"
                  : "bg-primary text-white rounded-tr-none shadow-md shadow-primary/10"
              )}>
                {msg.role === 'assistant' ? renderContent(msg.content) : msg.content}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/15">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1.5 items-center shadow-sm">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    className="w-1.5 h-1.5 bg-primary/30 rounded-full block"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <footer className="px-5 pb-5 pt-4 bg-white border-t border-slate-100">
          {/* Quick Topics */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 mb-3 pb-1 sm:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
            {suggestedTopics.map((topic, i) => (
              <button
                key={i}
                onClick={() => setInput(topic.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-primary/20 hover:bg-primary/4 transition-all text-[10px] sm:text-xs font-medium text-primary/70 hover:text-primary group shrink-0 whitespace-nowrap"
              >
                <topic.icon className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:scale-110 transition-transform", topic.color)} />
                {topic.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="relative">
            <button className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-on-surface-variant/30 hover:text-primary transition-colors">
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about stocks..."
              className="w-full pl-12 pr-24 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-primary font-medium placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/10 focus:border-primary/20 focus:bg-white outline-none transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button className="p-1.5 text-on-surface-variant/30 hover:text-primary transition-colors">
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-center mt-2.5 stat-label text-[8px] sm:text-[10px] truncate w-full px-2">InvestAI Expert Advisor · Akurat per hari ini</p>
        </footer>
      </main>
    </div>
  );
}
