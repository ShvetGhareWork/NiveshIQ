"use client";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/hooks/useAuth";

interface ChatWidgetProps {
    portfolioData: any;
}

export default function ChatWidget({ portfolioData }: ChatWidgetProps) {
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
        { role: "ai", text: "SYSTEM INITIALIZED: I've analyzed your portfolio data. Ask me about your risk profile, scheme quality, or tax efficiency protocols." }
    ]);
    const [loading, setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/chat", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    question: userMsg,
                    portfolioData: portfolioData // Send the context!
                }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: "ai", text: data.answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: "ai", text: "ERROR: Lost connection to Oracle core. Please re-establish session." }]);
        } finally {
            setLoading(false);
        }
    };

    if (!portfolioData) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative flex items-center gap-3 bg-background border border-accent/30 hover:border-accent p-4 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all hover:scale-105 active:scale-95"
                >
                    <div className="absolute inset-0 bg-accent/5 rounded-2xl group-hover:bg-accent/10 transition-colors" />
                    <Sparkles className="w-6 h-6 text-accent relative z-10" />
                    <span className="text-[10px] font-black tracking-[0.2em] text-accent uppercase relative z-10">AI ANALYST</span>
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse relative z-10 ml-1 shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                </button>
            )}

            {isOpen && (
                <div className="glass-panel border border-border/40 w-[calc(100vw-3rem)] md:w-[420px] h-[550px] max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 backdrop-blur-xl relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[50px] pointer-events-none" />
                    
                    {/* Header */}
                    <div className="p-5 border-b border-border/30 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                                <Bot className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black font-barlow-condensed tracking-widest text-foreground uppercase">ORACLE ASSISTANT</h3>
                                <p className="text-[8px] font-black tracking-widest text-accent/60 uppercase">NEURAL ADVISORY ENABLED</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-transparent custom-scrollbar">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[92%] p-4 rounded-2xl text-[11px] md:text-xs leading-relaxed transition-all ${m.role === 'user'
                                        ? 'bg-accent/10 text-accent border border-accent/20 rounded-tr-none font-bold'
                                        : 'bg-white/[0.03] text-foreground rounded-tl-none border border-white/5'
                                    }`}>
                                    <ReactMarkdown
                                        components={{
                                            p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                            strong: ({ ...props }) => <strong className="text-accent font-black" {...props} />,
                                            ul: ({ ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                                            ol: ({ ...props }) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                                            li: ({ ...props }) => <li className="mb-1" {...props} />,
                                        }}
                                    >
                                        {m.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/[0.03] p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-5 bg-white/[0.02] border-t border-border/30">
                        <div className="relative group">
                            <input
                                className="w-full bg-background/50 text-foreground border border-border/40 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 text-[11px] md:text-xs font-bold tracking-tight transition-all placeholder:text-muted-foreground/30"
                                placeholder="ENTER QUERY PROTOCOL..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg bg-accent text-background hover:scale-105 active:scale-95 disabled:opacity-20 disabled:scale-100 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="mt-3 text-[7px] font-black tracking-[0.2em] text-muted-foreground/40 text-center uppercase">SECURE ENCRYPTION CHANNEL // NIVESHIQ v1.0</p>
                    </div>
                </div>
            )}
        </div>
    );
}
