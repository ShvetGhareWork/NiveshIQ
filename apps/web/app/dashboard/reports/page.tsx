'use client';

import { useState, useEffect } from 'react';
import { TopNav } from '@/components/navigation/TopNav';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { Download, RefreshCw, Trash2, Search, FileText, Database, Plus, Flame, Printer } from 'lucide-react';
import Link from 'next/link';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/lib/api';

// ─── types ────────────────────────────────────────────────────────────────────

interface Report {
    id: string;
    date: string;
    totalValue: number;
    holdingsCount: number;
    riskScore: number;
    xirr: number;
    overlapCount: number;
}

// ─── reusable archive row actions (always visible on mobile) ──────────────────

function RowActions({ onPrint, onDownload, onDelete, rerunHref }: {
    onPrint?: () => void;
    onDownload?: () => void;
    onDelete: () => void;
    rerunHref?: string;
}) {
    return (
        <div className="flex items-center justify-end gap-1.5 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
            {onPrint && (
                <button onClick={onPrint} className="p-2.5 rounded-xl text-muted-foreground/50 hover:text-accent hover:bg-accent/10 transition-all active:scale-95 bg-white/5 lg:bg-transparent" title="Generate PDF">
                    <Printer size={14} />
                </button>
            )}
            {onDownload && (
                <button onClick={onDownload} className="p-2.5 rounded-xl text-muted-foreground/50 hover:text-accent hover:bg-accent/10 transition-all active:scale-95 bg-white/5 lg:bg-transparent" title="Download JSON">
                    <Download size={14} />
                </button>
            )}
            {rerunHref && (
                <Link href={rerunHref} className="p-2.5 rounded-xl text-muted-foreground/50 hover:text-accent hover:bg-accent/10 transition-all active:scale-95 bg-white/5 lg:bg-transparent">
                    <RefreshCw size={14} />
                </Link>
            )}
            <button onClick={onDelete} className="p-2.5 rounded-xl text-muted-foreground/50 hover:text-red-400 hover:bg-red-400/10 transition-all active:scale-95 bg-white/5 lg:bg-transparent">
                <Trash2 size={14} />
            </button>
        </div>
    );
}

// ─── reusable archive section wrapper ────────────────────────────────────────

function ArchiveSection({ icon, title, subtitle, children }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mt-12 sm:mt-16 md:mt-24">
            <div className="flex items-center gap-3 mb-5 md:mb-8">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                    {icon}
                </div>
                <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-black font-barlow-condensed uppercase">{title}</h2>
                    <p className="text-[8px] md:text-[9px] text-muted-foreground font-black tracking-widest uppercase opacity-60 mt-0.5">{subtitle}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
    return (
        <div className="py-10 md:py-14 px-4 text-center border border-dashed border-border/20 rounded-2xl bg-secondary/5">
            <p className="text-[8px] md:text-[9px] text-muted-foreground tracking-widest uppercase">{message}</p>
        </div>
    );
}

