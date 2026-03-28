'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Info, Lock, Activity, Shield, BarChart3, User, Bell, ChevronRight, PieChart as PieChartIcon, TrendingUp, AlertCircle, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { TopNav } from '@/components/navigation/TopNav';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ChatWidget from '@/components/ChatWidget';
import CountUp from '@/components/reactbits/CountUp';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/lib/api';

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
    summary: {
        totalValue: number;
    };
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
        allocation: {
            equity: number;
            debt: number;
            other: number;
        };
        benchmark: {
            label: string;
            return: number;
            status: string;
        };
    };
}

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

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const userName = user?.name || 'Operator';

    useEffect(() => {
        const agreed = localStorage.getItem('niveshiq_legal_agreed');
        if (agreed === 'true') {
            setHasAgreedLegal(true);
        }
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
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.data) {
                    setResult(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch initial portfolio:", err);
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
        if (password) {
            formData.append('password', password);
        }
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/api/portfolio/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setResult(data.data);
            addNotification({
                title: 'Portfolio Node Decrypted',
                message: `${data.data.holdings.length} holdings from your PDF have been successfully indexed.`,
                type: 'success',
                link: '/dashboard/portfolio'
            });
            console.log("✅ Extraction success:", data);
        } catch (err: any) {
            console.error("❌ Upload error:", err);
            setError(err.message || 'Something went wrong during extraction.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    if (!isMounted) return <div className="min-h-screen bg-[#0A0F1E]" />;

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">

            <DashboardSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <TopNav 
                    userName={userName} 
                    customLinks={[
                        { label: 'PORTFOLIO', href: '/dashboard/portfolio', icon: <Activity size={12} /> },
                    ]}
                />

                <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background/50 relative">
                    {/* Cinematic Background Detail */}
                    <div className="absolute top-0 right-0 w-[150%] md:w-1/3 h-1/2 md:h-1/3 bg-accent/5 blur-[80px] md:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 md:translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[150%] md:w-1/2 h-1/2 bg-accent/2 blur-[100px] md:blur-[140px] rounded-full translate-y-1/4 md:translate-y-1/2 -translate-x-1/4 md:-translate-x-1/2 pointer-events-none" />

                    {/* Header */}
                    <header className="px-4 sm:px-6 md:px-10 py-10 md:py-16 border-b border-border/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.05)_0%,transparent_50%)] pointer-events-none" />
                        <div className="relative z-10 max-w-7xl mx-auto w-full">
                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                                <div className="text-center lg:text-left">
                                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-foreground font-barlow-condensed tracking-normal mb-2 sm:mb-3 uppercase leading-[0.9]">
                                        PORTFOLIO <span className="text-accent underline decoration-accent/30 underline-offset-4 md:underline-offset-8">X-RAY</span>
                                    </h1>
                                    <p className="text-muted-foreground font-black tracking-[0.4em] md:tracking-[0.6em] uppercase text-[9px] sm:text-xs opacity-70">
                                        DEEP-SCAN PROTOCOL <span className="hidden sm:inline">//</span><br className="sm:hidden" /> MF HOLDING ANALYSIS
                                    </p>
                                </div>
                                {result && !isUploading && (
                                    <button
                                        onClick={() => setResult(null)}
                                        className="mx-auto lg:mx-0 px-6 py-3 bg-accent text-background font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95 flex items-center gap-2"
                                    >
                                        <Upload size={14} />
                                        NEW SCAN PROTOCOL
                                    </button>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <section className="px-4 sm:px-6 md:px-10 py-8 md:py-12 pb-20 md:pb-24">
                        <div className="max-w-7xl mx-auto w-full">

                            {isInitialLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 px-4">
                                    <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mb-8 border border-accent/20">
                                        <Activity className="w-10 h-10 text-accent animate-pulse" />
                                    </div>
                                    <h3 className="text-xl font-black font-barlow-condensed tracking-normal text-foreground mb-2 uppercase text-center">SYNCHRONIZING ORACLE...</h3>
                                    <p className="text-[9px] text-muted-foreground tracking-[0.6em] font-black uppercase text-center opacity-70">RETRIVING PREVIOUSLY ENCRYPTED DATA</p>
                                </div>
                            ) : !hasAgreedLegal ? (
                                <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <div className="glass-panel border border-accent/20 rounded-[40px] p-8 md:p-16 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                            <Shield size={160} className="text-accent" />
                                        </div>

                                        <div className="relative z-10 flex flex-col items-center text-center">
                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/10 rounded-3xl flex items-center justify-center mb-8 border border-accent/20">
                                                <ShieldCheck className="w-10 h-10 text-accent" />
                                            </div>

                                            <h2 className="text-3xl md:text-5xl font-black font-barlow-condensed tracking-normal uppercase mb-6 leading-none">
                                                LEGAL <span className="text-accent">ACKNOWLEDGEMENT</span>
                                            </h2>

                                            <div className="space-y-6 text-left mb-12">
                                                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                                    <div className="flex gap-4">
                                                        <AlertCircle className="text-accent shrink-0" size={20} />
                                                        <div>
                                                            <h4 className="text-[10px] font-black tracking-widest uppercase mb-1">NOT FINANCIAL ADVICE</h4>
                                                            <p className="text-[10px] text-muted-foreground uppercase leading-relaxed font-bold tracking-wider">
                                                                THE INSIGHTS GENERATED BY NIVESHIQ ARE FOR INFORMATIONAL PURPOSES ONLY. WE ARE NOT SEBI-REGISTERED ADVISORS. CONSULT A PROFESSIONAL BEFORE ACTING ON ANY DATA.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <Lock className="text-accent shrink-0" size={20} />
                                                        <div>
                                                            <h4 className="text-[10px] font-black tracking-widest uppercase mb-1">DATA PRIVACY PROTOCOL</h4>
                                                            <p className="text-[10px] text-muted-foreground uppercase leading-relaxed font-bold tracking-wider">
                                                                YOUR PORTFOLIO STATEMENTS ARE PROCESSED LOCALLY IN VOLATILE MEMORY. WE DO NOT RETAIN ORIGINAL DOCUMENTS POST-EXTRACTION.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <FileText className="text-accent shrink-0" size={20} />
                                                        <div>
                                                            <h4 className="text-[10px] font-black tracking-widest uppercase mb-1">ACCURACY LIMITATIONS</h4>
                                                            <p className="text-[10px] text-muted-foreground uppercase leading-relaxed font-bold tracking-wider">
                                                                ORACLE EXTRACTION RELIES ON AI-PARSING. OCCASIONAL DISCREPANCIES MAY OCCUR DUE TO DOCUMENT FORMAT VARIATIONS.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleAgreeLegal}
                                                className="w-full py-5 bg-accent text-background font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] active:scale-95"
                                            >
                                                I ACCEPT THE TERMS & PROCEED
                                            </button>

                                            <p className="mt-8 text-[8px] text-muted-foreground font-black tracking-[0.2em] uppercase opacity-40">
                                                BY CLICKING ABOVE, YOU CONFIRM YOU ARE THE LEGAL OWNER OF THE ACCOUNT BEING ACCESSED
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (!result || !isMounted) ? (
                                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start">
                                    {/* Left Column (Upload Area) */}
                                    <div className="flex-1 w-full flex flex-col items-center max-w-[600px] mx-auto lg:max-w-none">
                                        <p className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed mb-8 md:mb-12 text-center">
                                            Deep-scan your mutual fund holdings to reveal hidden risks and performance leaks.
                                        </p>

                                        {/* Password Field Integration */}
                                        <div className="w-full max-w-[480px] mb-8 group">
                                            <div className="flex items-center justify-between mb-2 md:mb-3 px-1 text-[9px] md:text-[10px] font-black tracking-widest text-muted-foreground uppercase group-focus-within:text-accent transition-colors">
                                                <span>STATEMENT PASSWORD (PAN)</span>
                                                <Lock size={12} className="opacity-50" />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="ENTER PASSWORD IF ENCRYPTED"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full h-12 md:h-14 bg-background/50 border border-border/30 rounded-xl md:rounded-2xl px-4 md:px-6 text-xs md:text-sm font-bold tracking-widest focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all placeholder:text-muted-foreground/30"
                                            />
                                        </div>

                                        {/* Decorative Upload Component */}
                                        <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center">
                                            <div className="absolute inset-2 md:inset-4 border border-dashed border-accent/20 rounded-[30px] md:rounded-[40px] rotate-[-8deg] pointer-events-none" />
                                            <div className="absolute inset-6 md:inset-10 border border-dashed border-white/5 rounded-[30px] md:rounded-[40px] rotate-[15deg] pointer-events-none" />

                                            {/* Actual Upload Box */}
                                            <div
                                                onClick={triggerUpload}
                                                className={`relative z-10 w-[90%] md:w-[85%] h-[90%] md:h-[85%] glass-panel rounded-[30px] md:rounded-[40px] flex flex-col items-center justify-center p-6 md:p-8 transition-all hover:scale-[1.02] hover:border-accent/30 cursor-pointer group active:scale-[0.98] ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                                            >
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    ref={fileInputRef}
                                                    onChange={handleUpload}
                                                    accept=".pdf,.xlsx,.xls,.csv"
                                                />

                                                {/* Icon Container */}
                                                <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/10 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.1)] md:shadow-[0_0_40px_rgba(212,175,55,0.15)] border border-accent/20">
                                                    {isUploading ? (
                                                        <Activity className="w-8 h-8 md:w-10 md:h-10 text-accent animate-pulse" />
                                                    ) : (
                                                        <Upload className="w-8 h-8 md:w-10 md:h-10 text-accent" />
                                                    )}
                                                </div>

                                                <h3 className="text-xl md:text-2xl font-black font-barlow-condensed tracking-normal text-foreground mb-2 md:mb-3 uppercase text-center">
                                                    {isUploading ? 'SCANNING VAULT...' : 'DROP CAMS PDF'}
                                                </h3>
                                                <p className="text-[9px] md:text-[10px] text-muted-foreground tracking-[0.4em] md:tracking-[0.6em] font-black uppercase mb-8 md:mb-10 text-center opacity-70">
                                                    MAX 10MB <span className="hidden sm:inline">·</span><br className="sm:hidden" /> QUAD-LAYER SECURITY
                                                </p>

                                                {/* Ready Status Pill */}
                                                <div className="mt-auto flex items-center gap-2.5 text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase text-accent group-focus-within:scale-105 transition-all transition-all">
                                                    <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
                                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 ${isUploading ? 'hidden' : ''}`}></span>
                                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-accent shadow-[0_0_10px_rgba(212,175,55,0.5)]"></span>
                                                    </span>
                                                    {isUploading ? 'EXTRACTING BIOMETRICS...' : 'PORT READY'}
                                                </div>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[9px] md:text-[10px] font-black tracking-widest uppercase animate-in slide-in-from-top-4 w-full max-w-[480px] text-center sm:text-left">
                                                <AlertCircle size={16} className="shrink-0" />
                                                <span>{error}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column (Info Cards) */}
                                    <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0 lg:pt-10 xl:pt-20 max-w-[600px] mx-auto lg:max-w-none">
                                        <div className="glass-panel rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/5 overflow-hidden relative">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                                <Info size={100} className="md:w-[120px] md:h-[120px] text-accent" />
                                            </div>
                                            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 border border-accent/30">
                                                    <Info className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                                                </div>
                                                <h3 className="text-base md:text-lg font-black font-barlow-condensed tracking-normal uppercase">PROTOCOL OVERVIEW</h3>
                                            </div>
                                            <div className="flex flex-col gap-4 md:gap-6">
                                                {[
                                                    { type: 'lock', title: 'HARDWARE ENCRYPTION', desc: 'DATA PROCESSED IN MEMORY-ONLY SANDBOX' },
                                                    { type: 'shield', title: 'PAN VERIFICATION', desc: 'STRICT AUTHENTICATION AGAINST STATEMENT PAN' },
                                                    { type: 'file', title: 'ZERO-DATA STORAGE', desc: 'PDF DELETED IMMEDIATELY POST-EXTRACT' },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 group hover:border-accent/20 transition-all">
                                                        <div className="text-accent mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
                                                            {item.type === 'lock' && <Lock size={16} className="md:w-5 md:h-5" />}
                                                            {item.type === 'shield' && <Shield size={16} className="md:w-5 md:h-5" />}
                                                            {item.type === 'file' && <FileText size={16} className="md:w-5 md:h-5" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[9px] md:text-[10px] font-black tracking-widest uppercase mb-1">{item.title}</h4>
                                                            <p className="text-[8px] md:text-[9px] text-muted-foreground uppercase leading-relaxed font-bold tracking-wider">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 md:space-y-12 animate-in fade-in zoom-in-95 duration-700">
                                    {/* SUCCESS RESULTS SECTION */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                                        {/* Total Value Summary */}
                                        <div className="lg:col-span-1 glass-panel rounded-2xl md:rounded-3xl p-6 md:p-10 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-6 md:p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                                                <TrendingUp size={100} className="md:w-[120px] md:h-[120px] text-accent" />
                                            </div>
                                            <div className="relative z-10 h-full flex flex-col justify-between">
                                                <div>
                                                    <p className="text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] text-accent uppercase mb-3 md:mb-4">TOTAL ASSETS SCANNED</p>
                                                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-barlow-condensed tracking-normal mb-4 flex items-baseline">
                                                        <span>₹</span>
                                                        <CountUp
                                                            to={result.insights.metrics.totalValue || 0}
                                                            separator=","
                                                            duration={1}
                                                        />
                                                    </h2>
                                                    <div className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-black tracking-widest text-green-500 bg-green-500/10 w-fit px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg border border-green-500/20">
                                                        <CheckCircle2 size={10} className="md:w-3 md:h-3" />
                                                        VERIFIED HOLDINGS
                                                    </div>
                                                </div>

                                                <div className="mt-8 pt-8 border-t border-border/20">
                                                    <p className="text-[9px] md:text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-4">ASSET ALLOCATION</p>
                                                    <div className="h-48 w-full">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart>
                                                                <Pie
                                                                    data={[
                                                                        { name: 'Equity', value: result.insights.allocation.equity },
                                                                        { name: 'Debt', value: result.insights.allocation.debt },
                                                                        { name: 'Other', value: result.insights.allocation.other }
                                                                    ].filter(d => d.value > 0)}
                                                                    innerRadius={60}
                                                                    outerRadius={80}
                                                                    paddingAngle={5}
                                                                    dataKey="value"
                                                                >
                                                                    <Cell fill="var(--accent)" />
                                                                    <Cell fill="rgba(212, 175, 55, 0.4)" />
                                                                    <Cell fill="rgba(255, 255, 255, 0.1)" />
                                                                </Pie>
                                                                <Tooltip
                                                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px' }}
                                                                    itemStyle={{ color: '#D4AF37' }}
                                                                />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                    <div className="flex justify-around mt-4">
                                                        <div className="text-center">
                                                            <p className="text-[10px] font-black text-accent">{result.insights.allocation.equity}%</p>
                                                            <p className="text-[8px] text-muted-foreground uppercase tracking-widest">EQUITY</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-[10px] font-black text-accent/60">{result.insights.allocation.debt}%</p>
                                                            <p className="text-[8px] text-muted-foreground uppercase tracking-widest">DEBT</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                            {[
                                                {
                                                    label: 'TRUE XIRR',
                                                    value: (
                                                        <div className="flex items-baseline">
                                                            <CountUp to={result.insights.metrics.xirr || 0} duration={1} />
                                                            <span className="text-muted-foreground/40 ml-0.5">%</span>
                                                        </div>
                                                    ),
                                                    type: 'xirr',
                                                    sub: 'ANNUALIZED PERFORMANCE'
                                                },
                                                {
                                                    label: 'EXPENSE DRAG',
                                                    value: (
                                                        <div className="flex items-baseline">
                                                            <span className="mr-0.5">₹</span>
                                                            <CountUp to={result.insights.metrics.expenseRatioDrag || 0} separator="," duration={1} />
                                                        </div>
                                                    ),
                                                    type: 'drag',
                                                    sub: 'ANNUAL SAVING POTENTIAL'
                                                },
                                                {
                                                    label: 'FUND OVERLAP',
                                                    value: <CountUp to={result.insights.metrics.overlapCount || 0} duration={1} />,
                                                    type: 'overlap',
                                                    sub: 'HIDDEN DUPLICATES FOUND'
                                                },
                                                {
                                                    label: 'BENCHMARK',
                                                    value: `BEATING ${result.insights.benchmark?.label || "NIFTY 50"}`,
                                                    type: 'benchmark',
                                                    sub: `${result.insights.benchmark?.status || "TRACKING"} STATS`
                                                },
                                            ].map((stat, i) => (
                                                <div key={i} className="glass-panel border border-border/20 rounded-xl md:rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6 group hover:border-accent/40 transition-all">
                                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-background/50 border border-border/30 rounded-xl flex items-center justify-center text-accent group-hover:scale-110 group-hover:bg-accent/10 transition-all shadow-[0_0_20px_rgba(212,175,55,0.05)] shrink-0">
                                                        {stat.type === 'xirr' && <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />}
                                                        {stat.type === 'drag' && <Shield className="w-5 h-5 md:w-6 md:h-6" />}
                                                        {stat.type === 'overlap' && <PieChartIcon className="w-5 h-5 md:w-6 md:h-6" />}
                                                        {stat.type === 'benchmark' && <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] md:text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-0.5 md:mb-1">{stat.label}</p>
                                                        <div className="text-lg md:text-xl font-black font-barlow-condensed tracking-normal uppercase">{stat.value}</div>
                                                        <p className="text-[7px] md:text-[8px] text-accent/50 font-black tracking-[0.05em] md:tracking-[0.1em] uppercase">{stat.sub}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* HOLDINGS TABLE */}
                                    <div className="glass-panel rounded-2xl md:rounded-3xl overflow-hidden border border-white/5">
                                        <div className="px-4 sm:px-6 md:px-10 py-6 md:py-8 border-b border-border/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30 text-accent shrink-0">
                                                    <BarChart3 size={16} className="md:w-[18px] md:h-[18px]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg md:text-xl font-black font-barlow-condensed tracking-normal uppercase">DETAILED HOLDINGS VAULT</h3>
                                                    <p className="text-[8px] md:text-[9px] font-black tracking-widest text-muted-foreground uppercase mt-0.5">FULL DATA ARCHIVE EXTRACTED FROM DOCUMENT</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setResult(null)}
                                                className="w-full sm:w-auto px-5 md:px-6 py-2 bg-background border border-border/50 text-[9px] md:text-[10px] font-black tracking-widest uppercase hover:bg-white/5 hover:border-accent/40 transition-all rounded-lg text-center"
                                            >
                                                RESET SCAN
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto w-full">
                                            <table className="w-full text-left border-collapse min-w-[600px]">
                                                <thead>
                                                    <tr className="bg-background/20">
                                                        <th className="px-4 sm:px-6 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] font-black tracking-widest text-muted-foreground uppercase whitespace-nowrap">SCHEME IDENTIFIER</th>
                                                        <th className="px-4 sm:px-6 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] font-black tracking-widest text-muted-foreground uppercase whitespace-nowrap">CATEGORY</th>
                                                        <th className="px-4 sm:px-6 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] font-black tracking-widest text-muted-foreground uppercase whitespace-nowrap">UNITS</th>
                                                        <th className="px-4 sm:px-6 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] font-black tracking-widest text-muted-foreground uppercase text-right whitespace-nowrap">CURRENT VALUE</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/20">
                                                    {result.holdings.map((holding, idx) => (
                                                        <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-4 sm:px-6 md:px-10 py-4 md:py-6">
                                                                <p className="text-xs md:text-sm font-bold tracking-tight mb-1 group-hover:text-accent transition-colors line-clamp-2 md:line-clamp-none" title={holding.schemeName}>{holding.schemeName}</p>
                                                                <div className="flex flex-wrap gap-2 mt-1">
                                                                    <span className="text-[8px] md:text-[9px] text-muted-foreground bg-white/5 border border-white/10 px-1.5 py-0.5 rounded uppercase font-black tracking-widest">
                                                                        NAV: ₹{holding.liveNav || "N/A"}
                                                                    </span>
                                                                    {holding.lastUpdated && (
                                                                        <span className="text-[8px] text-accent/40 font-black tracking-widest uppercase">
                                                                            SYNC: {holding.lastUpdated}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 sm:px-6 md:px-10 py-4 md:py-6 whitespace-nowrap">
                                                                <span className="text-[9px] md:text-[10px] px-2.5 md:px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded-lg font-black tracking-widest">
                                                                    {holding.category}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 sm:px-6 md:px-10 py-4 md:py-6 whitespace-nowrap">
                                                                <p className="text-xs md:text-sm font-mono font-bold text-muted-foreground">{holding.units.toFixed(3)}</p>
                                                            </td>
                                                            <td className="px-4 sm:px-6 md:px-10 py-4 md:py-6 text-right whitespace-nowrap">
                                                                <div className="flex flex-col items-end">
                                                                    <p className="text-sm md:text-base font-black font-barlow-condensed tracking-normal">
                                                                        ₹{(holding.realTimeValue || holding.currentValue || 0).toLocaleString('en-IN')}
                                                                    </p>

                                                                    {holding.gain !== undefined && (
                                                                        <div className={`flex items-center gap-1 text-[9px] md:text-[10px] font-black mt-1 ${holding.gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                                            <span>{holding.gain >= 0 ? "▲" : "▼"}</span>
                                                                            <span>₹{(Math.abs(holding.gain) || 0).toLocaleString('en-IN')}</span>
                                                                            <span className="opacity-50">
                                                                                ({((holding.gain / holding.currentValue) * 100).toFixed(2)}%)
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="px-4 sm:px-6 md:px-10 py-8 md:py-12 border-t border-border/10 text-center relative overflow-hidden mt-auto">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                        <p className="text-[8px] md:text-[10px] font-black tracking-[0.4em] md:tracking-[0.6em] text-muted-foreground/30 uppercase leading-relaxed">
                            NIVESHIQ INTELLIGENCE LAYER <br className="sm:hidden" />
                            <span className="hidden sm:inline">//</span> PORTFOLIO ANALYSIS MODULE
                        </p>
                    </footer>
                </main>
            </div>
            {result && <ChatWidget portfolioData={result} />}
        </div>
    );
}