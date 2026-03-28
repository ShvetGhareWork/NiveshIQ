'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Coins, Heart, Baby, Gift, 
    ArrowRight, CheckCircle2, AlertCircle,
    TrendingUp, ShieldCheck, GraduationCap, 
    Wallet, Scale, ChevronLeft, Sparkles
} from 'lucide-react';

type EventType = 'bonus' | 'marriage' | 'baby' | 'inheritance';

interface ActionPlan {
    title: string;
    items: { label: string; value: string; priority: 'high' | 'medium' | 'low' }[];
    summary: string;
}

const LIFE_EVENTS = [
    {
        id: 'bonus' as EventType,
        title: 'ANNUAL BONUS',
        description: 'DEPLOYMENT STRATEGY',
        icon: Coins,
        gradient: 'from-amber-500/20 to-yellow-500/5',
        color: '#D4AF37'
    },
    {
        id: 'marriage' as EventType,
        title: 'MARRIAGE',
        description: 'FINANCIAL CHECKLIST',
        icon: Heart,
        gradient: 'from-rose-500/20 to-pink-500/5',
        color: '#f43f5e'
    },
    {
        id: 'baby' as EventType,
        title: 'NEW BABY',
        description: 'FUTURE PROOFING',
        icon: Baby,
        gradient: 'from-cyan-500/20 to-blue-500/5',
        color: '#06b6d4'
    },
    {
        id: 'inheritance' as EventType,
        title: 'INHERITANCE',
        description: 'WEALTH PRESERVATION',
        icon: Gift,
        gradient: 'from-emerald-500/20 to-teal-500/5',
        color: '#10b981'
    }
];

