'use client';

import { useState, useEffect } from 'react';
import { TopNav } from '@/components/navigation/TopNav';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { Download, RefreshCw, Trash2, Search, FileText, Database, Plus, Filter, Flame, Printer } from 'lucide-react';
import Link from 'next/link';
import CountUp from '@/components/reactbits/CountUp';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/lib/api';

interface Report {
    id: string;
    date: string;
    totalValue: number;
    holdingsCount: number;
    riskScore: number;
    xirr: number;
    overlapCount: number;
}

export default function Reports() {
    const [reports, setReports] = useState<Report[]>([]);
    const [healthReports, setHealthReports] = useState<any[]>([]);
    const [taxReports, setTaxReports] = useState<any[]>([]);
    const [fireReports, setFireReports] = useState<any[]>([]);
    const [lifePlannerReports, setLifePlannerReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [timeFilter, setTimeFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState<'DATE' | 'VALUE' | 'XIRR'>('DATE');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
    const [isMounted, setIsMounted] = useState(false);
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Custom Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState<{ id: string, type: 'PORTFOLIO' | 'HEALTH' | 'TAX' | 'FIRE' | 'LIFE_PLANNER' } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (authLoading) return;

            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('oracle_token') : null;
                if (!token) {
                    setLoading(false);
                    return;
                }

                const [portfolioRes, healthRes, taxRes, fireRes, lifePlannerRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/portfolio/all`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/health/all`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/tax/history`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/fire/all`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/life-planner/all`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                const portfolioData = await portfolioRes.json();
                const healthData = await healthRes.json();
                const taxData = await taxRes.json();
                const fireData = await fireRes.json();
                const lifePlannerData = await lifePlannerRes.json();

                if (portfolioData.success) setReports(portfolioData.data);
                if (healthData.success) setHealthReports(healthData.data);
                if (Array.isArray(taxData)) setTaxReports(taxData);
                if (fireData.success) setFireReports(fireData.data);
                if (lifePlannerData.success) setLifePlannerReports(lifePlannerData.data);
            } catch (err) {
                console.error("Failed to fetch reports:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [authLoading, user]);

    const filteredReports = reports.filter(r => {
        const reportDate = new Date(r.date);
        const now = new Date();

        if (timeFilter === 'LAST 30 DAYS') {
            const diff = now.getTime() - reportDate.getTime();
            const days = diff / (1000 * 60 * 60 * 24);
            if (days > 30) return false;
        } else if (timeFilter === 'LAST 6 MONTHS') {
            const diff = now.getTime() - reportDate.getTime();
            const months = diff / (1000 * 60 * 60 * 24 * 30.44); // Approx month
            if (months > 6) return false;
        }

        return (
            reportDate.toLocaleDateString('en-IN').includes(searchQuery) ||
            r.totalValue.toString().includes(searchQuery)
        );
    }).sort((a, b) => {
        let valA, valB;
        if (sortBy === 'DATE') {
            valA = new Date(a.date).getTime();
            valB = new Date(b.date).getTime();
        } else if (sortBy === 'VALUE') {
            valA = a.totalValue;
            valB = b.totalValue;
        } else {
            valA = a.xirr;
            valB = b.xirr;
        }

        return sortOrder === 'DESC' ? valB - valA : valA - valB;
    });

    const handlePDF = (id: string, type: 'PORTFOLIO' | 'HEALTH' | 'TAX' | 'FIRE' | 'LIFE_PLANNER') => {
        const params = new URLSearchParams();
        if (type === 'PORTFOLIO') params.set('portfolioId', id);
        else if (type === 'HEALTH') params.set('healthId', id);
        else if (type === 'TAX') params.set('taxId', id);
        else if (type === 'FIRE') params.set('fireId', id);
        else if (type === 'LIFE_PLANNER') params.set('lifeId', id);
        
        params.set('autoPrint', 'true');
        window.open(`/dashboard/analytics/dossier?${params.toString()}`, '_blank');
    };

    const handleDownload = async (id: string, date: string, type: 'PORTFOLIO' | 'HEALTH' | 'TAX' | 'FIRE' | 'LIFE_PLANNER' = 'PORTFOLIO') => {
        try {
            const token = localStorage.getItem('oracle_token');
            const endpoint = type === 'PORTFOLIO'
                ? `${API_BASE_URL}/api/portfolio/${id}`
                : type === 'HEALTH'
                    ? `${API_BASE_URL}/api/health/${id}`
                    : type === 'FIRE'
                        ? `${API_BASE_URL}/api/fire/${id}`
                        : type === 'LIFE_PLANNER'
                            ? `${API_BASE_URL}/api/life-planner/${id}`
                            : `${API_BASE_URL}/api/tax/${id}`;

            const res = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success || (type === 'TAX' && data)) {
                // Tax might return direct object or success wrapped
                const payload = data.data || data;
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const typeLabel = type.replace('_', '-');
                a.download = `NiveshIQ-${typeLabel}-${new Date(date).toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error("Download failed:", err);
        }
    };

    const handleDelete = async () => {
        if (!reportToDelete) return;
        const { id, type } = reportToDelete;

        try {
            const token = localStorage.getItem('oracle_token');
            const endpoint = type === 'PORTFOLIO'
                ? `${API_BASE_URL}/api/portfolio/${id}`
                : type === 'HEALTH'
                    ? `${API_BASE_URL}/api/health/${id}`
                    : type === 'FIRE'
                        ? `${API_BASE_URL}/api/fire/${id}`
                        : type === 'LIFE_PLANNER'
                            ? `${API_BASE_URL}/api/life-planner/${id}`
                            : `${API_BASE_URL}/api/tax/${id}`;

            const res = await fetch(endpoint, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                if (type === 'PORTFOLIO') {
                    setReports(prev => prev.filter(r => (r as any).id !== id && (r as any)._id !== id));
                } else if (type === 'HEALTH') {
                    setHealthReports(prev => prev.filter(h => h._id !== id));
                } else if (type === 'FIRE') {
                    setFireReports(prev => prev.filter(f => f._id !== id));
                } else if (type === 'LIFE_PLANNER') {
                    setLifePlannerReports(prev => prev.filter(lp => lp._id !== id));
                } else {
                    setTaxReports(prev => prev.filter(t => t._id !== id));
                }
            }
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setIsDeleteModalOpen(false);
            setReportToDelete(null);
        }
    };

    const openDeleteModal = (id: string, type: 'PORTFOLIO' | 'HEALTH' | 'TAX' | 'FIRE' | 'LIFE_PLANNER') => {
        setReportToDelete({ id, type: type as any });
        setIsDeleteModalOpen(true);
    };

    if (!isMounted) return <div className="min-h-screen bg-[#0A0F1E]" />;

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <DashboardSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <TopNav 
                    userName={user?.name || 'Operator'}
                    customLinks={[
                        { label: 'REPORTS VAULT', href: '/dashboard/reports', icon: <Database size={12} /> },
                    ]}
                />

                <main className="flex-1 overflow-y-auto bg-background relative scrollbar-thin scrollbar-thumb-accent/20">
                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 w-[150%] md:w-1/3 h-1/2 md:h-1/3 bg-accent/5 blur-[80px] md:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 md:translate-x-1/2 pointer-events-none" />

                    {/* Header Section */}
                    <header className="px-5 md:px-10 py-10 md:py-20 relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(212,175,55,0.03)_0%,transparent_50%)] pointer-events-none" />
                        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8">
                            <div>
                                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-barlow-condensed tracking-normal leading-[0.85] uppercase">
                                    YOUR ANALYSES<br />
                                    <span className="text-accent italic">HISTORY</span>
                                </h1>
                                <p className="text-muted-foreground font-black tracking-[0.4em] md:tracking-[0.6em] text-[9px] sm:text-[10px] md:text-xs mt-4 md:mt-8 max-w-xl opacity-60 uppercase leading-relaxed">
                                    ACCESS YOUR ARCHIVED INTELLIGENCE. REVIEW PAST PORTFOLIO HEALTH CHECKS AND PERFORMANCE SNAPSHOTS.
                                </p>
                            </div>

                            <Link
                                href="/dashboard/portfolio"
                                className="inline-flex items-center justify-center gap-3 w-full lg:w-auto px-6 md:px-8 py-3.5 md:py-4 bg-accent text-background rounded-xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:scale-[1.02] md:hover:scale-[1.05] transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)] group active:scale-95"
                            >
                                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                                NEW ANALYSIS
                            </Link>
                        </div>
                    </header>

                    {/* Controls Section */}
                    <section className="px-5 md:px-10 py-4 md:py-6 border-y border-border/20 sticky top-0 bg-background/90 backdrop-blur-xl z-20">
                        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6 items-center justify-between">
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                                {/* Filter Pills: Uses flex-wrap on mobile so they don't break off-screen */}
                                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 p-1 bg-secondary/30 rounded-xl border border-white/5 w-full sm:w-fit">
                                    {['LAST 30 DAYS', 'LAST 6 MONTHS', 'ALL'].map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setTimeFilter(filter)}
                                            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-[8px] sm:text-[9px] font-black tracking-widest transition-all whitespace-nowrap flex-1 sm:flex-none ${timeFilter === filter
                                                ? 'bg-accent text-background shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative group w-full sm:w-64 shrink-0">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" size={14} />
                                    <input
                                        type="text"
                                        placeholder="SEARCH NODES..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-secondary/20 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-accent/30 transition-all font-black text-[9px] tracking-widest uppercase placeholder:text-muted-foreground/30"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 w-full lg:w-auto">
                                <div className="text-[9px] sm:text-[10px] font-black tracking-widest text-muted-foreground uppercase shrink-0">
                                    TOTAL: <span className="text-foreground">{filteredReports.length} REPORTS</span>
                                </div>
                                <div className="flex items-center justify-center flex-wrap gap-2 p-1 bg-secondary/30 rounded-xl border border-white/5 w-full sm:w-auto">
                                    {[
                                        { label: 'DATE', key: 'DATE' },
                                        { label: 'VALUE', key: 'VALUE' },
                                        { label: 'XIRR', key: 'XIRR' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.key}
                                            onClick={() => {
                                                if (sortBy === opt.key) {
                                                    setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
                                                } else {
                                                    setSortBy(opt.key as any);
                                                    setSortOrder('DESC');
                                                }
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-[8px] font-black tracking-widest transition-all uppercase flex-1 sm:flex-none ${sortBy === opt.key
                                                ? 'bg-accent/10 border border-accent/30 text-accent'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {opt.label} {sortBy === opt.key ? (sortOrder === 'ASC' ? '▲' : '▼') : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Vault Content */}
                    <section className="px-5 md:px-10 py-8 md:py-10 pb-20 md:pb-32">
                        <div className="max-w-7xl mx-auto">

                            {/* PORTFOLIO REPORTS */}
                            {!loading && reports.length === 0 ? (
                                <div className="py-16 md:py-20 px-4 text-center border border-dashed border-border/30 rounded-[1.5rem] md:rounded-3xl bg-secondary/10">
                                    <Database className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/30 mx-auto mb-4 md:mb-6" />
                                    <h3 className="text-lg md:text-xl font-black font-barlow-condensed tracking-normal uppercase mb-2">THE VAULT IS EMPTY</h3>
                                    <p className="text-[8px] md:text-[9px] text-muted-foreground tracking-widest uppercase mb-6 md:mb-8 leading-relaxed">NO PREVIOUS ANALYSES DETECTED IN THE SECURE NODE</p>
                                    <Link href="/dashboard/portfolio" className="text-accent text-[9px] md:text-[10px] font-black border-b border-accent/30 pb-1">START INITIAL SCAN →</Link>
                                </div>
                            ) : (
                                <div className="glass-panel border border-white/5 rounded-[1.25rem] md:rounded-2xl overflow-hidden shadow-2xl">
                                    <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-white/10">
                                        <table className="w-full text-left border-collapse min-w-[700px]">
                                            <thead>
                                                <tr className="border-b border-border/10 bg-white/[0.02]">
                                                    <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] w-28 md:w-32">DATE</th>
                                                    <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">PORTFOLIO VALUE</th>
                                                    <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">XIRR</th>
                                                    <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">FUNDS</th>
                                                    <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">OVERLAP</th>
                                                    <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/10">
                                                {loading ? (
                                                    [1, 2, 3].map(i => (
                                                        <tr key={i} className="animate-pulse">
                                                            <td colSpan={6} className="px-4 py-6 md:px-8 md:py-8 h-16 md:h-20 bg-white/[0.01]" />
                                                        </tr>
                                                    ))
                                                ) : (
                                                    filteredReports.map((report, i) => (
                                                        <tr key={report.id} className="group hover:bg-accent/[0.02] transition-colors border-l-2 border-l-transparent hover:border-l-accent">
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <span className="text-[10px] md:text-xs font-bold tracking-tight text-foreground uppercase">
                                                                    {new Date(report.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <div className="text-sm md:text-base font-black font-barlow-condensed tracking-tight text-foreground">
                                                                    ₹ {(report.totalValue || 0).toLocaleString('en-IN')}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-center">
                                                                <div className={`mx-auto text-xs md:text-sm font-black font-barlow-condensed ${report.xirr >= 12 ? 'text-emerald-500' : 'text-accent'}`}>
                                                                    {report.xirr.toFixed(1)}%
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-center">
                                                                <span className="text-[9px] md:text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                                                                    {report.holdingsCount} FUNDS
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <div className={`mx-auto px-2 md:px-3 py-1 rounded-lg border text-[8px] md:text-[9px] font-black tracking-widest uppercase w-fit ${report.overlapCount > 2
                                                                    ? 'bg-red-500/5 border-red-500/20 text-red-500/70'
                                                                    : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500/70'
                                                                    }`}>
                                                                    {Math.round((report.overlapCount / (report.holdingsCount || 1)) * 100)}% {report.overlapCount > 2 ? 'HIGH' : 'LOW'}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-right">
                                                                <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => handlePDF(report.id, 'PORTFOLIO')}
                                                                        className="p-2 md:p-2.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all active:scale-90"
                                                                        title="Generate Intelligence PDF"
                                                                    >
                                                                        <Printer size={14} className="md:w-4 md:h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDownload(report.id, report.date)}
                                                                        className="p-2 md:p-2.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all active:scale-90"
                                                                        title="Download Report"
                                                                    >
                                                                        <Download size={14} className="md:w-4 md:h-4" />
                                                                    </button>
                                                                    <button className="p-2 md:p-2.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all active:scale-90" title="Re-simulate">
                                                                        <RefreshCw size={14} className="md:w-4 md:h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openDeleteModal(report.id, 'PORTFOLIO')}
                                                                        className="p-2 md:p-2.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all active:scale-90"
                                                                        title="Delete Node"
                                                                    >
                                                                        <Trash2 size={14} className="md:w-4 md:h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* HEALTH DIAGNOSTIC ARCHIVE */}
                            <div className="mt-20 md:mt-32">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 md:mb-8">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                                        <FileText size={18} className="md:w-5 md:h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-black font-barlow-condensed tracking-normal uppercase">Vitality Diagnostic Archive</h2>
                                        <p className="text-[8px] md:text-[9px] text-muted-foreground font-black tracking-widest uppercase opacity-60 mt-0.5 md:mt-1">HISTORICAL MONEY HEALTH SCORES & ACTION ROADMAPS</p>
                                    </div>
                                </div>

                                {!loading && healthReports.length === 0 ? (
                                    <div className="py-12 md:py-16 px-4 text-center border border-dashed border-border/20 rounded-[1.25rem] md:rounded-3xl bg-secondary/5">
                                        <p className="text-[8px] md:text-[9px] text-muted-foreground tracking-widest uppercase">NO HEALTH DIAGNOSTICS LOGGED</p>
                                    </div>
                                ) : (
                                    <div className="glass-panel border border-white/5 rounded-[1.25rem] md:rounded-2xl overflow-hidden shadow-2xl">
                                        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-white/10">
                                            <table className="w-full text-left border-collapse min-w-[650px]">
                                                <thead>
                                                    <tr className="border-b border-border/10 bg-white/[0.02]">
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] w-28 md:w-32">ANALYSIS DATE</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] w-32">SCORE</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">DIMENSIONS</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">ACTIONS</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/10">
                                                    {healthReports.map((h, i) => (
                                                        <tr key={h._id} className="group hover:bg-white/[0.01] transition-colors border-l-2 border-l-transparent hover:border-l-accent">
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <span className="text-[10px] md:text-sm font-bold tracking-tight text-foreground uppercase">
                                                                    {new Date(h.generatedAt || h.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-2 md:gap-3">
                                                                    <div className={`text-xl md:text-2xl font-black font-barlow-condensed ${h.totalScore >= 80 ? 'text-emerald-400' : h.totalScore >= 60 ? 'text-accent' : 'text-red-400'}`}>
                                                                        {h.totalScore}
                                                                    </div>
                                                                    <div className="w-16 md:w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full transition-all duration-1000 ${h.totalScore >= 80 ? 'bg-emerald-400' : h.totalScore >= 60 ? 'bg-accent' : 'bg-red-400'}`}
                                                                            style={{ width: `${h.totalScore}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4">
                                                                <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                                                                    {h.scores?.slice(0, 3).map((s: any, j: number) => (
                                                                        <span key={j} className="px-2 py-1 md:px-3 md:py-1 bg-white/5 border border-white/10 rounded-lg text-[7px] md:text-[8px] font-black tracking-widest text-muted-foreground uppercase whitespace-nowrap">
                                                                            {s.label}: <span className="text-foreground">{s.score}</span>
                                                                        </span>
                                                                    ))}
                                                                    {h.scores?.length > 3 && <span className="text-[7px] md:text-[8px] font-black text-accent opacity-40 whitespace-nowrap">+{h.scores.length - 3} DIMENSIONS</span>}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 text-right whitespace-nowrap">
                                                                <div className="flex justify-end items-center gap-1 md:gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                                                                    <button
                                                                        onClick={() => handlePDF(h._id, 'HEALTH')}
                                                                        className="p-2 md:p-2.5 rounded-xl text-muted-foreground/30 hover:text-accent hover:bg-accent/10 transition-all active:scale-95"
                                                                        title="Generate Diagnostic PDF"
                                                                    >
                                                                        <Printer size={14} className="md:w-4 md:h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDownload(h._id, h.generatedAt || h.createdAt, 'HEALTH')}
                                                                        className="p-2 md:p-2.5 rounded-xl text-muted-foreground/30 hover:text-accent hover:bg-accent/10 transition-all active:scale-95"
                                                                        title="Download Intelligence Artifact"
                                                                    >
                                                                        <Download size={14} className="md:w-4 md:h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openDeleteModal(h._id, 'HEALTH')}
                                                                        className="p-2 md:p-2.5 rounded-xl text-muted-foreground/30 hover:text-red-400 hover:bg-red-400/10 transition-all active:scale-95"
                                                                    >
                                                                        <Trash2 size={14} className="md:w-4 md:h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* FISCAL ASSESSMENT ARCHIVE */}
                            <div className="mt-20 md:mt-32">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 md:mb-8">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                                        <RefreshCw size={18} className="md:w-5 md:h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-black font-barlow-condensed tracking-normal uppercase">Fiscal Assessment Archive</h2>
                                        <p className="text-[8px] md:text-[9px] text-muted-foreground font-black tracking-widest uppercase opacity-60 mt-0.5 md:mt-1">HISTORICAL TAX VERDICTS & REGIME OPTIMIZATION</p>
                                    </div>
                                </div>

                                {!loading && taxReports.length === 0 ? (
                                    <div className="py-12 md:py-16 px-4 text-center border border-dashed border-border/20 rounded-[1.25rem] md:rounded-3xl bg-secondary/5">
                                        <p className="text-[8px] md:text-[9px] text-muted-foreground tracking-widest uppercase">NO TAX ASSESSMENTS LOGGED</p>
                                    </div>
                                ) : (
                                    <div className="glass-panel border border-white/5 rounded-[1.25rem] md:rounded-2xl overflow-hidden shadow-2xl">
                                        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-white/10">
                                            <table className="w-full text-left border-collapse min-w-[650px]">
                                                <thead>
                                                    <tr className="border-b border-border/10 bg-white/[0.02]">
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] w-28 md:w-32">ASSESSMENT DATE</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">VERDICT</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">ANNUAL SAVINGS</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">FISCAL YEAR</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">ACTIONS</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/10">
                                                    {taxReports.map((t, i) => (
                                                        <tr key={t._id} className="group hover:bg-white/[0.01] transition-colors border-l-2 border-l-transparent hover:border-l-accent">
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <span className="text-[10px] md:text-xs font-black tracking-tight text-foreground uppercase">
                                                                    {new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <div className={`px-3 py-1 md:px-4 md:py-1.5 rounded-lg border text-[8px] md:text-[10px] font-black tracking-widest uppercase w-fit ${t.result?.verdict === 'new'
                                                                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                                                                    : 'bg-accent/5 border-accent/20 text-accent'
                                                                    }`}>
                                                                    {t.result?.verdict} REGIME
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <div className="text-sm md:text-base font-black font-barlow-condensed tracking-tight text-foreground">
                                                                    ₹ {Math.abs(t.result?.deltaTax || 0).toLocaleString('en-IN')} Saved
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <span className="text-[9px] md:text-[10px] font-black text-muted-foreground tracking-widest uppercase">
                                                                    FY {t.fy || '2024-25'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 text-right whitespace-nowrap">
                                                                <div className="flex justify-end items-center gap-1 md:gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                                                                    <button
                                                                        onClick={() => handlePDF(t._id, 'TAX')}
                                                                        className="p-2 md:p-2.5 rounded-xl text-muted-foreground/30 hover:text-accent hover:bg-accent/10 transition-all active:scale-95"
                                                                        title="Generate Fiscal PDF"
                                                                    >
                                                                        <Printer size={14} className="md:w-4 md:h-4" />
                                                                    </button>
                                                                    <Link
                                                                        href="/dashboard/tax-wizard"
                                                                        className="p-2 md:p-2.5 rounded-xl text-muted-foreground/30 hover:text-accent hover:bg-accent/10 transition-all active:scale-95"
                                                                    >
                                                                        <RefreshCw size={14} className="md:w-4 md:h-4" />
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => openDeleteModal(t._id, 'TAX' as any)}
                                                                        className="p-2 md:p-2.5 rounded-xl text-muted-foreground/30 hover:text-red-400 hover:bg-red-400/10 transition-all active:scale-95"
                                                                    >
                                                                        <Trash2 size={14} className="md:w-4 md:h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* FIRE PROTOCOL ARCHIVE */}
                            <div className="mt-20 md:mt-32">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 md:mb-8">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                                        <Flame size={18} className="md:w-5 md:h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-black font-barlow-condensed tracking-normal uppercase">FIRE Protocol Archive</h2>
                                        <p className="text-[8px] md:text-[9px] text-muted-foreground font-black tracking-widest uppercase opacity-60 mt-0.5 md:mt-1">HISTORICAL WEALTH TRAJECTORIES & RETIREMENT PLANS</p>
                                    </div>
                                </div>

                                {!loading && fireReports.length === 0 ? (
                                    <div className="py-12 md:py-16 px-4 text-center border border-dashed border-border/20 rounded-[1.25rem] md:rounded-3xl bg-secondary/5">
                                        <p className="text-[8px] md:text-[9px] text-muted-foreground tracking-widest uppercase">NO FIRE PLANS ARCHIVED</p>
                                    </div>
                                ) : (
                                    <div className="glass-panel border border-white/5 rounded-[1.25rem] md:rounded-2xl overflow-hidden shadow-2xl">
                                        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-white/10">
                                            <table className="w-full text-left border-collapse min-w-[600px]">
                                                <thead>
                                                    <tr className="border-b border-border/10 bg-white/[0.02]">
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] w-28 md:w-32">ARCHIVE DATE</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">TARGET CORPUS</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">MONTHLY SIP</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">EXIT AGE</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">ACTIONS</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/10">
                                                    {fireReports.map((f, i) => (
                                                        <tr key={f._id} className="group hover:bg-white/[0.01] transition-colors border-l-2 border-l-transparent hover:border-l-accent">
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <span className="text-[10px] md:text-xs font-black tracking-tight text-foreground uppercase">
                                                                    {new Date(f.generatedAt || f.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <div className="text-sm md:text-base font-black font-barlow-condensed tracking-normal text-foreground uppercase">
                                                                    ₹ {(f.results?.targetCorpus / 10000000).toFixed(2)} CR
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <div className="text-sm md:text-base font-black font-barlow-condensed tracking-normal text-emerald-400">
                                                                    ₹ {(f.results?.sipRequired || 0).toLocaleString('en-IN')}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <span className="text-[9px] md:text-[10px] font-black text-accent tracking-[0.2em] uppercase">
                                                                    AGE {f.inputs?.retireAge}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 text-right whitespace-nowrap">
                                                                <div className="flex justify-end items-center gap-1 md:gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                                                                    <button
                                                                        onClick={() => handlePDF(f._id, 'FIRE')}
                                                                        className="p-2 md:p-2.5 rounded-xl text-muted-foreground/30 hover:text-accent hover:bg-accent/10 transition-all active:scale-95"
                                                                        title="Generate Freedom PDF"
                                                                    >
                                                                        <Printer size={14} className="md:w-4 md:h-4" />
                                                                    </button>
                                                                    <Link
                                                                        href="/dashboard/fire"
                                                                        className="p-2 md:p-2.5 rounded-xl text-muted-foreground/30 hover:text-accent hover:bg-accent/10 transition-all active:scale-95"
                                                                    >
                                                                        <RefreshCw size={14} className="md:w-4 md:h-4" />
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => openDeleteModal(f._id, 'FIRE')}
                                                                        className="p-2 md:p-2.5 rounded-xl text-muted-foreground/30 hover:text-red-400 hover:bg-red-400/10 transition-all active:scale-95"
                                                                    >
                                                                        <Trash2 size={14} className="md:w-4 md:h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* LIFE STRATEGIC ROADMAP ARCHIVE */}
                            <div className="mt-20 md:mt-32">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 md:mb-8">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                                        <Plus size={18} className="md:w-5 md:h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-black font-barlow-condensed tracking-normal uppercase">Strategic Roadmap Archive</h2>
                                        <p className="text-[8px] md:text-[9px] text-muted-foreground font-black tracking-widest uppercase opacity-60 mt-0.5 md:mt-1">HISTORICAL LIFE EVENT PLANNING & GOAL SYNERGY</p>
                                    </div>
                                </div>

                                {!loading && lifePlannerReports.length === 0 ? (
                                    <div className="py-12 md:py-16 px-4 text-center border border-dashed border-border/20 rounded-[1.25rem] md:rounded-3xl bg-secondary/5">
                                        <p className="text-[8px] md:text-[9px] text-muted-foreground tracking-widest uppercase">NO STRATEGIC PLANS ARCHIVED</p>
                                    </div>
                                ) : (
                                    <div className="glass-panel border border-white/5 rounded-[1.25rem] md:rounded-2xl overflow-hidden shadow-2xl">
                                        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-white/10">
                                            <table className="w-full text-left border-collapse min-w-[600px]">
                                                <thead>
                                                    <tr className="border-b border-border/10 bg-white/[0.02]">
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] w-28 md:w-32">ARCHIVE DATE</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">EVENT TYPE</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">CAPITAL NODE</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">GOAL SYNC</th>
                                                        <th className="px-4 py-3 md:px-6 md:py-4 text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">ACTIONS</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/10">
                                                    {lifePlannerReports.map((lp, i) => (
                                                        <tr key={lp._id} className="group hover:bg-white/[0.01] transition-colors border-l-2 border-l-transparent hover:border-l-accent">
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <span className="text-[10px] md:text-xs font-black tracking-tight text-foreground uppercase">
                                                                    {new Date(String(lp.createdAt)).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <div className="text-[10px] md:text-xs font-black font-barlow text-accent uppercase tracking-widest">
                                                                    {String(lp.eventType || 'GENERAL')}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <div className="text-sm md:text-base font-black font-barlow-condensed tracking-normal text-foreground uppercase">
                                                                    ₹ {(Number(lp.inputData?.amount || 0)).toLocaleString('en-IN')}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                                                                <span className="text-[9px] md:text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase">
                                                                    {lp.goals?.length || 0} GOALS ACTIVE
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 md:px-6 md:py-4 text-right whitespace-nowrap">
                                                                <div className="flex justify-end items-center gap-1 md:gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                                                                    <button
                                                                        onClick={() => handlePDF(lp._id, 'LIFE_PLANNER')}
                                                                        className="p-2 md:p-2.5 rounded-xl text-muted-foreground/30 hover:text-accent hover:bg-accent/10 transition-all active:scale-95"
                                                                        title="Generate Strategic PDF"
                                                                    >
                                                                        <Printer size={14} className="md:w-4 md:h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDownload(lp._id, lp.createdAt, 'LIFE_PLANNER')}
                                                                        className="p-2 md:p-2.5 rounded-xl text-muted-foreground/30 hover:text-accent hover:bg-accent/10 transition-all active:scale-95"
                                                                        title="Download Strategic Artifact"
                                                                    >
                                                                        <Download size={14} className="md:w-4 md:h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openDeleteModal(lp._id, 'LIFE_PLANNER' as any)}
                                                                        className="p-2 md:p-2.5 rounded-xl text-muted-foreground/30 hover:text-red-400 hover:bg-red-400/10 transition-all active:scale-95"
                                                                    >
                                                                        <Trash2 size={14} className="md:w-4 md:h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="px-5 md:px-10 py-8 md:py-12 border-t border-border/10 text-center relative overflow-hidden mt-auto">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                        <div className="flex flex-col items-center gap-1.5 md:gap-2">
                            <p className="text-[8px] md:text-[10px] font-black tracking-[0.5em] md:tracking-[0.7em] text-muted-foreground/30 uppercase leading-relaxed">
                                NIVESHIQ INTELLIGENCE LAYER <span className="hidden sm:inline">//</span> VAULT SYSTEM V3.0
                            </p>
                            <p className="text-[7px] md:text-[8px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em]">SECURE DISTRIBUTED LEDGER DEPLOYED</p>
                        </div>
                    </footer>
                </main>
            </div>

            {/* Cinematic Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Erase Intelligence Node?"
                message="Are you sure you want to permanently delete this snapshot? All historical data associated with this node will be purged from the archive."
            />
        </div>
    );
}