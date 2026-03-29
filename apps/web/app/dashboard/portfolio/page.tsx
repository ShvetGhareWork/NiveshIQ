'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Info, Lock, Activity, Shield, BarChart3, ChevronRight, PieChart as PieChartIcon, TrendingUp, AlertCircle, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { TopNav } from '@/components/navigation/TopNav';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ChatWidget from '@/components/ChatWidget';
import CountUp from '@/components/reactbits/CountUp';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/lib/api';

// ─── types unchanged ───────────────────────────────────────────────────────────

interface Holding {
    schemeName: string;
    units: number;
    currentValue: number;
    category: string;
    liveNav?: number;
    lastUpdated?: string;
    realTimeValue?: number;
    gain?: number;
}

interface ExtractionResult {
    holdings: Holding[];
    summary: { totalValue: number };
    insights: {
        metrics: {
            totalValue: number;
            riskScore: number;
            riskLabel: string;
            taxEfficiency: number;
            assetQuality: string;
            expenseRatioDrag: number;
            overlapCount: number;
            xirr: number;
        };
        allocation: { equity: number; debt: number; other: number };
        benchmark: { label: string; return: number; status: string };
    };
}

// ─── component ────────────────────────────────────────────────────────────────

export default function PortfolioXRay() {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const token = typeof window !== 'undefined' ? localStorage.getItem('oracle_token') : null;

    const [isUploading, setIsUploading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ExtractionResult | null>(null);
    const [password, setPassword] = useState('');
    const [hasAgreedLegal, setHasAgreedLegal] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setIsMounted(true); }, []);

    const userName = user?.name || 'Operator';

    useEffect(() => {
        if (localStorage.getItem('niveshiq_legal_agreed') === 'true') setHasAgreedLegal(true);
    }, []);

    const handleAgreeLegal = () => {
        localStorage.setItem('niveshiq_legal_agreed', 'true');
        setHasAgreedLegal(true);
    };

    useEffect(() => {
        const fetchLatest = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${API_BASE_URL}/api/portfolio`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success && data.data) setResult(data.data);
            } catch (err) {
                console.error('Failed to fetch initial portfolio:', err);
            } finally {
                setIsInitialLoading(false);
            }
        };
        fetchLatest();
    }, [token]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        setError(null);
        const formData = new FormData();
        if (password) formData.append('password', password);
        formData.append('file', file);
        try {
            const response = await fetch(`${API_BASE_URL}/api/portfolio/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Upload failed');
            setResult(data.data);
            addNotification({
                title: 'Portfolio Node Decrypted',
                message: `${data.data.holdings.length} holdings indexed.`,
                type: 'success',
                link: '/dashboard/portfolio',
            });
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (!isMounted) return <div className="min-h-screen bg-[#0A0F1E]" />;

    // ─── layout shell ──────────────────────────────────────────────────────────
    return (
        <div className="flex min-h-screen bg-background text-foreground">

            {/* Sidebar: hidden on mobile, visible md+ */}
            <DashboardSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopNav
                    userName={userName}
                    customLinks={[{ label: 'PORTFOLIO', href: '/dashboard/portfolio', icon: <Activity size={12} /> }]}
                />

                <main className="flex-1 bg-background/50 relative overflow-x-hidden">
                    {/* Ambient blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/3 blur-[140px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    {/* ── Header ───────────────────────────────────────────── */}
                    <header className="px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16 border-b border-border/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.05)_0%,transparent_50%)] pointer-events-none" />
                        <div className="relative z-10 max-w-7xl mx-auto w-full">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                <div>
                                    {/* clamp() ensures the heading never overflows on any screen */}
                                    <h1
                                        className="font-black text-foreground font-barlow-condensed uppercase leading-none mb-2"
                                        style={{ fontSize: 'clamp(2.5rem, 10vw, 6rem)' }}
                                    >
                                        PORTFOLIO{' '}
                                        <span className="text-accent underline decoration-accent/30 underline-offset-4">
                                            X-RAY
                                        </span>
                                    </h1>
                                    <p className="text-muted-foreground font-black tracking-[0.4em] uppercase text-[9px] sm:text-[10px] opacity-70">
                                        DEEP-SCAN PROTOCOL // MF HOLDING ANALYSIS
                                    </p>
                                </div>
                                {result && !isUploading && (
                                    <button
                                        onClick={() => setResult(null)}
                                        className="self-start sm:self-auto px-5 py-3 bg-accent text-background font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95 flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <Upload size={13} />
                                        NEW SCAN
                                    </button>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* ── Main content ──────────────────────────────────────── */}
                    {/* pb-28 on mobile reserves room so ChatWidget doesn't overlap last row */}
                    <section className="px-4 sm:px-6 md:px-10 py-8 md:py-12 pb-28 md:pb-24 max-w-7xl mx-auto w-full">

                        {/* Loading */}
                        {isInitialLoading && (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center mb-6 border border-accent/20">
                                    <Activity className="w-8 h-8 text-accent animate-pulse" />
                                </div>
                                <h3 className="text-xl font-black font-barlow-condensed uppercase tracking-wide text-center mb-1">
                                    SYNCHRONIZING ORACLE...
                                </h3>
                                <p className="text-[9px] text-muted-foreground tracking-[0.5em] font-black uppercase opacity-70 text-center">
                                    RETRIEVING PREVIOUSLY ENCRYPTED DATA
                                </p>
                            </div>
                        )}

                        {/* Legal gate */}
                        {!isInitialLoading && !hasAgreedLegal && (
                            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="glass-panel border border-accent/20 rounded-[32px] p-6 sm:p-10 md:p-14 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                        <Shield size={140} className="text-accent" />
                                    </div>
                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 border border-accent/20">
                                            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
                                        </div>
                                        <h2
                                            className="font-black font-barlow-condensed uppercase mb-6 leading-none"
                                            style={{ fontSize: 'clamp(1.75rem, 6vw, 3rem)' }}
                                        >
                                            LEGAL{' '}
                                            <span className="text-accent">ACKNOWLEDGEMENT</span>
                                        </h2>

                                        <div className="w-full space-y-3 text-left mb-10">
                                            {[
                                                {
                                                    icon: <AlertCircle size={16} className="text-accent shrink-0 mt-0.5" />,
                                                    title: 'NOT FINANCIAL ADVICE',
                                                    desc: 'INSIGHTS ARE FOR INFORMATIONAL PURPOSES ONLY. WE ARE NOT SEBI-REGISTERED ADVISORS.',
                                                },
                                                {
                                                    icon: <Lock size={16} className="text-accent shrink-0 mt-0.5" />,
                                                    title: 'DATA PRIVACY PROTOCOL',
                                                    desc: 'STATEMENTS PROCESSED IN MEMORY-ONLY SANDBOX. ORIGINAL DOCUMENTS NOT RETAINED.',
                                                },
                                                {
                                                    icon: <FileText size={16} className="text-accent shrink-0 mt-0.5" />,
                                                    title: 'ACCURACY LIMITATIONS',
                                                    desc: 'AI PARSING MAY HAVE OCCASIONAL DISCREPANCIES DUE TO DOCUMENT FORMAT VARIATIONS.',
                                                },
                                            ].map((item, i) => (
                                                <div key={i} className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                                    {item.icon}
                                                    <div>
                                                        <h4 className="text-[9px] font-black tracking-widest uppercase mb-1">{item.title}</h4>
                                                        <p className="text-[9px] text-muted-foreground uppercase leading-relaxed font-bold tracking-wider">{item.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={handleAgreeLegal}
                                            className="w-full py-4 bg-accent text-background font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] active:scale-95"
                                        >
                                            I ACCEPT THE TERMS & PROCEED
                                        </button>
                                        <p className="mt-6 text-[8px] text-muted-foreground font-black tracking-widest uppercase opacity-40">
                                            BY CLICKING ABOVE, YOU CONFIRM YOU ARE THE LEGAL OWNER OF THE ACCOUNT
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Upload screen */}
                        {!isInitialLoading && hasAgreedLegal && !result && (
                            <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

                                {/* Left: upload */}
                                <div className="flex-1 w-full flex flex-col items-center">
                                    <p className="text-muted-foreground text-sm sm:text-base max-w-md leading-relaxed mb-8 text-center">
                                        Deep-scan your mutual fund holdings to reveal hidden risks and performance leaks.
                                    </p>

                                    {/* Password field — full width on all screens */}
                                    <div className="w-full mb-6 group">
                                        <div className="flex items-center justify-between mb-2 px-1 text-[9px] font-black tracking-widest text-muted-foreground uppercase group-focus-within:text-accent transition-colors">
                                            <span>STATEMENT PASSWORD (PAN)</span>
                                            <Lock size={11} className="opacity-50" />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="ENTER PASSWORD IF ENCRYPTED"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-12 bg-background/50 border border-border/30 rounded-xl px-4 text-xs font-bold tracking-widest focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all placeholder:text-muted-foreground/30"
                                        />
                                    </div>

                                    {/* Upload box — square on mobile, slightly smaller max on desktop */}
                                    <div className="relative w-full max-w-sm sm:max-w-md aspect-square flex items-center justify-center">
                                        <div className="absolute inset-2 border border-dashed border-accent/20 rounded-[30px] rotate-[-8deg] pointer-events-none" />
                                        <div className="absolute inset-6 border border-dashed border-white/5 rounded-[30px] rotate-[15deg] pointer-events-none" />
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`relative z-10 w-[88%] h-[88%] glass-panel rounded-[26px] flex flex-col items-center justify-center p-6 transition-all hover:scale-[1.02] hover:border-accent/30 cursor-pointer group active:scale-[0.98] ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                                        >
                                            <input
                                                type="file"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={handleUpload}
                                                accept=".pdf,.xlsx,.xls,.csv"
                                            />
                                            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent/20 transition-all border border-accent/20">
                                                {isUploading
                                                    ? <Activity className="w-8 h-8 text-accent animate-pulse" />
                                                    : <Upload className="w-8 h-8 text-accent" />}
                                            </div>
                                            <h3 className="text-xl sm:text-2xl font-black font-barlow-condensed uppercase mb-2 text-center">
                                                {isUploading ? 'SCANNING VAULT...' : 'DROP CAMS PDF'}
                                            </h3>
                                            <p className="text-[9px] text-muted-foreground tracking-[0.5em] font-black uppercase mb-8 text-center opacity-70">
                                                MAX 10MB · QUAD-LAYER SECURITY
                                            </p>
                                            <div className="mt-auto flex items-center gap-2 text-[9px] font-black tracking-widest uppercase text-accent">
                                                <span className="relative flex h-2.5 w-2.5">
                                                    {!isUploading && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />}
                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                                                </span>
                                                {isUploading ? 'EXTRACTING...' : 'PORT READY'}
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="mt-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[9px] font-black tracking-widest uppercase w-full animate-in slide-in-from-top-4">
                                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                            <span>{error}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Right: info panel — full width on mobile, fixed on lg */}
                                <div className="w-full lg:w-80 xl:w-96 shrink-0">
                                    <div className="glass-panel rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                            <Info size={100} className="text-accent" />
                                        </div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30 shrink-0">
                                                <Info className="w-4 h-4 text-accent" />
                                            </div>
                                            <h3 className="text-base font-black font-barlow-condensed uppercase">PROTOCOL OVERVIEW</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                { icon: <Lock size={14} />, title: 'HARDWARE ENCRYPTION', desc: 'PROCESSED IN MEMORY-ONLY SANDBOX' },
                                                { icon: <Shield size={14} />, title: 'PAN VERIFICATION', desc: 'STRICT AUTH AGAINST STATEMENT PAN' },
                                                { icon: <FileText size={14} />, title: 'ZERO-DATA STORAGE', desc: 'PDF DELETED IMMEDIATELY POST-EXTRACT' },
                                            ].map((item, i) => (
                                                <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent/20 transition-all group">
                                                    <div className="text-accent opacity-60 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">{item.icon}</div>
                                                    <div>
                                                        <h4 className="text-[9px] font-black tracking-widest uppercase mb-0.5">{item.title}</h4>
                                                        <p className="text-[8px] text-muted-foreground uppercase leading-relaxed font-bold tracking-wider">{item.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {!isInitialLoading && hasAgreedLegal && result && isMounted && (
                            <div className="space-y-6 md:space-y-10 animate-in fade-in zoom-in-95 duration-700">

                                {/* Top row: summary + stats */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">

                                    {/* Total value card */}
                                    <div className="lg:col-span-1 glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                                            <TrendingUp size={100} className="text-accent" />
                                        </div>
                                        <div className="relative z-10 flex flex-col h-full">
                                            <p className="text-[9px] font-black tracking-[0.3em] text-accent uppercase mb-3">
                                                TOTAL ASSETS SCANNED
                                            </p>
                                            <h2 className="font-black font-barlow-condensed mb-3 flex items-baseline" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>
                                                <span>₹</span>
                                                <CountUp to={result.insights.metrics.totalValue || 0} separator="," duration={1} />
                                            </h2>
                                            <div className="flex items-center gap-1.5 text-[9px] font-black tracking-widest text-green-500 bg-green-500/10 w-fit px-3 py-1 rounded-lg border border-green-500/20 mb-6">
                                                <CheckCircle2 size={10} />
                                                VERIFIED HOLDINGS
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-border/20">
                                                <p className="text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-4">
                                                    ASSET ALLOCATION
                                                </p>
                                                {/* Pie chart — reduced height on mobile */}
                                                <div className="h-44 sm:h-52 w-full relative flex items-center justify-center">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={[
                                                                    { name: 'Equity', value: result.insights.allocation.equity },
                                                                    { name: 'Debt', value: result.insights.allocation.debt },
                                                                    { name: 'Other', value: result.insights.allocation.other },
                                                                ].filter(d => d.value > 0)}
                                                                innerRadius={55}
                                                                outerRadius={72}
                                                                paddingAngle={8}
                                                                dataKey="value"
                                                                stroke="none"
                                                            >
                                                                <Cell fill="#D4AF37" />
                                                                <Cell fill="#4A5568" />
                                                                <Cell fill="#1A202C" />
                                                            </Pie>
                                                            <Tooltip
                                                                contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px' }}
                                                                itemStyle={{ color: '#D4AF37' }}
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                        <span className="text-xl font-black font-barlow-condensed">{result.insights.allocation.equity}%</span>
                                                        <span className="text-[8px] font-black tracking-widest text-accent uppercase">EQUITY</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-around mt-4 pt-4 border-t border-white/5">
                                                    <div className="text-center">
                                                        <p className="text-sm font-black text-accent">{result.insights.allocation.equity}%</p>
                                                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-black">EQUITY</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-black text-white/40">{result.insights.allocation.debt}%</p>
                                                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-black">DEBT</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-black text-white/20">{result.insights.allocation.other}%</p>
                                                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest font-black">OTHER</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats grid: 1 col on mobile → 2 col on sm+ */}
                                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            {
                                                label: 'TRUE XIRR',
                                                value: <div className="flex items-baseline"><CountUp to={result.insights.metrics.xirr || 0} duration={1} /><span className="text-muted-foreground/40 ml-0.5">%</span></div>,
                                                icon: <TrendingUp className="w-5 h-5" />,
                                                sub: 'ANNUALIZED PERFORMANCE',
                                            },
                                            {
                                                label: 'EXPENSE DRAG',
                                                value: <div className="flex items-baseline"><span className="mr-0.5">₹</span><CountUp to={result.insights.metrics.expenseRatioDrag || 0} separator="," duration={1} /></div>,
                                                icon: <Shield className="w-5 h-5" />,
                                                sub: 'ANNUAL SAVING POTENTIAL',
                                            },
                                            {
                                                label: 'FUND OVERLAP',
                                                value: <CountUp to={result.insights.metrics.overlapCount || 0} duration={1} />,
                                                icon: <PieChartIcon className="w-5 h-5" />,
                                                sub: 'HIDDEN DUPLICATES FOUND',
                                            },
                                            {
                                                label: 'BENCHMARK',
                                                value: <span className="text-base">BEATING {result.insights.benchmark?.label || 'NIFTY 50'}</span>,
                                                icon: <CheckCircle2 className="w-5 h-5" />,
                                                sub: `${result.insights.benchmark?.status || 'TRACKING'} STATS`,
                                            },
                                        ].map((stat, i) => (
                                            <div key={i} className="glass-panel border border-border/20 rounded-xl p-4 sm:p-5 flex items-center gap-4 group hover:border-accent/40 transition-all">
                                                <div className="w-11 h-11 shrink-0 bg-background/50 border border-border/30 rounded-xl flex items-center justify-center text-accent group-hover:scale-110 group-hover:bg-accent/10 transition-all">
                                                    {stat.icon}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[8px] font-black tracking-widest text-muted-foreground uppercase mb-0.5">{stat.label}</p>
                                                    <div className="text-lg font-black font-barlow-condensed uppercase truncate">{stat.value}</div>
                                                    <p className="text-[7px] text-accent/50 font-black tracking-widest uppercase">{stat.sub}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Holdings table */}
                                <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                                    <div className="px-4 sm:px-6 md:px-8 py-5 md:py-6 border-b border-border/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30 text-accent shrink-0">
                                                <BarChart3 size={15} />
                                            </div>
                                            <div>
                                                <h3 className="text-base sm:text-lg font-black font-barlow-condensed uppercase">DETAILED HOLDINGS VAULT</h3>
                                                <p className="text-[8px] font-black tracking-widest text-muted-foreground uppercase mt-0.5 hidden sm:block">
                                                    FULL DATA ARCHIVE EXTRACTED FROM DOCUMENT
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setResult(null)}
                                            className="px-4 py-2 bg-background border border-border/50 text-[9px] font-black tracking-widest uppercase hover:bg-white/5 hover:border-accent/40 transition-all rounded-lg self-start sm:self-auto"
                                        >
                                            RESET SCAN
                                        </button>
                                    </div>

                                    {/* Horizontal scroll on mobile */}
                                    <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
                                        <table className="w-full text-left border-collapse" style={{ minWidth: '560px' }}>
                                            <thead>
                                                <tr className="bg-background/20">
                                                    <th className="px-4 sm:px-6 md:px-8 py-4 text-[9px] font-black tracking-widest text-muted-foreground uppercase whitespace-nowrap">SCHEME</th>
                                                    <th className="px-4 sm:px-6 py-4 text-[9px] font-black tracking-widest text-muted-foreground uppercase whitespace-nowrap">CATEGORY</th>
                                                    <th className="px-4 sm:px-6 py-4 text-[9px] font-black tracking-widest text-muted-foreground uppercase whitespace-nowrap">UNITS</th>
                                                    <th className="px-4 sm:px-6 md:px-8 py-4 text-[9px] font-black tracking-widest text-muted-foreground uppercase text-right whitespace-nowrap">VALUE</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/20">
                                                {result.holdings.map((holding, idx) => (
                                                    <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-4 sm:px-6 md:px-8 py-4">
                                                            <p className="text-xs sm:text-sm font-bold mb-1 group-hover:text-accent transition-colors max-w-[200px] sm:max-w-none truncate sm:whitespace-normal">
                                                                {holding.schemeName}
                                                            </p>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                <span className="text-[8px] text-muted-foreground bg-white/5 border border-white/10 px-1.5 py-0.5 rounded uppercase font-black tracking-widest whitespace-nowrap">
                                                                    NAV: ₹{holding.liveNav ?? 'N/A'}
                                                                </span>
                                                                {holding.lastUpdated && (
                                                                    <span className="text-[8px] text-accent/40 font-black tracking-widest uppercase whitespace-nowrap">
                                                                        SYNC: {holding.lastUpdated}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                            <span className="text-[9px] px-2.5 py-1 bg-accent/10 text-accent border border-accent/20 rounded-lg font-black tracking-widest">
                                                                {holding.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                            <p className="text-xs font-mono font-bold text-muted-foreground">
                                                                {holding.units.toFixed(3)}
                                                            </p>
                                                        </td>
                                                        <td className="px-4 sm:px-6 md:px-8 py-4 text-right whitespace-nowrap">
                                                            <p className="text-sm font-black font-barlow-condensed">
                                                                ₹{(holding.realTimeValue || holding.currentValue || 0).toLocaleString('en-IN')}
                                                            </p>
                                                            {holding.gain !== undefined && (
                                                                <div className={`flex items-center justify-end gap-1 text-[9px] font-black mt-0.5 ${holding.gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                                    <span>{holding.gain >= 0 ? '▲' : '▼'}</span>
                                                                    <span>₹{Math.abs(holding.gain).toLocaleString('en-IN')}</span>
                                                                    <span className="opacity-50">
                                                                        ({((holding.gain / holding.currentValue) * 100).toFixed(1)}%)
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Footer */}
                    <footer className="px-4 sm:px-6 md:px-10 py-8 border-t border-border/10 text-center relative overflow-hidden">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                        <p className="text-[8px] sm:text-[9px] font-black tracking-[0.4em] text-muted-foreground/30 uppercase">
                            NIVESHIQ INTELLIGENCE LAYER // PORTFOLIO ANALYSIS MODULE
                        </p>
                    </footer>
                </main>
            </div>

            {result && <ChatWidget portfolioData={result} />}
        </div>
    );
}