// ─── main component ───────────────────────────────────────────────────────────

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

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState<{ id: string; type: string } | null>(null);

    useEffect(() => { setIsMounted(true); }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (authLoading) return;
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('oracle_token') : null;
                if (!token) { setLoading(false); return; }

                const [portfolioRes, healthRes, taxRes, fireRes, lifePlannerRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/portfolio/all`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/health/all`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/tax/history`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/fire/all`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/life-planner/all`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                const [portfolioData, healthData, taxData, fireData, lifePlannerData] = await Promise.all([
                    portfolioRes.json(), healthRes.json(), taxRes.json(), fireRes.json(), lifePlannerRes.json(),
                ]);

                if (portfolioData.success) setReports(portfolioData.data);
                if (healthData.success) setHealthReports(healthData.data);
                if (Array.isArray(taxData)) setTaxReports(taxData);
                if (fireData.success) setFireReports(fireData.data);
                if (lifePlannerData.success) setLifePlannerReports(lifePlannerData.data);
            } catch (err) {
                console.error('Failed to fetch reports:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [authLoading, user]);

    // ── helpers ───────────────────────────────────────────────────────────────

    const filteredReports = reports.filter(r => {
        const reportDate = new Date(r.date);
        const now = new Date();
        if (timeFilter === 'LAST 30 DAYS' && (now.getTime() - reportDate.getTime()) / 86400000 > 30) return false;
        if (timeFilter === 'LAST 6 MONTHS' && (now.getTime() - reportDate.getTime()) / (86400000 * 30.44) > 6) return false;
        return reportDate.toLocaleDateString('en-IN').includes(searchQuery) || r.totalValue.toString().includes(searchQuery);
    }).sort((a, b) => {
        const va = sortBy === 'DATE' ? new Date(a.date).getTime() : sortBy === 'VALUE' ? a.totalValue : a.xirr;
        const vb = sortBy === 'DATE' ? new Date(b.date).getTime() : sortBy === 'VALUE' ? b.totalValue : b.xirr;
        return sortOrder === 'DESC' ? vb - va : va - vb;
    });

    const handlePDF = (id: string, type: string) => {
        const params = new URLSearchParams();
        const keyMap: Record<string, string> = { PORTFOLIO: 'portfolioId', HEALTH: 'healthId', TAX: 'taxId', FIRE: 'fireId', LIFE_PLANNER: 'lifeId' };
        params.set(keyMap[type] || 'id', id);
        params.set('autoPrint', 'true');
        window.open(`/dashboard/analytics/dossier?${params.toString()}`, '_blank');
    };

    const handleDownload = async (id: string, date: string, type = 'PORTFOLIO') => {
        try {
            const token = localStorage.getItem('oracle_token');
            const endpointMap: Record<string, string> = {
                PORTFOLIO: `${API_BASE_URL}/api/portfolio/${id}`,
                HEALTH: `${API_BASE_URL}/api/health/${id}`,
                FIRE: `${API_BASE_URL}/api/fire/${id}`,
                LIFE_PLANNER: `${API_BASE_URL}/api/life-planner/${id}`,
                TAX: `${API_BASE_URL}/api/tax/${id}`,
            };
            const res = await fetch(endpointMap[type], { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.success || type === 'TAX') {
                const payload = data.data || data;
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = Object.assign(document.createElement('a'), {
                    href: url,
                    download: `NiveshIQ-${type.replace('_', '-')}-${new Date(date).toISOString().split('T')[0]}.json`,
                });
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (err) { console.error('Download failed:', err); }
    };

    const handleDelete = async () => {
        if (!reportToDelete) return;
        const { id, type } = reportToDelete;
        try {
            const token = localStorage.getItem('oracle_token');
            const endpointMap: Record<string, string> = {
                PORTFOLIO: `${API_BASE_URL}/api/portfolio/${id}`,
                HEALTH: `${API_BASE_URL}/api/health/${id}`,
                FIRE: `${API_BASE_URL}/api/fire/${id}`,
                LIFE_PLANNER: `${API_BASE_URL}/api/life-planner/${id}`,
                TAX: `${API_BASE_URL}/api/tax/${id}`,
            };
            const res = await fetch(endpointMap[type], { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.success) {
                const setterMap: Record<string, any> = {
                    PORTFOLIO: (prev: any[]) => prev.filter(r => r.id !== id && r._id !== id),
                    HEALTH: (prev: any[]) => prev.filter(r => r._id !== id),
                    FIRE: (prev: any[]) => prev.filter(r => r._id !== id),
                    LIFE_PLANNER: (prev: any[]) => prev.filter(r => r._id !== id),
                    TAX: (prev: any[]) => prev.filter(r => r._id !== id),
                };
                const stateSetters: Record<string, React.Dispatch<React.SetStateAction<any[]>>> = {
                    PORTFOLIO: setReports, HEALTH: setHealthReports, FIRE: setFireReports,
                    LIFE_PLANNER: setLifePlannerReports, TAX: setTaxReports,
                };
                stateSetters[type]?.(setterMap[type]);
            }
        } catch (err) { console.error('Delete failed:', err); }
        finally { setIsDeleteModalOpen(false); setReportToDelete(null); }
    };

    const openDeleteModal = (id: string, type: string) => {
        setReportToDelete({ id, type });
        setIsDeleteModalOpen(true);
    };

    const fmtDate = (d: string) =>
        new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

    if (!isMounted) return <div className="min-h-screen bg-[#0A0F1E]" />;

    // ─── render ───────────────────────────────────────────────────────────────

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <DashboardSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopNav
                    userName={user?.name || 'Operator'}
                    customLinks={[{ label: 'REPORTS VAULT', href: '/dashboard/reports', icon: <Database size={12} /> }]}
                />

                <main className="flex-1 bg-background relative overflow-x-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    {/* ── Header ─────────────────────────────────────────── */}
                    <header className="px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16 lg:py-20 relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(212,175,55,0.03)_0%,transparent_50%)] pointer-events-none" />
                        <div className="max-w-7xl mx-auto relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                            <div>
                                <h1
                                    className="font-black font-barlow-condensed leading-[0.85] uppercase"
                                    style={{ fontSize: 'clamp(2.5rem, 9vw, 5.5rem)' }}
                                >
                                    YOUR ANALYSES<br />
                                    <span className="text-accent italic">HISTORY</span>
                                </h1>
                                <p className="text-muted-foreground font-black tracking-[0.3em] text-[9px] sm:text-[10px] mt-4 max-w-xl opacity-60 uppercase leading-relaxed">
                                    ACCESS YOUR ARCHIVED INTELLIGENCE. REVIEW PAST PORTFOLIO HEALTH CHECKS AND PERFORMANCE SNAPSHOTS.
                                </p>
                            </div>
                            <Link
                                href="/dashboard/portfolio"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-background rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)] group active:scale-95 whitespace-nowrap self-start sm:self-auto shrink-0"
                            >
                                <Plus size={14} className="group-hover:rotate-90 transition-transform duration-500" />
                                NEW ANALYSIS
                            </Link>
                        </div>
                    </header>

                    {/* ── Sticky controls ────────────────────────────────── */}
                    {/* Two rows on mobile, one row on lg */}
                    <section className="px-4 sm:px-6 md:px-10 py-3 md:py-4 border-y border-border/20 sticky top-0 bg-background/90 backdrop-blur-xl z-20">
                        <div className="max-w-7xl mx-auto space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-6">

                            {/* Row 1: time filters + search */}
                            <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                                {/* Time filter pills — horizontal scroll on very small screens */}
                                <div className="flex items-center gap-1 p-1 bg-secondary/30 rounded-xl border border-white/5 shrink-0">
                                    {['LAST 30 DAYS', 'LAST 6 MONTHS', 'ALL'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setTimeFilter(f)}
                                            className={`px-3 py-2 rounded-lg text-[8px] sm:text-[9px] font-black tracking-widest transition-all whitespace-nowrap ${timeFilter === f ? 'bg-accent text-background shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>

                                {/* Search */}
                                <div className="relative group min-w-0 flex-1 lg:w-56 lg:flex-none">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors shrink-0" size={13} />
                                    <input
                                        type="text"
                                        placeholder="SEARCH..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full bg-secondary/20 border border-white/5 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-accent/30 transition-all font-black text-[9px] tracking-widest uppercase placeholder:text-muted-foreground/30"
                                    />
                                </div>
                            </div>

                            {/* Row 2: count + sort */}
                            <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
                                <span className="text-[9px] font-black tracking-widest text-muted-foreground uppercase shrink-0">
                                    <span className="text-foreground">{filteredReports.length}</span> REPORTS
                                </span>
                                <div className="flex items-center gap-1 p-1 bg-secondary/30 rounded-xl border border-white/5">
                                    {(['DATE', 'VALUE', 'XIRR'] as const).map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                if (sortBy === opt) setSortOrder(p => p === 'ASC' ? 'DESC' : 'ASC');
                                                else { setSortBy(opt); setSortOrder('DESC'); }
                                            }}
                                            className={`px-3 py-2 rounded-lg text-[9px] font-black tracking-widest transition-all ${sortBy === opt ? 'bg-accent/15 border border-accent/40 text-accent' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            {opt} {sortBy === opt ? (sortOrder === 'ASC' ? '▲' : '▼') : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Vault Content ───────────────────────────────────── */}
                    <section className="px-4 sm:px-6 md:px-10 py-8 md:py-12 pb-20 md:pb-32">
                        <div className="max-w-7xl mx-auto">

                            {/* ── Portfolio reports ──────────────────────── */}
                            {!loading && reports.length === 0 ? (
                                <div className="py-12 md:py-20 px-4 text-center border border-dashed border-border/30 rounded-2xl md:rounded-3xl bg-secondary/10">
                                    <Database className="w-10 h-10 text-muted-foreground/30 mx-auto mb-5" />
                                    <h3 className="text-lg md:text-xl font-black font-barlow-condensed uppercase mb-2">THE VAULT IS EMPTY</h3>
                                    <p className="text-[8px] md:text-[9px] text-muted-foreground tracking-widest uppercase mb-6 leading-relaxed">NO PREVIOUS ANALYSES DETECTED</p>
                                    <Link href="/dashboard/portfolio" className="text-accent text-[9px] md:text-[10px] font-black border-b border-accent/30 pb-1">START INITIAL SCAN →</Link>
                                </div>
                            ) : (
                                <>
                                    {/* Mobile cards */}
                                    <div className="grid grid-cols-1 gap-4 md:hidden">
                                        {loading ? [1, 2, 3].map(i => (
                                            <div key={i} className="glass-panel border border-white/5 rounded-2xl h-40 animate-pulse bg-white/5" />
                                        )) : filteredReports.map(report => (
                                            <div key={report.id} className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-1">{fmtDate(report.date)}</p>
                                                        <div className="text-xl font-black font-barlow-condensed">₹{report.totalValue.toLocaleString('en-IN')}</div>
                                                    </div>
                                                    <div className={`text-lg font-black font-barlow-condensed ${report.xirr >= 12 ? 'text-emerald-500' : 'text-accent'}`}>
                                                        {report.xirr.toFixed(1)}%
                                                        <span className="text-[8px] opacity-50 ml-0.5">XIRR</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 py-3 border-y border-white/5">
                                                    <div className="flex-1">
                                                        <p className="text-[8px] font-black text-muted-foreground tracking-widest uppercase mb-0.5">FUNDS</p>
                                                        <p className="text-xs font-bold">{report.holdingsCount}</p>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[8px] font-black text-muted-foreground tracking-widest uppercase mb-0.5">OVERLAP</p>
                                                        <p className={`text-[9px] font-black uppercase ${report.overlapCount > 2 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                            {Math.round((report.overlapCount / (report.holdingsCount || 1)) * 100)}% {report.overlapCount > 2 ? 'HIGH' : 'LOW'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handlePDF(report.id, 'PORTFOLIO')} className="flex-1 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center gap-1.5 text-[9px] font-black uppercase hover:bg-accent/10 hover:text-accent transition-all"><Printer size={13} />PDF</button>
                                                    <button onClick={() => handleDownload(report.id, report.date)} className="flex-1 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center gap-1.5 text-[9px] font-black uppercase hover:bg-accent/10 hover:text-accent transition-all"><Download size={13} />JSON</button>
                                                    <button onClick={() => openDeleteModal(report.id, 'PORTFOLIO')} className="px-3 h-10 bg-red-500/5 rounded-xl border border-red-500/10 flex items-center justify-center text-red-400/50 hover:text-red-400 transition-all"><Trash2 size={13} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop table */}
                                    <div className="hidden md:block glass-panel border border-white/5 rounded-2xl overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse" style={{ minWidth: '700px' }}>
                                                <thead>
                                                    <tr className="border-b border-border/10 bg-white/[0.02]">
                                                        {['DATE', 'PORTFOLIO VALUE', 'XIRR', 'FUNDS', 'OVERLAP', 'ACTIONS'].map((h, i) => (
                                                            <th key={h} className={`px-6 py-4 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] ${i === 5 ? 'text-right' : i >= 2 ? 'text-center' : ''}`}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/10">
                                                    {loading ? [1, 2, 3].map(i => (
                                                        <tr key={i} className="animate-pulse"><td colSpan={6} className="px-6 py-8 bg-white/[0.01]" /></tr>
                                                    )) : filteredReports.map(report => (
                                                        <tr key={report.id} className="group hover:bg-accent/[0.02] transition-colors border-l-2 border-l-transparent hover:border-l-accent">
                                                            <td className="px-6 py-4 whitespace-nowrap text-xs font-bold uppercase">{fmtDate(report.date)}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-base font-black font-barlow-condensed">₹{report.totalValue.toLocaleString('en-IN')}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                <span className={`text-sm font-black font-barlow-condensed ${report.xirr >= 12 ? 'text-emerald-500' : 'text-accent'}`}>{report.xirr.toFixed(1)}%</span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-[10px] font-black text-muted-foreground uppercase">{report.holdingsCount} FUNDS</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`mx-auto block w-fit px-3 py-1 rounded-lg border text-[9px] font-black tracking-widest uppercase ${report.overlapCount > 2 ? 'bg-red-500/5 border-red-500/20 text-red-500/70' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500/70'}`}>
                                                                    {Math.round((report.overlapCount / (report.holdingsCount || 1)) * 100)}% {report.overlapCount > 2 ? 'HIGH' : 'LOW'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <RowActions
                                                                    onPrint={() => handlePDF(report.id, 'PORTFOLIO')}
                                                                    onDownload={() => handleDownload(report.id, report.date)}
                                                                    onDelete={() => openDeleteModal(report.id, 'PORTFOLIO')}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── Health Archive ─────────────────────────── */}
                            <ArchiveSection icon={<FileText size={16} />} title="Vitality Diagnostic Archive" subtitle="HISTORICAL MONEY HEALTH SCORES & ACTION ROADMAPS">
                                {!loading && healthReports.length === 0 ? <EmptyState message="NO HEALTH DIAGNOSTICS LOGGED" /> : (
                                    <>
                                        {/* Mobile cards */}
                                        <div className="grid grid-cols-1 gap-4 md:hidden">
                                            {healthReports.map(h => (
                                                <div key={h._id} className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-[9px] font-black tracking-widest text-muted-foreground uppercase">{fmtDate(h.generatedAt || h.createdAt)}</p>
                                                        <div className={`text-2xl font-black font-barlow-condensed ${h.totalScore >= 80 ? 'text-emerald-400' : h.totalScore >= 60 ? 'text-accent' : 'text-red-400'}`}>{h.totalScore}</div>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <div className={`h-full ${h.totalScore >= 80 ? 'bg-emerald-400' : h.totalScore >= 60 ? 'bg-accent' : 'bg-red-400'}`} style={{ width: `${h.totalScore}%` }} />
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {h.scores?.slice(0, 3).map((s: any, j: number) => (
                                                            <span key={j} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[7px] font-black tracking-widest text-muted-foreground uppercase">
                                                                {s.label}: <span className="text-foreground">{s.score}</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <RowActions
                                                        onPrint={() => handlePDF(h._id, 'HEALTH')}
                                                        onDownload={() => handleDownload(h._id, h.generatedAt || h.createdAt, 'HEALTH')}
                                                        onDelete={() => openDeleteModal(h._id, 'HEALTH')}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {/* Desktop table */}
                                        <div className="hidden md:block glass-panel border border-white/5 rounded-2xl overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse" style={{ minWidth: '640px' }}>
                                                    <thead>
                                                        <tr className="border-b border-border/10 bg-white/[0.02]">
                                                            {['ANALYSIS DATE', 'SCORE', 'DIMENSIONS', 'ACTIONS'].map((h, i) => (
                                                                <th key={h} className={`px-6 py-4 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border/10">
                                                        {healthReports.map(h => (
                                                            <tr key={h._id} className="group hover:bg-white/[0.01] transition-colors border-l-2 border-l-transparent hover:border-l-accent">
                                                                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold uppercase">{fmtDate(h.generatedAt || h.createdAt)}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={`text-2xl font-black font-barlow-condensed ${h.totalScore >= 80 ? 'text-emerald-400' : h.totalScore >= 60 ? 'text-accent' : 'text-red-400'}`}>{h.totalScore}</span>
                                                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                                            <div className={`h-full ${h.totalScore >= 80 ? 'bg-emerald-400' : h.totalScore >= 60 ? 'bg-accent' : 'bg-red-400'}`} style={{ width: `${h.totalScore}%` }} />
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {h.scores?.slice(0, 3).map((s: any, j: number) => (
                                                                            <span key={j} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black tracking-widest text-muted-foreground uppercase">
                                                                                {s.label}: <span className="text-foreground">{s.score}</span>
                                                                            </span>
                                                                        ))}
                                                                        {h.scores?.length > 3 && <span className="text-[8px] font-black text-accent opacity-40">+{h.scores.length - 3}</span>}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <RowActions
                                                                        onPrint={() => handlePDF(h._id, 'HEALTH')}
                                                                        onDownload={() => handleDownload(h._id, h.generatedAt || h.createdAt, 'HEALTH')}
                                                                        onDelete={() => openDeleteModal(h._id, 'HEALTH')}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </ArchiveSection>

                            {/* ── Tax Archive ────────────────────────────── */}
                            <ArchiveSection icon={<RefreshCw size={16} />} title="Fiscal Assessment Archive" subtitle="HISTORICAL TAX VERDICTS & REGIME OPTIMIZATION">
                                {!loading && taxReports.length === 0 ? <EmptyState message="NO TAX ASSESSMENTS LOGGED" /> : (
                                    <>
                                        {/* Mobile cards */}
                                        <div className="grid grid-cols-1 gap-4 md:hidden">
                                            {taxReports.map(t => (
                                                <div key={t._id} className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-[9px] font-black tracking-widest text-muted-foreground uppercase">{fmtDate(t.createdAt)}</p>
                                                        <span className={`px-3 py-1 rounded-lg border text-[8px] font-black tracking-widest uppercase ${t.result?.verdict === 'new' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-accent/5 border-accent/20 text-accent'}`}>
                                                            {t.result?.verdict} REGIME
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-muted-foreground tracking-widest uppercase mb-0.5">ANNUAL SAVINGS</p>
                                                        <p className="text-lg font-black font-barlow-condensed">₹{Math.abs(t.result?.deltaTax || 0).toLocaleString('en-IN')}</p>
                                                    </div>
                                                    <p className="text-[9px] font-black text-muted-foreground tracking-widest uppercase">FY {t.fy || '2024-25'}</p>
                                                    <RowActions
                                                        onPrint={() => handlePDF(t._id, 'TAX')}
                                                        rerunHref="/dashboard/tax-wizard"
                                                        onDelete={() => openDeleteModal(t._id, 'TAX')}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {/* Desktop table */}
                                        <div className="hidden md:block glass-panel border border-white/5 rounded-2xl overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse" style={{ minWidth: '640px' }}>
                                                    <thead>
                                                        <tr className="border-b border-border/10 bg-white/[0.02]">
                                                            {['ASSESSMENT DATE', 'VERDICT', 'ANNUAL SAVINGS', 'FISCAL YEAR', 'ACTIONS'].map((h, i) => (
                                                                <th key={h} className={`px-6 py-4 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border/10">
                                                        {taxReports.map(t => (
                                                            <tr key={t._id} className="group hover:bg-white/[0.01] transition-colors border-l-2 border-l-transparent hover:border-l-accent">
                                                                <td className="px-6 py-4 whitespace-nowrap text-xs font-black uppercase">{fmtDate(t.createdAt)}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`px-4 py-1.5 rounded-lg border text-[10px] font-black tracking-widest uppercase w-fit block ${t.result?.verdict === 'new' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-accent/5 border-accent/20 text-accent'}`}>
                                                                        {t.result?.verdict} REGIME
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-base font-black font-barlow-condensed">₹{Math.abs(t.result?.deltaTax || 0).toLocaleString('en-IN')} Saved</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-[10px] font-black text-muted-foreground uppercase">FY {t.fy || '2024-25'}</td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <RowActions
                                                                        onPrint={() => handlePDF(t._id, 'TAX')}
                                                                        rerunHref="/dashboard/tax-wizard"
                                                                        onDelete={() => openDeleteModal(t._id, 'TAX')}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </ArchiveSection>

                            {/* ── FIRE Archive ───────────────────────────── */}
                            <ArchiveSection icon={<Flame size={16} />} title="FIRE Protocol Archive" subtitle="HISTORICAL WEALTH TRAJECTORIES & RETIREMENT PLANS">
                                {!loading && fireReports.length === 0 ? <EmptyState message="NO FIRE PLANS ARCHIVED" /> : (
                                    <>
                                        {/* Mobile cards */}
                                        <div className="grid grid-cols-1 gap-4 md:hidden">
                                            {fireReports.map(f => (
                                                <div key={f._id} className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-[9px] font-black tracking-widest text-muted-foreground uppercase">{fmtDate(f.generatedAt || f.createdAt)}</p>
                                                        <span className="text-[9px] font-black text-accent tracking-widest uppercase">AGE {f.inputs?.retireAge}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="text-[8px] font-black text-muted-foreground tracking-widest uppercase mb-0.5">TARGET CORPUS</p>
                                                            <p className="text-base font-black font-barlow-condensed">{(f.results?.targetCorpus / 10000000).toFixed(2)} CR</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[8px] font-black text-muted-foreground tracking-widest uppercase mb-0.5">MONTHLY SIP</p>
                                                            <p className="text-base font-black font-barlow-condensed text-emerald-400">₹{(f.results?.sipRequired || 0).toLocaleString('en-IN')}</p>
                                                        </div>
                                                    </div>
                                                    <RowActions
                                                        onPrint={() => handlePDF(f._id, 'FIRE')}
                                                        rerunHref="/dashboard/fire"
                                                        onDelete={() => openDeleteModal(f._id, 'FIRE')}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {/* Desktop table */}
                                        <div className="hidden md:block glass-panel border border-white/5 rounded-2xl overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse" style={{ minWidth: '640px' }}>
                                                    <thead>
                                                        <tr className="border-b border-border/10 bg-white/[0.02]">
                                                            {['ARCHIVE DATE', 'TARGET CORPUS', 'MONTHLY SIP', 'EXIT AGE', 'ACTIONS'].map((h, i) => (
                                                                <th key={h} className={`px-6 py-4 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border/10">
                                                        {fireReports.map(f => (
                                                            <tr key={f._id} className="group hover:bg-white/[0.01] transition-colors border-l-2 border-l-transparent hover:border-l-accent">
                                                                <td className="px-6 py-4 whitespace-nowrap text-xs font-black uppercase">{fmtDate(f.generatedAt || f.createdAt)}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-base font-black font-barlow-condensed">₹{(f.results?.targetCorpus / 10000000).toFixed(2)} CR</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-base font-black font-barlow-condensed text-emerald-400">₹{(f.results?.sipRequired || 0).toLocaleString('en-IN')}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-[10px] font-black text-accent uppercase">AGE {f.inputs?.retireAge}</td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <RowActions
                                                                        onPrint={() => handlePDF(f._id, 'FIRE')}
                                                                        rerunHref="/dashboard/fire"
                                                                        onDelete={() => openDeleteModal(f._id, 'FIRE')}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </ArchiveSection>

                            {/* ── Life Planner Archive ───────────────────── */}
                            <ArchiveSection icon={<Plus size={16} />} title="Strategic Roadmap Archive" subtitle="HISTORICAL LIFE EVENT PLANNING & GOAL SYNERGY">
                                {!loading && lifePlannerReports.length === 0 ? <EmptyState message="NO STRATEGIC PLANS ARCHIVED" /> : (
                                    <>
                                        {/* Mobile cards */}
                                        <div className="grid grid-cols-1 gap-4 md:hidden">
                                            {lifePlannerReports.map(lp => (
                                                <div key={lp._id} className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-[9px] font-black tracking-widest text-muted-foreground uppercase">{fmtDate(lp.createdAt)}</p>
                                                        <span className="text-[9px] font-black text-accent tracking-widest uppercase">{lp.goals?.length || 0} GOALS</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="text-[8px] font-black text-muted-foreground tracking-widest uppercase mb-0.5">EVENT TYPE</p>
                                                            <p className="text-sm font-black text-accent uppercase">{lp.eventType || 'GENERAL'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[8px] font-black text-muted-foreground tracking-widest uppercase mb-0.5">CAPITAL NODE</p>
                                                            <p className="text-base font-black font-barlow-condensed">₹{Number(lp.inputData?.amount || 0).toLocaleString('en-IN')}</p>
                                                        </div>
                                                    </div>
                                                    <RowActions
                                                        onPrint={() => handlePDF(lp._id, 'LIFE_PLANNER')}
                                                        onDownload={() => handleDownload(lp._id, lp.createdAt, 'LIFE_PLANNER')}
                                                        onDelete={() => openDeleteModal(lp._id, 'LIFE_PLANNER')}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {/* Desktop table */}
                                        <div className="hidden md:block glass-panel border border-white/5 rounded-2xl overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse" style={{ minWidth: '640px' }}>
                                                    <thead>
                                                        <tr className="border-b border-border/10 bg-white/[0.02]">
                                                            {['ARCHIVE DATE', 'EVENT TYPE', 'CAPITAL NODE', 'GOAL SYNC', 'ACTIONS'].map((h, i) => (
                                                                <th key={h} className={`px-6 py-4 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border/10">
                                                        {lifePlannerReports.map(lp => (
                                                            <tr key={lp._id} className="group hover:bg-white/[0.01] transition-colors border-l-2 border-l-transparent hover:border-l-accent">
                                                                <td className="px-6 py-4 whitespace-nowrap text-xs font-black uppercase">{fmtDate(lp.createdAt)}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-xs font-black text-accent uppercase tracking-widest">{lp.eventType || 'GENERAL'}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-base font-black font-barlow-condensed">₹{Number(lp.inputData?.amount || 0).toLocaleString('en-IN')}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-[10px] font-black text-muted-foreground uppercase">{lp.goals?.length || 0} GOALS ACTIVE</td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <RowActions
                                                                        onPrint={() => handlePDF(lp._id, 'LIFE_PLANNER')}
                                                                        onDownload={() => handleDownload(lp._id, lp.createdAt, 'LIFE_PLANNER')}
                                                                        onDelete={() => openDeleteModal(lp._id, 'LIFE_PLANNER')}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </ArchiveSection>

                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="px-4 sm:px-6 md:px-10 py-8 md:py-10 border-t border-border/10 text-center relative mt-auto">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                        <p className="text-[8px] md:text-[9px] font-black tracking-[0.3em] md:tracking-[0.6em] text-muted-foreground/30 uppercase">
                            NIVESHIQ INTELLIGENCE LAYER // VAULT SYSTEM V3.0
                        </p>
                    </footer>
                </main>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Erase Intelligence Node?"
                message="Are you sure you want to permanently delete this snapshot? All historical data will be purged."
            />
        </div>
    );
}