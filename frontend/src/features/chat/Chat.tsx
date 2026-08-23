"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

export function Chat() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: "Hi! I'm your MebingLocal AI Assistant. How can I help you plan your trip today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      // Use the actual backend API
      const res = await api.post("/ai/assistant", { query: userMsg, contextOverrides: {} });
      setMessages(prev => [...prev, { role: "assistant", content: res.data.response || res.data.answer || "I couldn't process that." }]);
    } catch (err: any) {
      toast.error("Failed to connect to AI Assistant");
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I am having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FE] font-['Plus_Jakarta_Sans']">
      <div className="flex-1 overflow-y-auto p-6" ref={scrollRef}>
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-[#C96F52]' : 'bg-[#1A3B2B]'}`}>
                {msg.role === 'user' ? <User size={20} color="#FFF" /> : <Bot size={20} color="#FFF" />}
              </div>
              <div 
                className={`p-4 rounded-2xl max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-[#C96F52] text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-[#2C4F3E] rounded-tl-none'
                }`}
                style={{ fontSize: 15, lineHeight: 1.6 }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1A3B2B]">
                <Bot size={20} color="#FFF" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-200 text-[#2C4F3E] rounded-tl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about itineraries, recommendations..."
            className="w-full bg-[#F8F9FE] border border-gray-200 rounded-2xl py-4 pl-6 pr-16 outline-none text-[#1A3B2B]"
            style={{ fontSize: 15 }}
          />
          <button 
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-3 w-10 h-10 bg-[#C96F52] rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
          >
            <Send size={18} color="#FFF" />
          </button>
        </div>
      </div>
    </div>
  );
}
