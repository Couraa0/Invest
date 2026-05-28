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
  MessageSquare
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

const suggestedTopics = [
  { icon: TrendingUp, label: 'Apa saham blue chip?', color: 'text-primary' },
  { icon: LineChart, label: 'Cara baca grafik candle', color: 'text-secondary' },
  { icon: Brain, label: 'Psikologi investasi', color: 'text-primary' },
  { icon: Zap, label: 'Sektor cuan minggu ini', color: 'text-secondary' },
];

const sessions = [
  { title: 'Analisis Saham BBCA', date: '2h ago' },
  { title: 'Strategi Dividen Investing', date: 'Kemarin' },
  { title: 'Apa itu Right Issue?', date: '3 hari lalu' },
  { title: 'Review Portofolio Q1', date: '1 minggu lalu' },
];

const API_BASE = 'http://localhost:8000';

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

export default function Mentorship() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya InvestAI Mentor. Ada yang ingin kamu tanyakan seputar pasar saham hari ini? Saya bisa membantu memahami laporan keuangan, membaca grafik, atau memberikan edukasi strategi investasi.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const response = await fetch(`${API_BASE}/api/mentor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content || 'Gagal memproses jawaban dari AI.'
      }]);
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
    <div className="h-[calc(100vh-130px)] flex flex-col lg:flex-row gap-4">
      {/* Sessions Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 gap-3">
        <button className="flex items-center justify-center gap-2.5 w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all group">
          <div className="w-6 h-6 bg-white/15 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform">
            <Plus className="w-3.5 h-3.5" />
          </div>
          New Discussion
        </button>

        <div className="flex-1 card rounded-2xl p-4 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-on-surface-variant/40" />
              <h3 className="stat-label">Recent Sessions</h3>
            </div>
            <Clock className="w-3.5 h-3.5 text-on-surface-variant/30" />
          </div>

          <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
            {sessions.map((session, i) => (
              <div
                key={i}
                className="group cursor-pointer p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
              >
                <h4 className="text-xs font-semibold text-primary truncate mb-0.5">{session.title}</h4>
                <div className="flex items-center justify-between">
                  <p className="stat-label">{session.date}</p>
                  <MoreVertical className="w-3 h-3 text-on-surface-variant/0 group-hover:text-on-surface-variant/30 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="bg-secondary/6 p-4 rounded-xl border border-secondary/10 hover:bg-secondary/10 transition-colors cursor-help">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap className="w-3.5 h-3.5 text-secondary" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Premium Plus</span>
              </div>
              <p className="text-xs text-primary/70 leading-snug">Akses analisis fundamental mendalam secara instan.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 card rounded-2xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <header className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20">
                <Bot className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-secondary border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-primary">InvestAI Mentor</h2>
                <span className="px-1.5 py-0.5 rounded-md bg-secondary/10 text-[8px] font-bold text-secondary uppercase tracking-wider">AI Expert</span>
              </div>
              <p className="stat-label mt-0.5">Always ready to guide your trades</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 text-on-surface-variant/40 hover:text-primary hover:bg-slate-100 rounded-lg transition-all">
              <Sparkles className="w-4 h-4" />
            </button>
            <button className="p-2 text-on-surface-variant/40 hover:text-error hover:bg-red-50 rounded-lg transition-all">
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
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedTopics.map((topic, i) => (
              <button
                key={i}
                onClick={() => setInput(topic.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-primary/20 hover:bg-primary/4 transition-all text-xs font-medium text-primary/70 hover:text-primary group"
              >
                <topic.icon className={cn("w-3 h-3 group-hover:scale-110 transition-transform", topic.color)} />
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
          <p className="text-center mt-2.5 stat-label">InvestAI Expert Advisor · Akurat per hari ini</p>
        </footer>
      </main>
    </div>
  );
}
