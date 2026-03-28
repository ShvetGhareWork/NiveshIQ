'use client';

import { Search, Globe, ShieldCheck, Zap } from 'lucide-react';
import { StockSearch } from '@/components/market/StockSearch';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { TopNav } from '@/components/navigation/TopNav';
import { useAuth } from '@/hooks/useAuth';

export default function MarketSearchPage() {
    const { user } = useAuth();
    
    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <TopNav 
                    userName={user?.name || 'Operator'}
                    customLinks={[
                        { label: 'SEARCH ORBIT', href: '/dashboard/market/search', icon: <Search size={14} /> },
                    ]}
                />
                <main className="flex-1 overflow-y-auto bg-background/50 p-6 lg:p-12 space-y-16">
                    <div className="max-w-[1200px] mx-auto space-y-16">
                        {/* Header Section */}
                        <div className="max-w-4xl mx-auto text-center space-y-8">
                            <div className="inline-flex items-center gap-3 px-6 py-2 bg-accent/5 border border-accent/20 rounded-full">
                                <Zap size={14} className="text-accent" />
                                <span className="text-[10px] font-black tracking-[0.4em] text-accent uppercase italic">NiveshIQ Search Grid v2.0</span>
                            </div>
                            
                            <div className="space-y-4">
                                <h1 className="text-6xl font-black font-barlow-condensed tracking-tighter uppercase leading-none">
                                    STOCK <span className="text-accent italic">ORACLE</span> SEARCH
                                </h1>
                                <p className="text-muted-foreground font-medium tracking-wide max-w-2xl mx-auto italic">
                                    Access detailed financial intelligence on 2,000+ NSE listed securities. Real-time quote stream powered by Yahoo Finance protocols.
                                </p>
                            </div>

                            <div className="pt-8">
                                <StockSearch />
                            </div>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="bg-[#111827] border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:border-accent/20 transition-all group">
                                <div className="p-4 bg-accent/5 rounded-[1.5rem] w-fit group-hover:bg-accent/10 transition-colors">
                                    <Globe className="text-accent" size={24} />
                                </div>
                                <h3 className="text-xl font-black font-barlow-condensed tracking-tight uppercase">NSE Global Access</h3>
                                <p className="text-[11px] font-bold text-muted-foreground leading-relaxed uppercase opacity-40">Direct integration with National Stock Exchange nodes for high-frequency pricing updates.</p>
                            </div>

                            <div className="bg-[#111827] border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:border-accent/20 transition-all group">
                                <div className="p-4 bg-teal-500/5 rounded-[1.5rem] w-fit group-hover:bg-teal-500/10 transition-colors">
                                    <ShieldCheck className="text-teal-400" size={24} />
                                </div>
                                <h3 className="text-xl font-black font-barlow-condensed tracking-tight uppercase">Audit Check</h3>
                                <p className="text-[11px] font-bold text-muted-foreground leading-relaxed uppercase opacity-40">Institutional-grade metrics including P/E ratios, Beta scores, and 52W volatility analysis.</p>
                            </div>

                            <div className="bg-[#111827] border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:border-accent/20 transition-all group">
                                <div className="p-4 bg-yellow-500/5 rounded-[1.5rem] w-fit group-hover:bg-yellow-500/10 transition-colors">
                                    <Zap className="text-yellow-400" size={24} />
                                </div>
                                <h3 className="text-xl font-black font-barlow-condensed tracking-tight uppercase">Fast Handshake</h3>
                                <p className="text-[11px] font-bold text-muted-foreground leading-relaxed uppercase opacity-40">Millisecond latency for search indexing across our local and cloud caching clusters.</p>
                            </div>
                        </div>

                        {/* Disclaimer Strip */}
                        <div className="pt-12 border-t border-white/5 flex flex-col items-center gap-6">
                            <div className="flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                                <span className="text-[9px] font-black text-muted-foreground/30 tracking-[0.3em] uppercase">Handcrafted Intelligence for the Indian Retail Investor</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
