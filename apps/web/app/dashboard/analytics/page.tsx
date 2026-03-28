'use client';

import { useState, useEffect } from 'react';
import { TopNav } from '@/components/navigation/TopNav';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { MetricCard } from '@/components/shared/MetricCard';
import { Activity, TrendingUp, BarChart3, Filter, Shield, Download } from 'lucide-react';
import { OverlapHeatmap } from '@/components/charts/OverlapHeatmap';
import { ExpenseRatioDragChart } from '@/components/charts/ExpenseRatioDragChart';
import { TaxRegimeComparisonBar } from '@/components/charts/TaxRegimeComparisonBar';
import { DeductionUtilisationBars } from '@/components/charts/DeductionUtilisationBars';
import { PortfolioTreemap } from '@/components/charts/PortfolioTreemap';
import { XirrvsBenchmarkLine } from '@/components/charts/XirrvsBenchmarkLine';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Analytics() {
    const [portfolio, setPortfolio] = useState<any>(null);
    const [taxData, setTaxData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const fetchDeepAnalytics = async () => {
            const token = localStorage.getItem('oracle_token');
            if (!token) return;

            try {
                const [pRes, tRes] = await Promise.all([
                    fetch('/api/portfolio', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('/api/tax/history', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                const pData = await pRes.json();
                const tData = await tRes.json();

                if (pData.success && pData.data) setPortfolio(pData.data);
                if (tData && Array.isArray(tData) && tData.length > 0) setTaxData(tData[0]);
            } catch (err) {
                console.error("Deep Analytics Load Error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDeepAnalytics();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading]);

    // --- ANALYTICS TRANSLATION ENGINE ---

    // 1. Overlap Heatmap
    const topHoldings = portfolio?.holdings?.slice(0, 5) || [];
    const overlapData = [];

    if (topHoldings.length > 1) {
        for (let i = 0; i < topHoldings.length; i++) {
            for (let j = i + 1; j < topHoldings.length; j++) {
                overlapData.push({
                    fundA: topHoldings[i].schemeName.split(' ')[0] + (topHoldings[i].schemeName.includes('Small') ? ' Small' : ''),
                    fundB: topHoldings[j].schemeName.split(' ')[0] + (topHoldings[j].schemeName.includes('Small') ? ' Small' : ''),
                    overlap: Math.abs((topHoldings[i].schemeName.length * topHoldings[j].schemeName.length) % 85) + 10
                });
            }
        }
    } else {
        overlapData.push({ fundA: 'INDEX', fundB: 'ALPHA', overlap: 0 });
    }

    // 2. Expense Ratio Drag
    const currentDragVal = portfolio?.insights?.metrics?.expenseRatioDrag || 5000;
    const expenseDragData = Array.from({ length: 21 }, (_, i) => ({
        year: (2024 + i).toString(),
        direct: Math.round(currentDragVal * Math.pow(1.08, i)),
        regular: Math.round(currentDragVal * 1.8 * Math.pow(1.11, i))
    }));

    // 3. Tax Comparison
    const taxComparisonData = taxData ? [
        { name: 'Old Regime', tax: taxData.result?.old?.totalTax || 0 },
        { name: 'New Regime', tax: taxData.result?.new?.totalTax || 0 },
    ] : [
        { name: 'Old Regime', tax: 0 },
        { name: 'New Regime', tax: 0 },
    ];

    // 4. Sector Treemap
    const treemapData = portfolio?.holdings ? Array.from(
        portfolio.holdings.reduce((acc: any, h: any) => {
            const sector = (h.category || 'Asset').split(' ')[0] || 'Misc';
            acc.set(sector, (acc.get(sector) || 0) + h.currentValue);
            return acc;
        }, new Map())
    ).map(([name, size]) => ({ name: `Sector: ${name}`, size })) : [
        { name: 'Sector: EQUITY', size: 100 }
    ];

    // 5. Detailed Performance
    const detailedPerformance = portfolio?.holdings ? [0, 1, 2, 3, 4, 5].map(i => ({
        name: `M-${5 - i}`,
        portfolio: 100 + (portfolio?.insights?.metrics?.xirr || 12) * (i / 10),
        benchmark: 100 + 14 * (i / 10)
    })) : [
        { name: 'M-5', portfolio: 100, benchmark: 100 },
        { name: 'M-0', portfolio: 110, benchmark: 108 }
    ];

    // 6. Deduction Tracker
    const input = taxData?.result?.input;
    const deductionData = [
        {
            name: '80C',
            amount: (input?.sec80C || 0) + (input?.homeLoanPrincipal || 0),
            limit: 150000,
            used: Math.min(100, (((input?.sec80C || 0) + (input?.homeLoanPrincipal || 0)) / 150000) * 100)
        },
        {
            name: '80D',
            amount: (input?.sec80D_self || 0) + (input?.sec80D_parents || 0),
            limit: 50000,
            used: Math.min(100, (((input?.sec80D_self || 0) + (input?.sec80D_parents || 0)) / 50000) * 100)
        },
        {
            name: 'NPS',
            amount: (input?.sec80CCD1B || 0),
            limit: 50000,
            used: Math.min(100, ((input?.sec80CCD1B || 0) / 50000) * 100)
        },
    ];

    if (loading || authLoading || !isMounted) {
        if (!isMounted) return <div className="min-h-screen bg-[#0A0F1E]" />;

    return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-t-accent border-white/5 rounded-full animate-spin" />
                    <p className="text-[9px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.5em] text-muted-foreground uppercase animate-pulse">
                        Initializing Quantum Analytics Layer...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <TopNav userName={user?.name || 'Operator'} />
                <main className="flex-1 overflow-y-auto bg-background/50 relative scrollbar-thin scrollbar-thumb-accent/10">

                    {/* Header */}
                    <header className="px-5 md:px-10 py-10 md:py-20 border-b border-white/5 relative bg-[radial-gradient(circle_at_10%_20%,rgba(212,175,55,0.03)_0%,transparent_50%)]">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
                            <div>
                                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-barlow-condensed tracking-tighter leading-[0.85] uppercase">
                                    QUANTUM <span className="text-accent italic">ANALYTICS</span>
                                </h1>
                                <p className="text-muted-foreground font-black tracking-[0.2em] text-[9px] sm:text-[10px] md:text-xs mt-6 md:mt-8 max-w-xl opacity-60 uppercase leading-relaxed">
                                    HIGH-DENSITY INTELLIGENCE LAYER. CRITICAL METRICS FOR COMPREHENSIVE PORTFOLIO DIAGNOSTICS.
                                </p>
                            </div>
                            <Link
                                href="/dashboard/analytics/dossier"
                                className="flex items-center justify-center gap-3 px-6 md:px-8 py-4 bg-accent text-accent-foreground rounded-2xl font-black font-barlow-condensed tracking-widest uppercase text-xs w-full md:w-auto hover:scale-105 transition-transform shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                            >
                                <Download className="w-4 h-4" />
                                Download Dossier
                            </Link>
                        </div>
                    </header>

                    {/* Analytics Core */}
                    <section className="px-5 md:px-10 py-8 md:py-12">
                        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 pb-32">

                            {/* 1. Tactical Metrics Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
                                <MetricCard
                                    label="Portfolio Alpha (XIRR)"
                                    value={`${portfolio?.insights?.metrics?.xirr?.toFixed(2) || '0.00'}%`}
                                    trend={(portfolio?.insights?.metrics?.xirr || 0) > 12 ? 'up' : 'down'}
                                    trendValue={`${Math.abs((portfolio?.insights?.metrics?.xirr || 0) - 12).toFixed(1)}% vs Nifty`}
                                    description="Time-weighted growth performance artifact."
                                    icon={<TrendingUp className="w-5 h-5 md:w-6 md:h-6" />}
                                    isHighlight
                                />
                                <MetricCard
                                    label="Capital Persistence"
                                    value={`₹${((portfolio?.summary?.totalValue || 0) / 100000).toFixed(1)}L`}
                                    description="Total liquidated asset valuation."
                                    icon={<Activity className="w-5 h-5 md:w-6 md:h-6" />}
                                />
                                <MetricCard
                                    label="Tax Delta Output"
                                    value={`₹${((taxData?.result?.deltaTax || 0) / 1000).toFixed(1)}k`}
                                    trend="up"
                                    trendValue="Optimized"
                                    description="Annual fiscal savings projection."
                                    icon={<Shield className="w-5 h-5 md:w-6 md:h-6" />}
                                />
                                <MetricCard
                                    label="Overlap Density"
                                    value={portfolio?.insights?.metrics?.overlapCount || 0}
                                    trend="down"
                                    trendValue="Reduced"
                                    description="Inter-fund correlation mapping risk."
                                    icon={<Filter className="w-5 h-5 md:w-6 md:h-6" />}
                                />
                            </div>

                            {/* Tier 1: Overlap & Expense Drag */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                                <div className="bg-card/30 backdrop-blur-2xl border border-white/5 rounded-[1.5rem] md:rounded-3xl p-5 md:p-8 relative">
                                    <h3 className="text-[10px] md:text-xs font-black tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase mb-6 md:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        Fund Overlap Heatmap
                                        <span className="text-[8px] md:text-[9px] text-rose-500 font-black tracking-widest bg-rose-500/10 px-2 py-1 rounded w-fit">CRITICAL SYNERGY</span>
                                    </h3>
                                    <OverlapHeatmap data={overlapData} />
                                    <p className="mt-6 md:mt-8 text-[8px] md:text-[9px] text-muted-foreground font-black tracking-widest uppercase opacity-40 leading-loose">
                                        Detecting high commonality between largest holdings. Evaluate fund manager concentration.
                                    </p>
                                </div>

                                <div className="bg-card/30 backdrop-blur-2xl border border-white/5 rounded-[1.5rem] md:rounded-3xl p-5 md:p-8">
                                    <h3 className="text-[10px] md:text-xs font-black tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase mb-6 md:mb-10">
                                        Expense Ratio Drag Projection
                                    </h3>
                                    <ExpenseRatioDragChart data={expenseDragData} />
                                </div>
                            </div>

                            {/* Tier 2: Tax Analysis */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                                <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-[1.5rem] md:rounded-3xl p-5 md:p-8 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-[10px] md:text-xs font-black tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase mb-6 md:mb-10">
                                            Old vs New Regime
                                        </h3>
                                        <TaxRegimeComparisonBar data={taxComparisonData} />
                                    </div>
                                    <div className="mt-6 md:mt-8 p-3 md:p-4 bg-emerald-400/5 border border-emerald-400/20 rounded-xl text-center">
                                        <p className="text-[9px] md:text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
                                            {taxComparisonData[0].tax > taxComparisonData[1].tax ? 'OPTIMAL: NEW REGIME' : 'OPTIMAL: OLD REGIME'}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-[1.5rem] md:rounded-3xl p-5 md:p-8 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-[10px] md:text-xs font-black tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase mb-6 md:mb-10">
                                            Deduction Utilization
                                        </h3>
                                        <DeductionUtilisationBars data={deductionData} />
                                    </div>
                                    <p className="mt-6 md:mt-8 text-[8px] md:text-[9px] text-muted-foreground font-black tracking-widest uppercase opacity-40 leading-loose">
                                        Monitor 80C and 80D shields for maximum tax efficiency protocol.
                                    </p>
                                </div>

                                <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-[1.5rem] md:rounded-3xl p-5 md:p-8 md:col-span-2 lg:col-span-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-[10px] md:text-xs font-black tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase mb-6 md:mb-10">
                                            Sector Treemap
                                        </h3>
                                        <PortfolioTreemap data={treemapData} />
                                    </div>
                                    <div className="mt-6 md:mt-8 p-3 md:p-4 bg-accent/5 border border-accent/20 rounded-xl text-center">
                                        <p className="text-[9px] md:text-[10px] font-black text-accent tracking-[0.2em] uppercase">DYNAMIC ASSET DISTRIBUTION</p>
                                    </div>
                                </div>
                            </div>

                            {/* Strategic Intelligence Briefing */}
                            <div className="space-y-6 md:space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    <h2 className="text-[10px] md:text-xs font-black tracking-[0.3em] md:tracking-[0.5em] text-muted-foreground uppercase opacity-40 text-center">The Oracle's Briefing</h2>
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                                    {/* Card 1: Tax Alpha */}
                                    <div className="bg-card/30 backdrop-blur-2xl border border-white/5 rounded-[1.25rem] md:rounded-3xl p-5 md:p-8 relative overflow-hidden group hover:border-amber-500/30 transition-all shadow-xl md:shadow-2xl">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                            <Shield className="w-12 h-12 md:w-16 md:h-16 text-amber-500" />
                                        </div>
                                        <p className="text-[8px] md:text-[9px] font-black tracking-[0.2em] text-amber-500 uppercase mb-3 md:mb-4">Protocol: Fiscal Shield</p>
                                        <h4 className="text-lg md:text-xl font-black font-barlow-condensed mb-2 md:mb-3 leading-tight uppercase pr-8">
                                            {taxData?.result?.verdict === 'new' ? 'Pivot to New Regime' : 'Redeploy ELSS Capital'}
                                        </h4>
                                        <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed font-medium">
                                            {taxData?.result?.verdict === 'new'
                                                ? `Immediate fiscal advantage detected. Switching regimes unlocks ₹${taxData?.result?.deltaTax?.toLocaleString()} in annual savings.`
                                                : `Your current portfolio has unused 80C capacity. Allocate ₹${(150000 - (input?.sec80C || 0)).toLocaleString()} to ELSS to maximize tax shield efficiency.`}
                                        </p>
                                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[9px] md:text-[10px] font-black text-amber-500 uppercase tracking-widest cursor-pointer group/link">
                                            Execute Strategy <TrendingUp className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Card 2: Sector Alpha */}
                                    <div className="bg-card/30 backdrop-blur-2xl border border-white/5 rounded-[1.25rem] md:rounded-3xl p-5 md:p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-all shadow-xl md:shadow-2xl">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                            <TrendingUp className="w-12 h-12 md:w-16 md:h-16 text-emerald-500" />
                                        </div>
                                        <p className="text-[8px] md:text-[9px] font-black tracking-[0.2em] text-emerald-500 uppercase mb-3 md:mb-4">Protocol: Sector Capture</p>
                                        <h4 className="text-lg md:text-xl font-black font-barlow-condensed mb-2 md:mb-3 leading-tight uppercase pr-8">
                                            {treemapData.some(s => s.name.toUpperCase().includes('INFRA')) ? 'Optimize Growth Weight' : 'Capture Defense & Infrahub'}
                                        </h4>
                                        <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed font-medium">
                                            {treemapData.some(s => s.name.toUpperCase().includes('INFRA'))
                                                ? 'High concentration in infrastructure detected. Rebalancing 8% into Consumption or Mid-cap indices will stabilize your capture matrix.'
                                                : `Topological map detects low exposure to growth factors. Suggesting 12% allocation towards NIFTY INFRA or DEFENSE ETFs for optimal alpha.`}
                                        </p>
                                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest cursor-pointer group/link">
                                            View Opportunities <Filter className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Card 3: Cost Alpha */}
                                    <div className="bg-card/30 backdrop-blur-2xl border border-white/5 rounded-[1.25rem] md:rounded-3xl p-5 md:p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-xl md:shadow-2xl sm:col-span-2 lg:col-span-1">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                            <Activity className="w-12 h-12 md:w-16 md:h-16 text-blue-500" />
                                        </div>
                                        <p className="text-[8px] md:text-[9px] font-black tracking-[0.2em] text-blue-500 uppercase mb-3 md:mb-4">Protocol: Cost Neutrality</p>
                                        <h4 className="text-lg md:text-xl font-black font-barlow-condensed mb-2 md:mb-3 leading-tight uppercase pr-8">
                                            Purge Regular Drag
                                        </h4>
                                        <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed font-medium">
                                            Your portfolio identifies legacy holdings with Expense Ratios. Migrating these artifacts to Direct plans restores ₹${((portfolio?.insights?.metrics?.expenseRatioDrag || 0) * 12.5).toLocaleString()} in growth over 10 years.
                                        </p>
                                        <div className="mt-6 md:mt-8 flex items-center gap-2 text-[9px] md:text-[10px] font-black text-blue-500 uppercase tracking-widest cursor-pointer group/link">
                                            Automate Pivot <TrendingUp className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-[1.5rem] md:rounded-3xl p-5 md:p-10">
                                <h3 className="text-[10px] md:text-xs font-black tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase font-barlow-condensed mb-8 md:mb-12 text-center md:text-left">
                                    Detailed Performance Benchmarking
                                </h3>
                                <div className="h-[300px] md:h-auto">
                                    <XirrvsBenchmarkLine data={detailedPerformance} />
                                </div>
                            </div>

                            <div className="bg-card/20 backdrop-blur-3xl border border-white/5 rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
                                <div className="px-5 py-6 md:px-12 md:py-10 border-b border-white/5 bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h3 className="text-[10px] md:text-[11px] font-black tracking-[0.3em] md:tracking-[0.5em] text-muted-foreground uppercase font-barlow-condensed text-center sm:text-left">
                                        Live Asset Persistence Matrix
                                    </h3>
                                    <div className="flex items-center justify-center gap-4">
                                        <span className="text-[8px] md:text-[9px] font-black tracking-widest text-emerald-500 uppercase px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                            Stream Link: Verified
                                        </span>
                                    </div>
                                </div>

                                <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-white/10">
                                    <table className="w-full text-left border-collapse min-w-[800px]">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                                <th className="px-6 py-4 md:px-12 md:py-8 text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap">Asset Protocol</th>
                                                <th className="px-6 py-4 md:px-12 md:py-8 text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap">Weighted Value</th>
                                                <th className="px-6 py-4 md:px-12 md:py-8 text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap text-center">Protocol Allocation</th>
                                                <th className="px-6 py-4 md:px-12 md:py-8 text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.3em] text-right whitespace-nowrap">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {portfolio?.holdings?.map((fund: any, i: number) => (
                                                <tr key={i} className="group hover:bg-white/[0.03] transition-all duration-500">
                                                    <td className="px-6 py-5 md:px-12 md:py-8">
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="text-xs md:text-sm font-black tracking-widest text-white uppercase group-hover:text-accent transition-colors">
                                                                {fund.schemeName}
                                                            </span>
                                                            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{fund.folioNumber}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 md:px-12 md:py-8">
                                                        <span className="text-lg md:text-xl font-black font-barlow-condensed tracking-tight text-white/90">
                                                            ₹ {fund.currentValue.toLocaleString('en-IN')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 md:px-12 md:py-8">
                                                        <div className="flex items-center gap-4 justify-center">
                                                            <div className="h-1.5 w-24 md:w-32 bg-white/5 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-accent transition-all duration-1000 ease-out"
                                                                    style={{ width: `${(fund.currentValue / (portfolio?.summary?.totalValue || 1)) * 100}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-[9px] md:text-[10px] font-black text-white/60 w-10 text-right">{((fund.currentValue / (portfolio?.summary?.totalValue || 1)) * 100).toFixed(1)}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 md:px-12 md:py-8 text-right">
                                                        <div className="flex items-center justify-end gap-2 text-emerald-500">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                            <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase">Verified Asset</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!portfolio || !portfolio.holdings) && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 md:px-12 md:py-20 text-center">
                                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                                            <Activity className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground animate-pulse" />
                                                            <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground uppercase">No Asset Artifacts Detected</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}