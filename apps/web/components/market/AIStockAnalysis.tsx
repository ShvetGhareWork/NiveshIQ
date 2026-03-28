'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';
import { API_BASE_URL } from '@/lib/api';

interface AIStockAnalysisProps {
    stock: any;
}

export function AIStockAnalysis({ stock }: AIStockAnalysisProps) {
    const { token } = useAuth();
    const { addNotification } = useNotifications();
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

            addNotification({
                title: 'Intelligence Decrypted',
                message: `AI Stock Analysis for ${stock.symbol} has been successfully synthesized.`,
                type: 'success',
                link: `/dashboard/market/stock/${stock.symbol}`
            });
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
        <div className="bg-[#111827] border-l-4 border-l-accent border-y-white/5 border-r-white/5 rounded-r-[1.5rem] md:rounded-r-[2rem] rounded-l-none p-5 sm:p-6 md:p-8 space-y-4 md:space-y-6 relative overflow-hidden group shadow-2xl">
            {/* Background Sparkle Effect */}
            <div className="absolute top-0 right-0 p-6 md:p-12 opacity-[0.05] group-hover:opacity-10 transition-all pointer-events-none">
                <Sparkles className="w-20 h-20 md:w-[120px] md:h-[120px] text-accent animate-pulse" />
            </div>

            <div className="flex items-start sm:items-center justify-between relative z-10 gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2.5 md:p-3 bg-accent/10 rounded-xl md:rounded-2xl border border-accent/20 shrink-0">
                        <Sparkles className="text-accent w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-black font-barlow-condensed tracking-normal text-white uppercase italic leading-none mb-1 md:mb-0">
                            NiveshIQ AI Analysis
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-accent tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.5em] uppercase opacity-60 truncate">
                                Groq Intelligence Engine v3.3
                            </p>
                            <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shrink-0 ${loading ? 'bg-accent animate-ping' : 'bg-emerald-500'}`} />
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-2 -mr-2 md:mr-0 text-muted-foreground hover:text-white transition-colors shrink-0"
                    aria-label={expanded ? "Collapse analysis" : "Expand analysis"}
                >
                    {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {expanded && (
                <div className="relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    {loading && analysis === '' ? (
                        <div className="flex flex-col items-center justify-center p-8 md:p-12 gap-3 md:gap-4">
                            <Loader2 size={28} className="animate-spin text-accent md:w-8 md:h-8" />
                            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-muted-foreground tracking-[0.2em] sm:tracking-[0.4em] md:tracking-[0.6em] uppercase text-center">
                                Synchronizing Neural Net...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="flex items-start md:items-center gap-3 md:gap-4 p-4 md:p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl md:rounded-2xl text-rose-500">
                            <AlertCircle size={20} className="shrink-0 mt-0.5 md:mt-0 md:w-6 md:h-6" />
                            <div className="space-y-1">
                                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Handshake Timeout</p>
                                <p className="text-[11px] md:text-xs font-bold opacity-80">{error}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-invert prose-xs max-w-none text-muted-foreground">
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => (
                                        <p className="text-[12px] md:text-[13px] font-bold leading-relaxed text-slate-300 italic mb-3 md:mb-4">
                                            {children}
                                        </p>
                                    ),
                                    li: ({ children }) => (
                                        // Added items-start so bullet aligns with the first line of wrapped text
                                        <li className="text-[11px] md:text-[12px] font-medium text-slate-400 mb-2 list-none flex items-start gap-2">
                                            <span className="text-accent shrink-0 mt-0.5">▹</span>
                                            <span>{children}</span>
                                        </li>
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="text-white font-black tracking-normal">{children}</strong>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="pl-0 mb-4">{children}</ul>
                                    )
                                }}
                            >
                                {analysis}
                            </ReactMarkdown>

                            {!loading && (
                                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/5">
                                    <p className="text-[8px] md:text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest leading-loose">
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