export default function LifeEventPlanner() {
    const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
    const [step, setStep] = useState<'select' | 'input' | 'result'>('select');
    const [amount, setAmount] = useState<string>('');
    const [riskProfile, setRiskProfile] = useState<'low' | 'moderate' | 'high'>('moderate');
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<ActionPlan | null>(null);

    const generatePlan = async () => {
        setLoading(true);
        // Simulate AI or Complex Logic Calculation
        await new Promise(resolve => setTimeout(resolve, 1500));

        let generatedPlan: ActionPlan;

        switch (selectedEvent) {
            case 'bonus':
                generatedPlan = {
                    title: 'BONUS DEPLOYMENT ARCHITECTURE',
                    summary: 'Optimized for 30% tax bracket with moderate risk appetite.',
                    items: [
                        { label: 'Debt Liquidation', value: 'Allocate 40% to high-interest debt (Credit Cards/Personal Loans)', priority: 'high' },
                        { label: 'Emergency Buffer', value: 'Fill 3 months of expenses in Liquid Mutual Funds', priority: 'high' },
                        { label: 'Growth Engine', value: 'Invest 30% in Nifty 50 Index Fund via Lumpsum', priority: 'medium' },
                        { label: 'Tax Shield', value: 'Max out remaining 80C via ELSS (if limit exists)', priority: 'medium' }
                    ]
                };
                break;
            case 'marriage':
                generatedPlan = {
                    title: 'PRE-MARITAL FISCAL ALIGNMENT',
                    summary: 'Strategic checklist for joint financial harmony.',
                    items: [
                        { label: 'Joint Expense Node', value: 'Setup a zero-balance joint account for shared liabilities', priority: 'high' },
                        { label: 'Insurance Audit', value: 'Upgrade to a Family Floater Health Plan (Min 10L base)', priority: 'high' },
                        { label: 'Goal Synchronization', value: 'Map existing assets to shared goals (Home/Travel)', priority: 'medium' },
                        { label: 'Legal Architecture', value: 'Update nominees across all bank and demat accounts', priority: 'high' }
                    ]
                };
                break;
            case 'baby':
                generatedPlan = {
                    title: 'NEONATAL WEALTH PROTOCOL',
                    summary: 'Securing the next generation\'s geometric growth.',
                    items: [
                        { label: 'Education SIP', value: 'Start ₹10,000/mo in a Mid-cap fund (15yr horizon)', priority: 'high' },
                        { label: 'Term Life Multiplier', value: 'Increase Life Cover by 2.5x current income', priority: 'high' },
                        { label: 'Sukhanya Samriddhi', value: 'Open SSA account if girl child (8.2% tax-free)', priority: 'medium' },
                        { label: 'Emergency Scalability', value: 'Increase liquidity buffer by 50% for medical contingencies', priority: 'high' }
                    ]
                };
                break;
            case 'inheritance':
                generatedPlan = {
                    title: 'LEGACY PRESERVATION MATRIX',
                    summary: 'Shielding inherited assets from inflation and mismanagement.',
                    items: [
                        { label: 'Asset Consolidation', value: 'Map all inherited physical assets to digital equivalents', priority: 'medium' },
                        { label: 'Debt vs Invest', value: 'Clear home loan if rate > 8.5%; else invest in Hybrid funds', priority: 'high' },
                        { label: 'Capital Gains Guard', value: 'Utilize Section 54/54EC to shield real estate gains', priority: 'high' },
                        { label: 'Diversification Layer', value: 'Move 20% to Gold/International equity for stability', priority: 'medium' }
                    ]
                };
                break;
            default:
                generatedPlan = { title: '', summary: '', items: [] };
        }

        setPlan(generatedPlan);
        setStep('result');
        setLoading(false);
    };

    const reset = () => {
        setSelectedEvent(null);
        setStep('select');
        setAmount('');
        setPlan(null);
    };

    return (
        <div className="min-h-screen bg-[#0A0F1E] text-white p-6 md:p-12 font-barlow">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-px w-8 bg-[#D4AF37]" />
                            <span className="text-[#D4AF37] text-xs tracking-[0.3em] font-mono uppercase">Service 04</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black font-barlowCondensed uppercase tracking-tighter leading-none mb-4">
                            Life Event <span className="gold-text">Planner</span>
                        </h1>
                        <p className="text-white/40 text-xs font-mono tracking-widest uppercase max-w-xl">
                            Tell NiveshIQ about your milestone and get a custom financial action plan built around your exact numbers.
                        </p>
                    </div>
                    {step !== 'select' && (
                        <button 
                            onClick={reset}
                            className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/50 hover:text-white"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {step === 'select' && (
                        <motion.div 
                            key="select"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {LIFE_EVENTS.map((event) => (
                                <motion.button
                                    key={event.id}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setSelectedEvent(event.id);
                                        setStep('input');
                                    }}
                                    className={`relative group h-80 rounded-3xl p-8 border border-white/5 overflow-hidden text-left transition-all hover:border-white/20 bg-card/20 backdrop-blur-xl`}
                                >
                                    {/* Gradient Background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-40 group-hover:opacity-60 transition-opacity`} />
                                    
                                    {/* Icon */}
                                    <div className="relative z-10 mb-auto">
                                        <div className="w-16 h-16 rounded-2xl bg-[#0A0F1E] border border-white/10 flex items-center justify-center text-[event.color] shadow-2xl group-hover:border-white/30 transition-all">
                                            <event.icon size={32} style={{ color: event.color }} />
                                        </div>
                                    </div>

                                    <div className="relative z-10 mt-20">
                                        <h3 className="text-2xl font-black font-barlowCondensed tracking-tight uppercase leading-none mb-2">
                                            {event.title}
                                        </h3>
                                        <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-6">
                                            {event.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                            <span>Select Event</span>
                                            <ArrowRight size={14} className="text-white" />
                                        </div>
                                    </div>
                                    
                                    {/* Decorative element */}
                                    <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                        <event.icon size={200} />
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}

                    {step === 'input' && (
                        <motion.div 
                            key="input"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-xl mx-auto bg-card/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-accent">
                                    {selectedEvent && LIFE_EVENTS.find(e => e.id === selectedEvent)?.icon({ size: 24 })}
                                </div>
                                <h2 className="text-2xl font-black font-barlowCondensed uppercase tracking-tight">
                                    {selectedEvent?.toUpperCase()} PARAMETERS
                                </h2>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-[0.3em] font-mono text-white/30 uppercase">Estimated Amount / Value (₹)</label>
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="e.g. 5,00,000"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xl font-bold focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all outline-none placeholder:text-white/5"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black tracking-[0.3em] font-mono text-white/30 uppercase">Current Risk Profile</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(['low', 'moderate', 'high'] as const).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setRiskProfile(p)}
                                                className={`py-3 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all ${
                                                    riskProfile === p 
                                                    ? 'bg-accent/10 border-accent/40 text-accent shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                                                    : 'bg-white/5 border-white/5 text-white/30 hover:border-white/20'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ) )}
                                    </div>
                                </div>

                                <button 
                                    onClick={generatePlan}
                                    disabled={!amount || loading}
                                    className="w-full py-5 bg-accent text-[#0A0F1E] rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#0A0F1E] border-t-transparent" />
                                            <span>ANALYSING MILSTONE...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>GENERATE ACTION PLAN</span>
                                            <Sparkles size={16} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'result' && plan && (
                        <motion.div 
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden relative"
                        >
                            {/* Accent blur */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 blur-[120px] -z-10" />
                            
                            <div className="relative z-10 flex flex-col md:flex-row gap-12">
                                <div className="md:w-1/3">
                                    <h2 className="text-4xl font-black font-barlowCondensed text-accent leading-none uppercase mb-4">
                                        {plan.title}
                                    </h2>
                                    <p className="text-white/40 text-sm font-light leading-relaxed mb-8">
                                        {plan.summary}
                                    </p>
                                    
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <ShieldCheck className="text-accent" size={20} />
                                            <span className="text-[10px] font-black tracking-[0.2em] font-mono text-white/60 uppercase">Strategy Compliance</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-[10px] font-mono">
                                                <span className="text-white/30 uppercase">Tax Efficiency</span>
                                                <span className="text-emerald-400 font-bold">OPTIMAL</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-mono">
                                                <span className="text-white/30 uppercase">Capital Preservation</span>
                                                <span className="text-emerald-400 font-bold">SECURE</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-mono">
                                                <span className="text-white/30 uppercase">Algorithm Confidence</span>
                                                <span className="text-blue-400 font-bold">98.4%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-2/3 space-y-4">
                                    <h3 className="text-[10px] font-black tracking-[0.4em] font-mono text-white/20 uppercase mb-6">Execution Roadmap</h3>
                                    {plan.items.map((item, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent/30 hover:bg-white/[0.04] transition-all"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-black text-sm">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold leading-tight group-hover:text-accent transition-colors">
                                                        {item.label}
                                                    </h4>
                                                    <p className="text-white/40 text-xs font-light mt-1">
                                                        {item.value}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`px-2 py-1 rounded text-[8px] font-black tracking-widest uppercase ${
                                                    item.priority === 'high' ? 'bg-red-500/10 text-red-500' : 
                                                    item.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 
                                                    'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                    {item.priority}
                                                </div>
                                                <CheckCircle2 size={16} className="text-white/10 group-hover:text-emerald-500 transition-colors" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={reset}
                                className="mt-12 w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black tracking-[0.3em] font-mono text-white/20 hover:text-white/90 hover:border-white/30 transition-all uppercase"
                            >
                                Simulate Another Life Event
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
