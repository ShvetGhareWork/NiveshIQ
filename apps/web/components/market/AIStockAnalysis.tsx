'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/lib/api';

interface AIStockAnalysisProps {
    stock: any;
}

export function AIStockAnalysis({ stock }: AIStockAnalysisProps) {
    const { token } = useAuth();
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(true);
    const hasFetched = useRef(false);

    const fetchAnalysis = async () => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        
        setLoading(true);
        setError(null);
        setAnalysis('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/stock-analysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    symbol: stock.symbol,
                    price: stock.price,
                    pe_ratio: stock.pe_ratio,
                    market_cap: stock.market_cap,
                    change_percent: stock.change_percent,
                    week_52_high: stock.week_52_high,
                    week_52_low: stock.week_52_low,
                    sector: stock.sector,
                    description: stock.description?.substring(0, 1000)
                })
            });

            if (!response.ok) throw new Error('Failed to initiate AI handshake');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No stream readable');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                setAnalysis(prev => prev + chunk);
            }
        } catch (err: any) {
            console.error('AI Stream Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (stock?.symbol) {
            fetchAnalysis();
        }
    }, [stock?.symbol]);

    return (
        <div className="bg-[#111827] border-l-4 border-l-accent border-y-white/5 border-r-white/5 rounded-r-[2rem] rounded-l-none p-8 space-y-6 relative overflow-hidden group shadow-2xl">
            {/* Background Sparkle Effect */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-10 transition-all">
                <Sparkles size={120} className="text-accent animate-pulse" />
            </div>

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20">
                        <Sparkles className="text-accent" size={20} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black font-barlow-condensed tracking-tight text-white uppercase italic">NiveshIQ AI Analysis</h3>
                        <p className="text-[10px] font-black text-accent tracking-[0.4em] uppercase opacity-60 flex items-center gap-2">
                             Groq Intelligence Engine v3.3
                             <span className={`w-2 h-2 rounded-full ${loading ? 'bg-accent animate-ping' : 'bg-emerald-500'}`} />
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setExpanded(!expanded)}
                    className="p-2 text-muted-foreground hover:text-white transition-colors"
                >
                    {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {expanded && (
                <div className="relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    {loading && analysis === '' ? (
                        <div className="flex flex-col items-center justify-center p-12 gap-4">
                            <Loader2 size={32} className="animate-spin text-accent" />
                            <p className="text-[10px] font-black text-muted-foreground tracking-[0.6em] uppercase">Synchronizing Neural Net...</p>
                        </div>
                    ) : error ? (
                        <div className="flex items-center gap-4 p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500">
                            <AlertCircle size={24} />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest">Handshake Timeout</p>
                                <p className="text-xs font-bold opacity-80">{error}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-invert prose-xs max-w-none text-muted-foreground space-y-4">
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => <p className="text-[13px] font-bold leading-relaxed text-slate-300 italic mb-4">{children}</p>,
                                    li: ({ children }) => <li className="text-[12px] font-medium text-slate-400 mb-2 list-none flex gap-2"><span className="text-accent">▹</span> {children}</li>,
                                    strong: ({ children }) => <strong className="text-white font-black">{children}</strong>
                                }}
                            >
                                {analysis}
                            </ReactMarkdown>
                            {!loading && (
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest leading-loose">
                                        This analysis is generated by an artificial intelligence model and is provided for educational and informational purposes only. It does not constitute financial, investment, or legal advice. NiveshIQ is not a SEBI-registered investment advisor. Always consult with a qualified professional before making financial decisions.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
