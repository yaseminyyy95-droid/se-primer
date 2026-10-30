/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { TutorContext } from '../data/tutorPrompt.ts';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface TutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context: TutorContext;
  initialQuestion: string;
}

export const TutorDrawer: React.FC<TutorDrawerProps> = ({
  isOpen,
  onClose,
  context,
  initialQuestion,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or reset conversation when context decision changes
  useEffect(() => {
    setMessages([
      {
        id: 'initial',
        role: 'model',
        text: initialQuestion,
      },
    ]);
  }, [context.decisionId, initialQuestion]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          context,
        }),
      });

      const data = await response.json();
      const replyText = data.reply?.trim() || initialQuestion;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: replyText,
        },
      ]);
    } catch (err) {
      console.error('Tutor chat request error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: initialQuestion,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-[420px] bg-[#0E1526] border-t border-slate-700/80 rounded-t-2xl shadow-2xl flex flex-col max-h-[85vh] h-[550px] animate-in slide-in-from-bottom duration-200">
        {/* Handle bar */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Drawer Header */}
        <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <span>Tutor (Kıdemli Sistem Mimarı)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] font-mono text-emerald-400 tracking-wider">
                ÇEVRİMİÇİ · SOKRATİK REHBERLİK
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Kapat"
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Teaching Target / Notice Banner */}
        <div className="px-4 py-1.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-1.5 text-[11px] text-amber-300/90 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="truncate">Tutor cevabı doğrudan söylemez, Sokratik sorularla düşündürür.</span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                data-testid="tutor-message"
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed font-sans ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-[#151F38] border border-slate-700/70 text-slate-200 rounded-tl-none font-serif italic'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-slate-400 font-mono">
              <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span>Tutor düşünüyor ve soru formüle ediyor...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
          <button
            type="button"
            onClick={() => handleSend('Hangisi doğru, sadece harfi söyle?')}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-300 hover:bg-slate-700 whitespace-nowrap flex-shrink-0"
          >
            &quot;Hangisi doğru, sadece harfi söyle?&quot;
          </button>
          <button
            type="button"
            onClick={() => handleSend('Veritabanı şema riskini nasıl anlarım?')}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 whitespace-nowrap flex-shrink-0"
          >
            &quot;Şema riskini nasıl anlarım?&quot;
          </button>
        </div>

        {/* Input area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-800 bg-[#0A101D] flex items-center gap-2"
        >
          <input
            type="text"
            data-testid="tutor-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tutor'a soru sor (örn: Şemayı nasıl kontrol ederim?)..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            data-testid="tutor-send"
            disabled={!inputText.trim() || isLoading}
            className="h-9 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
