import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import ProGate from '@/components/subscription/ProGate';
import { Button } from '@/components/ui/button';
import { Bot, Plus, Sparkles, LayoutTemplate, Download, FileText, FileDown, MessageCircle, Trash2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from '../components/agent/MessageBubble';
import TemplatesModal from '../components/agent/TemplatesModal';
import ConversationInput from '../components/agent/ConversationInput';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AGENT_NAME = 'CampaignStrategist';

const OracleOrb = ({ active }) => (
  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-700 ${active ? 'scale-110' : 'scale-100'}`}>
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-purple-600 opacity-90 animate-pulse" />
    <div className="absolute inset-1 rounded-full bg-gradient-to-tl from-indigo-300 via-violet-400 to-fuchsia-400 opacity-60 blur-sm" />
    <div className="absolute inset-0 rounded-full" style={{
      background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4) 0%, transparent 60%)'
    }} />
    <Bot className="relative z-10 w-7 h-7 text-white drop-shadow-lg" />
    {active && (
      <>
        <div className="absolute -inset-2 rounded-full border border-violet-300/40 animate-ping" />
        <div className="absolute -inset-4 rounded-full border border-indigo-200/20 animate-ping" style={{ animationDelay: '0.3s' }} />
      </>
    )}
  </div>
);

export default function AgentStudio() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const scrollAreaRef = useRef(null);
  const prevMessagesLen = useRef(0);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!activeConversation) return;
    const unsubscribe = base44.agents.subscribeToConversation(activeConversation.id, (data) => {
      setMessages(data.messages || []);
      // Detect if agent is still generating (last message is assistant with no content yet)
      const last = data.messages?.[data.messages.length - 1];
      setAgentTyping(last?.role === 'assistant' && !last?.content);
      scrollToBottom();
    });
    return () => unsubscribe();
  }, [activeConversation]);

  // Scroll on new messages
  useEffect(() => {
    if (messages.length !== prevMessagesLen.current) {
      prevMessagesLen.current = messages.length;
      scrollToBottom();
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }, 80);
  };

  const loadConversations = async () => {
    setIsLoading(true);
    const convos = await base44.agents.listConversations({ agent_name: AGENT_NAME });
    setConversations(convos);
    if (convos.length > 0) await loadConversation(convos[0].id);
    setIsLoading(false);
  };

  const loadConversation = async (id) => {
    const convo = await base44.agents.getConversation(id);
    setActiveConversation(convo);
    setMessages(convo.messages || []);
    scrollToBottom();
  };

  const handleNewConversation = async () => {
    const now = new Date();
    const label = now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const newConvo = await base44.agents.createConversation({
      agent_name: AGENT_NAME,
      metadata: { name: `Session · ${label}` }
    });
    const updated = await base44.agents.listConversations({ agent_name: AGENT_NAME });
    setConversations(updated);
    await loadConversation(newConvo.id);
  };

  const handleSend = async (text) => {
    if (!text.trim() || !activeConversation) return;
    await base44.agents.addMessage(activeConversation, { role: 'user', content: text });
  };

  const exportAsMarkdown = () => {
    const title = activeConversation?.metadata?.name || 'Conversation';
    const lines = [`# ${title}\n`, `*Exported ${new Date().toLocaleString()}*\n\n---\n`];
    messages.forEach((m) => {
      lines.push(`**${m.role === 'user' ? 'You' : 'Campaign Strategist'}**\n\n${m.content || ''}\n\n---\n`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `${title.replace(/\s+/g, '_')}.md` });
    a.click();
  };

  const exportAsPDF = () => {
    const title = activeConversation?.metadata?.name || 'Conversation';
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
      <style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;color:#1a1a1a}
      h1{color:#6d28d9;border-bottom:2px solid #ede9fe;padding-bottom:12px}
      .meta{color:#6b7280;font-size:14px;margin-bottom:32px}
      .msg{margin-bottom:24px;padding:16px;border-radius:12px}
      .user{background:#eef2ff;border-left:4px solid #6d28d9}
      .assistant{background:#f9fafb;border-left:4px solid #9ca3af}
      .role{font-weight:bold;font-size:13px;margin-bottom:6px;color:#374151}
      .content{line-height:1.7;white-space:pre-wrap}</style></head><body>
      <h1>${title}</h1><div class="meta">Exported ${new Date().toLocaleString()}</div>
      ${messages.map(m => `<div class="msg ${m.role}"><div class="role">${m.role === 'user' ? 'You' : 'Campaign Strategist'}</div>
      <div class="content">${(m.content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div></div>`).join('')}
      </body></html>`);
    win.document.close();
    win.onload = () => win.print();
  };

  return (
    <ProGate featureName="Campaign Strategist AI">
    <div className="h-screen flex overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 40%, #24243e 100%)'
    }}>
      <TemplatesModal
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelect={(prompt) => {
          setShowTemplates(false);
          if (activeConversation) handleSend(prompt);
        }}
      />

      {/* ── Sidebar ── */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r border-white/10 bg-white/5 backdrop-blur-md">
        {/* Brand */}
        <div className="px-5 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-1">
            <OracleOrb active={agentTyping} />
            <div>
              <h1 className="text-white font-bold text-base leading-tight">Agent Studio</h1>
              <p className="text-violet-300 text-xs">Campaign Strategist Oracle</p>
            </div>
          </div>
        </div>

        {/* New Conversation */}
        <div className="px-4 py-3 border-b border-white/10">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-violet-900/40 group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            New Session
            <Sparkles className="w-3.5 h-3.5 ml-auto opacity-70" />
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse mb-1" style={{ animationDelay: `${i * 0.1}s` }} />
            ))
          ) : conversations.length === 0 ? (
            <p className="text-white/30 text-xs text-center mt-8 px-4">No sessions yet. Start a new one above.</p>
          ) : (
            <AnimatePresence>
              {conversations.map((convo, i) => {
                const isActive = activeConversation?.id === convo.id;
                return (
                  <motion.button
                    key={convo.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => loadConversation(convo.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-start gap-2.5 group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600/30 to-indigo-600/20 border border-violet-400/30 text-white shadow-lg shadow-violet-900/20'
                        : 'text-white/60 hover:bg-white/8 hover:text-white/90 border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-violet-400 rounded-full" />
                    )}
                    <MessageCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? 'text-violet-300' : 'text-white/30 group-hover:text-white/50'}`} />
                    <span className="truncate leading-snug font-medium text-xs">
                      {convo.metadata?.name || 'Untitled Session'}
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-white/25 text-[10px] leading-relaxed text-center">
            Your AI oracle for campaign strategy & creative insight
          </p>
        </div>
      </div>

      {/* ── Main Chat ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <AnimatePresence mode="wait">
          {activeConversation ? (
            <motion.div
              key={activeConversation.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-white/5 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${agentTyping ? 'bg-violet-400 animate-pulse' : 'bg-emerald-400'}`} />
                  <h3 className="text-white/90 font-medium text-sm truncate">
                    {activeConversation?.metadata?.name || 'Session'}
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowTemplates(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/12 text-white/70 hover:text-white text-xs font-medium border border-white/10 transition-all duration-200"
                  >
                    <LayoutTemplate className="w-3.5 h-3.5" /> Templates
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/12 text-white/70 hover:text-white text-xs font-medium border border-white/10 transition-all duration-200">
                        <Download className="w-3.5 h-3.5" /> Export
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white/80">
                      <DropdownMenuItem onClick={exportAsMarkdown} className="gap-2 cursor-pointer hover:bg-white/10">
                        <FileText className="h-4 w-4 text-violet-400" /> Markdown
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={exportAsPDF} className="gap-2 cursor-pointer hover:bg-white/10">
                        <FileDown className="h-4 w-4 text-rose-400" /> PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollAreaRef}
                className="flex-1 overflow-y-auto px-6 py-6 space-y-2"
                style={{ scrollBehavior: 'smooth' }}
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <OracleOrb active={false} />
                    <p className="text-white/40 text-sm mt-4 max-w-xs">
                      The oracle awaits your first question. Ask anything about campaign strategy, audiences, or creative direction.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <MessageBubble message={msg} />
                      </motion.div>
                    ))}
                    {agentTyping && (
                      <motion.div
                        key="typing"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 ml-2"
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex gap-1 px-4 py-3 bg-white/8 rounded-2xl rounded-bl-none border border-white/10">
                          {[0, 1, 2].map((d) => (
                            <div key={d} className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t border-white/10 bg-black/20 backdrop-blur-sm shrink-0">
                <ConversationInput onSend={handleSend} disabled={agentTyping} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-8"
            >
              <OracleOrb active={false} />
              <h2 className="text-white text-2xl font-bold mt-6 mb-2">The Oracle Awaits</h2>
              <p className="text-white/50 text-sm max-w-sm mb-8">
                Start a new session to unlock strategic insights, campaign ideas, and creative guidance from your AI oracle.
              </p>
              <button
                onClick={handleNewConversation}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-xl shadow-violet-900/50 group"
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                Begin New Session
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </ProGate>
  );
}