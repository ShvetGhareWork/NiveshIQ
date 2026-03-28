'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TopNav } from '@/components/navigation/TopNav';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { GoalProgressRing } from '@/components/charts/GoalProgressRing';
import { SIPWaterfall } from '@/components/charts/SIPWaterfall';
import { ExpenseRatioDragChart } from '@/components/charts/ExpenseRatioDragChart';
import { Plus, Target, Calendar, ArrowUpRight, Baby, Gem, Gift, Briefcase, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/lib/api';

export default function LifePlanner() {
    const { user } = useAuth();
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;
    
    // -- Real Data States --
    const [goals, setGoals] = useState<any[]>([
        { label: 'NEW HOUSE', progress: 45, target: '₹2.5Cr', sip: '₹1.2L' },
        { label: 'WEDDING', progress: 82, target: '₹40L', sip: '₹25K' },
        { label: 'EDUCATION', progress: 12, target: '₹1.5Cr', sip: '₹50K' },
        { label: 'LUXURY CAR', progress: 68, target: '₹80L', sip: '₹40K' },
    ]);
    const [sipAllocation, setSipAllocation] = useState<any[]>([
        { name: 'House', amount: 120000 },
        { name: 'Wedding', amount: 25000 },
        { name: 'Education', amount: 50000 },
        { name: 'Car', amount: 40000 },
        { name: 'Idle', amount: 15000 },
    ]);
    const [growthData, setGrowthData] = useState<any[]>([
        { year: '2024', direct: 100000, regular: 100000 },
        { year: '2026', direct: 250000, regular: 230000 },
        { year: '2028', direct: 450000, regular: 400000 },
        { year: '2030', direct: 800000, regular: 700000 },
        { year: '2032', direct: 1250000, regular: 1050000 },
    ]);
    const [milestones, setMilestones] = useState<any[]>([
        { year: '24', goal: 'Emergency Fund 100% Sync', status: 'Completed', color: 'bg-emerald-500' },
        { year: '26', goal: 'Wedding Corpus Node Maturity', status: 'On Track', color: 'bg-accent' },
        { year: '30', goal: 'Real Estate Liquidity Event', status: 'Projected', color: 'bg-white/20' },
    ]);

    const userName = user?.name || 'Operator';

    useEffect(() => {
        const fetchPlannerData = async () => {
            const token = localStorage.getItem('oracle_token');
            if (!token) return;

            try {
                const res = await fetch(`${API_BASE_URL}/api/life-planner/latest`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await res.json();
                if (result.success && result.data) {
                    const data = result.data;
                    setSelectedEvent(data.eventType);
                    if (data.goals) setGoals(data.goals);
                    if (data.sipAllocation) setSipAllocation(data.sipAllocation);
                    if (data.growthData) setGrowthData(data.growthData);
                    if (data.milestones) setMilestones(data.milestones);
                }
            } catch (err) {
                console.error("Planner Load Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlannerData();
    }, []);

    const handleExecuteStrategy = async () => {
        if (!selectedEvent) return;
        setIsSaving(true);
        const token = localStorage.getItem('oracle_token');
        
        try {
            const res = await fetch(`${API_BASE_URL}/api/life-planner`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    eventType: selectedEvent,
                    goals,
                    sipAllocation,
                    growthData,
                    milestones
                })
            });
            if (res.ok) {
                // Success logic
                console.log("Strategy Archival Successful");
            }
        } catch (err) {
            console.error("Strategy Execution Error:", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <TopNav 
                    userName={userName} 
                    customLinks={[
                        { label: 'LIFE PLANNER', href: '/dashboard/life-planner', icon: <Target size={12} /> },
                    ]}
                />
                <main className="flex-1 overflow-y-auto bg-background/50 relative scrollbar-thin scrollbar-thumb-accent/10">
                    
                    {/* Header */}
                    <header className="px-6 md:px-10 py-12 md:py-20 border-b border-white/5 relative bg-[radial-gradient(circle_at_10%_20%,rgba(212,175,55,0.03)_0%,transparent_50%)]">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <h1 className="text-5xl md:text-8xl font-black font-barlow-condensed tracking-tighter leading-[0.85] uppercase">
                                    LIFE EVENT <span className="text-accent italic">PLANNER</span>
                                </h1>
                                <p className="text-muted-foreground font-black tracking-[0.2em] text-[10px] md:text-xs mt-8 max-w-xl opacity-60 uppercase leading-relaxed">
                                    BONUS? MARRIAGE? NEW BABY? INITIALIZE A STRATEGIC ACTION PLAN BASED ON YOUR REAL NUMBERS.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-3 px-6 py-3 bg-secondary/30 rounded-xl border border-white/5 font-black text-[10px] uppercase tracking-widest text-muted-foreground">
                                    <Zap size={14} className="text-accent animate-pulse" /> ORACLE READY
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Event Selection Matrix */}
                    <section className="px-6 md:px-10 pt-12">
                        <div className="max-w-7xl mx-auto">
                            <h3 className="text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-8">Select Active Life Event</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { id: 'bonus', label: 'GOT A BONUS', icon: Gift, color: 'text-accent' },
                                    { id: 'marriage', label: 'GETTING MARRIED', icon: Gem, color: 'text-emerald-400' },
                                    { id: 'baby', label: 'NEW BABY', icon: Baby, color: 'text-blue-400' },
                                    { id: 'inheritance', label: 'INHERITANCE', icon: Briefcase, color: 'text-purple-400' },
                                ].map((event) => (
                                    <button
                                        key={event.id}
                                        onClick={() => setSelectedEvent(event.id)}
                                        className={`p-6 rounded-3xl border transition-all flex flex-col items-center text-center gap-4 group ${
                                            selectedEvent === event.id 
                                            ? 'bg-accent/10 border-accent/40 shadow-[0_0_30px_rgba(212,175,55,0.1)]' 
                                            : 'bg-card/30 border-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        <div className={`p-4 rounded-2xl bg-white/5 ${event.color} group-hover:scale-110 transition-transform`}>
                                            <event.icon size={24} />
                                        </div>
                                        <span className="text-[10px] font-black tracking-widest uppercase text-foreground">{event.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Action Plan Analysis */}
                    {selectedEvent && (
                        <motion.section 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-6 md:px-10 py-12"
                        >
                            <div className="max-w-7xl mx-auto">
                                <div className="bg-card/40 backdrop-blur-3xl border border-accent/20 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                        <Zap size={200} className="text-accent" />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                                        <div>
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg">
                                                    <Target className="text-background" size={24} />
                                                </div>
                                                <div>
                                                    <h2 className="text-3xl font-black font-barlow-condensed tracking-tight uppercase">Custom Action Plan</h2>
                                                    <p className="text-[10px] text-accent font-black tracking-[0.3em] uppercase opacity-80">Scenario: {selectedEvent}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                {[
                                                    { 
                                                        title: selectedEvent === 'bonus' ? 'Bonus Deployment Strategy' : 'Marriage Liquidity Lock', 
                                                        desc: 'Optimal allocation based on current tax bracket and risk nodes.' 
                                                    },
                                                    { 
                                                        title: 'Life Insurance Multiplier', 
                                                        desc: 'Adjusting term cover to account for new liability/dependency nodes.' 
                                                    },
                                                    { 
                                                        title: 'SIP Velocity Calibration', 
                                                        desc: 'Maintaining original goal trajectory while accommodating new cashflows.' 
                                                    }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex gap-6 p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-accent/20 transition-all cursor-default">
                                                        <div className="text-accent text-[10px] font-black pt-1">0{i+1}</div>
                                                        <div>
                                                            <h4 className="text-sm font-black text-foreground uppercase tracking-tight mb-2">{item.title}</h4>
                                                            <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase opacity-60 leading-relaxed">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-background/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-8">Strategic Breakdown</h3>
                                                <div className="space-y-8">
                                                    <div>
                                                        <div className="flex justify-between text-[10px] font-black tracking-widest uppercase mb-4">
                                                            <span>Invest (Long Term)</span>
                                                            <span className="text-accent">60%</span>
                                                        </div>
                                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-accent w-[60%] shadow-[0_0_20px_rgba(212,175,55,0.4)]" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between text-[10px] font-black tracking-widest uppercase mb-4">
                                                            <span>Debt Repayment</span>
                                                            <span className="text-emerald-400">30%</span>
                                                        </div>
                                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-400 w-[30%]" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between text-[10px] font-black tracking-widest uppercase mb-4">
                                                            <span>Life Celebration</span>
                                                            <span className="text-blue-400">10%</span>
                                                        </div>
                                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-400 w-[10%]" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={handleExecuteStrategy}
                                                disabled={isSaving}
                                                className="w-full py-5 bg-white text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all mt-12 disabled:opacity-50"
                                            >
                                                {isSaving ? 'ARCHIVING...' : 'EXECUTE STRATEGY'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* Goal Performance Grid */}
                    <section className="px-6 md:px-10 py-12">
                        <div className="max-w-7xl mx-auto space-y-12 pb-32">
                            
                            {/* Tier 1: Goal Rings */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {goals.map((goal, i) => (
                                    <div key={i} className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-6 group hover:border-accent/30 transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <Target size={16} className="text-accent group-hover:rotate-45 transition-transform" />
                                            <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">{goal.target}</span>
                                        </div>
                                        <GoalProgressRing progress={goal.progress} label={goal.label} />
                                        <div className="mt-4 flex items-center justify-between text-[8px] font-black tracking-widest text-muted-foreground uppercase">
                                            <span>SIP: {goal.sip}</span>
                                            <span className="text-accent flex items-center gap-1 group-hover:text-white transition-colors">PLANNER <ArrowUpRight size={10} /></span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tier 2: Waterfall & Growth */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                                <div className="bg-card/30 backdrop-blur-2xl border border-white/5 rounded-3xl p-8">
                                    <h3 className="text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-10">
                                        SIP Allocation Waterfall
                                    </h3>
                                    <SIPWaterfall data={sipAllocation} />
                                    <div className="mt-8 flex justify-between items-center bg-secondary/20 p-4 rounded-xl border border-white/5">
                                        <div className="text-[9px] font-black tracking-widest text-muted-foreground uppercase">Total Committed SIP</div>
                                        <div className="text-lg font-black font-barlow-condensed text-foreground">₹2,50,000</div>
                                    </div>
                                </div>

                                <div className="bg-card/30 backdrop-blur-2xl border border-white/5 rounded-3xl p-8">
                                    <h3 className="text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-10 flex items-center justify-between">
                                        Corpus Growth Matrix
                                        <span className="text-[9px] text-accent font-black tracking-widest bg-accent/10 px-3 py-1 rounded-full">ESTIMATED</span>
                                    </h3>
                                    <ExpenseRatioDragChart data={growthData} />
                                    <p className="mt-8 text-[9px] text-muted-foreground font-black tracking-widest uppercase opacity-40 leading-loose">
                                        Compounding acceleration at Year 5 detected. Maintain SIP velocity for peak alignment.
                                    </p>
                                </div>
                            </div>

                            {/* Goal Calendar / Timeline */}
                            <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Calendar size={120} className="text-accent" />
                                </div>
                                <h3 className="text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-12">Target Milestones</h3>
                                <div className="space-y-8 relative z-10">
                                    {milestones.map((item, i) => (
                                        <div key={i} className="flex items-center gap-8 group/item cursor-default">
                                            <div className="text-2xl font-black font-barlow-condensed text-muted-foreground group-hover/item:text-accent transition-colors">'{item.year}</div>
                                            <div className="flex-1">
                                                <div className="h-[1px] bg-white/5 w-full relative">
                                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${item.color} shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover/item:shadow-accent/40`} />
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black tracking-widest uppercase text-foreground mb-1">{item.goal}</p>
                                                <p className="text-[8px] font-black tracking-widest uppercase text-muted-foreground opacity-60">{item.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
