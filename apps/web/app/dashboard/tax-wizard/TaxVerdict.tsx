'use client';

import { motion } from 'framer-motion';
import {
    Receipt, Info, Sparkles,
    TrendingDown, AlertTriangle, ArrowRight, RotateCcw,
    Zap, Lock, Shield
} from 'lucide-react';
import { TaxRegimeComparisonBar } from '@/components/charts/TaxRegimeComparisonBar';
import { DeductionUtilisationBars } from '@/components/charts/DeductionUtilisationBars';
import type { TaxResult, TaxInput } from '@niveshiq/types';

interface TaxVerdictProps {
    result: TaxResult;
    initialInput: TaxInput;
    onRecalculate: (input: TaxInput) => Promise<void>;
    loading?: boolean;
    onReset: () => void;
}

export const TaxVerdict = ({ result, initialInput, onRecalculate, loading, onReset }: TaxVerdictProps) => {
    const taxComparisonData = [
        { name: 'Old Regime', tax: result.old.totalTax },
        { name: 'New Regime', tax: result.new.totalTax },
    ];

    const deductionData = result.gaps.map(gap => ({
        name: gap.section.split(' ')[0],
        amount: gap.currentInvested,
        limit: gap.maxAllowed,
        used: Math.round((gap.currentInvested / gap.maxAllowed) * 100)
    }));

    const savings = Math.abs(result.deltaTax);
    const winner = result.verdict === 'old' ? 'Old Regime' : 'New Regime';
    const isNewWinner = result.verdict === 'new';

    const strategies = [
        {
            id: '80c',
            name: '80C SHIELD',
            desc: 'Max out ELSS/EPF to ₹1.5L',
            active: initialInput.sec80C >= 150000,
            toggle: () => onRecalculate({ ...initialInput, sec80C: initialInput.sec80C >= 150000 ? 50000 : 150000 })
        },
        {
            id: 'nps',
            name: 'NPS VANGUARD',
            desc: 'Utilize ₹50k NPS Section 80CCD',
            active: initialInput.sec80CCD1B >= 50000,
            toggle: () => onRecalculate({ ...initialInput, sec80CCD1B: initialInput.sec80CCD1B >= 50000 ? 0 : 50000 })
        },
        {
            id: 'health',
            name: 'HEALTH DEFENSE',
            desc: 'Max out Section 80D Insurance',
            active: initialInput.sec80D_self >= 25000,
            toggle: () => onRecalculate({ ...initialInput, sec80D_self: initialInput.sec80D_self >= 25000 ? 5000 : 25000 })
        }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-0 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 pb-16 sm:pb-20 md:pb-28 lg:pb-32">

            {/* ── SECTION 1: Verdict Hero ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8"
            >
                {/* Left: Chart Card */}
                {/* NOTE: No overflow-hidden here — it would clip the verdict banner below the chart */}
                <div className="lg:col-span-2 bg-card/30 backdrop-blur-2xl border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 relative group">
                    {/* Decorative bg icon — clipped within its own wrapper so it doesn't affect layout */}
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none select-none">
                        <div className="absolute top-0 right-0 p-5 sm:p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
                            <Receipt className="w-20 h-20 sm:w-28 sm:h-28 text-accent" />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mb-5 sm:mb-7 md:mb-8 relative z-10">
                        <h3 className="text-[9px] sm:text-[10px] md:text-xs font-black tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-muted-foreground uppercase">
                            Regime Differential Matrix
                        </h3>
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-accent/10 border border-accent/20 rounded-full shrink-0">
                            <Sparkles size={9} className="text-accent" />
                            <span className="text-[7px] sm:text-[8px] font-black tracking-[0.12em] sm:tracking-widest text-accent uppercase whitespace-nowrap">
                                OPTIMAL SHIELD DETECTED
                            </span>
                        </div>
                    </div>

                    {/* Chart — overflow-hidden scoped only here so chart clips don't bleed into banner */}
                    <div className="relative w-full h-[200px] xs:h-[230px] sm:h-[270px] md:h-[300px] overflow-hidden rounded-xl">
                        <TaxRegimeComparisonBar data={taxComparisonData} />
                    </div>

                    {/* Verdict banner — sits cleanly below chart, never overlaps */}
                    <div className={`mt-5 sm:mt-7 md:mt-8 flex flex-col xs:flex-row justify-between items-center gap-4 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border relative z-10 ${isNewWinner ? 'bg-emerald-400/5 border-emerald-400/20' : 'bg-accent/5 border-accent/20'
                        }`}>
                        <div className="text-center xs:text-left w-full xs:w-auto">
                            <div className={`text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.18em] sm:tracking-widest uppercase mb-1.5 ${isNewWinner ? 'text-emerald-400' : 'text-accent'
                                }`}>
                                PREFERRED PATH: {winner}
                            </div>
                            <div className="text-xl xs:text-2xl sm:text-3xl font-black font-barlow-condensed text-foreground">
                                ₹{savings.toLocaleString('en-IN')} ANNUAL SAVINGS
                            </div>
                        </div>
                        <button
                            onClick={onReset}
                            aria-label="Reset calculator"
                            className="shrink-0 p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200 active:scale-95"
                        >
                            <RotateCcw size={15} className="text-muted-foreground" />
                        </button>
                    </div>
                </div>

                {/* Right: Monthly Impact Card */}
                <div className="bg-card/30 backdrop-blur-2xl border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col justify-between gap-6">
                    <div className="space-y-5 sm:space-y-6 md:space-y-8">
                        <h3 className="text-[9px] sm:text-[10px] md:text-xs font-black tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground uppercase">
                            Monthly Impact
                        </h3>

                        {/* In-hand increase */}
                        <div>
                            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.18em] sm:tracking-widest text-muted-foreground uppercase mb-2 opacity-50">
                                In-Hand Increase
                            </p>
                            <p className="text-2xl xs:text-3xl sm:text-4xl font-black font-barlow-condensed text-foreground leading-none">
                                +₹{Math.abs(result.deltaMonthlyInHand).toLocaleString('en-IN')}
                                <span className="text-base sm:text-xl md:text-2xl text-muted-foreground ml-1">/mo</span>
                            </p>
                        </div>

                        {/* Daily tax grid */}
                        <div className="grid grid-cols-2 gap-3 p-3.5 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl">
                            <div>
                                <p className="text-[7px] sm:text-[8px] font-black tracking-widest text-muted-foreground uppercase mb-1.5">Old Daily</p>
                                <p className="text-xs sm:text-sm font-bold text-foreground/60">
                                    ₹{Math.round(result.old.totalTax / 365).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div>
                                <p className="text-[7px] sm:text-[8px] font-black tracking-widest text-muted-foreground uppercase mb-1.5">New Daily</p>
                                <p className="text-xs sm:text-sm font-bold text-foreground/60 font-barlow-condensed">
                                    ₹{Math.round(result.new.totalTax / 365).toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="p-3 sm:p-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl">
                        <p className="text-[8px] sm:text-[9px] font-black tracking-[0.12em] sm:tracking-widest text-muted-foreground uppercase leading-relaxed flex items-center gap-2">
                            <Info size={11} className="text-accent shrink-0" />
                            Based on Budget 2024-25 slabs.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* ── SECTION 2: Deduction Gaps + Strategy Simulator ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8"
            >
                {/* Left: Deduction Gaps */}
                <div className="lg:col-span-2 bg-card/30 backdrop-blur-xl border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
                    <h3 className="text-[9px] sm:text-[10px] md:text-xs font-black tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground uppercase mb-5 sm:mb-7 md:mb-8 flex items-center gap-2">
                        <TrendingDown size={13} className="text-accent shrink-0" />
                        Missed Deduction Gaps
                    </h3>

                    {result.gaps.length > 0 ? (
                        <>
                            {/* Chart — overflow-hidden prevents bar elements bleeding outside bounds */}
                            <div className="relative w-full h-[180px] xs:h-[210px] sm:h-[240px] md:h-[260px] overflow-hidden rounded-xl">
                                <DeductionUtilisationBars data={deductionData} />
                            </div>

                            {/* Gap cards */}
                            <div className="mt-5 sm:mt-6 md:mt-8 grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
                                {result.gaps.map((gap, i) => (
                                    <div
                                        key={i}
                                        className="p-3 sm:p-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl overflow-hidden"
                                    >
                                        {/* Top row: label + save amount */}
                                        <div className="flex items-start justify-between gap-3 mb-2.5 sm:mb-3">
                                            <div className="min-w-0">
                                                <p className="text-[7px] sm:text-[8px] md:text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-1 truncate">
                                                    {gap.section}
                                                </p>
                                                <p className="text-[10px] sm:text-xs md:text-sm font-black text-foreground uppercase tracking-tight font-barlow-condensed">
                                                    ₹{gap.gap.toLocaleString('en-IN')} AVAILABLE
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-[7px] sm:text-[8px] font-black text-emerald-400 uppercase tracking-widest">SAVE</p>
                                                <p className="text-[10px] sm:text-xs font-black text-emerald-400">
                                                    ₹{gap.taxSaving.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Progress bar — fully contained, never bleeds */}
                                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-accent rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(100, Math.round((gap.currentInvested / gap.maxAllowed) * 100))}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-[140px] sm:h-[180px] md:h-[200px] flex items-center justify-center border border-white/5 border-dashed rounded-2xl sm:rounded-3xl">
                            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.2em] sm:tracking-widest text-muted-foreground uppercase opacity-40 text-center px-4">
                                All Tax Shields Maxed Out.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right: Strategy Simulator + Expert Insight */}
                <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-5 md:gap-6">

                    {/* Strategy Simulator */}
                    <div className="relative bg-card/30 backdrop-blur-xl border border-emerald-400/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden group flex-1">
                        {/* Decorative */}
                        <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none select-none">
                            <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-400" />
                        </div>

                        <h3 className="text-[9px] sm:text-[10px] md:text-xs font-black tracking-[0.2em] sm:tracking-[0.3em] text-emerald-400 uppercase mb-4 sm:mb-5 md:mb-6 relative z-10">
                            STRATEGY SIMULATOR
                        </h3>

                        {/* On mobile show as horizontal scroll row; on md+ stack vertically */}
                        <div className="relative z-10 flex flex-col gap-2.5 sm:gap-3 md:gap-4">
                            {strategies.map((strat) => (
                                <button
                                    key={strat.id}
                                    onClick={strat.toggle}
                                    disabled={loading}
                                    className={`w-full p-3.5 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border transition-all text-left flex items-center justify-between gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${strat.active
                                            ? 'bg-emerald-400/10 border-emerald-400/30'
                                            : 'bg-white/5 border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                                            {strat.active
                                                ? <Shield size={9} className="text-emerald-400 shrink-0" />
                                                : <Lock size={9} className="text-white/20 shrink-0" />
                                            }
                                            <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.12em] sm:tracking-widest uppercase ${strat.active ? 'text-emerald-400' : 'text-muted-foreground'
                                                }`}>
                                                {strat.name}
                                            </span>
                                        </div>
                                        <p className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground font-black tracking-tight uppercase opacity-60 leading-snug">
                                            {strat.desc}
                                        </p>
                                    </div>
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center transition-all ${strat.active ? 'bg-emerald-400/20 text-emerald-400' : 'bg-white/5 text-white/20'
                                        }`}>
                                        <ArrowRight size={13} className={`transition-transform duration-200 ${strat.active ? '-rotate-45' : ''}`} />
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Loading overlay */}
                        {loading && (
                            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl sm:rounded-3xl">
                                <div className="animate-spin rounded-full h-7 w-7 sm:h-8 sm:w-8 border-2 border-accent border-t-transparent" />
                            </div>
                        )}
                    </div>

                    {/* Expert Insight */}
                    <div className="bg-secondary/10 border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-5">
                            <Info size={13} className="text-accent shrink-0" />
                            <h3 className="text-[9px] sm:text-[10px] md:text-xs font-black tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground uppercase">
                                Expert Insight
                            </h3>
                        </div>
                        <p className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground font-black tracking-[0.12em] sm:tracking-widest uppercase opacity-80 leading-loose">
                            Toggle strategies above to see how ₹50k to ₹2L in investments changes your annual payload in real-time.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};