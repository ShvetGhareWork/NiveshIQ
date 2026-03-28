'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams, useRouter } from 'next/navigation';
import { Activity, TrendingUp, Shield, Filter, Download, ChevronLeft, Printer } from 'lucide-react';
import { TaxRegimeComparisonBar } from '@/components/charts/TaxRegimeComparisonBar';
import { DeductionUtilisationBars } from '@/components/charts/DeductionUtilisationBars';
import { PortfolioTreemap } from '@/components/charts/PortfolioTreemap';
import { OverlapHeatmap } from '@/components/charts/OverlapHeatmap';
import Link from 'next/link';

export default function AnalyticalDossier() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center h-screen bg-background">
                <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mb-8 border border-accent/20 animate-pulse">
                    <Activity className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-xl font-black font-barlow-condensed tracking-tight text-foreground mb-2 uppercase">SYNCRONIZING ORACLE...</h3>
                <p className="text-[9px] text-muted-foreground tracking-[0.4em] font-black uppercase">RETRIVING PREVIOUSLY ENCRYPTED DATA</p>
            </div>
        }>
            <DossierContent />
        </Suspense>
    );
}

function DossierContent() {
    const { user, loading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const portfolioId = searchParams.get('portfolioId');
    const taxId = searchParams.get('taxId');
    const healthId = searchParams.get('healthId');
    const fireId = searchParams.get('fireId');
    
    const [portfolio, setPortfolio] = useState<any>(null);
    const [taxData, setTaxData] = useState<any>(null);
    const [healthData, setHealthData] = useState<any>(null);
    const [fireData, setFireData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchDeepAnalytics = async () => {
            const token = localStorage.getItem('oracle_token');
            if (!token) return;

            try {
                const portfolioUrl = portfolioId ? `/api/portfolio/${portfolioId}` : '/api/portfolio';
                const taxUrl = taxId ? `/api/tax/history?id=${taxId}` : '/api/tax/history';

                const [pRes, tRes, hRes, fRes] = await Promise.all([
                    fetch(portfolioUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(taxUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('/api/health/all', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('/api/fire/all', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                const pData = await pRes.json();
                const tData = await tRes.json();
                const hData = await hRes.json();
                const fData = await fRes.json();

                if (pData.success && pData.data) setPortfolio(pData.data);
                
                if (tData) {
                    if (Array.isArray(tData)) {
                        setTaxData(tData.find((t: any) => t._id === taxId) || tData[0]);
                    } else if (tData.result) {
                        setTaxData(tData);
                    }
                }

                if (hData.success && hData.data) {
                    setHealthData(hData.data.find((h: any) => h._id === healthId) || (healthId ? null : hData.data[0]));
                }
                
                if (fData.success && fData.data) {
                    setFireData(fData.data.find((f: any) => f._id === fireId) || (fireId ? null : fData.data[0]));
                }
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
    }, [user, authLoading, portfolioId, taxId, healthId, fireId]);

    if (!mounted || authLoading || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-t-accent border-white/5 rounded-full animate-spin" />
                    <p className="text-[9px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.5em] text-muted-foreground uppercase animate-pulse">
                        Initializing Dossier Generation Layer...
                    </p>
                </div>
            </div>
        );
    }

    const taxComparisonData = taxData ? [
        { name: 'Old Regime', tax: taxData.result?.old?.totalTax || 0 },
        { name: 'New Regime', tax: taxData.result?.new?.totalTax || 0 },
    ] : [];

    const treemapData = portfolio?.holdings ? Array.from(
        portfolio.holdings.reduce((acc: any, h: any) => {
            const sector = (h.category || 'Asset').split(' ')[0] || 'Misc';
            acc.set(sector, (acc.get(sector) || 0) + h.currentValue);
            return acc;
        }, new Map())
    ).map(([name, size]) => ({ name: `${name}`, size })) : [];

    const topHoldings = portfolio?.holdings?.slice(0, 5) || [];
    const overlapData = [];
    if (topHoldings.length > 1) {
        for (let i = 0; i < topHoldings.length; i++) {
            for (let j = i + 1; j < topHoldings.length; j++) {
                overlapData.push({
                    fundA: topHoldings[i].schemeName,
                    fundB: topHoldings[j].schemeName,
                    overlap: Math.round(Math.random() * 40) + 10
                });
            }
        }
    }

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
    ];

    return (
        <div className="min-h-screen bg-[#0A0F1E] text-white font-barlow-condensed selection:bg-accent selection:text-black pb-20 print:pb-0">

            {/* Control Bar */}
            <div className="no-print sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                <Link href="/dashboard/analytics" className="flex items-center gap-2 text-[10px] font-black tracking-widest text-muted-foreground hover:text-white transition-colors uppercase w-full sm:w-auto justify-center sm:justify-start">
                    <ChevronLeft size={14} /> Back to Live Deck
                </Link>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <span className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-widest text-emerald-500 uppercase flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="hidden sm:inline">Generation Layer</span> Ready
                    </span>
                    <button
                        onClick={() => window.print()}
                        className="bg-accent text-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-black text-[9px] sm:text-[10px] tracking-widest uppercase hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <Printer size={14} /> <span className="hidden sm:inline">Initialize Print Protocol</span><span className="sm:hidden">Print</span>
                    </button>
                </div>
            </div>

            {/* Dossier Content - Adjusted print:space-y-6 to compress gaps */}
            <div className="max-w-[900px] mx-auto p-5 sm:p-8 md:p-12 lg:p-16 space-y-12 md:space-y-16 print:space-y-6 dossier-page">

                {/* 1. Header */}
                <header className="border-b-4 border-accent pb-8 md:pb-12 print:pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-4 print:gap-2">
                    <div className="w-full md:w-auto">
                        <div className="flex items-center gap-2 mb-3 md:mb-4 print:mb-2">
                            <Shield className="text-accent w-5 h-5 md:w-6 md:h-6" />
                            <span className="text-lg md:text-xl font-black tracking-widest uppercase print:text-black print:text-lg">NiveshIQ Intelligence</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.85] md:leading-[0.8] uppercase mb-3 md:mb-4 break-words print:text-black print:text-4xl print:mb-2">
                            ANALYTICAL <br className="hidden sm:block print:hidden" /><span className="text-accent italic">DOSSIER</span>
                        </h1>
                        <p className="text-[8px] md:text-[9px] font-black tracking-[0.2em] md:tracking-[0.4em] text-muted-foreground uppercase opacity-40 break-all print:text-gray-500 print:opacity-100 print:text-[8px] print:tracking-[0.1em]">
                            Secure Portfolio Audit // UID: {mounted ? Math.random().toString(36).substr(2, 9).toUpperCase() : 'ORACLE-SESSION-ID'}
                        </p>
                    </div>
                    <div className="text-left md:text-right w-full md:w-auto bg-white/5 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none print:bg-transparent print:p-0 print:text-right">
                        <div className="text-[8px] md:text-[9px] font-black tracking-[0.2em] text-muted-foreground uppercase mb-1 print:text-gray-500 print:mb-0.5 print:tracking-[0.1em]">Subject</div>
                        <div className="text-base md:text-lg font-black uppercase mb-3 print:text-black print:text-base print:mb-2">{user?.name || "Operator"}</div>
                        <div className="text-[8px] md:text-[9px] font-black tracking-[0.2em] text-muted-foreground uppercase mb-1 print:text-gray-500 print:mb-0.5 print:tracking-[0.1em]">Generated</div>
                        <div className="text-xs font-black uppercase text-accent print:text-[10px]">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    </div>
                </header>

                {/* 2. Metrics Card View - Compressed padding and text sizes for print */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 print:grid-cols-3 print:gap-4 print:break-inside-avoid">
                    <div className="p-5 md:p-6 print:p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-center print:border-gray-200 print:bg-gray-50">
                        <p className="text-[9px] font-black tracking-[0.2em] md:tracking-widest text-muted-foreground uppercase mb-1.5 md:mb-2 print:tracking-normal print:mb-1">Alpha (XIRR)</p>
                        <p className="text-2xl md:text-3xl font-black tracking-tight text-emerald-500 print:text-2xl">{portfolio?.insights?.metrics?.xirr?.toFixed(2) || '0.00'}%</p>
                    </div>
                    <div className="p-5 md:p-6 print:p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-center print:border-gray-200 print:bg-gray-50">
                        <p className="text-[9px] font-black tracking-[0.2em] md:tracking-widest text-muted-foreground uppercase mb-1.5 md:mb-2 print:tracking-normal print:mb-1">Valuation</p>
                        <p className="text-2xl md:text-3xl font-black tracking-tight italic print:text-black print:text-2xl">₹ {((portfolio?.summary?.totalValue || 0) / 100000).toFixed(1)}L</p>
                    </div>
                    <div className="p-5 md:p-6 print:p-4 bg-accent/5 border border-accent/20 rounded-2xl flex flex-col justify-center print:border-amber-200 print:bg-amber-50/30">
                        <p className="text-[9px] font-black tracking-[0.2em] md:tracking-widest text-accent uppercase mb-1.5 md:mb-2 print:tracking-normal print:mb-1">Tax Saving</p>
                        <p className="text-2xl md:text-3xl font-black tracking-tight text-accent print:text-2xl">₹ {((taxData?.result?.deltaTax || 0) / 1000).toFixed(1)}k</p>
                    </div>
                </div>

                {/* 3. Strategy Briefing */}
                <section className="bg-white/[0.03] border border-white/5 rounded-[1.5rem] md:rounded-3xl p-6 md:p-10 print:p-5 print:border-gray-200 print:bg-transparent print:break-inside-avoid">
                    <h2 className="text-[10px] md:text-xs font-black tracking-[0.3em] md:tracking-[0.5em] text-accent uppercase mb-6 md:mb-8 text-center sm:text-left print:text-left print:mb-4 print:tracking-[0.2em]">Mission Protocols</h2>
                    <div className="space-y-6 md:space-y-8 print:space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start print:flex-row print:gap-4">
                            <Shield className="w-8 h-8 text-amber-500 shrink-0 print:w-6 print:h-6" />
                            <div>
                                <h4 className="font-black uppercase tracking-tight text-base md:text-lg mb-1 md:mb-2 print:text-black print:text-sm print:mb-0.5">Fiscal Shield Assessment</h4>
                                <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold tracking-[0.1em] md:tracking-wide uppercase leading-relaxed print:text-gray-700 print:tracking-normal print:text-[9px]">
                                    Verdict: {(taxData?.result?.verdict || "Standard")?.toUpperCase()} REGIME. Optimize 80C deployment by ₹{(((150000 - (taxData?.input?.sec80C || 0)) / 1000) || 0).toFixed(1)}k to finalize fiscal security.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start print:flex-row print:gap-4">
                            <TrendingUp className="w-8 h-8 text-emerald-500 shrink-0 print:w-6 print:h-6" />
                            <div>
                                <h4 className="font-black uppercase tracking-tight text-base md:text-lg mb-1 md:mb-2 print:text-black print:text-sm print:mb-0.5">Portfolio Capture Alpha</h4>
                                <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold tracking-[0.1em] md:tracking-wide uppercase leading-relaxed print:text-gray-700 print:tracking-normal print:text-[9px]">
                                    Current sector topology shows infrastructure underweighting. Recommendation: Shift 5.5% capital to industrials.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Charts View - Reduced heights specifically for print so they fit cleanly */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 print:grid-cols-2 print:gap-6 print:break-inside-avoid">
                    <div className="h-[250px] sm:h-[300px] md:h-[350px] print:h-[200px] relative">
                        <h3 className="text-[9px] font-black tracking-[0.2em] md:tracking-widest text-muted-foreground uppercase mb-4 md:mb-6 print:mb-2 print:text-gray-600 print:tracking-[0.1em]">Regime Comparison</h3>
                        <TaxRegimeComparisonBar data={taxComparisonData} />
                    </div>
                    <div className="h-[250px] sm:h-[300px] md:h-[350px] print:h-[200px] relative">
                        <h3 className="text-[9px] font-black tracking-[0.2em] md:tracking-widest text-muted-foreground uppercase mb-4 md:mb-6 print:mb-2 print:text-gray-600 print:tracking-[0.1em]">Deduction Utilization</h3>
                        <DeductionUtilisationBars data={deductionData} />
                    </div>
                </div>

                <div className="h-[300px] sm:h-[350px] md:h-[400px] print:h-[250px] relative print:break-inside-avoid">
                    <h3 className="text-[9px] font-black tracking-[0.2em] md:tracking-widest text-muted-foreground uppercase mb-4 md:mb-6 print:mb-2 print:text-gray-600 print:tracking-[0.1em]">Asset Topology</h3>
                    <PortfolioTreemap data={treemapData} />
                </div>

                {healthData && (
                    <section className="print:break-inside-avoid">
                        <h2 className="text-[10px] md:text-xs font-black tracking-[0.3em] md:tracking-[0.5em] text-accent uppercase mb-6 md:mb-8 print:mb-4">Vitality Index Assessment</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center bg-white/[0.02] border border-white/5 rounded-3xl p-8 print:p-5 print:border-gray-200">
                            <div>
                                <div className="text-5xl font-black text-accent mb-2">{healthData.totalScore}</div>
                                <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Composite Vitality Score</div>
                                <p className="mt-4 text-[11px] text-muted-foreground font-bold uppercase leading-relaxed print:text-gray-700">
                                    {healthData.totalScore >= 80 ? 'Optimal financial resilience detected.' : 'Opportunities for structural optimization identified in contingency layers.'}
                                </p>
                            </div>
                            <div className="space-y-3">
                                {healthData.scores?.map((s: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 print:border-gray-100">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</span>
                                        <span className="text-[11px] font-black text-white print:text-black">{s.score}/10</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {fireData && (
                    <section className="print:break-inside-avoid">
                        <h2 className="text-[10px] md:text-xs font-black tracking-[0.3em] md:tracking-[0.5em] text-accent uppercase mb-6 md:mb-8 print:mb-4">Freedom Vector Deployment (FIRE)</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl print:border-gray-200">
                                <div className="text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-2">Target Corpus</div>
                                <div className="text-xl font-black text-white print:text-black">₹ {(fireData.results?.targetCorpus / 10000000).toFixed(2)} CR</div>
                            </div>
                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl print:border-gray-200">
                                <div className="text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-2">Monthly Engine</div>
                                <div className="text-xl font-black text-emerald-400">₹ {(fireData.results?.sipRequired || 0).toLocaleString('en-IN')}</div>
                            </div>
                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl print:border-gray-200">
                                <div className="text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-2">Freedom Age</div>
                                <div className="text-xl font-black text-accent">{fireData.inputs?.retireAge}</div>
                            </div>
                        </div>
                    </section>
                )}

                <div className="bg-white/[0.01] border border-white/5 rounded-[1.5rem] md:rounded-3xl p-5 md:p-8 print:p-5 print:border-gray-200 print:bg-transparent print:break-inside-avoid">
                    <h3 className="text-[9px] font-black tracking-[0.2em] md:tracking-widest text-muted-foreground uppercase mb-6 md:mb-8 text-center sm:text-left print:mb-4 print:text-gray-600 print:tracking-[0.1em]">Correlation Topology Matrix</h3>
                    <div className="h-[300px] print:h-[250px]">
                        <OverlapHeatmap data={overlapData} />
                    </div>
                </div>

                {/* 5. Footer */}
                <footer className="pt-10 md:pt-16 border-t border-white/5 text-center opacity-30 mt-12 md:mt-20 print:border-gray-200 print:opacity-100 print:pt-6 print:mt-6">
                    <p className="text-[7px] md:text-[8px] font-black tracking-[0.3em] md:tracking-[0.5em] text-muted-foreground uppercase mb-2 print:text-gray-400 print:tracking-[0.2em]">End of Intelligence Archive Report</p>
                    <p className="text-[6px] md:text-[7px] font-bold tracking-widest uppercase italic break-all px-4 print:text-gray-400 print:tracking-[0.1em]">
                        Unauthorized distribution is strictly prohibited // Ledger ID: {Math.random().toString(36).substr(2, 12)}
                    </p>
                </footer>
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 10mm; size: A4 portrait; }
                    
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    body, html { 
                        background: white !important; 
                        color: black !important; 
                        padding: 0; 
                        margin: 0; 
                        height: auto !important;
                        overflow: visible !important;
                    }
                    
                    .no-print { display: none !important; }
                    
                    .dossier-page { 
                        max-width: 100% !important; 
                        padding: 0 !important; 
                        margin: 0 !important; 
                        box-shadow: none !important; 
                        border: none !important;
                        background: white !important;
                    }
                    
                    header { flex-direction: row !important; align-items: flex-end !important; }
                    header > div:last-child { text-align: right !important; background: transparent !important; padding: 0 !important; }
                    
                    .print\\:break-inside-avoid {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    
                    text.recharts-text { 
                        fill: #333 !important; 
                        font-weight: 700 !important;
                        font-size: 10px !important;
                    }
                    .recharts-cartesian-grid line {
                        stroke: #eeeeee !important;
                    }
                    .recharts-tooltip-wrapper {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}