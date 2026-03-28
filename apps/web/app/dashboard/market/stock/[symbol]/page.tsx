'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    ArrowUpRight, 
    ArrowDownRight, 
    Clock, 
    Globe, 
    Activity, 
    TrendingUp, 
    ArrowLeft,
    Heart,
    Zap,
    Shield,
    BarChart2,
    PieChart,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/lib/api';
import { StockChart } from '@/components/market/StockChart';
import { AIStockAnalysis } from '@/components/market/AIStockAnalysis';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { TopNav } from '@/components/navigation/TopNav';

interface StockDetail {
    symbol: string;
    name: string;
    exchange: string;
    price: number;
    change: number;
    change_percent: number;
    open: number;
    high: number;
    low: number;
    prev_close: number;
    volume: number;
    avg_volume: number;
    market_cap: number;
    pe_ratio: number;
    pb_ratio: number;
    eps: number;
    dividend_yield: number;
    beta: number;
    week_52_high: number;
    week_52_low: number;
    sector: string;
    industry: string;
    description: string;
    currency: string;
}

export default function StockDetailPage() {
    const { symbol } = useParams();
    const router = useRouter();
    const { token, user } = useAuth();
    const [stock, setStock] = useState<StockDetail | null>(null);
    const [history, setHistory] = useState([]);
    const [period, setPeriod] = useState('1y');
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [descExpanded, setDescExpanded] = useState(false);

    const formatINR = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(val || 0);
    };

    const formatLarge = (val: number) => {
        if (!val) return '₹0.00';
        if (val >= 1e12) return `₹${(val / 1e12).toFixed(2)}T`;
        if (val >= 1e7) return `₹${(val / 1e7).toFixed(2)}Cr`;
        if (val >= 1e5) return `₹${(val / 1e5).toFixed(2)}L`;
        return formatINR(val);
    };

    const fetchStockDetail = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/market/stock/${symbol}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.error) throw new Error(data.message || data.error);
            setStock(data);
        } catch (error) {
            console.error('Failed to fetch stock detail:', error);
        }
    };

    const fetchHistory = async (p: string) => {
        setHistoryLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/market/stock/${symbol}/history?period=${p}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setHistory(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch history:', error);
            setHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        if (symbol && token) {
            setLoading(true);
            Promise.all([fetchStockDetail(), fetchHistory(period)]).finally(() => setLoading(false));
        }
    }, [symbol, token]);

    const handlePeriodChange = (p: string) => {
        setPeriod(p);
        fetchHistory(p);
    };

    if (loading || !stock) {
        return (
            <div className="flex h-screen bg-background text-foreground overflow-hidden">
                <DashboardSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <TopNav userName={user?.name || 'Operator'} />
                    <div className="flex-1 flex flex-col items-center justify-center bg-background/50 gap-6">
                        <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                        <div className="space-y-2 text-center">
                            <p className="text-[10px] font-black tracking-[0.6em] text-accent uppercase">Handshake with NSE...</p>
                            <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground uppercase opacity-40">Decrypting Financial Stream for {symbol}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isPositive = (stock.change || 0) >= 0;

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <TopNav 
                    userName={user?.name || 'Operator'}
                    customLinks={[
                        { label: 'INTEL DOSSIER', href: `/dashboard/market/stock/${symbol}`, icon: <Activity size={14} /> },
                    ]}
                />
                <main className="flex-1 overflow-y-auto bg-background/50 p-6 lg:p-10 space-y-12">
                    <div className="max-w-[1400px] mx-auto space-y-12">
                        {/* Nav Header Row */}
                        <div className="flex items-center justify-between gap-6">
                            <button 
                                onClick={() => router.back()}
                                className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-accent/10 hover:border-accent/30 transition-all group"
                            >
                                <ArrowLeft size={18} className="group-hover:text-accent" />
                            </button>

                            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                         <h1 className="text-3xl font-black font-barlow-condensed tracking-tight uppercase leading-none">{stock.name}</h1>
                                         <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-md text-[8px] font-black text-accent tracking-widest uppercase">
                                             {stock.exchange}
                                         </span>
                                    </div>
                                    <p className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase opacity-60">Symbol: <span className="text-teal-400">{stock.symbol}</span>  ·  {stock.sector || 'General'}</p>
                                </div>

                                <div className="flex flex-col items-end">
                                    <div className="text-4xl font-black font-barlow-condensed tracking-tighter leading-none">{formatINR(stock.price)}</div>
                                    <div className={`flex items-center gap-1 font-black text-[12px] tracking-tight ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {isPositive ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                                        {formatINR(Math.abs(stock.change || 0))} ({isPositive ? '+' : ''}{(stock.change_percent || 0).toFixed(2)}%)
                                    </div>
                                </div>
                            </div>

                            <button className="hidden md:flex items-center gap-3 px-6 py-3 bg-accent border border-accent rounded-2xl font-black text-[10px] tracking-widest text-background hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all">
                                <Heart size={16} fill="currentColor" />
                                ADD TO WATCHLIST
                            </button>
                        </div>

                        {/* Content Body Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 auto-rows-min">
                            
                            {/* Chart Section - Main Column */}
                            <div className="xl:col-span-2 space-y-8">
                                <StockChart 
                                    data={history} 
                                    period={period} 
                                    onPeriodChange={handlePeriodChange} 
                                    loading={historyLoading}
                                />

                                {/* Key Stats Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Market Cap', value: formatLarge(stock.market_cap), type: 'market_cap' },
                                        { label: 'P/E Ratio', value: stock.pe_ratio?.toFixed(2) || 'N/A', type: 'pe' },
                                        { label: 'PB Ratio', value: stock.pb_ratio?.toFixed(2) || 'N/A', type: 'pb' },
                                        { label: 'Beta', value: stock.beta?.toFixed(2) || 'N/A', type: 'beta' },
                                        { label: '52W High', value: formatINR(stock.week_52_high), type: '52h', color: 'text-teal-400' },
                                        { label: '52W Low', value: formatINR(stock.week_52_low), type: '52l', color: 'text-rose-400' },
                                        { label: 'Volume', value: ((stock.volume || 0) / 1e6).toFixed(1) + 'M', type: 'volume' },
                                        { label: 'Avg Vol (3m)', value: ((stock.avg_volume || 0) / 1e6).toFixed(1) + 'M', type: 'avg_volume' },
                                    ].map((stat) => (
                                        <div key={stat.label} className="bg-[#111827] border border-white/5 rounded-3xl p-5 space-y-3 hover:border-white/10 transition-all group">
                                            <div className="flex items-center gap-2 text-muted-foreground/40 group-hover:text-accent transition-colors">
                                                {stat.type === 'market_cap' && <Globe size={14}/>}
                                                {stat.type === 'pe' && <Activity size={14}/>}
                                                {stat.type === 'pb' && <PieChart size={14}/>}
                                                {stat.type === 'beta' && <Shield size={14}/>}
                                                {stat.type === '52h' && <ChevronUp size={14} className="text-teal-400"/>}
                                                {stat.type === '52l' && <ChevronDown size={14} className="text-rose-400"/>}
                                                {stat.type === 'volume' && <BarChart2 size={14}/>}
                                                {stat.type === 'avg_volume' && <Clock size={14}/>}
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
                                            </div>
                                            <div className={`text-xl font-black font-barlow-condensed tracking-tight ${stat.color || 'text-white'}`}>{stat.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar Column */}
                            <div className="space-y-8 h-fit">
                                {/* AI Analysis Card */}
                                <AIStockAnalysis stock={stock} />

                                {/* Company Information Card */}
                                <div className="bg-[#111827] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
                                    <div className="flex items-center gap-3">
                                        <Zap size={18} className="text-accent" />
                                        <h3 className="text-xl font-black font-barlow-condensed tracking-tight uppercase">Company Context</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest mb-1">EPS (Trailing)</p>
                                                <p className="text-sm font-black italic">{formatINR(stock.eps)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest mb-1">Div. Yield</p>
                                                <p className="text-sm font-black italic">{((stock.dividend_yield || 0) * 100).toFixed(2)}%</p>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5">
                                            <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest mb-3">Business Profile</p>
                                            <div className={`relative ${!descExpanded ? 'max-h-[120px] overflow-hidden' : ''}`}>
                                                <p className="text-xs font-bold text-muted-foreground/80 leading-relaxed uppercase italic tracking-tighter">
                                                    {stock.description || "In-depth profile currently being indexed by Oracle Cloud Nodes."}
                                                </p>
                                                {!descExpanded && (
                                                    <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#111827] to-transparent" />
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => setDescExpanded(!descExpanded)}
                                                className="mt-4 text-[9px] font-black text-accent uppercase tracking-[0.3em] hover:opacity-100 transition-opacity"
                                            >
                                                {descExpanded ? 'RETRACT INTEL' : 'EXPAND BIO'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
