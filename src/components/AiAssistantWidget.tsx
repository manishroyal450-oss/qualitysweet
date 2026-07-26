import React, { useState, useRef, useEffect } from 'react';
import { MenuItem, ViewMode } from '../types';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  ShoppingBag, 
  Plus, 
  Check, 
  RefreshCw,
  Search,
  MessageSquare,
  ChevronRight,
  Flame,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AiAssistantWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  allItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onViewChange: (view: ViewMode) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  suggestedItems?: MenuItem[];
  quickFollowups?: string[];
  timestamp: string;
}

export default function AiAssistantWidget({
  isOpen,
  onClose,
  allItems,
  onAddToCart,
  onViewChange
}: AiAssistantWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Namaste! 🙏 I am your Madhuram AI Food & Sweets Assistant. What are you craving today? Tell me your taste preferences, budget, or occasion!',
      quickFollowups: [
        '🍬 Pure Ghee Sweets',
        '🌿 Sugar-Free Options',
        '🌶️ Spicy Snacks under ₹150',
        '🍦 Ice Creams & Desserts'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleAddToCart = (item: MenuItem) => {
    onAddToCart(item);
    setAddedItemIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const handleSend = async (customQuery?: string) => {
    const queryToSend = (customQuery || inputQuery).trim();
    if (!queryToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Build history for backend
      const historySummary = messages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToSend,
          menuItems: allItems,
          history: historySummary
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      
      // Map suggestedItemIds back to MenuItem objects
      const matchedItems: MenuItem[] = [];
      if (Array.isArray(data.suggestedItemIds)) {
        data.suggestedItemIds.forEach((id: string) => {
          const item = allItems.find(i => i.id === id);
          if (item) matchedItems.push(item);
        });
      }

      // If no item matched by id directly, perform fallback matching
      if (matchedItems.length === 0) {
        const lowerQ = queryToSend.toLowerCase();
        const matches = allItems.filter(item => 
          item.name.toLowerCase().includes(lowerQ) ||
          item.category.toLowerCase().includes(lowerQ) ||
          item.description.toLowerCase().includes(lowerQ)
        ).slice(0, 4);
        matchedItems.push(...matches);
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || "Here are some recommendations based on your search:",
        suggestedItems: matchedItems,
        quickFollowups: data.quickFollowups || [
          "Show more sweets",
          "Budget options under ₹100",
          "Filter by vegetarian"
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Assistant error:", err);
      // Fallback response if API call fails
      const lowerQ = queryToSend.toLowerCase();
      const matches = allItems.filter(item => 
        item.name.toLowerCase().includes(lowerQ) ||
        item.category.toLowerCase().includes(lowerQ) ||
        item.description.toLowerCase().includes(lowerQ)
      ).slice(0, 4);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: matches.length > 0
          ? `I found these ${matches.length} matching items from our store:`
          : `I searched for "${queryToSend}". Here are some popular customer favorites:`,
        suggestedItems: matches.length > 0 ? matches : allItems.slice(0, 4),
        quickFollowups: ["Show Ghee Sweets", "Popular Restaurant Starters", "View Cart"],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-2xl h-[88vh] max-h-[720px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="h-11 w-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Sparkles className="h-6 w-6 text-emerald-200 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black tracking-tight font-sans">Madhuram AI Assistant</h2>
                  <span className="text-[10px] font-extrabold bg-emerald-400/20 text-emerald-100 border border-emerald-300/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Smart Search
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 font-medium">
                  Search food, sweets & get personal recommendations
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all shrink-0 cursor-pointer"
              aria-label="Close AI Assistant"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Preset Category Pills / Quick Tips */}
          <div className="bg-slate-50 border-b border-slate-100 p-2.5 px-4 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0 text-xs">
            <span className="text-slate-400 font-bold shrink-0 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-amber-500" /> Ideas:
            </span>
            {[
              "🍬 Pure Desi Ghee Sweets",
              "🌿 Sugar-Free Options",
              "🌶️ Spicy Snacks under ₹150",
              "🍱 Dinner Thali & Mains",
              "🎁 Gift Boxes"
            ].map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(pill)}
                className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-3 py-1.5 rounded-full border border-slate-200 hover:border-emerald-200 font-medium whitespace-nowrap transition-all shadow-2xs shrink-0 cursor-pointer"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center gap-2 mb-1.5">
                    {msg.sender === 'ai' ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        <Bot className="h-3.5 w-3.5" /> AI Culinary Assistant
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-100">
                        You
                      </span>
                    )}
                    <span className={`text-[10px] ${msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message Content */}
                  <p className="text-sm leading-relaxed whitespace-pre-line font-normal">
                    {msg.text}
                  </p>

                  {/* Suggested Product Cards */}
                  {msg.suggestedItems && msg.suggestedItems.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2.5">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                        Recommended Items ({msg.suggestedItems.length}):
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {msg.suggestedItems.map((item) => {
                          const isAdded = !!addedItemIds[item.id];
                          return (
                            <div
                              key={item.id}
                              className="bg-slate-50 hover:bg-white rounded-xl p-2.5 border border-slate-200 flex gap-3 items-center transition-all group shadow-2xs hover:border-emerald-300"
                            >
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-16 w-16 object-cover rounded-lg shrink-0 bg-slate-200 border border-slate-100"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <h4 className="text-xs font-bold text-slate-900 truncate">
                                    {item.name}
                                  </h4>
                                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                                    ₹{item.price}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {item.description || item.category}
                                </p>
                                
                                <div className="mt-2 flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                    {item.category}
                                  </span>
                                  <button
                                    onClick={() => handleAddToCart(item)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                      isAdded
                                        ? 'bg-green-600 text-white'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                                    }`}
                                  >
                                    {isAdded ? (
                                      <>
                                        <Check className="h-3 w-3" /> Added
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="h-3 w-3" /> Add ₹{item.price}
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Followup Buttons */}
                  {msg.quickFollowups && msg.quickFollowups.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-2">
                      {msg.quickFollowups.map((followup, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(followup)}
                          className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                        >
                          {followup}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2 text-slate-500 text-xs py-2">
                <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center gap-2.5 shadow-2xs">
                  <RefreshCw className="h-4 w-4 text-emerald-600 animate-spin" />
                  <span className="font-semibold text-slate-700">Searching store catalog & analyzing items...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask AI e.g. 'Show pure ghee sweets under ₹250'..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold px-5 py-3 rounded-2xl transition-all flex items-center gap-1.5 shrink-0 shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Ask</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Powered by Gemini AI Engine</span>
              <button
                onClick={() => {
                  if (onViewChange) {
                    onClose();
                    onViewChange('sweet-shop');
                  }
                }}
                className="text-emerald-600 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                Browse Full Catalog <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
