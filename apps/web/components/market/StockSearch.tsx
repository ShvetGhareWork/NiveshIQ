'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, TrendingUp, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface SearchResult {
    symbol: string;
    name: string;
    exchange: string;
}

export function StockSearch() {
    const router = useRouter();
    const { token } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const searchRef = useRef<HTMLDivElement>(null);

    const popularStocks = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'SBIN'];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setLoading(true);
                setIsOpen(true);
                try {
                    const res = await fetch(`${API_BASE_URL}/api/market/search?q=${query}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    setResults(data);
                } catch (error) {
                    console.error('Search failed:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(query.length > 0);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, token]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            setFocusedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter' && focusedIndex >= 0) {
            router.push(`/dashboard/market/stock/${results[focusedIndex].symbol}`);
            setIsOpen(false);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
            {/* Search Input Box */}
            <div className={`
                relative flex items-center bg-[#111827] border rounded-[2rem] p-1.5 transition-all duration-500
                ${isOpen ? 'border-accent shadow-[0_0_40px_rgba(212,175,55,0.1)] ring-1 ring-accent/20' : 'border-white/5 shadow-2xl hover:border-white/20'}
            `}>
                <div className="p-3 text-muted-foreground/40 group-hover:text-accent transition-colors">
                    <Search size={20} />
                </div>
                
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(query.length > 0)}
                    placeholder="Search NSE stocks — RELIANCE, TCS, INFY..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white font-bold tracking-wide placeholder:text-white/10 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[0.3em] h-12 px-2"
                />

                {loading ? (
                    <div className="p-3">
                        <Loader2 size={20} className="animate-spin text-accent" />
                    </div>
                ) : query && (
                    <button onClick={() => setQuery('')} className="p-3 text-muted-foreground hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Default State: Popular Chips */}
            {!isOpen && query === '' && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] mr-2">Top Nodes:</span>
                    {popularStocks.map(sym => (
                        <button
                            key={sym}
                            onClick={() => router.push(`/dashboard/market/stock/${sym}`)}
                            className="px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-full text-[10px] font-black tracking-widest text-muted-foreground hover:bg-accent/10 hover:border-accent/30 hover:text-accent transition-all duration-300 transform hover:scale-110 active:scale-95"
                        >
                            {sym}
                        </button>
                    ))}
                </div>
            )}

            {/* Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-[#111827] border border-accent/20 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] z-[100] overflow-hidden backdrop-blur-3xl animate-in zoom-in-95 duration-300">
                    <div className="p-3 border-b border-white/5 bg-accent/5">
                        <span className="text-[11px] font-black text-accent tracking-[0.4em] uppercase px-4 py-1">Stock Oracle Search Analysis</span>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                        {results.length > 0 ? (
                            results.map((item, i) => (
                                <button
                                    key={item.symbol}
                                    onClick={() => {
                                        router.push(`/dashboard/market/stock/${item.symbol}`);
                                        setIsOpen(false);
                                    }}
                                    onMouseEnter={() => setFocusedIndex(i)}
                                    className={`
                                        w-full flex items-center justify-between p-4 rounded-3xl transition-all duration-300 group/item text-left
                                        ${focusedIndex === i ? 'bg-white/[0.04] translate-x-1 outline-none' : 'hover:bg-white/[0.02]'}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-all ${focusedIndex === i ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 text-muted-foreground'}`}>
                                            <TrendingUp size={16} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black text-teal-400 tracking-tight">{item.symbol}</span>
                                                <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-md text-[8px] font-black text-muted-foreground opacity-60">
                                                    {item.exchange}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-bold text-muted-foreground line-clamp-1 uppercase opacity-40">{item.name}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black text-accent opacity-0 group-hover/item:opacity-100 transition-all ${focusedIndex === i ? 'translate-x-0 opacity-100' : 'translate-x-4'}`}>VIEW INTEL</span>
                                </button>
                            ))
                        ) : query.trim().length >= 2 && !loading ? (
                            <div className="p-12 text-center text-muted-foreground/20">
                                <Search size={48} className="mx-auto mb-4 opacity-10" />
                                <p className="text-[10px] font-black tracking-[0.5em] uppercase">No Stock Nodes Located</p>
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground/20">
                                <Loader2 size={48} className="mx-auto mb-4 opacity-10 animate-spin" />
                                <p className="text-[10px] font-black tracking-[0.5em] uppercase">Scanning NSE Grid...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
