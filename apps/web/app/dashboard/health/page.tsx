"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from "recharts";
import {
    Shield, TrendingUp, CreditCard, PiggyBank,
    BarChart2, Users, ChevronRight, ChevronLeft,
    AlertTriangle, CheckCircle, Info, Zap, RotateCcw, Star
} from "lucide-react";
import Link from 'next/link';
import { TopNav } from '@/components/navigation/TopNav';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { useAuth } from '@/hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────
interface QuizAnswer { questionId: string; value: number; label: string }
interface DimensionScore { key: string; label: string; score: number; fullMark: number }
interface ActionItem { dimension: string; severity: "critical" | "warning" | "good"; message: string; action: string }

// ─── Quiz questions ────────────────────────────────────────────────────────────
const QUIZ_STEPS = [
    {
        id: "emergency",
        icon: Shield,
        dimension: "Emergency Fund",
        color: "#D4AF37",
        question: "How many months of expenses does your emergency fund cover?",
        subtitle: "Include savings accounts, liquid funds, and FDs you can break instantly.",
        options: [
            { label: "Less than 1 month", value: 5 },
            { label: "1 – 2 months", value: 25 },
            { label: "3 – 5 months", value: 65 },
            { label: "6+ months (recommended)", value: 100 },
        ],
    },
    {
        id: "insurance",
        icon: Shield,
        dimension: "Insurance",
        color: "#00C9B1",
        question: "What is your total life insurance coverage relative to annual income?",
        subtitle: "Rule of thumb: minimum 10–15× your annual income in pure term cover.",
        options: [
            { label: "No life insurance", value: 5 },
            { label: "Less than 5× annual income", value: 30 },
            { label: "5 – 10× annual income", value: 65 },
            { label: "10× or more (+ health cover ≥ ₹10L)", value: 100 },
        ],
    },
    {
        id: "debt",
        icon: CreditCard,
        dimension: "Debt",
        color: "#FF6B6B",
        question: "What percentage of your monthly income goes toward EMIs?",
        subtitle: "Include home loan, car loan, personal loan, and credit card minimums.",
        options: [
            { label: "More than 50%", value: 10 },
            { label: "30 – 50%", value: 35 },
            { label: "10 – 30%", value: 70 },
            { label: "Less than 10% (debt-free)", value: 100 },
        ],
    },
    {
        id: "savings",
        icon: PiggyBank,
        dimension: "Savings",
        color: "#A78BFA",
        question: "What percentage of your monthly take-home income do you save or invest?",
        subtitle: "Count SIPs, PPF, NPS, FDs — anything that leaves your spending account.",
        options: [
            { label: "Less than 5%", value: 10 },
            { label: "5 – 15%", value: 40 },
            { label: "15 – 30%", value: 75 },
            { label: "30%+ (wealth-builder mode)", value: 100 },
        ],
    },
    {
        id: "portfolio",
        icon: BarChart2,
        dimension: "Portfolio Quality",
        color: "#34D399",
        question: "How would you describe your current investment asset allocation?",
        subtitle: "A healthy allocation includes equity, debt, and alternative assets diversified by goal horizon.",
        options: [
            { label: "Only FDs / savings account", value: 10 },
            { label: "Mix of FDs + 1–2 mutual funds", value: 40 },
            { label: "Equity + Debt + some diversification", value: 75 },
            { label: "Goal-mapped, diversified, direct plans", value: 100 },
        ],
    },
    {
        id: "legacy",
        icon: Users,
        dimension: "Legacy",
        color: "#F9A8D4",
        question: "Have you set up nominees and a Will for your financial assets?",
        subtitle: "Nominees + registered Will + joint accounts = protected legacy.",
        options: [
            { label: "No nominees, no Will", value: 5 },
            { label: "Some nominees, no Will", value: 35 },
            { label: "All nominees set, no Will yet", value: 65 },
            { label: "All nominees + registered Will", value: 100 },
        ],
    },
];

const DIMENSION_META: Record<string, { color: string; icon: typeof Shield }> = {
    emergency: { color: "#D4AF37", icon: Shield },
    insurance: { color: "#00C9B1", icon: Shield },
    debt: { color: "#FF6B6B", icon: CreditCard },
    savings: { color: "#A78BFA", icon: PiggyBank },
    portfolio: { color: "#34D399", icon: BarChart2 },
    legacy: { color: "#F9A8D4", icon: Users },
};

