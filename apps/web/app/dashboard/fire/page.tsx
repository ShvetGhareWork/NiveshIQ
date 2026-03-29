'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TopNav } from '@/components/navigation/TopNav';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { Flame, Target, TrendingUp, ShieldCheck, Zap, Info, ArrowRight, Wallet, PieChart as PieChartIcon, Calendar, Activity, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

export default function FIREProtocol() {
    const { user, token } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // -- FIRE Inputs --
    const [currentAge, setCurrentAge] = useState(30);
    const [retireAge, setRetireAge] = useState(50);
    const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
    const [monthlyEarnings, setMonthlyEarnings] = useState(120000);
    const [currentSavings, setCurrentSavings] = useState(1000000); // 10L
    const [inflation, setInflation] = useState(6);
    const [preRetReturn, setPreRetReturn] = useState(12);
    const [postRetReturn, setPostRetReturn] = useState(8);
    const [withdrawalRate, setWithdrawalRate] = useState(4); // Safe Withdrawal Rate

    // -- Derived Calculations --
    const yearsToRetire = Math.max(0, retireAge - currentAge);

    const results = useMemo(() => {
        const monthsToRetire = yearsToRetire * 12;
        const inflationRate = inflation / 100 / 12;
        const preReturnRate = preRetReturn / 100 / 12;
        const postReturnRate = postRetReturn / 100;

        // Future monthly expenses at retirement
        const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflation / 100, yearsToRetire);
        const futureAnnualExpenses = futureMonthlyExpenses * 12;

        // Target Corpus needed (Withdrawal Rate calculation)
        // Simplest: Corpus = Annual Expense / SWR
        const targetCorpus = futureAnnualExpenses / (withdrawalRate / 100);

        // Corpus needed to survive until age 90 (more robust)
        const yearsPostRetirement = 90 - retireAge;
        // Adjusted return (r - i)
        const adjReturn = (1 + (postRetReturn / 100)) / (1 + (inflation / 100)) - 1;
        const annuityFactor = (1 - Math.pow(1 + adjReturn, -yearsPostRetirement)) / adjReturn;
        const robustCorpus = futureAnnualExpenses * annuityFactor;

        // Calculate Monthly SIP required
        // FV = P * [((1+r)^n - 1) / r] * (1+r) + PV * (1+r)^n
        // P = (FV - PV * (1+r)^n) / [((1+r)^n - 1) / r * (1+r)]
        const pvTerm = currentSavings * Math.pow(1 + preReturnRate, monthsToRetire);
        const numerator = targetCorpus - pvTerm;
        const denominator = ((Math.pow(1 + preReturnRate, monthsToRetire) - 1) / preReturnRate) * (1 + preReturnRate);
        const sipRequired = Math.max(0, numerator / denominator);

        // Projection Data
        const chartData = [];
        let runningCorpus = currentSavings;
        for (let y = 0; y <= yearsToRetire + 20; y++) {
            const age = currentAge + y;
            if (y <= yearsToRetire) {
                // Accumulation Phase
                if (y > 0) {
                    for (let m = 0; m < 12; m++) {
                        runningCorpus = (runningCorpus + sipRequired) * (1 + preReturnRate);
                    }
                }
            } else {
                // Withdrawal Phase
                const yearlyExp = futureAnnualExpenses * Math.pow(1 + inflation / 100, y - yearsToRetire);
                runningCorpus = (runningCorpus - yearlyExp) * (1 + postRetReturn / 100);
            }
            chartData.push({
                age,
                corpus: Math.round(runningCorpus),
                target: Math.round(targetCorpus),
                phase: age < retireAge ? 'ACCUMULATING' : 'RETIRED'
            });
        }

        return {
            targetCorpus,
            futureMonthlyExpenses,
            sipRequired,
            chartData,
            yearsToRetire
        };
    }, [currentAge, retireAge, monthlyExpenses, currentSavings, inflation, preRetReturn, postRetReturn, withdrawalRate]);

    const handleLockStrategy = async () => {
        if (!token) {
            router.push('/login');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/fire`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    inputs: {
                        currentAge,
                        retireAge,
                        monthlyExpenses,
                        currentSavings,
                        inflation,
                        preRetReturn,
                        postRetReturn,
                        withdrawalRate
                    },
                    results: {
                        targetCorpus: results.targetCorpus,
                        sipRequired: results.sipRequired,
                        futureMonthlyExpenses: results.futureMonthlyExpenses,
                        yearsToRetire: results.yearsToRetire
                    }
                })
            });

            if (response.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (err) {
            console.error("Failed to lock strategy:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleExportPDF = () => {
        window.print();
    };

    const formatCurrency = (val: number) => {
        if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2)} Cr`;
        if (val >= 100000) return `₹ ${(val / 100000).toFixed(1)} L`;
        return `₹ ${val.toLocaleString('en-IN')}`;
    };

    if (!isMounted) return <div className="min-h-screen bg-[#0A0F1E]" />;

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <div className="no-print">
                <DashboardSidebar />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
                <div className="no-print">
                    <TopNav
                        userName={user?.name || 'Operator'}
                        customLinks={[
                            { label: 'FIRE PROTOCOL', href: '/dashboard/fire', icon: <Flame size={12} /> },
                        ]}
                    />
                </div>
                <main className="flex-1 overflow-y-auto bg-background/50 relative scrollbar-thin scrollbar-thumb-accent/10">

                    {/* Header */}
                    <header className="px-4 sm:px-6 md:px-10 py-8 md:py-12 lg:py-16 border-b border-white/5 relative bg-[radial-gradient(circle_at_10%_20%,rgba(212,175,55,0.03)_0%,transparent_50%)] overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
                        <div className="max-w-7xl mx-auto relative z-10">
                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8">
                                <div>
                                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-barlow-condensed tracking-tighter leading-none uppercase">
                                        EXIT <span className="text-accent underline decoration-accent/30 underline-offset-4 md:underline-offset-8">PLANNER</span>
                                    </h1>
                                    <p className="text-muted-foreground font-bold tracking-[0.15em] sm:tracking-widest text-[9px] sm:text-[10px] md:text-xs mt-4 sm:mt-6 max-w-xl opacity-60 uppercase leading-relaxed">
                                        Financial Independence, Retire Early. Calibrating inflation-adjusted escape velocity for your capital.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="p-3 sm:p-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl w-full lg:w-auto">
                                        <p className="text-[7px] sm:text-[8px] font-black tracking-widest text-muted-foreground uppercase mb-1">Status</p>
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Calculations Live</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <section className="px-4 sm:px-6 md:px-10 py-8 md:py-12">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 pb-20 md:pb-32">

                            {/* Left: Inputs Column */}
                            <div className="lg:col-span-4 space-y-6 md:space-y-8">
                                <div className="glass-panel border border-white/5 rounded-[1.5rem] md:rounded-3xl p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8 shadow-2xl">
                                    <div className="flex items-center gap-2 sm:gap-3 text-accent mb-2">
                                        <Calendar size={14} className="sm:w-4 sm:h-4" />
                                        <h3 className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase">Life Metrics</h3>
                                    </div>

                                    {/* Age Sliders */}
                                    <div className="space-y-5 sm:space-y-6">
                                        <div>
                                            <div className="flex justify-between mb-2 sm:mb-3 px-1 text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                <span>Current Age</span>
                                                <span className="text-accent">{currentAge} Yrs</span>
                                            </div>
                                            <input
                                                type="range" min="18" max="70" value={currentAge}
                                                onChange={(e) => setCurrentAge(parseInt(e.target.value))}
                                                className="w-full accent-accent bg-white/5 h-1.5 rounded-lg cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-2 sm:mb-3 px-1 text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                <span>Target Retirement Age</span>
                                                <span className="text-accent">{retireAge} Yrs</span>
                                            </div>
                                            <input
                                                type="range" min={currentAge + 1} max="85" value={retireAge}
                                                onChange={(e) => setRetireAge(parseInt(e.target.value))}
                                                className="w-full accent-accent bg-white/5 h-1.5 rounded-lg cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="h-[1px] bg-white/5 w-full" />

                                    <div className="flex items-center gap-2 sm:gap-3 text-accent mb-2">
                                        <Wallet size={14} className="sm:w-4 sm:h-4" />
                                        <h3 className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase">Capital Flow</h3>
                                    </div>

                                    {/* Financial Inputs */}
                                    <div className="space-y-5 sm:space-y-6">
                                        <div>
                                            <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 sm:mb-3">Current Monthly Expenses</p>
                                            <div className="relative">
                                                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-accent text-sm font-black">₹</span>
                                                <input
                                                    type="number"
                                                    value={monthlyExpenses}
                                                    onChange={(e) => setMonthlyExpenses(parseInt(e.target.value) || 0)}
                                                    className="w-full bg-background/50 border border-white/10 rounded-xl pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold focus:border-accent/40 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 sm:mb-3">Existing Corpus (Savings)</p>
                                            <div className="relative">
                                                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-accent text-sm font-black">₹</span>
                                                <input
                                                    type="number"
                                                    value={currentSavings}
                                                    onChange={(e) => setCurrentSavings(parseInt(e.target.value) || 0)}
                                                    className="w-full bg-background/50 border border-white/10 rounded-xl pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold focus:border-accent/40 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-[1px] bg-white/5 w-full" />

                                    {/* Growth Assumptions */}
                                    <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">
                                        <div>
                                            <p className="text-[7px] sm:text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2 opacity-60">Inflation (%)</p>
                                            <input
                                                type="number" value={inflation} onChange={e => setInflation(Number(e.target.value))}
                                                className="w-full bg-background/50 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold focus:border-accent/40 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-[7px] sm:text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2 opacity-60">Return (%)</p>
                                            <input
                                                type="number" value={preRetReturn} onChange={e => setPreRetReturn(Number(e.target.value))}
                                                className="w-full bg-background/50 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold focus:border-accent/40 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Milestone Card */}
                                <div className="p-5 sm:p-6 bg-accent/5 border border-accent/20 rounded-[1.5rem] sm:rounded-3xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                        <ShieldCheck size={50} className="sm:w-[60px] sm:h-[60px] text-accent" />
                                    </div>
                                    <h4 className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase mb-2 sm:mb-4 text-accent">Protocol Alert</h4>
                                    <p className="text-[10px] sm:text-[11px] text-muted-foreground uppercase leading-relaxed font-bold tracking-wider relative z-10">
                                        Maintain emergency fund worth ₹{(monthlyExpenses * 6).toLocaleString('en-IN')} before deploying full SIP strategy.
                                    </p>
                                </div>
                            </div>

                            {/* Right: Results Column */}
                            <div className="lg:col-span-8 space-y-6 md:space-y-8 lg:space-y-10">

                                {/* Top Metric Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    <div className="glass-panel border border-white/5 rounded-[1.5rem] md:rounded-[32px] p-5 sm:p-6 md:p-8 hover:border-accent/20 transition-all group">
                                        <p className="text-[8px] sm:text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-2 sm:mb-4">Target FIRE Corpus</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl sm:text-3xl md:text-4xl font-black font-barlow-condensed tracking-tight text-foreground group-hover:text-accent transition-colors">
                                                {formatCurrency(results.targetCorpus)}
                                            </span>
                                        </div>
                                        <p className="text-[7px] sm:text-[8px] text-accent/50 font-black tracking-widest uppercase mt-2 sm:mt-4">Required for {withdrawalRate}% SWR</p>
                                    </div>

                                    <div className="glass-panel border border-white/5 rounded-[1.5rem] md:rounded-[32px] p-5 sm:p-6 md:p-8 hover:border-accent/20 transition-all group">
                                        <p className="text-[8px] sm:text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-2 sm:mb-4">Monthly SIP Protocol</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl sm:text-3xl md:text-4xl font-black font-barlow-condensed tracking-tight text-foreground group-hover:text-emerald-400 transition-colors">
                                                {formatCurrency(results.sipRequired)}
                                            </span>
                                        </div>
                                        <p className="text-[7px] sm:text-[8px] text-muted-foreground/50 font-black tracking-widest uppercase mt-2 sm:mt-4">Starting immediately</p>
                                    </div>

                                    <div className="glass-panel border border-white/5 rounded-[1.5rem] md:rounded-[32px] p-5 sm:p-6 md:p-8 hover:border-accent/20 transition-all group sm:col-span-2 md:col-span-1">
                                        <p className="text-[8px] sm:text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-2 sm:mb-4">Retirement Expenses</p>
                                        <div className="flex items-baseline gap-2 text-red-500/80">
                                            <span className="text-2xl sm:text-3xl md:text-4xl font-black font-barlow-condensed tracking-tight">
                                                {formatCurrency(results.futureMonthlyExpenses)}
                                            </span>
                                        </div>
                                        <p className="text-[7px] sm:text-[8px] text-muted-foreground/50 font-black tracking-widest uppercase mt-2 sm:mt-4">Inflation Adjusted</p>
                                    </div>
                                </div>

                                {/* Main Trajectory Chart */}
                                <div className="glass-panel border border-white/5 rounded-[1.5rem] md:rounded-[40px] p-5 sm:p-6 md:p-8 lg:p-10 shadow-3xl overflow-hidden">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 md:mb-12 gap-4 sm:gap-0">
                                        <div>
                                            <h3 className="text-[10px] sm:text-xs font-black tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground uppercase mb-1">CAPITAL TRAJECTORY</h3>
                                            <p className="text-[8px] sm:text-[9px] font-bold text-accent tracking-widest uppercase">Wealth Projection Archive</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(212,175,55,0.5)] shrink-0" />
                                                <span className="text-[7px] sm:text-[8px] font-black tracking-widest uppercase opacity-40">Portfolio Value</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px]">
                                        <div className="absolute inset-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={results.chartData}>
                                                    <defs>
                                                        <linearGradient id="corpusGradient" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.5} />
                                                            <stop offset="50%" stopColor="#D4AF37" stopOpacity={0.2} />
                                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.01} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                                    <XAxis
                                                        dataKey="age"
                                                        stroke="#ffffff40"
                                                        fontSize={10}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        label={{ value: 'User Age', position: 'insideBottom', offset: -5, fontSize: 8, fill: '#ffffff40' }}
                                                    />
                                                    <YAxis
                                                        stroke="#ffffff40"
                                                        fontSize={10}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickFormatter={(value) => `₹${(value / 10000000).toFixed(1)}Cr`}
                                                        width={60}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#111111', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', fontSize: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                                        formatter={(value: any) => [`₹${(value).toLocaleString('en-IN')}`, 'Portfolio Corpus']}
                                                        labelFormatter={(label) => `Age: ${label}`}
                                                    />
                                                    <ReferenceLine x={retireAge} stroke="#D4AF37" strokeDasharray="3 3" label={{ position: 'top', value: 'EXIT NODE', fill: '#D4AF37', fontSize: 10, fontWeight: 'black', letterSpacing: '0.1em' }} />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="corpus"
                                                        stroke="#D4AF37"
                                                        strokeWidth={3}
                                                        fillOpacity={1}
                                                        fill="url(#corpusGradient)"
                                                        animationDuration={2000}
                                                        activeDot={{ r: 5, fill: '#D4AF37', stroke: '#000', strokeWidth: 2 }}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 text-emerald-400 shrink-0">
                                                <PieChartIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] sm:text-[10px] font-black tracking-widest text-foreground uppercase mb-1">Asset Shift</p>
                                                <p className="text-[8px] sm:text-[9px] text-muted-foreground uppercase leading-relaxed font-bold">
                                                    Current: 80% Equity / 20% Debt. <br />
                                                    At Age {retireAge}: 40% Equity / 60% Debt for safety.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20 text-accent shrink-0">
                                                <Activity size={16} className="sm:w-[18px] sm:h-[18px]" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] sm:text-[10px] font-black tracking-widest text-foreground uppercase mb-1">Stability Check</p>
                                                <p className="text-[8px] sm:text-[9px] text-muted-foreground uppercase leading-relaxed font-bold">
                                                    Safe Withdrawal Rate of {withdrawalRate}% allows corpus to sustain for 35+ years.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 text-amber-500 shrink-0">
                                                <TrendingUp size={16} className="sm:w-[18px] sm:h-[18px]" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] sm:text-[10px] font-black tracking-widest text-foreground uppercase mb-1">Inflation Hedge</p>
                                                <p className="text-[8px] sm:text-[9px] text-muted-foreground uppercase leading-relaxed font-bold">
                                                    System assumes {inflation}% average LTC inflation. Adjust as needed.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2 sm:pt-4 no-print">
                                    <button
                                        onClick={handleLockStrategy}
                                        disabled={isSaving}
                                        className={`flex-1 py-4 sm:py-5 ${saveSuccess ? 'bg-emerald-500' : 'bg-accent'} text-background font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-xl sm:rounded-2xl hover:scale-[1.02] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50`}
                                    >
                                        {isSaving ? (
                                            <Loader2 className="animate-spin w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                        ) : saveSuccess ? (
                                            <ShieldCheck className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                        ) : (
                                            <Target className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                        )}
                                        {isSaving ? 'LOCKING PROTOCOL...' : saveSuccess ? 'STRATEGY ARCHIVED' : 'LOCK EXIT STRATEGY'}
                                    </button>
                                    <button
                                        onClick={handleExportPDF}
                                        className="flex-1 py-4 sm:py-5 bg-secondary/30 border border-white/5 text-foreground font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-xl sm:rounded-2xl hover:bg-secondary/50 transition-all flex items-center justify-center gap-2 sm:gap-3"
                                    >
                                        <ArrowRight className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                        EXPORT PDF BLUEPRINT
                                    </button>
                                </div>
                            </div>

                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}