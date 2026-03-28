'use client';

import { motion } from 'framer-motion';
import { 
    Receipt, ShieldCheck, Info, Sparkles, 
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

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-32">
            
            {/* Verdict Hero */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                <div className="lg:col-span-2 bg-card/30 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <Receipt size={120} className="text-accent" />
                    </div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black tracking-[0.3em] text-muted-foreground uppercase">Regime Differential Matrix</h3>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full">
                            <Sparkles size={10} className="text-accent" />
                            <span className="text-[8px] font-black tracking-widest text-accent uppercase">OPTIMAL SHIELD DETECTED</span>
                        </div>
                    </div>
                    
                    <TaxRegimeComparisonBar data={taxComparisonData} />
                    
                    <div className={`mt-8 flex justify-between items-center p-6 rounded-2xl border ${
                        result.verdict === 'new' ? 'bg-emerald-400/5 border-emerald-400/20' : 'bg-accent/5 border-accent/20'
                    }`}>
                        <div>
                            <div className={`text-[10px] font-black tracking-widest uppercase mb-1 ${
                                result.verdict === 'new' ? 'text-emerald-400' : 'text-accent'
                            }`}>
                                PREFERRED PATH: {winner}
                            </div>
                            <div className="text-3xl font-black font-barlow-condensed text-foreground">
                                ₹{savings.toLocaleString('en-IN')} ANNUAL SAVINGS
                            </div>
                        </div>
                        <button onClick={onReset} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                            <RotateCcw size={16} className="text-muted-foreground" />
                        </button>
                    </div>
                </div>

                <div className="bg-card/30 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-10">Monthly Impact</h3>
                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-2 opacity-50">In-Hand Increase</p>
                                <p className="text-4xl font-black font-barlow-condensed text-foreground">
                                    +₹{Math.abs(result.deltaMonthlyInHand).toLocaleString('en-IN')} /mo
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[8px] font-black tracking-widest text-muted-foreground uppercase mb-1">Old Daily</p>
                                    <p className="text-sm font-bold opacity-60">₹{Math.round(result.old.totalTax/365).toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black tracking-widest text-muted-foreground uppercase mb-1">New Daily</p>
                                    <p className="text-sm font-bold opacity-60 font-barlow-condensed">₹{Math.round(result.new.totalTax/365).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <p className="text-[9px] font-black tracking-widest text-muted-foreground uppercase leading-relaxed">
                            <Info size={12} className="inline mr-2 text-accent" />
                            Based on Budget 2024-25 slabs.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Shield Strategies & Gaps */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                <div className="lg:col-span-2 bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
                    <h3 className="text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-10 flex items-center gap-3">
                        <TrendingDown size={14} className="text-accent" /> 
                        Missed Deduction Gaps
                    </h3>
                    
                    {result.gaps.length > 0 ? (
                        <>
                            <DeductionUtilisationBars data={deductionData} />
                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {result.gaps.map((gap, i) => (
                                    <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-1">{gap.section}</p>
                                            <p className="text-sm font-black text-foreground uppercase tracking-tight font-barlow-condensed">₹{gap.gap.toLocaleString('en-IN')} AVAILABLE</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">SAVE</p>
                                            <p className="text-xs font-black text-emerald-400">₹{gap.taxSaving.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-[200px] flex items-center justify-center border border-white/5 border-dashed rounded-3xl">
                            <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase opacity-40">All Tax Shields Maxed Out.</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card/30 backdrop-blur-xl border border-emerald-400/20 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity">
                            <Zap size={60} className="text-emerald-400" />
                        </div>

                        <h3 className="text-xs font-black tracking-[0.3em] text-emerald-400 uppercase mb-8 flex items-center gap-2">
                             STRATEGY SIMULATOR
                        </h3>
                        
                        <div className="space-y-4">
                            {[
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
                            ].map((strat) => (
                                <button
                                    key={strat.id}
                                    onClick={strat.toggle}
                                    disabled={loading}
                                    className={`w-full p-5 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                                        strat.active 
                                        ? 'bg-emerald-400/10 border-emerald-400/30' 
                                        : 'bg-white/5 border-white/5 hover:border-white/20'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {strat.active ? <Shield size={10} className="text-emerald-400" /> : <Lock size={10} className="text-white/20" />}
                                            <span className={`text-[10px] font-black tracking-widest uppercase ${strat.active ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                                                {strat.name}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-black tracking-tight uppercase opacity-60">
                                            {strat.desc}
                                        </p>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                        strat.active ? 'bg-emerald-400/20 text-emerald-400' : 'bg-white/5 text-white/20'
                                    }`}>
                                        <ArrowRight size={14} className={strat.active ? 'rotate-[-45deg]' : ''} />
                                    </div>
                                </button>
                            ))}
                        </div>

                        {loading && (
                            <div className="absolute inset-0 bg-background/40 backdrop-blur-sm flex items-center justify-center z-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
                            </div>
                        )}
                    </div>

                    <div className="bg-secondary/10 border border-white/5 rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Info size={16} className="text-accent" />
                            <h3 className="text-xs font-black tracking-[0.3em] text-muted-foreground uppercase">Expert Insight</h3>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase opacity-80 leading-loose">
                            Toggle strategies above to see how ₹50k to ₹2L in investments changes your annual payload in real-time.
                        </p>
                    </div>
                </div>
            </motion.div>

        </div>
    );
};
