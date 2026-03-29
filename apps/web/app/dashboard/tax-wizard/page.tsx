'use client';

import { useState, useEffect } from 'react';
import { TopNav } from '@/components/navigation/TopNav';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { WizardForm } from './WizardForm';
import { TaxVerdict } from './TaxVerdict';
import { useTaxCalculator } from '@/hooks/useTaxCalculator';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Activity, AlertTriangle } from 'lucide-react';
import type { TaxInput } from '@niveshiq/types';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';

export default function TaxWizard() {
    const [phase, setPhase] = useState<'wizard' | 'results'>('wizard');
    const [initialInput, setInitialInput] = useState<TaxInput | null>(null);
    const { calculate, result, loading, error } = useTaxCalculator();
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const handleCalculate = async (input: TaxInput) => {
        setInitialInput(input);
        await calculate(input);
        addNotification({
            title: 'Tax Oracle Synthesis Complete',
            message: `Your multi-regime tax analysis is ready. Potential liability optimized across Old and New regimes.`,
            type: 'success',
            link: '/dashboard/tax-wizard'
        });
        setPhase('results');
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <TopNav
                    userName={user?.name || 'Operator'}
                    customLinks={[
                        { label: 'TAX ORACLE', href: '/dashboard/tax-wizard', icon: <Activity size={12} /> },
                    ]}
                />
                <main className="flex-1 bg-background/50 relative scrollbar-thin scrollbar-thumb-accent/10">

                    {/* Header */}
                    <header className="px-4 sm:px-6 md:px-10 py-8 md:py-16 lg:py-20 border-b border-white/5 relative bg-[radial-gradient(circle_at_10%_20%,rgba(212,175,55,0.03)_0%,transparent_50%)]">
                        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8">
                            <div>
                                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-barlow-condensed tracking-normal leading-[0.85] uppercase">
                                    TAX <span className="text-accent italic">ORACLE</span>
                                </h1>
                                <p className="text-muted-foreground font-black tracking-[0.15em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] md:text-xs mt-4 sm:mt-6 md:mt-8 max-w-xl opacity-60 uppercase leading-relaxed">
                                    OPTIMIZE YOUR TAX LIABILITY. MULTIDIMENSIONAL SHIELDING THROUGH REGIME COMPARISON AND DEDUCTION ANALYSIS.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-secondary/30 rounded-xl sm:rounded-2xl border border-white/5 font-black text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground w-fit">
                                    <Activity size={14} className="text-accent animate-pulse" /> SYSTEM ACTIVE
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Tax Dashboard Core */}
                    <section className="px-4 sm:px-6 md:px-10 py-8 md:py-12">
                        <div className="max-w-7xl mx-auto">
                            {error && (
                                <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 text-red-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                                    <AlertTriangle size={14} className="shrink-0" /> {error}
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
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}