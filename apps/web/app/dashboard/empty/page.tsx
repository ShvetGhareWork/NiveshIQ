'use client';

import { TopNav } from '@/components/navigation/TopNav';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function EmptyPortfolio() {
    const { user } = useAuth();
    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNav userName={user?.name || 'Operator'} />

                <main className="flex-1 bg-background/50 relative flex items-center justify-center">
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="text-center max-w-lg px-6 relative z-10">
                        <div className="mb-12 flex justify-center">
                            <div className="relative">
                                <span className="text-8xl block grayscale group-hover:grayscale-0 transition-all duration-700">🛸</span>
                                <div className="absolute -inset-4 bg-accent/20 blur-2xl rounded-full -z-10 animate-pulse" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6 font-barlow-condensed tracking-tighter uppercase">
                            ORACLE <span className="text-accent underline decoration-accent/30 underline-offset-8">OFFLINE</span>
                        </h1>

                        <p className="text-muted-foreground font-medium tracking-wide mb-10 leading-relaxed uppercase text-xs">
                            THIS SECTOR OF THE VAULT IS CURRENTLY UNDER CONSTRUCTION BY OUR QUANTUM ANALYSTS.
                            STAY DISCIPLINED.
                        </p>

                        <Link
                            href="/dashboard"
                            className="inline-block px-10 py-4 rounded-xl bg-accent text-background font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.05] transition-all shadow-[0_10px_25px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.4)] active:scale-95"
                        >
                            RETURN TO BASE →
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
}