function getGrade(score: number) {
    if (score >= 85) return { label: "EXCELLENT", color: "#34D399", desc: "Financially bulletproof" };
    if (score >= 70) return { label: "STRONG", color: "#D4AF37", desc: "Minor gaps to close" };
    if (score >= 50) return { label: "MODERATE", color: "#F59E0B", desc: "Needs attention" };
    if (score >= 30) return { label: "WEAK", color: "#F97316", desc: "Multiple red flags" };
    return { label: "CRITICAL", color: "#EF4444", desc: "Immediate action needed" };
}

function buildActions(answers: QuizAnswer[]): ActionItem[] {
    const map: Record<string, number> = {};
    answers.forEach((a) => { map[a.questionId] = a.value; });
    const items: ActionItem[] = [];
    if ((map.emergency ?? 100) < 30) items.push({ dimension: "Emergency Fund", severity: "critical", message: "Your emergency fund covers less than 2 months of expenses.", action: "Open a liquid fund or high-yield savings account and automate ₹X/month until you hit 6 months." });
    if ((map.insurance ?? 100) < 40) items.push({ dimension: "Insurance", severity: "critical", message: "Your life cover is dangerously insufficient for your dependants.", action: "Buy a pure term plan for 15× annual income + ₹10L health floater immediately." });
    if ((map.debt ?? 100) < 40) items.push({ dimension: "Debt", severity: "critical", message: "Over 30% of income is locked in EMIs — compressing your ability to build wealth.", action: "Prioritise prepaying the highest-interest loan. Every ₹1L prepaid on a 14% personal loan saves ₹14,000/yr." });
    if ((map.savings ?? 100) < 45) items.push({ dimension: "Savings", severity: "warning", message: "Savings rate below 15% will make long-term goals hard to reach.", action: "Set up a SIP on salary day — automate before you spend." });
    if ((map.legacy ?? 100) < 40) items.push({ dimension: "Legacy", severity: "critical", message: "No Will + missing nominees = legal chaos for your family.", action: "Register nominees on all bank accounts immediately." });

    const order = { critical: 0, warning: 1, good: 2 };
    return items.sort((a, b) => order[a.severity] - order[b.severity]);
}

