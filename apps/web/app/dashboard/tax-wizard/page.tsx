'use client';

import { useState } from 'react';
import { TopNav } from '@/components/navigation/TopNav';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { WizardForm } from './WizardForm';
import { TaxVerdict } from './TaxVerdict';
import { useTaxCalculator } from '@/hooks/useTaxCalculator';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Activity, AlertTriangle } from 'lucide-react';
import type { TaxInput } from '@niveshiq/types';
import { useAuth } from '@/hooks/useAuth';

export default function TaxWizard() {
    const [phase, setPhase] = useState<'wizard' | 'results'>('wizard');
    const [initialInput, setInitialInput] = useState<TaxInput | null>(null);
    const { calculate, result, loading, error } = useTaxCalculator();
    const { user } = useAuth();


    const handleCalculate = async (input: TaxInput) => {
        setInitialInput(input);
        await calculate(input);
        setPhase('results');
    };

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <TopNav userName={user?.name || 'Operator'} />
                <main className="flex-1 overflow-y-auto bg-background/50 relative scrollbar-thin scrollbar-thumb-accent/10">

                    {/* Header */}
                    <header className="px-6 md:px-10 py-12 md:py-16 border-b border-white/5 relative bg-[radial-gradient(circle_at_10%_20%,rgba(212,175,55,0.03)_0%,transparent_50%)]">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <h1 className="text-5xl md:text-8xl font-black font-barlow-condensed tracking-tighter leading-[0.85] uppercase">
                                    TAX <span className="text-accent italic">ORACLE</span>
                                </h1>
                                <p className="text-muted-foreground font-black tracking-[0.2em] text-[10px] md:text-xs mt-8 max-w-xl opacity-60 uppercase leading-relaxed">
                                    OPTIMIZE YOUR TAX LIABILITY. MULTIDIMENSIONAL SHIELDING THROUGH REGIME COMPARISON AND DEDUCTION ANALYSIS.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-3 px-6 py-3 bg-secondary/30 rounded-xl border border-white/5 font-black text-[10px] uppercase tracking-widest text-muted-foreground">
                                    <Activity size={14} className="text-accent animate-pulse" /> SYSTEM ACTIVE
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Tax Dashboard Core */}
                    <section className="px-6 md:px-10 py-12">
                        {error && (
                            <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                                <AlertTriangle size={14} /> {error}
                            </div>
                        )}
                        
                        <AnimatePresence mode="wait">
                            {phase === 'wizard' ? (
                                <motion.div
                                    key="wizard"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <WizardForm onCalculate={handleCalculate} loading={loading} />
                                </motion.div>
                            ) : (
                                result && (
                                    <motion.div
                                        key="results"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <TaxVerdict
                                            result={result}
                                            initialInput={initialInput!}
                                            onRecalculate={handleCalculate}
                                            loading={loading}
                                            onReset={() => setPhase('wizard')}
                                        />
                                    </motion.div>
                                )
                            )}
                        </AnimatePresence>
                    </section>
                </main>
            </div>
        </div>
    );
}
