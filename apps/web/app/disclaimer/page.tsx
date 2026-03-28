'use client';

import React from 'react';
import { Shield, AlertCircle, Lock, FileText, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function Disclaimer() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-accent/30 selection:text-white">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-20 md:py-32">
                <Link 
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-accent text-[10px] font-black tracking-widest uppercase mb-12 hover:translate-x-[-4px] transition-transform"
                >
                    <Home size={14} />
                    RETURN TO ORACLE
                </Link>

                <header className="mb-20">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 border border-accent/20">
                        <Shield className="text-accent" size={32} />
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black font-barlow-condensed tracking-tighter uppercase leading-[0.85] mb-6">
                        LEGAL <span className="text-accent underline decoration-accent/30 underline-offset-8">DISCLAIMER</span>
                    </h1>
                    <p className="text-muted-foreground font-black tracking-[0.3em] uppercase text-xs opacity-60">
                        NIVESHIQ PROTOCOL // REGULATORY COMPLIANCE ARK
                    </p>
                </header>

                <div className="space-y-16">
                    {/* Section 1 */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-accent" size={20} />
                            <h2 className="text-xl font-black font-barlow-condensed tracking-tight uppercase">NOT AN INVESTMENT ADVISOR</h2>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 leading-relaxed text-muted-foreground uppercase text-[10px] tracking-widest font-bold">
                            NiveshIQ is an AI-powered financial diagnostic tool developed for educational and informational purposes. 
                            We do not provide personalized investment advice, nor are we registered with SEBI (Securities and Exchange Board of India) 
                            as Investment Advisors. The AI models analyze your data based on general financial principles and budget 
                            regulations, which should not be considered as a mandate for any financial transaction.
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Lock className="text-accent" size={20} />
                            <h2 className="text-xl font-black font-barlow-condensed tracking-tight uppercase">DATA PRIVACY & SECURITY</h2>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 leading-relaxed text-muted-foreground uppercase text-[10px] tracking-widest font-bold">
                            Your security is our highest priority. All portfolio statements (CAS), tax documents, and financial inputs are processed 
                            in volatile memory using secure extraction protocols. NiveshIQ does not store original copies of uploaded PDF or 
                            spreadsheet documents. Extracted data for historical reporting is encrypted and stored in your private vault, 
                            accessible only through your authenticated identity.
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <FileText className="text-accent" size={20} />
                            <h2 className="text-xl font-black font-barlow-condensed tracking-tight uppercase">ACCURACY OF CALCULATIONS</h2>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 leading-relaxed text-muted-foreground uppercase text-[10px] tracking-widest font-bold">
                            While we strive for 100% precision, AI-based document extraction and tax computation models may occasionally 
                            experience discrepancies due to non-standard document formatting or complex dividend re-investment structures. 
                            Users are encouraged to cross-verify the Tax Overlaps and XIRR calculations with official fund House reports.
                        </div>
                    </section>
                </div>

                <footer className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-[9px] font-black tracking-widest text-muted-foreground uppercase opacity-40">
                        © 2025 NIVESHIQ INTELLIGENCE ARK // ALL RIGHTS RESERVED
                    </div>
                    <div className="flex gap-8">
                        {['Terms', 'Privacy', 'Contact'].map(item => (
                            <button key={item} className="text-[10px] font-black tracking-[0.2em] text-accent uppercase hover:text-white transition-colors">
                                {item}
                            </button>
                        ))}
                    </div>
                </footer>
            </main>
        </div>
    );
}