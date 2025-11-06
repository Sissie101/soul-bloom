
import React, { useState, useEffect, useRef } from 'react';
import { agentSDK } from '@/agents';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Plus, Send } from 'lucide-react';
import MessageBubble from '../components/agent/MessageBubble';

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

    const handleSendMessage = async () => {
        if (!userInput.trim() || !activeConversation) return;

        const tempMessage = userInput;
        setUserInput('');

        await agentSDK.addMessage(activeConversation, {
            role: 'user',
            content: tempMessage,
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
                        {conversations.map(convo => (
                            <button
                                key={convo.id}
                                onClick={() => loadConversation(convo.id)}
                                className={`w-full text-left p-2 rounded-md text-sm ${activeConversation?.id === convo.id ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-slate-100'}`}
                            >
                                {convo.metadata?.name || 'New Conversation'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main chat window */}
            <div className="flex-grow flex flex-col h-full">
                {activeConversation ? (
                    <>
                        <div className="flex-grow p-6 overflow-y-auto" ref={scrollAreaRef}>
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <MessageBubble key={index} message={msg} />
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t bg-white">
                            <div className="relative">
                                <Input
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask the Campaign Strategist..."
                                    className="pr-12"
                                />
                                <Button
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                    onClick={handleSendMessage}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                         <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <Bot className="w-10 h-10 text-indigo-600"/>
                         </div>
                        <h2 className="text-2xl font-semibold">Welcome to the Agent Studio</h2>
                        <p className="text-gray-500 mt-2">Start a new conversation to chat with your Campaign Strategist AI.</p>
                        <Button onClick={handleNewConversation} className="mt-6"><Plus className="mr-2"/>New Conversation</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
