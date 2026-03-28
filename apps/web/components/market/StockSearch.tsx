'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, TrendingUp, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';

interface SearchResult {
    symbol: string;
    name: string;
    exchange: string;
}

export function StockSearch() {
    const router = useRouter();
    const { token } = useAuth();
    const { addNotification } = useNotifications();
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
                relative flex items-center bg-[#111827] border rounded-[1.5rem] md:rounded-[2rem] p-1 md:p-1.5 transition-all duration-500
                ${isOpen ? 'border-accent shadow-[0_0_30px_rgba(212,175,55,0.15)] ring-1 ring-accent/20' : 'border-white/5 shadow-xl hover:border-white/20'}
            `}>
                <div className="p-2 sm:p-3 text-muted-foreground/40 group-hover:text-accent transition-colors shrink-0">
                    <Search size={18} className="sm:w-5 sm:h-5" />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(query.length > 0)}
                    placeholder="Search NSE stocks (e.g. RELIANCE, TCS)..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white font-bold tracking-wide placeholder:text-white/20 placeholder:font-black placeholder:uppercase placeholder:text-[8px] sm:placeholder:text-[10px] placeholder:tracking-[0.2em] sm:placeholder:tracking-[0.3em] md:placeholder:tracking-[0.5em] h-10 sm:h-12 px-1 sm:px-2 w-full outline-none"
                />

                {loading ? (
                    <div className="p-2 sm:p-3 shrink-0">
                        <Loader2 size={18} className="sm:w-5 sm:h-5 animate-spin text-accent" />
                    </div>
                ) : query && (
                    <button onClick={() => setQuery('')} className="p-2 sm:p-3 text-muted-foreground hover:text-white transition-colors shrink-0 outline-none">
                        <X size={18} className="sm:w-5 sm:h-5" />
                    </button>
                )}
            </div>

            {/* Default State: Popular Chips */}
            {!isOpen && query === '' && (
                <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-2 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <span className="w-full sm:w-auto text-center text-[8px] font-black text-white/30 uppercase tracking-[0.5em] sm:tracking-[0.7em] mb-2 sm:mb-0 sm:mr-2">
                        Top Nodes:
                    </span>
                    {popularStocks.map(sym => (
                        <button
                            key={sym}
                            onClick={() => router.push(`/dashboard/market/stock/${sym}`)}
                            className="px-3 sm:px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest text-muted-foreground hover:bg-accent/10 hover:border-accent/30 hover:text-accent transition-all duration-300 transform hover:scale-105 active:scale-95 outline-none"
                        >
                            {sym}
                        </button>
                    ))}
                </div>
            )}

            {/* Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 md:mt-4 bg-[#111827]/95 border border-accent/20 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] z-[100] overflow-hidden backdrop-blur-3xl animate-in zoom-in-95 duration-300">
                    <div className="p-2.5 md:p-3 border-b border-white/5 bg-accent/5">
                        <span className="text-[9px] sm:text-[11px] font-black text-accent tracking-[0.4em] sm:tracking-[0.6em] uppercase px-3 sm:px-4 py-1 block text-center sm:text-left">
                            Stock Oracle Search Analysis
                        </span>
                    </div>

                    <div className="max-h-[250px] sm:max-h-[300px] md:max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                        {results.length > 0 ? (
                            results.map((item, i) => (
                                <button
                                    key={item.symbol}
                                    onClick={() => {
                                        addNotification({
                                            title: 'NSE Node Located',
                                            message: `Intelligence channel established for ${item.symbol}. Accessing profile data...`,
                                            type: 'info',
                                            link: `/dashboard/market/stock/${item.symbol}`
                                        });
                                        router.push(`/dashboard/market/stock/${item.symbol}`);
                                        setIsOpen(false);
                                    }}
                                    onMouseEnter={() => setFocusedIndex(i)}
                                    className={`
                                        w-full flex items-center justify-between p-3 sm:p-4 rounded-2xl md:rounded-3xl transition-all duration-300 group/item text-left
                                        ${focusedIndex === i ? 'bg-white/[0.04] sm:translate-x-1 outline-none' : 'hover:bg-white/[0.02]'}
                                    `}
                                >
                                    <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                                        <div className={`p-1.5 sm:p-2 rounded-xl transition-all shrink-0 ${focusedIndex === i ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 text-muted-foreground'}`}>
                                            <TrendingUp size={14} className="sm:w-4 sm:h-4" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-xs sm:text-sm font-black text-teal-400 tracking-normal truncate">{item.symbol}</span>
                                                <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-md text-[7px] sm:text-[8px] font-black text-muted-foreground opacity-80 shrink-0">
                                                    {item.exchange}
                                                </span>
                                            </div>
                                            <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground truncate uppercase opacity-60">{item.name}</p>
                                        </div>
                                    </div>
                                    <span className={`hidden sm:block text-[9px] md:text-[10px] font-black text-accent opacity-0 group-hover/item:opacity-100 transition-all shrink-0 ml-4 ${focusedIndex === i ? 'translate-x-0 opacity-100' : 'translate-x-4'}`}>
                                        VIEW INTEL
                                    </span>
                                </button>
                            ))
                        ) : query.trim().length >= 2 && !loading ? (
                            <div className="p-8 md:p-12 text-center text-muted-foreground/30">
                                <Search size={32} className="sm:w-12 sm:h-12 mx-auto mb-3 md:mb-4 opacity-20" />
                                <p className="text-[9px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase">No Stock Nodes Located</p>
                            </div>
                        ) : (
                            <div className="p-8 md:p-12 text-center text-muted-foreground/30">
                                <Loader2 size={32} className="sm:w-12 sm:h-12 mx-auto mb-3 md:mb-4 opacity-20 animate-spin" />
                                <p className="text-[9px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase">Scanning NSE Grid...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}