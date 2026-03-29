'use client';

import React, { useEffect, useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Activity,
    Clock,
    Globe,
    Zap,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCcw,
    Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MetricCard } from '@/components/shared/MetricCard';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/lib/api';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { TopNav } from '@/components/navigation/TopNav';

interface IndexData {
    index: string;
    last: number;
    variation: number;
    percentChange: number;
    open: number;
    high: number;
    low: number;
    previousClose: number;
}

interface MarketStatus {
    marketState: {
        market: string;
        marketStatus: string;
        tradeDate: string;
        lastUpdateTime: string;
    }[];
}

interface GainersLosers {
    gainers: any[];
    losers: any[];
}

export default function MarketTrendsPage() {
    const router = useRouter();
    const { token } = useAuth();
    const [indices, setIndices] = useState<IndexData[]>([]);
    const [status, setStatus] = useState<MarketStatus | null>(null);
    const [movers, setMovers] = useState<GainersLosers | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            const [indicesRes, statusRes, moversRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/market/indices`, { headers }),
                fetch(`${API_BASE_URL}/api/market/status`, { headers }),
                fetch(`${API_BASE_URL}/api/market/gainers-losers`, { headers })
            ]);

            if (!indicesRes.ok || !statusRes.ok || !moversRes.ok) {
                throw new Error('Failed to fetch market data');
            }

            const indicesData = await indicesRes.json();
            const statusData = await statusRes.json();
            const moversData = await moversRes.json();

            setIndices(indicesData.data || []);
            setStatus(statusData);
            setMovers(moversData);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
            setLastRefresh(new Date());
        }
    };

    useEffect(() => {
        setMounted(true);
        if (token) {
            fetchData();
            const interval = setInterval(fetchData, 60000); // Refresh every minute
            return () => clearInterval(interval);
        }
    }, [token]);

    const findIndex = (name: string) => indices.find(idx => idx.index === name);

    const nifty50 = findIndex('NIFTY 50');
    const niftyBank = findIndex('NIFTY BANK');
    const niftyIT = findIndex('NIFTY IT');

    const { user } = useAuth();

    if (!mounted) return <div className="min-h-screen bg-[#0A0F1E]" />;

    const marketOpen = status?.marketState?.find(m => m.market === 'Capital Market')?.marketStatus === 'Open';

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <TopNav
                    userName={user?.name || 'Operator'}
                    customLinks={[
                        { label: 'MARKET ORBIT', href: '/dashboard/market', icon: <Globe size={14} /> },
                    ]}
                />
                <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/10 bg-background/50 px-4 sm:px-6 md:px-10 py-6 md:py-10 space-y-8 md:space-y-12">
                    <div className="max-w-[1400px] mx-auto space-y-8 md:space-y-12 pb-10">
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 sm:p-3 bg-accent/10 rounded-xl sm:rounded-2xl border border-accent/20">
                                        <BarChart3 className="text-accent w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black font-barlow-condensed tracking-tighter uppercase leading-none">
                                        Market <span className="text-accent">Oracle</span>
                                    </h1>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground font-medium tracking-wide max-w-xl leading-relaxed">
                                    Real-time intelligence from the National Stock Exchange of India. Track indices, industry rotations, and institutional flow.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 sm:p-4 rounded-[1.5rem] md:rounded-3xl backdrop-blur-xl w-full lg:w-auto">
                                <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${marketOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            NSE Status: {marketOpen ? 'Live' : 'Closed'}
                                        </span>
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-tighter mt-0.5">
                                        Last Updated: {mounted ? lastRefresh.toLocaleTimeString() : '---'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                    <button
                                        onClick={() => router.push('/dashboard/market/search')}
                                        className="flex-1 sm:flex-none p-3 sm:p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl sm:rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 px-4"
                                    >
                                        <Search size={16} className="text-accent sm:w-[18px] sm:h-[18px]" />
                                        <span className="text-[9px] sm:text-[10px] font-black text-white/60 sm:text-white/40 uppercase tracking-tighter">
                                            <span className="hidden sm:inline">Enter Search </span>Orbit
                                        </span>
                                    </button>
                                    <button
                                        onClick={fetchData}
                                        className="p-3 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-xl sm:rounded-2xl transition-all active:scale-95 shrink-0"
                                    >
                                        <RefreshCcw size={16} className={`text-accent sm:w-[18px] sm:h-[18px] ${loading ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {loading && indices.length === 0 ? (
                            <div className="flex items-center justify-center h-48 sm:h-64">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                                    <p className="text-[9px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.5em] text-accent uppercase">Synchronizing Oracle...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="p-6 sm:p-8 bg-rose-500/10 border border-rose-500/20 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col items-center gap-4 text-center">
                                <AlertCircle className="text-rose-500 w-10 h-10 sm:w-12 sm:h-12" />
                                <h2 className="text-xl sm:text-2xl font-black font-barlow-condensed tracking-tight">CONNECTION INTERRUPTED</h2>
                                <p className="text-muted-foreground uppercase text-[10px] sm:text-xs tracking-widest max-w-md">{error}</p>
                                <button onClick={fetchData} className="px-6 py-3 sm:px-8 sm:py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl sm:rounded-2xl font-black tracking-widest text-[9px] sm:text-[10px] transition-all">RETRY HANDSHAKE</button>
                            </div>
                        ) : (
                            <>
                                {/* Primary Indices grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    <MetricCard
                                        label="NIFTY 50"
                                        value={nifty50?.last.toLocaleString('en-IN') || '---'}
                                        icon={<Activity size={20} className="sm:w-6 sm:h-6" />}
                                        trend={nifty50 && nifty50.variation >= 0 ? 'up' : 'down'}
                                        trendValue={`${nifty50?.percentChange.toFixed(2)}%`}
                                        description="India's benchmark blue-chip index representing 50 of the largest companies."
                                        isHighlight
                                    />
                                    <MetricCard
                                        label="NIFTY BANK"
                                        value={niftyBank?.last.toLocaleString('en-IN') || '---'}
                                        icon={<TrendingUp size={20} className="sm:w-6 sm:h-6" />}
                                        trend={niftyBank && niftyBank.variation >= 0 ? 'up' : 'down'}
                                        trendValue={`${niftyBank?.percentChange.toFixed(2)}%`}
                                        description="Representative of the liquidity and solvency of the Indian banking sector."
                                    />
                                    <div className="sm:col-span-2 lg:col-span-1">
                                        <MetricCard
                                            label="NIFTY IT"
                                            value={niftyIT?.last.toLocaleString('en-IN') || '---'}
                                            icon={<Zap size={20} className="sm:w-6 sm:h-6" />}
                                            trend={niftyIT && niftyIT.variation >= 0 ? 'up' : 'down'}
                                            trendValue={`${niftyIT?.percentChange.toFixed(2)}%`}
                                            description="Companies providing IT services, products, and tech consultancy."
                                        />
                                    </div>
                                </div>

                                {/* Market Depth Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                                    {/* Top Gainers */}
                                    <div className="bg-[#0A0F1E]/50 border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-6 md:p-8 space-y-6 md:space-y-8 backdrop-blur-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h3 className="text-xl sm:text-2xl font-black font-barlow-condensed tracking-tight text-white uppercase">Market Hawks</h3>
                                                <p className="text-[8px] sm:text-[10px] font-black text-emerald-500 tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-60">Top Price Performers (Gains)</p>
                                            </div>
                                            <ArrowUpRight className="text-emerald-500 w-6 h-6 sm:w-8 sm:h-8" />
                                        </div>

                                        <div className="space-y-3 sm:space-y-4">
                                            {movers?.gainers.map((stock, i) => (
                                                <div key={stock.symbol} className="flex items-center justify-between p-3 sm:p-4 bg-white/[0.02] border border-white/5 rounded-xl sm:rounded-2xl hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all group/item">
                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                        <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground w-3 sm:w-4">{i + 1}</span>
                                                        <div>
                                                            <h4 className="font-bold text-xs sm:text-sm tracking-tight">{stock.symbol}</h4>
                                                            <p className="text-[8px] sm:text-[10px] text-muted-foreground opacity-60">{stock.series}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs sm:text-sm font-black text-white">₹{stock.lastPrice.toLocaleString('en-IN')}</div>
                                                        <div className="text-[9px] sm:text-[10px] font-black text-emerald-400">+{stock.pChange.toFixed(2)}%</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Top Losers */}
                                    <div className="bg-[#0A0F1E]/50 border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-6 md:p-8 space-y-6 md:space-y-8 backdrop-blur-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h3 className="text-xl sm:text-2xl font-black font-barlow-condensed tracking-tight text-white uppercase">Market Bears</h3>
                                                <p className="text-[8px] sm:text-[10px] font-black text-rose-500 tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-60">Top Value Detractors (Locks)</p>
                                            </div>
                                            <ArrowDownRight className="text-rose-500 w-6 h-6 sm:w-8 sm:h-8" />
                                        </div>

                                        <div className="space-y-3 sm:space-y-4">
                                            {movers?.losers.map((stock, i) => (
                                                <div key={stock.symbol} className="flex items-center justify-between p-3 sm:p-4 bg-white/[0.02] border border-white/5 rounded-xl sm:rounded-2xl hover:bg-rose-500/5 hover:border-rose-500/20 transition-all group/item">
                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                        <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground w-3 sm:w-4">{i + 1}</span>
                                                        <div>
                                                            <h4 className="font-bold text-xs sm:text-sm tracking-tight">{stock.symbol}</h4>
                                                            <p className="text-[8px] sm:text-[10px] text-muted-foreground opacity-60">{stock.series}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs sm:text-sm font-black text-white">₹{stock.lastPrice.toLocaleString('en-IN')}</div>
                                                        <div className="text-[9px] sm:text-[10px] font-black text-rose-400">{stock.pChange.toFixed(2)}%</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Secondary Indices / Sector Watch */}
                                <div className="space-y-6 md:space-y-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                        <h3 className="text-2xl md:text-3xl font-black font-barlow-condensed tracking-tight uppercase">Sector Rotation</h3>
                                        <div className="h-[2px] w-16 sm:flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                                        {indices.filter(idx => !['NIFTY 50', 'NIFTY BANK', 'NIFTY IT'].includes(idx.index)).slice(0, 10).map(idx => (
                                            <div key={idx.index} className="p-4 sm:p-5 bg-white/[0.03] border border-white/5 rounded-2xl sm:rounded-3xl hover:bg-white/[0.05] transition-all cursor-crosshair group/sector flex flex-col justify-between">
                                                <h4 className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 sm:mb-3 group-hover:text-accent transition-colors line-clamp-2 leading-tight min-h-[24px]">{idx.index}</h4>
                                                <div>
                                                    <div className="text-base sm:text-lg font-black font-barlow-condensed tracking-tight mb-0.5 sm:mb-1">{idx.last.toLocaleString('en-IN')}</div>
                                                    <div className={`text-[9px] sm:text-[10px] font-black ${idx.percentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {idx.percentChange >= 0 ? '+' : ''}{idx.percentChange.toFixed(2)}%
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Footer Notice */}
                        <div className="pt-8 md:pt-12 border-t border-white/5 flex flex-col items-center gap-3 sm:gap-4 mt-8 md:mt-12">
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 rounded-full border border-white/10">
                                <Globe size={12} className="text-accent sm:w-[14px] sm:h-[14px]" />
                                <span className="text-[8px] sm:text-[10px] font-medium text-muted-foreground uppercase tracking-[0.15em] sm:tracking-widest">Data Streamed via Unofficial NSE Relay</span>
                            </div>
                            <p className="text-[8px] sm:text-[9px] text-center text-muted-foreground opacity-40 max-w-2xl font-bold tracking-tighter uppercase leading-relaxed px-4">
                                MARKET DATA IS DELAYED BY AT LEAST 15 MINUTES. INFORMATION IS PROVIDED AS IS FOR EDUCATIONAL PURPOSES AND DOES NOT CONSTITUTE FINANCIAL ADVICE. NIVESHIQ IS NOT RESPONSIBLE FOR ANY TRADING LOSSES INCURRED USING THIS DATA.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}