'use client';

import { useState, useEffect } from 'react';
import { TopNav } from '@/components/navigation/TopNav';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { MetricCard } from '@/components/shared/MetricCard';
import { AIBadge } from '@/components/shared/AIBadge';
import { Home, TrendingUp, Activity, AlertCircle, Download, RefreshCw, Trash2, User, Bell, Shield, BarChart3, Info } from 'lucide-react';
import Link from 'next/link';
import CountUp from '@/components/reactbits/CountUp';
import { MoneyHealthGauge } from '@/components/charts/MoneyHealthGauge';
import { HexagonalRadar } from '@/components/charts/HexagonalRadar';
import { PortfolioTreemap } from '@/components/charts/PortfolioTreemap';
import { XirrvsBenchmarkLine } from '@/components/charts/XirrvsBenchmarkLine';
import { useDashboardTour } from '@/hooks/useDashboardTour';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';
import { API_BASE_URL } from '@/lib/api';

export default function Dashboard() {
    const { addNotification, notifications } = useNotifications();
    useDashboardTour();
    const { user } = useAuth();
    const userName = user?.name || 'Operator';

    // Mock initial notification
    useEffect(() => {
        if (notifications.length === 0) {
            addNotification({
                title: 'SYSTEM INITIALIZED',
                message: 'AI ORACLE V4.0 ONLINE. SECURE DATA LINK ESTABLISHED. ALL SENSORS NOMINAL.',
                type: 'success',
                link: '/dashboard'
            });
        }
    }, []);

    const [latestData, setLatestData] = useState<any>(null);
    const [vaultHistory, setVaultHistory] = useState<any[]>([]);
    const [healthResult, setHealthResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // --- TRANSFORMATION ENGINE: DATA TO VISUALS ---
    const radarData = latestData ? [
        { subject: 'Risk', A: (latestData.insights?.metrics?.riskScore || 0) * 10, fullMark: 100 },
        { subject: 'Return', A: Math.min((latestData.insights?.metrics?.xirr || 0) * 5, 100), fullMark: 100 },
        { subject: 'Diversify', A: Math.max(100 - (latestData.insights?.metrics?.overlapCount || 0) * 15, 20), fullMark: 100 },
        { subject: 'Tax', A: latestData.insights?.metrics?.taxEfficiency || 60, fullMark: 100 },
        { subject: 'Cashflow', A: (latestData.insights?.allocation?.debt || 0) + 50, fullMark: 100 },
        { subject: 'Quality', A: latestData.insights?.metrics?.assetQuality === "AAA" ? 95 : 75, fullMark: 100 },
    ] : [
        { subject: 'Risk', A: 0, fullMark: 100 },
        { subject: 'Return', A: 0, fullMark: 100 },
        { subject: 'Diversify', A: 0, fullMark: 100 },
        { subject: 'Tax', A: 0, fullMark: 100 },
        { subject: 'Cashflow', A: 0, fullMark: 100 },
        { subject: 'Quality', A: 0, fullMark: 100 },
    ];

    const treemapData = latestData?.holdings ? Array.from(
        latestData.holdings.reduce((acc: any, h: any) => {
            const cat = h.category.split(' ')[0] || 'Equity';
            acc.set(cat, (acc.get(cat) || 0) + h.currentValue);
            return acc;
        }, new Map())
    ).map(([name, size]) => ({ name, size })) : [
        { name: 'INDEX', size: 400 },
        { name: 'DEBT', size: 300 },
        { name: 'LIQUID', size: 200 },
    ];

    const performanceData = vaultHistory.length > 0
        ? [...vaultHistory].reverse().map(v => ({
            name: new Date(v.date).toLocaleDateString('en-IN', { month: 'short', day: '2-digit' }),
            portfolio: v.totalValue,
            benchmark: v.totalValue * 0.95 // Synthetic benchmark for visual comparison
        }))
        : [
            { name: 'SCAN 01', portfolio: 0, benchmark: 0 },
            { name: 'SCAN 02', portfolio: 0, benchmark: 0 },
        ];

    useEffect(() => {
        const loadDashboardData = async () => {
            const token = localStorage.getItem('oracle_token');
            if (!token) return;

            try {
                const [latestRes, allRes, healthRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/portfolio`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/api/portfolio/all`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/api/health/all`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                const latest = await latestRes.json();
                const all = await allRes.json();
                const health = await healthRes.json();

                if (latest.success && latest.data) setLatestData(latest.data);
                if (all.success && all.data) setVaultHistory(all.data);
                if (health.success && health.data && health.data.length > 0) {
                    setHealthResult(health.data[0]); // Get the latest scan
                }
            } catch (err) {
                console.error("Dashboard Load Error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const totalValue = latestData?.summary?.totalValue || 0;
    const riskScore = latestData?.insights?.metrics?.riskScore || "N/A";

    // PRIORITY 1: REAL HEALTH SCORE | PRIORITY 2: CALC FROM PORTFOLIO | DEFAULT: 85
    const healthScore = healthResult?.totalScore || (latestData ? Math.round(100 - (latestData.insights?.metrics?.riskScore * 5) + (latestData.insights?.metrics?.taxEfficiency / 10)) : 85);

    if (!isMounted) return <div className="min-h-screen bg-[#0A0F1E]" />;

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <TopNav
                    userName={user?.name || 'Operator'}
                    customLinks={[
                        { label: 'PORTFOLIO', href: '/dashboard/portfolio', icon: <Activity size={12} /> },
                    ]}
                />
                <main id="dashboard-main-content" className="flex-1 overflow-y-auto overflow-x-hidden bg-background/50 relative scrollbar-thin scrollbar-thumb-accent/10">

                    {/* Hero Section */}
                    <section id="hero-section" className="px-4 sm:px-6 md:px-10 py-8 md:py-16 border-b border-border/30 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.05)_0%,transparent_50%)] pointer-events-none" />
                        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-center justify-between gap-6 md:gap-8 text-center md:text-left">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 sm:gap-5">
                                <div className="w-16 h-16 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-accent flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                                    <Home className="text-background w-8 h-8 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                </div>
                                <div>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground font-barlow-condensed tracking-normal">
                                        NAMASKAR, <span className="text-accent uppercase">{user?.name || 'OPERATOR'}</span>.
                                    </h1>
                                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-black tracking-[0.15em] uppercase opacity-60 mt-1 sm:mt-2">
                                        {latestData ? "YOUR FINANCIAL ORACLE IS READY." : "UPLOAD YOUR FIRST STATEMENT TO INITIALIZE ORACLE."}
                                    </p>
                                </div>
                            </div>

                            <Link
                                id="diagnostic-cta"
                                href="/dashboard/health"
                                className="group relative flex w-full sm:w-auto items-center justify-center md:justify-start gap-3 sm:gap-4 px-5 py-4 sm:px-8 sm:py-5 bg-card/40 backdrop-blur-xl border border-accent/20 rounded-2xl overflow-hidden hover:border-accent/40 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 md:mt-0"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                                    <Shield size={18} className="group-hover:scale-110 transition-transform sm:w-[20px] sm:h-[20px]" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-accent uppercase mb-0.5">SERVICE 02 ACTIVE</p>
                                    <p className="text-xs sm:text-sm font-black text-foreground uppercase tracking-normal font-barlow-condensed">START HEALTH DIAGNOSTIC →</p>
                                </div>
                            </Link>
                        </div>
                    </section>

                    {/* Main Content Grid */}
                    <section className="px-4 sm:px-6 md:px-10 py-8 md:py-10">
                        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">

                            {/* Top Tier: Health & Risk */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                                <div id="health-gauge-card" className="lg:col-span-1 bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-5 sm:p-6 md:p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Activity size={32} className="text-accent sm:w-[40px] sm:h-[40px]" />
                                    </div>
                                    <h3 className="text-[10px] sm:text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-6 sm:mb-8">FINANCIAL VITALITY</h3>
                                    <MoneyHealthGauge score={healthScore} />
                                    <div className="mt-6 flex items-center justify-between text-[9px] sm:text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                                        <span>Risk Profile: Aggressive</span>
                                        <span className="text-accent">Optimizing...</span>
                                    </div>
                                </div>

                                <div id="performance-chart-card" className="lg:col-span-2 bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                                        <h3 className="text-[10px] sm:text-xs font-black tracking-[0.3em] text-muted-foreground uppercase">Performance vs Benchmark</h3>
                                        <Link href="/dashboard/analytics" className="text-accent text-[8px] font-black tracking-widest border-b border-accent/20 pb-0.5">FULL ANALYTICS →</Link>
                                    </div>
                                    <div className="min-h-[200px] sm:min-h-[250px] w-full flex-1">
                                        <XirrvsBenchmarkLine data={performanceData} />
                                    </div>
                                </div>
                            </div>

                            {/* Middle Tier: Metrics & Radar */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                                {/* Left Column (Spans 2/3 on Desktop) */}
                                <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">

                                    {/* Metric Cards Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <MetricCard
                                            label="Portfolio Value"
                                            value={totalValue > 0 ? (
                                                <div className="flex items-baseline">
                                                    <span>₹</span>
                                                    <CountUp
                                                        to={totalValue}
                                                        separator=","
                                                        duration={1}
                                                        startWhen={!loading}
                                                    />
                                                </div>
                                            ) : "₹---"}
                                            icon={<Activity size={24} />}
                                            trend="up"
                                            trendValue={latestData ? "Live NAV Sync Active" : "No Data Sync"}
                                        />
                                        <MetricCard
                                            label="Portfolio Risk"
                                            value={riskScore !== "N/A" ? (
                                                <div className="flex items-baseline">
                                                    <CountUp
                                                        to={Number(riskScore)}
                                                        duration={1}
                                                        startWhen={!loading}
                                                    />
                                                    <span className="text-muted-foreground/60 text-lg md:text-xl ml-1">/10</span>
                                                </div>
                                            ) : "---"}
                                            icon={<TrendingUp size={24} />}
                                            trend={Number(riskScore) > 6 ? "down" : "up"}
                                            trendValue={latestData?.insights?.metrics?.riskLabel || "Analyzing..."}
                                        />
                                    </div>

                                    {/* Treemap Card Container */}
                                    <div id="treemap-card" className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-5 md:p-6 lg:p-8 overflow-hidden">
                                        {/* Header for Treemap */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                                            <h3 className="text-[10px] md:text-xs font-black tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase">
                                                Asset Allocation Treemap
                                            </h3>
                                            <span className="text-[8px] md:text-[9px] font-black text-accent tracking-[0.2em] md:tracking-widest uppercase bg-accent/10 px-3 py-1.5 rounded-full w-fit">
                                                Direct Holdings Only
                                            </span>
                                        </div>

                                        {/* Using an explicit height instead of flex-1 prevents the chart from bleeding out */}
                                        <div className="w-full relative h-[300px] md:h-[400px]">
                                            <PortfolioTreemap data={treemapData} />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column (Spans 1/3 on Desktop) */}
                                <div id="radar-analysis-card" className="lg:col-span-1 space-y-6 md:space-y-8 flex flex-col">

                                    {/* Radar Chart Card */}
                                    <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-5 sm:p-6 md:p-8 flex-1 min-h-[350px] lg:min-h-[auto]">
                                        <h3 className="text-[10px] md:text-xs font-black tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase mb-4 md:mb-6 text-center lg:text-left">
                                            6D Health Analysis
                                        </h3>
                                        <div className="relative w-full h-[250px] sm:h-[300px] lg:h-full lg:min-h-[250px] flex items-center justify-center">
                                            <HexagonalRadar data={radarData} />
                                        </div>
                                    </div>

                                    {/* Nudges Section */}
                                    <div className="space-y-4">
                                        <div className="mb-4">
                                            <AIBadge text="Real-time Oracle Nudges" />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                            {[
                                                { title: 'Tax Threshold', desc: 'Approaching ₹1.5L ELSS limit.', color: 'accent' },
                                                { title: 'Overlap Alert', desc: '72% overlap in Small Cap funds.', color: 'red-400' },
                                            ].map((nudge, i) => (
                                                <div key={i} className="p-4 md:p-5 rounded-2xl border border-white/5 bg-[#141B2D]/50 hover:bg-[#1A2235] hover:border-accent/30 transition-all duration-300 group cursor-default">
                                                    <p className="font-black text-foreground text-[10px] md:text-[11px] uppercase tracking-[0.2em] mb-1.5 group-hover:text-accent transition-colors">
                                                        {nudge.title}
                                                    </p>
                                                    <p className="text-[9px] md:text-[10px] text-muted-foreground font-black tracking-wider uppercase opacity-70 leading-relaxed">
                                                        {nudge.desc}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Tier: History */}
                            <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                                <div className="px-5 sm:px-6 md:px-8 py-5 md:py-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <h3 className="text-[10px] sm:text-xs font-black tracking-[0.3em] text-muted-foreground uppercase font-barlow-condensed">Vault Analysis History</h3>
                                    <Link href="/dashboard/reports" className="text-accent w-fit text-[8px] sm:text-[9px] font-black tracking-[0.2em] border-b border-accent/20 pb-0.5">VIEW ALL NODES →</Link>
                                </div>
                                <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                                    <table className="w-full text-left border-collapse min-w-[500px]">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                                <th className="px-5 sm:px-6 md:px-8 py-4 sm:py-5 text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">Analysis Date</th>
                                                <th className="px-5 sm:px-6 md:px-8 py-4 sm:py-5 text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">Total Value</th>
                                                <th className="px-5 sm:px-6 md:px-8 py-4 sm:py-5 text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right whitespace-nowrap">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {vaultHistory.length > 0 ? vaultHistory.slice(0, 5).map((report, i) => (
                                                <tr key={i} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                                                    <td className="px-5 sm:px-6 md:px-8 py-4 sm:py-6 whitespace-nowrap">
                                                        <span className="text-[10px] sm:text-xs font-black tracking-widest text-foreground uppercase group-hover:text-accent transition-colors">
                                                            {new Date(report.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 sm:px-6 md:px-8 py-4 sm:py-6 whitespace-nowrap">
                                                        <div className="text-sm md:text-base font-black font-barlow-condensed tracking-normal text-foreground">
                                                            ₹{(report.totalValue || 0).toLocaleString('en-IN')}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 sm:px-6 md:px-8 py-4 sm:py-6 text-right whitespace-nowrap">
                                                        <span className="px-2 sm:px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-[8px] sm:text-[9px] font-black tracking-widest">
                                                            ARCHIVED
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={3} className="px-5 sm:px-6 md:px-8 py-8 sm:py-10 text-center text-muted-foreground text-[9px] sm:text-[10px] font-black tracking-widest uppercase">
                                                        No Vault Entries Detected
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="px-4 md:px-10 py-8 md:py-12 border-t border-border/10 text-center relative overflow-hidden">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                        <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.4em] text-muted-foreground/30 uppercase leading-relaxed">
                            © 2026 NIVESHIQ INTELLIGENCE LAYER <span className="hidden sm:inline">//</span> SEC REGULATED SYSTEMS
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
}