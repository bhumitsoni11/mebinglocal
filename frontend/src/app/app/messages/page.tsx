'use client';

import React, { useState } from 'react';

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState('kenji');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Record<string, any[]>>({
    kenji: [
      { sender: 'them', text: 'Konnichiwa! Looking forward to showing you Tsukiji at dawn on Oct 24th.', time: '10:15 AM' },
      { sender: 'me', text: 'Thank you Kenji! Is it okay if we focus slightly more on seasonal knife sharpening?', time: '10:20 AM' },
      { sender: 'them', text: 'Absolutely! I will notify Master Yamamoto at the Sakai atelier in advance so he prepares raw carbon steel bars.', time: '10:22 AM' },
    ],
    elena: [
      { sender: 'them', text: 'Ciao! Let me know if you have any dietary restrictions for our wine window tasting.', time: 'Yesterday' },
    ],
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setMessages((prev) => ({
      ...prev,
      [activeChat]: [
        ...(prev[activeChat] || []),
        { sender: 'me', text: messageInput.trim(), time: 'Just now' },
      ],
    }));
    setMessageInput('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 pb-20">
      <div className="mb-6">
        <span className="font-label-caps uppercase text-secondary font-bold text-xs">Direct Messenger</span>
        <h1 className="font-headline-xl text-3xl font-bold text-on-surface mt-1">Host Conversations</h1>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        {/* Left Conversation List */}
        <div className="md:col-span-4 border-r border-surface-container-high flex flex-col">
          <div className="p-4 border-b border-surface-container-high">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:outline-none"
            />
          </div>

          <div className="divide-y divide-surface-container-low overflow-y-auto">
            <button
              type="button"
              onClick={() => setActiveChat('kenji')}
              className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                activeChat === 'kenji' ? 'bg-secondary-container/30' : 'hover:bg-surface-container-low'
              }`}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqfU5FIabnja1SwcN3cXbWR69mESaI9Zgpe-PrdyVDRQhyTvlR0JMuxEHnU34s-537bZnr1RV-YqqlMqgLIPWYt_vrF6IlDuMP3pmCaLIoPp-iICBrXe4A9fB_DCO0U8fuuc8MW9xPLkOmoJICvUFSOMbtEfrAUS5qwHzCNPTzvs8_RakwWALP2D51pBEItW6QHo2rSiIsr4yGvYQdJDpm0ub-kZUQCh-ccn6_LBzvlWwLKBqOVkOxCw"
                alt="Kenji"
                className="w-12 h-12 rounded-full object-cover shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-label-md font-bold text-on-surface text-sm">Kenji Tanaka</h4>
                  <span className="text-[10px] text-on-surface-variant">10:22 AM</span>
                </div>
                <p className="text-xs text-on-surface-variant truncate">I will notify Master Yamamoto...</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveChat('elena')}
              className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                activeChat === 'elena' ? 'bg-secondary-container/30' : 'hover:bg-surface-container-low'
              }`}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC01zPXzIKGzm7sn1XNsHYDkjcrHeiVpfUxzqP1t2LXby_oTTPaTYekLjOi0Ojqd-jIA6C530l_wi73snHfrA39XYourpLv_XJRBfSsjTkSw6sfxybFf2_w38498jBl6Tp0Dpy23aemyAQv6g-tQ0JeCDFLZAvaRhDz90rNFfO8_dchE3JPvJQ0iT6rWQqQGRkww0ePLFNXIzpPOjxHIrUcNFKCNB0d6uE7nQEugjV76TRqoQfmZ2qG5Q"
                alt="Elena"
                className="w-12 h-12 rounded-full object-cover shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-label-md font-bold text-on-surface text-sm">Elena Rossi</h4>
                  <span className="text-[10px] text-on-surface-variant">Yesterday</span>
                </div>
                <p className="text-xs text-on-surface-variant truncate">Ciao! Let me know if you have any...</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Active Chat Pane */}
        <div className="md:col-span-8 flex flex-col justify-between h-full bg-surface-container-low/40">
          {/* Header */}
          <div className="p-4 bg-surface-container-lowest border-b border-surface-container-high flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-label-lg font-bold text-on-surface text-base">
                {activeChat === 'kenji' ? 'Kenji Tanaka (Tokyo Host)' : 'Elena Rossi (Florence Host)'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Online
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary font-medium">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Encrypted</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {(messages[activeChat] || []).map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.sender === 'me'
                      ? 'bg-primary text-on-primary rounded-br-none shadow-sm'
                      : 'bg-surface-container-lowest text-on-surface rounded-bl-none border border-surface-container-high shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-on-surface-variant mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-4 bg-surface-container-lowest border-t border-surface-container-high flex items-center gap-3">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message to your host..."
              className="flex-1 px-5 py-3 rounded-full bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center shadow-md transition-all active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
