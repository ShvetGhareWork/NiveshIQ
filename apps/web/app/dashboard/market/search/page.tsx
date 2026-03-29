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
                <main className="flex-1 overflow-y-auto bg-background/50 px-4 sm:px-6 md:px-10 py-8 md:py-12 space-y-10 md:space-y-16 scrollbar-thin scrollbar-thumb-accent/10">
                    <div className="max-w-[1200px] mx-auto space-y-10 md:space-y-16">
                        {/* Header Section */}
                        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
                            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-1.5 sm:py-2 bg-accent/5 border border-accent/20 rounded-full">
                                <Zap size={12} className="text-accent sm:w-[14px] sm:h-[14px]" />
                                <span className="text-[8px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.4em] text-accent uppercase italic">NiveshIQ Search Grid v2.0</span>
                            </div>

                            <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-barlow-condensed tracking-tighter uppercase leading-none">
                                    STOCK <span className="text-accent italic">ORACLE</span> SEARCH
                                </h1>
                                <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium tracking-wide max-w-2xl mx-auto italic px-2">
                                    Access detailed financial intelligence on 2,000+ NSE listed securities. Real-time quote stream powered by Yahoo Finance protocols.
                                </p>
                            </div>

                            <div className="pt-6 md:pt-8 w-full">
                                <StockSearch />
                            </div>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
                            <div className="bg-[#111827] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 space-y-3 md:space-y-4 hover:border-accent/20 transition-all group">
                                <div className="p-3 md:p-4 bg-accent/5 rounded-xl md:rounded-[1.5rem] w-fit group-hover:bg-accent/10 transition-colors">
                                    <Globe className="text-accent w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <h3 className="text-lg md:text-xl font-black font-barlow-condensed tracking-tight uppercase">NSE Global Access</h3>
                                <p className="text-[10px] md:text-[11px] font-bold text-muted-foreground leading-relaxed uppercase opacity-40">Direct integration with National Stock Exchange nodes for high-frequency pricing updates.</p>
                            </div>

                            <div className="bg-[#111827] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 space-y-3 md:space-y-4 hover:border-accent/20 transition-all group">
                                <div className="p-3 md:p-4 bg-teal-500/5 rounded-xl md:rounded-[1.5rem] w-fit group-hover:bg-teal-500/10 transition-colors">
                                    <ShieldCheck className="text-teal-400 w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <h3 className="text-lg md:text-xl font-black font-barlow-condensed tracking-tight uppercase">Audit Check</h3>
                                <p className="text-[10px] md:text-[11px] font-bold text-muted-foreground leading-relaxed uppercase opacity-40">Institutional-grade metrics including P/E ratios, Beta scores, and 52W volatility analysis.</p>
                            </div>

                            <div className="bg-[#111827] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 space-y-3 md:space-y-4 hover:border-accent/20 transition-all group">
                                <div className="p-3 md:p-4 bg-yellow-500/5 rounded-xl md:rounded-[1.5rem] w-fit group-hover:bg-yellow-500/10 transition-colors">
                                    <Zap className="text-yellow-400 w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <h3 className="text-lg md:text-xl font-black font-barlow-condensed tracking-tight uppercase">Fast Handshake</h3>
                                <p className="text-[10px] md:text-[11px] font-bold text-muted-foreground leading-relaxed uppercase opacity-40">Millisecond latency for search indexing across our local and cloud caching clusters.</p>
                            </div>
                        </div>

                        {/* Disclaimer Strip */}
                        <div className="pt-8 md:pt-12 border-t border-white/5 flex flex-col items-center gap-4 md:gap-6 mt-8 md:mt-12">
                            <div className="flex items-center gap-2 md:gap-3 px-4 sm:px-6 py-2 bg-white/5 border border-white/10 rounded-full text-center">
                                <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black text-muted-foreground/30 tracking-[0.15em] sm:tracking-[0.3em] uppercase">Handcrafted Intelligence for the Indian Retail Investor</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}