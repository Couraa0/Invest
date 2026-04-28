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
  Clock
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

const suggestedTopics = [
  { icon: TrendingUp, label: 'Apa saham blue chip?', color: 'text-primary' },
  { icon: LineChart, label: 'Cara baca grafik candle', color: 'text-secondary' },
  { icon: Brain, label: 'Psikologi investasi', color: 'text-primary' },
  { icon: Zap, label: 'Sektor cuan minggu ini', color: 'text-secondary' },
];

export default function Mentorship() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya InvestAI Mentor. Ada yang ingin kamu tanyakan seputar pasar saham hari ini? Saya bisa membantu kamu memahami laporan keuangan, membaca grafik, atau memberikan edukasi strategi investasi.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);
    
    // Mock response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Analisis yang bagus. Untuk sektor tersebut, AI saya mendeteksi potensi akumulasi jangka menengah karena rilis kebijakan suku bunga terbaru. Apakah kamu ingin saya bedah satu emiten spesifik di sektor ini?' }]);
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sidebar - Sessions history */}
      <aside className="hidden lg:flex flex-col w-80 shrink-0">
        <button className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 mb-6 hover:scale-[1.02] active:scale-95 transition-all group">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          New Discussion
        </button>

        <div className="flex-1 glass-card rounded-[2.5rem] p-6 flex flex-col overflow-hidden border-white/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Recent Sessions</h3>
            <Clock className="w-4 h-4 text-on-surface-variant/30" />
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { title: 'Analisis Saham BBCA', date: '2h ago' },
              { title: 'Strategi Dividen Investing', date: 'Yesterday' },
              { title: 'Apa itu Right Issue?', date: '3d ago' },
              { title: 'Review Portofolio Q1', date: '1w ago' },
            ].map((session, i) => (
              <div key={i} className="group cursor-pointer p-4 rounded-2xl hover:bg-white hover:shadow-md border border-transparent hover:border-primary/5 transition-all">
                <h4 className="text-sm font-bold text-primary truncate">{session.title}</h4>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-widest">{session.date}</p>
                  <MoreVertical className="w-3 h-3 text-on-surface-variant/0 group-hover:text-on-surface-variant/40 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100/50">
            <div className="bg-secondary/5 p-5 rounded-2xl border border-secondary/10 relative overflow-hidden group hover:bg-secondary/10 transition-colors cursor-help">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-4 h-4 text-secondary" />
                <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Premium Plus</span>
              </div>
              <p className="text-xs font-bold text-primary leading-snug">Get instant automated deep-dive fundamental analysis.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main className="flex-1 glass-card rounded-[2.5rem] flex flex-col overflow-hidden relative border-white/50 shadow-2xl">
        {/* Chat Header */}
        <header className="px-8 py-6 border-b border-white/40 backdrop-blur-md flex items-center justify-between bg-white/30 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Bot className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary border-4 border-white rounded-full"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-primary">InvestAI Mentor</h2>
                <div className="px-1.5 py-0.5 rounded-md bg-secondary/10 text-[8px] font-black text-secondary uppercase tracking-widest">AI Expert</div>
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mt-0.5">Always ready to guide your trades</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 text-on-surface-variant/40 hover:text-primary hover:bg-white rounded-xl transition-all">
              <Sparkles className="w-5 h-5" />
            </button>
            <button className="p-3 text-on-surface-variant/40 hover:text-error hover:bg-white rounded-xl transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-8 space-y-8 relative z-0 custom-scrollbar bg-slate-50/30">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-4",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold",
                msg.role === 'assistant' ? "bg-primary text-white" : "bg-white text-primary border border-slate-100 shadow-sm"
              )}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : 'U'}
              </div>
              
              <div className={cn(
                "p-5 text-sm leading-relaxed max-w-[80%] lg:max-w-[65%] shadow-sm transition-all",
                msg.role === 'assistant' 
                  ? "bg-white text-primary rounded-[1.5rem] rounded-tl-none border border-white" 
                  : "bg-primary text-white rounded-[1.5rem] rounded-tr-none shadow-xl shadow-primary/10"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white p-5 rounded-[1.5rem] rounded-tl-none border border-white flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-primary/20 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Entry Area */}
        <footer className="px-8 pb-10 pt-6 bg-white/80 backdrop-blur-md relative z-10">
          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 mb-6">
            {suggestedTopics.map((topic, i) => (
              <button 
                key={i}
                onClick={() => setInput(topic.label)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all text-xs font-bold text-primary group shadow-sm"
              >
                <topic.icon className={cn("w-3.5 h-3.5 group-hover:scale-110 transition-transform", topic.color)} />
                {topic.label}
              </button>
            ))}
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button className="p-2 text-on-surface-variant/30 hover:text-primary transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about stocks..."
              className="w-full pl-16 pr-28 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-primary font-medium placeholder:text-on-surface-variant/30"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button className="p-2 text-on-surface-variant/30 hover:text-primary transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSend}
                className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                disabled={!input.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <p className="text-center mt-4 text-[9px] font-black text-on-surface-variant/20 uppercase tracking-[0.2em]">InvestAI Expert Advisor • Data accurate as of today</p>
        </footer>
      </main>
    </div>
  );
}
