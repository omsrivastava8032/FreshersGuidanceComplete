import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Bot, User } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Message {
    role: 'user' | 'ai';
    content: string;
}

const Mentor = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: `Hi ${user?.name || 'there'}! I'm your AI Career Mentor. Ask me anything about career paths, internships, or skills you want to learn!` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await api.post('/ai/chat', { message: userMessage });
            setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
        } catch (error) {
            console.error("Failed to get AI response", error);
            toast.error("Failed to get response from AI Mentor");
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 h-[calc(100vh-4rem)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                    <Bot className="w-8 h-8 text-primary" />
                    AI Career Mentor
                </h1>
                <p className="text-muted-foreground mt-2">Your personal guide for career advice and technical questions</p>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden border-2">
                <CardHeader className="border-b bg-muted/30 py-4">
                    <CardTitle className="text-lg">Chat Session</CardTitle>
                    <CardDescription>Powered by Google Gemini</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 p-0 overflow-hidden relative">
                    <ScrollArea className="h-full p-4">
                        <div className="space-y-4 pb-4">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'ai' && (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-5 h-5 text-primary" />
                                        </div>
                                    )}

                                    <div
                                        className={`rounded-lg p-3 max-w-[80%] text-sm whitespace-pre-wrap ${msg.role === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-primary-foreground" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {loading && (
                                <div className="flex gap-3 justify-start">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-xs text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>
                </CardContent>

                <div className="p-4 border-t bg-background">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Ask about internships, skills, or career advice..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={loading}
                            className="flex-1"
                        />
                        <Button onClick={handleSend} disabled={loading || !input.trim()}>
                            <Send className="w-4 h-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Mentor;
