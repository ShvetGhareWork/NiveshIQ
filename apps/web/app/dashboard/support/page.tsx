'use client';

import { TopNav } from '@/components/navigation/TopNav';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { HelpCircle, Mail, MessageSquare, BookOpen, Shield, ShieldCheck, ExternalLink, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Support() {
    const { user } = useAuth();
    const faqs = [
        {
            q: "How secure is my statement data?",
            a: "NiveshIQ uses bank-grade 256-bit encryption. Your CAMS/KFintech statements are processed locally on your device where possible, and we never store your passwords or session tokens."
        },
        {
            q: "Why is the XIRR different from my broker's app?",
            a: "Brokers often use Point-to-Point returns or Simple Returns. NiveshIQ uses Extended Internal Rate of Return (XIRR) which accounts for the exact timing and amount of every SIP and lump sum transaction."
        },
        {
            q: "Does NiveshIQ manage my money?",
            a: "No. NiveshIQ is an intelligence layer. We provide diagnostics and insights, but we do not execute trades or hold your funds. You continue to use your existing platforms for transactions."
        }
    ];

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <TopNav 
                    userName={user?.name || 'Operator'}
                    customLinks={[
                        { label: 'INTEL SUPPORT', href: '/dashboard/support', icon: <HelpCircle size={12} /> },
                    ]}
                />
                <main className="flex-1 overflow-y-auto bg-background/50 relative scrollbar-thin scrollbar-thumb-accent/10">

                    {/* Header */}
                    <header className="px-6 md:px-10 py-12 md:py-20 border-b border-white/5 relative bg-[radial-gradient(circle_at_10%_20%,rgba(212,175,55,0.03)_0%,transparent_50%)]">
                        <div className="max-w-7xl mx-auto">
                            <h1 className="text-5xl md:text-8xl font-black font-barlow-condensed tracking-tighter leading-[0.85] uppercase">
                                INTEL <span className="text-accent italic border-l border-white/10 pl-4 ml-2">SUPPORT</span>
                            </h1>
                            <p className="text-muted-foreground font-black tracking-[0.2em] text-[10px] md:text-xs mt-8 max-w-xl opacity-60 uppercase leading-relaxed">
                                ACCESS THE KNOWLEDGE BASE. SYSTEM DOCUMENTATION AND DIRECT CHANNELS TO THE ORACLE ARCHITECTS.
                            </p>
                        </div>
                    </header>

                    {/* Support Content */}
                    <section className="px-6 md:px-10 py-12">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 pb-32">

                            {/* FAQ & Knowledge */}
                            <div className="lg:col-span-8 space-y-12">
                                <div>
                                    <h3 className="text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-8 flex items-center gap-3">
                                        <BookOpen size={14} className="text-accent" /> COMMON QUERIES
                                    </h3>
                                    <div className="space-y-6">
                                        {faqs.map((faq, i) => (
                                            <div key={i} className="p-8 bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl hover:border-accent/20 transition-all group">
                                                <h4 className="text-lg font-black font-barlow-condensed text-foreground group-hover:text-accent transition-colors mb-4">{faq.q}</h4>
                                                <p className="text-[11px] text-muted-foreground font-black tracking-widest uppercase opacity-60 leading-relaxed">{faq.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-10 bg-accent/5 border border-accent/20 rounded-3xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <ShieldCheck size={120} className="text-accent" />
                                    </div>
                                    <h3 className="text-xl font-black font-barlow-condensed text-foreground mb-4 uppercase">Regulatory Compliance</h3>
                                    <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase leading-relaxed max-w-xl opacity-60">
                                        NiveshIQ operates as a technology provider under the SEBI Registered Investment Adviser (RIA) frameworks where applicable. All algorithmic logic is audited for mathematical accuracy and parity with industry standards.
                                    </p>
                                    <button className="mt-8 flex items-center gap-2 text-[10px] font-black text-accent tracking-widest uppercase border-b border-accent/20 pb-1">
                                        VIEW LEGAL DISCLOSURES <ExternalLink size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Contact & Status */}
                            <div className="lg:col-span-4 space-y-8">
                                <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
                                    <h3 className="text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-8">DIRECT CHANNELS</h3>
                                    <div className="space-y-4">
                                        <button className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-accent/30 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                                    <Mail size={18} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[10px] font-black text-foreground uppercase tracking-tight">Email Support</p>
                                                    <p className="text-[8px] font-black tracking-widest text-muted-foreground opacity-40 uppercase">oracle@niveshiq.ai</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-muted-foreground group-hover:text-accent transition-all" />
                                        </button>
                                        <button className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-accent/30 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                    <MessageSquare size={18} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[10px] font-black text-foreground uppercase tracking-tight">WhatsApp Priority</p>
                                                    <p className="text-[8px] font-black tracking-widest text-muted-foreground opacity-40 uppercase">EXCLUSIVELY FOR PRO</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-muted-foreground group-hover:text-accent transition-all" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-secondary/20 border border-white/5 rounded-3xl p-8">
                                    <h3 className="text-xs font-black tracking-[0.3em] text-muted-foreground uppercase mb-6">SYSTEM STATUS</h3>
                                    <div className="space-y-6">
                                        {[
                                            { name: 'Core Engine', status: 'Operational' },
                                            { name: 'Quant Analytics', status: 'Operational' },
                                            { name: 'CAMS/KFin Bridge', status: 'Optimal' },
                                        ].map((sys, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <span className="text-[9px] font-black tracking-widest text-muted-foreground uppercase opacity-60">{sys.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[9px] font-black tracking-widest text-emerald-500 uppercase">{sys.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
