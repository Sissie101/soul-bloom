import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PLACEHOLDER_HINTS = [
  "Ask about campaign strategy...",
  "Explore audience segments...",
  "Request creative ad copy ideas...",
  "Analyze competitor positioning...",
  "Plan your next launch sequence...",
];

export default function ConversationInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);

  // Cycle placeholder text
  useEffect(() => {
    if (focused) return;
    const timer = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_HINTS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [focused]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [value]);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`relative flex items-end gap-3 p-3 rounded-2xl border transition-all duration-300 ${
      focused
        ? 'bg-white/10 border-violet-400/50 shadow-lg shadow-violet-900/30'
        : 'bg-white/6 border-white/10'
    }`}>
      {/* Animated placeholder overlay when empty and not focused */}
      {!value && !focused && (
        <div className="absolute left-4 top-3.5 pointer-events-none overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={placeholderIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="text-white/30 text-sm"
            >
              {PLACEHOLDER_HINTS[placeholderIdx]}
            </motion.span>
          </AnimatePresence>
        </div>
      )}

      {/* Sparkle icon on focus */}
      <div className={`shrink-0 mb-0.5 transition-all duration-300 ${focused ? 'opacity-100' : 'opacity-30'}`}>
        <Sparkles className="w-4 h-4 text-violet-300" />
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        rows={1}
        className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder-transparent leading-relaxed py-0.5 max-h-40 disabled:opacity-50"
        placeholder=" "
      />

      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 mb-0.5 ${
          value.trim() && !disabled
            ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-800/50 hover:scale-105 active:scale-95'
            : 'bg-white/8 text-white/25 cursor-not-allowed'
        }`}
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}