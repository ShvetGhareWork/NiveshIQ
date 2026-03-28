'use client';

import { TopNav } from '@/components/navigation/TopNav';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { User, Bell, Shield, BarChart3, Info, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const userName = user?.name || 'Operator';

    // Handle hash-based tab switching
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (['account', 'notifications', 'privacy', 'data', 'about'].includes(hash)) {
                setActiveTab(hash);
            }
        };

        handleHashChange(); // Initial check
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return (
        <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
            <DashboardSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <TopNav
                    userName={userName}
                    customLinks={[
                        { label: 'ACCOUNT PROFILE', href: '#account', icon: <User size={14} /> },
                        { label: 'NOTIFICATION SETTINGS', href: '#notifications', icon: <Bell size={14} /> },
                        { label: 'PRIVACY & SECURITY', href: '#privacy', icon: <Shield size={14} /> },
                        { label: 'DATA & EXPORT', href: '#data', icon: <BarChart3 size={14} /> },
                        { label: 'ABOUT NIVESHIQ', href: '#about', icon: <Info size={14} /> },
                    ]}
                />

                <main className="flex-1 overflow-y-auto bg-background/50 relative">
                    {/* Cinematic Background Detail */}
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/2 blur-[140px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />


                    {/* Account Section */}
                    <section className="px-6 md:px-10 py-12">
                        <div className="max-w-7xl mx-auto w-full">
                            <div className="grid grid-cols-1 gap-10">

                                {/* Main Content Area */}
                                <div className="w-full">
                                    <div className="glass-panel border border-border/30 rounded-3xl p-6 md:p-12 relative overflow-hidden min-h-[500px]">
                                        {/* Account Content */}
                                        {activeTab === 'account' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 max-w-5xl">
                                                <h2 className="text-2xl font-black font-barlow-condensed tracking-tighter uppercase mb-10 text-foreground/90">PROFILE CONFIGURATION</h2>

                                                <div className="space-y-10">
                                                    {/* User Identity Banner */}
                                                    <div className="flex flex-col md:flex-row items-center gap-10 bg-white/[0.02] p-8 md:p-10 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-accent/20 transition-all duration-500">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                                                        
                                                        <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 flex items-center justify-center text-5xl font-black text-accent shadow-[0_0_40px_rgba(212,175,55,0.15)] flex-shrink-0 group-hover:scale-105 transition-transform duration-500 font-barlow-condensed">
                                                            {userName.charAt(0).toUpperCase()}
                                                        </div>
                                                        
                                                        <div className="text-center md:text-left relative z-10">
                                                            <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground uppercase mb-2 opacity-60">IDENTIFICATION DATA</p>
                                                            <h3 className="text-3xl md:text-4xl font-black tracking-tighter mb-6 text-foreground font-barlow-condensed uppercase">{userName}</h3>
                                                            <button className="px-8 py-3 rounded-xl bg-accent text-background font-black text-[10px] tracking-[0.3em] uppercase hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all active:scale-95">
                                                                UPDATE BIOMETRICS
                                                            </button>
                                                        </div>

                                                        {/* Silhouette icon in background of the banner */}
                                                        <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-foreground pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-700">
                                                            <User size={180} />
                                                        </div>
                                                    </div>

                                                    {/* Configuration Fields Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                                        {[
                                                            { label: 'LEGAL NAME', value: userName, placeholder: 'Enter legal name' },
                                                            { label: 'E-MAIL ARCHIVE', value: user?.email || 'shvetgharework@gmail.com', placeholder: 'primary@domain.com' },
                                                            { label: 'SECURE PHONE', value: '+91 98765 43210', placeholder: '+91 XXXXX XXXXX' },
                                                            { label: 'CITIZENSHIP', value: 'Indian Republic', placeholder: 'Sovereign State' },
                                                        ].map((field, i) => (
                                                            <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-accent/30 transition-all duration-300 relative overflow-hidden">
                                                                <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                <label className="block text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase mb-4 group-hover:text-accent transition-colors opacity-60">
                                                                    {field.label}
                                                                </label>
                                                                <input 
                                                                    type="text" 
                                                                    defaultValue={field.value}
                                                                    placeholder={field.placeholder}
                                                                    className="w-full bg-transparent border-none p-0 text-xl font-black font-barlow-condensed tracking-tight text-foreground focus:ring-0 outline-none placeholder:text-white/10 uppercase"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Notifications Content */}
                                        {activeTab === 'notifications' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 max-w-4xl">
                                                <h2 className="text-2xl font-black font-barlow-condensed tracking-tight uppercase mb-8">INTELLIGENCE FEED CONFIG</h2>
                                                
                                                <div className="space-y-6">
                                                    {[
                                                        { title: 'MARKET ANOMALY ALERTS', desc: 'Real-time notifications for extreme volatility or black-swan events.', active: true },
                                                        { title: 'PORTFOLIO REBALANCING', desc: 'Nudges when your asset allocation drifts by more than 5%.', active: true },
                                                        { title: 'TAX COMPLIANCE UPDATES', desc: 'Quarterly reminders for advance tax and return filings.', active: false },
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex items-center justify-between p-6 bg-background/20 border border-border/20 rounded-2xl group hover:border-accent/30 transition-all">
                                                            <div className="max-w-md">
                                                                <h4 className="text-xs font-black tracking-widest uppercase mb-1">{item.title}</h4>
                                                                <p className="text-[10px] text-muted-foreground uppercase">{item.desc}</p>
                                                            </div>
                                                            <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 ${item.active ? 'bg-accent' : 'bg-muted/20'}`}>
                                                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-background transition-all duration-300 ${item.active ? 'right-1' : 'left-1'}`} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Privacy Content */}
                                        {activeTab === 'privacy' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 max-w-4xl">
                                                <h2 className="text-2xl font-black font-barlow-condensed tracking-tight uppercase mb-8">SECURITY PROTOCOLS</h2>
                                                
                                                <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-2xl mb-8">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
                                                        <div>
                                                            <h4 className="text-sm font-black text-red-500 uppercase tracking-widest mb-2">CRITICAL: DATA SOVEREIGNTY</h4>
                                                            <p className="text-[10px] text-muted-foreground uppercase leading-relaxed">
                                                                Deleting your primary data vault is irreversible. 
                                                                This will purge all portfolio history, biometric data, 
                                                                and personalized intelligence models from our secure archives.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button className="w-full py-4 border border-red-500/30 text-red-500 font-extrabold text-[10px] tracking-[0.4em] uppercase hover:bg-red-500 hover:text-white transition-all">
                                                        TERMINATE ALL DATA VAULTS
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="p-6 bg-background/20 border border-border/20 rounded-2xl">
                                                        <p className="text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-2">2FA STATUS</p>
                                                        <p className="text-sm font-bold text-accent">HARDWARE KEY (YUBIKEY) ENABLED</p>
                                                    </div>
                                                    <div className="p-6 bg-background/20 border border-border/20 rounded-2xl">
                                                        <p className="text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-2">ENCRYPTION TYPE</p>
                                                        <p className="text-sm font-bold">AES-256 QUAD-LAYER</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Other tabs */}
                                        {activeTab === 'data' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 max-w-4xl">
                                                <h2 className="text-2xl font-black font-barlow-condensed tracking-tight uppercase mb-8">DATA ARCHIVE EXPORT</h2>
                                                <div className="p-12 border border-dashed border-border/40 rounded-3xl flex flex-col items-center justify-center text-center bg-background/10">
                                                    <BarChart3 className="text-accent/30 mb-6" size={48} />
                                                    <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase mb-6">PREPARING ENCRYPTED DATA PACKAGE</p>
                                                    <button className="px-10 py-4 bg-accent/20 border border-accent/30 text-accent font-black text-xs uppercase tracking-widest hover:bg-accent hover:text-background transition-all">
                                                        GENERATE CSV EXPORT
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'about' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 max-w-4xl">
                                                <h2 className="text-2xl font-black font-barlow-condensed tracking-tight uppercase mb-8">ABOUT NIVESHIQ v4.0</h2>
                                                <div className="space-y-6 text-muted-foreground text-[11px] uppercase tracking-widest leading-loose">
                                                    <p>NiveshIQ is a decentralized financial intelligence layer designed for the modern retail sovereign.</p>
                                                    <p>Developed by Antigravity Systems, this terminal represents the convergence of high-fidelity data modeling and cinematic user experience.</p>
                                                    <div className="pt-8 flex gap-8">
                                                        <div>
                                                            <span className="text-accent block mb-1">BUILD VERSION</span>
                                                            <span className="text-foreground">2026.03.26-RELEASE</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-accent block mb-1">LEGAL STATUS</span>
                                                            <span className="text-foreground">SEC REGULATED ENTITY</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="absolute bottom-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                                            {activeTab === 'account' && <User size={240} className="text-foreground" />}
                                            {activeTab === 'notifications' && <Bell size={240} className="text-foreground" />}
                                            {activeTab === 'privacy' && <Shield size={240} className="text-foreground" />}
                                            {activeTab === 'data' && <BarChart3 size={240} className="text-foreground" />}
                                            {activeTab === 'about' && <Info size={240} className="text-foreground" />}
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-col md:flex-row justify-end items-center gap-10">
                                        <button className="text-[10px] font-black tracking-[0.4em] text-muted-foreground uppercase hover:text-foreground transition-colors">
                                            RESET DEFAULTS
                                        </button>
                                        <button className="w-full md:w-auto px-12 py-4 rounded-xl bg-accent text-background text-[10px] font-black tracking-[0.4em] uppercase hover:scale-105 transition-all shadow-[0_10px_40px_rgba(212,175,55,0.3)] active:scale-95">
                                            COMMIT CHANGES
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* Footer */}
                    <footer className="px-6 md:px-10 py-12 border-t border-border/10 text-center relative overflow-hidden">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                        <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground/30 uppercase">
                            NIVESHIQ VAULT SYSTEM // SECURE CONFIGURATION MODE
                        </p>
                    </footer>
                </main>
            </div>
        </div>


    );
}
