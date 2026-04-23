import React, { useState, useEffect, useRef } from 'react';
import { agentSDK } from '@/agents';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Plus, Send, Download, FileText, FileDown } from 'lucide-react';
import MessageBubble from '../components/agent/MessageBubble';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AGENT_NAME = 'CampaignStrategist';

export default function AgentStudio() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);
      const convos = await agentSDK.listConversations({ agent_name: AGENT_NAME });
      setConversations(convos);
      if (convos.length > 0) {
        await loadConversation(convos[0].id);
      }
      setIsLoading(false);
    };
    loadConversations();
  }, []);

  useEffect(() => {
    if (!activeConversation) return;

    const unsubscribe = agentSDK.subscribeToConversation(activeConversation.id, (data) => {
      setMessages(data.messages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [activeConversation]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }, 100);
  };

  const loadConversation = async (id) => {
    const convo = await agentSDK.getConversation(id);
    setActiveConversation(convo);
    setMessages(convo.messages);
  };

  const handleNewConversation = async () => {
    const newConvo = await agentSDK.createConversation({
      agent_name: AGENT_NAME,
      metadata: { name: `Campaign Chat ${new Date().toLocaleTimeString()}` }
    });
    const updatedConvos = await agentSDK.listConversations({ agent_name: AGENT_NAME });
    setConversations(updatedConvos);
    await loadConversation(newConvo.id);
  };

  const exportAsMarkdown = () => {
    const title = activeConversation?.metadata?.name || 'Conversation';
    const lines = [`# ${title}\n`, `*Exported on ${new Date().toLocaleString()}*\n\n---\n`];
    messages.forEach((msg) => {
      const role = msg.role === 'user' ? '**You**' : '**Campaign Strategist**';
      lines.push(`${role}\n\n${msg.content || ''}\n\n---\n`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = () => {
    const title = activeConversation?.metadata?.name || 'Conversation';
    const printWindow = window.open('', '_blank');
    const html = `
      <!DOCTYPE html><html><head>
      <title>${title}</title>
      <style>
        body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; }
        h1 { color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; }
        .meta { color: #6b7280; font-size: 14px; margin-bottom: 32px; }
        .message { margin-bottom: 24px; padding: 16px; border-radius: 12px; }
        .user { background: #eef2ff; border-left: 4px solid #4f46e5; }
        .assistant { background: #f9fafb; border-left: 4px solid #9ca3af; }
        .role { font-weight: bold; font-size: 13px; margin-bottom: 6px; color: #374151; }
        .content { line-height: 1.7; white-space: pre-wrap; }
      </style></head><body>
      <h1>${title}</h1>
      <div class="meta">Exported on ${new Date().toLocaleString()}</div>
      ${messages.map((msg) => `
        <div class="message ${msg.role}">
          <div class="role">${msg.role === 'user' ? 'You' : 'Campaign Strategist'}</div>
          <div class="content">${(msg.content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </div>`).join('')}
      </body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.print(); };
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !activeConversation) return;

    const tempMessage = userInput;
    setUserInput('');

    await agentSDK.addMessage(activeConversation, {
      role: 'user',
      content: tempMessage
    });
  };

  return (
    <div className="h-screen flex bg-slate-50">
            {/* Sidebar for conversations */}
            <div className="w-1/4 min-w-[250px] bg-white border-r p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2"><Bot /> Agent Conversations</h2>
                    <Button size="icon" variant="ghost" onClick={handleNewConversation}><Plus /></Button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <div className="space-y-2 pr-2">
                        {conversations.map((convo) =>
            <button
              key={convo.id}
              onClick={() => loadConversation(convo.id)}
              className={`w-full text-left p-2 rounded-md text-sm ${activeConversation?.id === convo.id ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-slate-100'}`}>
              
                                {convo.metadata?.name || 'New Conversation'}
                            </button>
            )}
                    </div>
                </div>
            </div>

            {/* Main chat window */}
            <div className="flex-grow flex flex-col h-full">
                {activeConversation ?
        <>
                        <div className="flex items-center justify-between px-6 py-3 border-b bg-white">
                            <h3 className="font-semibold text-gray-700 text-sm truncate">{activeConversation?.metadata?.name || 'Conversation'}</h3>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline" className="gap-2 text-xs">
                                        <Download className="h-3.5 w-3.5" /> Export
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={exportAsMarkdown} className="gap-2 cursor-pointer">
                                        <FileText className="h-4 w-4 text-indigo-500" /> Download as Markdown
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={exportAsPDF} className="gap-2 cursor-pointer">
                                        <FileDown className="h-4 w-4 text-rose-500" /> Export as PDF
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="flex-grow p-6 overflow-y-auto" ref={scrollAreaRef}>
                            <div className="space-y-4">
                                {messages.map((msg, index) =>
              <MessageBubble key={index} message={msg} />
              )}
                            </div>
                        </div>
                        <div className="p-4 border-t bg-white">
                            <div className="relative">
                                <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask the Campaign Strategist..." className="bg-[hsl(var(--background))] pr-12 px-3 py-1 text-base rounded-md flex h-9 w-full border border-input shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />

              
                                <Button
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleSendMessage}>
                
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </> :

        <div className="flex flex-col items-center justify-center h-full text-center">
                         <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <Bot className="w-10 h-10 text-indigo-600" />
                         </div>
                        <h2 className="text-2xl font-semibold">Welcome to the Agent Studio</h2>
                        <p className="text-gray-500 mt-2">Start a new conversation to chat with your Campaign Strategist AI.</p>
                        <Button onClick={handleNewConversation} className="mt-6"><Plus className="mr-2" />New Conversation</Button>
                    </div>
        }
            </div>
        </div>);

}