function MoneyHealthGauge({ score }: { score: number }) {
    const grade = getGrade(score);
    const clampedScore = Math.min(100, Math.max(0, score));
    const r = 80; const cx = 110; const cy = 110; const startAngle = -210; const sweepRange = 240;
    const angleRad = (deg: number) => (deg * Math.PI) / 180;
    const arcPoint = (deg: number) => ({ x: cx + r * Math.cos(angleRad(deg)), y: cy + r * Math.sin(angleRad(deg)) });
    const describeArc = (start: number, end: number, large: boolean) => {
        const s = arcPoint(start); const e = arcPoint(end);
        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large ? 1 : 0} 1 ${e.x} ${e.y}`;
    };
    const sweep = (sweepRange * clampedScore) / 100;
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[220px] mx-auto overflow-hidden">
            <svg width="220" height="180" viewBox="0 0 220 180" className="max-w-full">
                <path d={describeArc(startAngle, startAngle + sweepRange, true)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" strokeLinecap="round" />
                <motion.path
                    d={describeArc(startAngle, startAngle + sweep, sweep > 180)}
                    fill="none" stroke={grade.color} strokeWidth="12" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
                    style={{ filter: `drop-shadow(0 0 8px ${grade.color}88)` }}
                />
                <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="36" fontWeight="900" fontFamily="Barlow Condensed, sans-serif">{clampedScore}</text>
                <text x={cx} y={cy + 16} textAnchor="middle" fill={grade.color} fontSize="11" fontWeight="700" fontFamily="monospace" letterSpacing="3">{grade.label}</text>
                <text x={cx} y={cy + 34} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="monospace" letterSpacing="2">{grade.desc.toUpperCase()}</text>
            </svg>
        </div>
    );
}

function HexagonalRadar({ data }: { data: DimensionScore[] }) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10, fontFamily: "monospace", fontWeight: 600 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="score" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ background: "#0d1117", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 4, fontFamily: "monospace", fontSize: 11 }} />
            </RadarChart>
        </ResponsiveContainer>
    );
}

function QuizStep({ step, stepIndex, totalSteps, selected, onSelect, onNext, onPrev }: any) {
    const Icon = step.icon;
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
            <div className="mb-8 md:mb-10 text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <Icon size={28} style={{ color: step.color }} className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black font-barlow-condensed tracking-tighter text-foreground uppercase mb-2">{step.question}</h3>
                <p className="text-[10px] md:text-xs font-black tracking-widest text-muted-foreground uppercase opacity-40">{step.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 gap-2 md:gap-3 mb-8 md:mb-12">
                {step.options.map((opt: any, i: number) => {
                    const isSelected = selected === opt.value;
                    return (
                        <button
                            key={i} onClick={() => onSelect(opt.value, opt.label)}
                            className={`w-full text-left px-5 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl transition-all duration-300 border font-black text-[10px] tracking-widest uppercase flex items-center justify-between ${isSelected ? 'bg-accent/10 border-accent/50 text-accent shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/20'
                                }`}
                        >
                            <span className="pr-4">{opt.label}</span>
                            {isSelected && <CheckCircle size={16} className="shrink-0" />}
                        </button>
                    );
                })}
            </div>

            <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4">
                <button onClick={onPrev} className="w-full md:w-auto px-6 md:px-8 py-4 bg-secondary/30 rounded-xl border border-white/5 font-black text-[10px] uppercase tracking-widest hover:border-accent group">
                    <ChevronLeft size={14} className="inline mr-2" /> BACK
                </button>
                <button
                    onClick={onNext} disabled={selected === null}
                    className="w-full md:flex-1 px-6 md:px-8 py-4 bg-accent text-background rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-20 active:scale-95 transition-transform"
                >
                    {stepIndex === QUIZ_STEPS.length - 1 ? "FINALIZE ORACLE REPORT →" : "NEXT NODE →"}
                </button>
            </div>
        </motion.div>
    );
}

function ActionCard({ item, index }: any) {
    const config = {
        critical: { color: "#EF4444", bg: "rgba(239,68,68,0.07)", border: "rgba(239,68,68,0.2)", icon: AlertTriangle, label: "CRITICAL" },
        warning: { color: "#F59E0B", bg: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.2)", icon: Info, label: "ACTION NEEDED" },
        good: { color: "#34D399", bg: "rgba(52,211,153,0.07)", border: "rgba(52,211,153,0.2)", icon: CheckCircle, label: "HEALTHY" },
    }[item.severity as "critical" | "warning" | "good"];
    const SeverityIcon = config.icon;
    return (
        <div className="p-5 md:p-6 rounded-2xl transition-all group border border-white/5 bg-secondary/10 hover:border-accent/30" style={{ borderLeft: `4px solid ${config.color}` }}>
            <div className="flex items-center justify-between mb-3 md:mb-4">
                <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: config.color }}>{item.dimension}</span>
                <SeverityIcon size={14} style={{ color: config.color }} />
            </div>
            <p className="text-sm md:text-base font-black font-barlow-condensed text-foreground uppercase tracking-tight mb-2 leading-tight">{item.message}</p>
            <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase opacity-60 leading-relaxed">{item.action}</p>
        </div>
    );
}

export default function MoneyHealthDashboard() {
    const [phase, setPhase] = useState<"intro" | "quiz" | "results">("intro");
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState<{ value: number; label: string } | null>(null);
    const [scores, setScores] = useState<DimensionScore[]>([]);
    const [totalScore, setTotalScore] = useState(0);
    const [actions, setActions] = useState<ActionItem[]>([]);
    const { user } = useAuth();

    function handleNext() {
        if (!currentAnswer) return;
        const newAnswers = [...answers.filter((a) => a.questionId !== QUIZ_STEPS[currentStep].id), { questionId: QUIZ_STEPS[currentStep].id, value: currentAnswer.value, label: currentAnswer.label }];
        setAnswers(newAnswers);
        if (currentStep < QUIZ_STEPS.length - 1) {
            setCurrentStep(currentStep + 1); setCurrentAnswer(null);
        } else {
            const computed = QUIZ_STEPS.map((s) => ({ key: s.id, label: s.dimension, score: newAnswers.find((a) => a.questionId === s.id)?.value ?? 0, fullMark: 100 }));
            const avg = Math.round(computed.reduce((sum, d) => sum + d.score, 0) / computed.length);
            setScores(computed); setTotalScore(avg); setActions(buildActions(newAnswers));

            // SAVE TO BACKEND USER DB
            const token = localStorage.getItem('oracle_token');
            fetch('/api/health', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    quizAnswers: newAnswers,
                    scores: computed,
                    totalScore: avg
                })
            }).then(v => {
                if (v.ok) console.log("Financial Node Synced Successfully");
            }).catch(e => console.error("Sync Protocol Failure:", e));

            setPhase("results");
        }
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <TopNav userName={user?.name || 'Operator'} />
                <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background/50 relative scrollbar-thin scrollbar-thumb-accent/10">

                    {/* Header Flare */}
                    <div className="absolute top-0 right-0 w-full md:w-1/3 h-[40%] md:h-1/3 bg-accent/5 blur-[80px] md:blur-[120px] rounded-full -translate-y-1/2 md:translate-x-1/2 pointer-events-none" />

                    <AnimatePresence mode="wait">
                        {phase === "intro" && (
                            <motion.section key="intro" className="px-5 md:px-10 py-10 md:pb-32 h-full flex flex-col justify-center items-center">
                                <div className="max-w-4xl mx-auto text-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-accent flex items-center justify-center mx-auto mb-8 md:mb-10 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                                        <Zap className="text-background w-8 h-8 md:w-10 md:h-10" />
                                    </div>
                                    <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black font-barlow-condensed tracking-tighter leading-[0.85] uppercase mb-6 md:mb-8">
                                        MONEY HEALTH<br /><span className="text-accent italic">DIAGNOSTIC</span>
                                    </h1>
                                    <p className="text-muted-foreground font-black tracking-[0.2em] text-[9px] sm:text-[10px] md:text-xs mb-10 md:mb-12 max-w-2xl mx-auto opacity-60 uppercase leading-relaxed px-4 md:px-0">
                                        THE 5-MINUTE ORACLE SCAN. 6 CRITICAL DIMENSIONS. ONE UNIFIED VITALITY SCORE. ACCESSING SYSTEMATIC REALITY.
                                    </p>
                                    <button
                                        onClick={() => setPhase("quiz")}
                                        className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-accent text-background rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.05] transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)] active:scale-95"
                                    >
                                        INITIALIZE SCAN →
                                    </button>
                                </div>
                            </motion.section>
                        )}

                        {phase === "quiz" && (
                            <motion.section key="quiz" className="px-5 md:px-10 py-10 md:py-32 flex items-center min-h-full">
                                <div className="w-full max-w-2xl mx-auto">
                                    <QuizStep
                                        step={QUIZ_STEPS[currentStep]}
                                        stepIndex={currentStep}
                                        totalSteps={QUIZ_STEPS.length}
                                        selected={currentAnswer?.value ?? null}
                                        onSelect={(v: number, l: string) => setCurrentAnswer({ value: v, label: l })}
                                        onNext={handleNext}
                                        onPrev={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : setPhase("intro")}
                                    />
                                </div>
                            </motion.section>
                        )}

                        {phase === "results" && (
                            <motion.section key="results" className="px-5 md:px-10 py-10 md:py-20">
                                <div className="max-w-7xl mx-auto pb-20 md:pb-32">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-12 md:mb-20 text-center md:text-left">
                                        <div>
                                            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black font-barlow-condensed tracking-tighter leading-[0.85] uppercase">
                                                VITALITY <span className="text-accent italic md:border-l md:border-white/10 md:pl-4 md:ml-2 block md:inline mt-2 md:mt-0">REPORT</span>
                                            </h1>
                                            <p className="text-muted-foreground font-black tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-xs mt-6 md:mt-8 max-w-xl opacity-60 uppercase leading-relaxed mx-auto md:mx-0">
                                                DIAGNOSTIC COMPLETE. SYSTEM DETECTS {totalScore}% COMPLIANCE WITH THE FINANCIAL HARMONY PROTOCOL.
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-0 w-full md:w-auto">
                                            <button onClick={() => { setPhase("intro"); setCurrentStep(0); setCurrentAnswer(null); }} className="w-full sm:w-auto px-6 md:px-8 py-4 bg-secondary/30 rounded-xl border border-white/5 font-black text-[10px] uppercase tracking-widest hover:border-accent">
                                                <RotateCcw size={14} className="inline mr-2" /> RETAKE
                                            </button>
                                            <Link href="/dashboard/portfolio" className="w-full sm:w-auto px-6 md:px-8 py-4 bg-accent text-background rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center">
                                                PORTFOLIO X-RAY →
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
                                        <div className="lg:col-span-4 space-y-6 md:space-y-8">
                                            <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 text-center bg-gradient-to-b from-accent/5 to-transparent">
                                                <h3 className="text-[10px] md:text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-6 md:mb-8">Unified Vitality</h3>
                                                <MoneyHealthGauge score={totalScore} />
                                            </div>
                                            <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
                                                <h3 className="text-[10px] md:text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-6 md:mb-8 text-center md:text-left">6D Radar Analysis</h3>
                                                <HexagonalRadar data={scores} />
                                            </div>
                                        </div>

                                        <div className="lg:col-span-8 flex flex-col">
                                            <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 flex-1">
                                                <h3 className="text-[10px] md:text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-6 md:mb-10 flex items-center justify-center md:justify-start gap-3">
                                                    <Star size={14} className="text-accent" /> RANKED ACTION LIST
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                                    {actions.map((item, i) => <ActionCard key={i} item={item} index={i} />)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}