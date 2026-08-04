'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, ArrowUp } from 'lucide-react';
import { useStore } from '@/lib/storeContext';

export default function FloatingChat() {
  const { showToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '🌿 Namaste! Welcome to PrimeBrew Herbis. How can I help you choose your ideal herbal blend today?' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userText = message;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setMessage('');

    setTimeout(() => {
      let botReply = "Thank you for reaching out! Our tea expert will assist you shortly. In the meantime, try our Himalayan Sunrise Detox for morning energy or Midnight Serenity for sleep!";
      if (userText.toLowerCase().includes('sleep')) {
        botReply = "For sleep, we strongly recommend our 'Midnight Serenity Sleep Elixir' with Egyptian Chamomile and Lavender!";
      } else if (userText.toLowerCase().includes('detox') || userText.toLowerCase().includes('weight')) {
        botReply = "For detox & metabolism, check out our 'Himalayan Sunrise' or 'SlimFit Oolong' blends!";
      }
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="p-3 bg-white text-brand-darkGreen rounded-full shadow-card border border-brand-mint/40 hover:bg-brand-beige transition-all duration-300"
        title="Scroll to Top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="bg-white rounded-modal shadow-premium border border-brand-mint/40 w-80 sm:w-96 overflow-hidden flex flex-col h-96 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-brand-darkGreen text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-darkGreen font-bold text-xs">
                PB
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs">PrimeBrew Tea Concierge</h4>
                <span className="text-[10px] text-brand-mint flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online Now
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-brand-cream/50 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-card ${
                    m.sender === 'user'
                      ? 'bg-brand-green text-white rounded-tr-none'
                      : 'bg-white border border-brand-mint/30 text-brand-darkGreen shadow-soft rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              placeholder="Ask about tea benefits, ingredients..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-input focus:outline-none focus:border-brand-green"
            />
            <button
              type="submit"
              className="bg-brand-green text-white p-2 rounded-button hover:bg-brand-darkGreen transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-green hover:bg-brand-darkGreen text-white p-4 rounded-full shadow-premium flex items-center justify-center transition-all duration-300 hover:scale-105 border-2 border-brand-gold/50"
        title="Live Tea Advisor"
      >
        <MessageCircle className="w-6 h-6 text-brand-gold" />
      </button>
    </div>
  );
}
