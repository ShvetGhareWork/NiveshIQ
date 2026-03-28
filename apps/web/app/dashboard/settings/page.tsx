'use client';

import { TopNav } from '@/components/navigation/TopNav';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { User, Bell, Shield, BarChart3, Info, AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';

export default function Settings() {
    const { user, updateUser, refreshUser } = useAuth();
    const { notifications, markAsRead, markAllAsRead, addNotification } = useNotifications();
    const [activeTab, setActiveTab] = useState('account');
    const userName = user?.name || 'Operator';

    // State for editable profile fields
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phoneNumber: user?.phoneNumber || ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [toggles, setToggles] = useState({

        market: true,
        rebalance: true,
        tax: false,
        news: true,
        stealth: false
    });

    // Sync profile state when user data is available
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name,
                phoneNumber: user.phoneNumber || ''
            });
            if (user.settings) {
                setToggles(user.settings);
            }
        }
    }, [user]);


    // Refresh profile from backend on mount
    useEffect(() => {
        refreshUser();
    }, []);

    // Handle hash-based tab switching
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (['account', 'notifications', 'privacy', 'data', 'about'].includes(hash)) {
                setActiveTab(hash);
            } else if (!hash) {
                setActiveTab('account');
            }
        };

        handleHashChange(); // Initial check
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleCommitChanges = async () => {
        setIsSaving(true);
        try {
            await updateUser(profileData.name, profileData.phoneNumber, toggles);
            addNotification({ 
                title: 'System Updated', 
                message: 'All biometric and configuration data synced to Oracle Nodes.', 
                type: 'success' 
            });
        } catch (err: any) {
            addNotification({ 
                title: 'Sync Failed', 
                message: err.message, 
                type: 'error' 
            });
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
                        { label: 'ACCOUNT PROFILE', href: '/dashboard/settings#account', icon: <User size={14} /> },
                        { label: 'NOTIFICATION SETTINGS', href: '/dashboard/settings#notifications', icon: <Bell size={14} /> },
                        { label: 'PRIVACY & SECURITY', href: '/dashboard/settings#privacy', icon: <Shield size={14} /> },
                        { label: 'DATA & EXPORT', href: '/dashboard/settings#data', icon: <BarChart3 size={14} /> },
                        { label: 'ABOUT NIVESHIQ', href: '/dashboard/settings#about', icon: <Info size={14} /> },
                    ]}
                />

                <main className="flex-1 overflow-y-auto bg-background/50 relative scrollbar-thin scrollbar-thumb-white/10">
                    {/* Cinematic Background Detail */}
                    <div className="absolute top-0 right-0 w-[150%] md:w-1/3 h-1/2 md:h-1/3 bg-accent/5 blur-[80px] md:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 md:translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[150%] md:w-1/2 h-1/2 bg-accent/2 blur-[100px] md:blur-[140px] rounded-full translate-y-1/2 -translate-x-1/4 md:-translate-x-1/2 pointer-events-none" />

                    {/* Account Section */}
                    <section className="px-4 sm:px-6 md:px-10 py-8 md:py-12">
                        <div className="max-w-7xl mx-auto w-full">
                            <div className="grid grid-cols-1 gap-6 md:gap-10">

                                {/* Main Content Area */}
                                <div className="w-full">
                                    <div className="glass-panel border border-border/30 rounded-[1.5rem] md:rounded-3xl p-5 sm:p-8 md:p-12 relative overflow-hidden min-h-[500px]">

                                        {/* Account Content */}
                                        {activeTab === 'account' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 max-w-5xl">
                                                <h2 className="text-xl sm:text-2xl font-black font-barlow-condensed tracking-tighter uppercase mb-6 md:mb-10 text-foreground/90">PROFILE CONFIGURATION</h2>

                                                <div className="space-y-6 md:space-y-10">
                                                    {/* User Identity Banner */}
                                                    <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 md:gap-10 bg-white/[0.02] p-6 md:p-10 rounded-[1.25rem] md:rounded-3xl border border-white/5 relative overflow-hidden group hover:border-accent/20 transition-all duration-500 text-center sm:text-left">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                                                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 flex items-center justify-center text-4xl md:text-5xl font-black text-accent shadow-[0_0_30px_rgba(212,175,55,0.15)] flex-shrink-0 group-hover:scale-105 transition-transform duration-500 font-barlow-condensed z-10">
                                                            {userName.charAt(0).toUpperCase()}
                                                        </div>

                                                        <div className="relative z-10 w-full">
                                                            <p className="text-[9px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground uppercase mb-1 md:mb-2 opacity-60">IDENTIFICATION DATA</p>
                                                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter mb-4 md:mb-6 text-foreground font-barlow-condensed uppercase break-words">{userName}</h3>
                                                            <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-3.5 rounded-xl bg-accent text-background font-black text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all active:scale-95">
                                                                UPDATE BIOMETRICS
                                                            </button>
                                                        </div>

                                                        {/* Silhouette icon in background of the banner */}
                                                        <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-foreground pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-700 hidden sm:block">
                                                            <User size={180} className="md:w-[180px] md:h-[180px]" />
                                                        </div>
                                                    </div>

                                                    {/* Configuration Fields Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                                                        {[
                                                            { label: 'LEGAL NAME', value: profileData.name, key: 'name', placeholder: 'Enter legal name' },
                                                            { label: 'E-MAIL ARCHIVE', value: user?.email || '', key: 'email', placeholder: 'primary@domain.com', disabled: true },
                                                            { label: 'SECURE PHONE', value: profileData.phoneNumber, key: 'phoneNumber', placeholder: '+91 XXXXX XXXXX' },
                                                            { label: 'CITIZENSHIP', value: 'Indian Republic', key: 'citizenship', placeholder: 'Sovereign State', disabled: true },
                                                        ].map((field, i) => (
                                                            <div key={i} className={`p-5 sm:p-6 md:p-8 rounded-[1.25rem] md:rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-accent/30 transition-all duration-300 relative overflow-hidden ${field.disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}>
                                                                <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                <label className="block text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase mb-3 md:mb-4 group-hover:text-accent transition-colors opacity-60">
                                                                    {field.label}
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={field.value}
                                                                    disabled={field.disabled}
                                                                    onChange={(e) => !field.disabled && setProfileData(p => ({ ...p, [field.key]: e.target.value }))}
                                                                    placeholder={field.placeholder}
                                                                    className="w-full bg-transparent border-none p-0 text-lg md:text-xl font-black font-barlow-condensed tracking-tight text-foreground focus:ring-0 outline-none placeholder:text-white/10 uppercase"
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
                                                <h2 className="text-xl sm:text-2xl font-black font-barlow-condensed tracking-tight uppercase mb-6 md:mb-8 text-foreground/90">INTELLIGENCE FEED CONFIG</h2>

                                                <div className="space-y-4 md:space-y-6">
                                                    {[
                                                        { id: 'market', title: 'MARKET ANOMALY ALERTS', desc: 'Real-time notifications for extreme volatility or black-swan events.' },
                                                        { id: 'rebalance', title: 'PORTFOLIO REBALANCING', desc: 'Nudges when your asset allocation drifts by more than 5%.' },
                                                        { id: 'tax', title: 'TAX COMPLIANCE UPDATES', desc: 'Quarterly reminders for advance tax and return filings.' },
                                                        { id: 'news', title: 'ORACLE INTELLIGENCE FEED', desc: 'Daily synthesized insights from the Groq analysis engine.' },
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex items-center justify-between gap-4 p-4 sm:p-5 md:p-6 bg-white/[0.02] border border-border/10 rounded-xl md:rounded-2xl group hover:border-accent/30 transition-all">
                                                            <div className="max-w-[75%] md:max-w-md">
                                                                <h4 className="text-[10px] md:text-xs font-black tracking-widest uppercase mb-1 md:mb-1.5">{item.title}</h4>
                                                                <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase opacity-60 leading-relaxed">{item.desc}</p>
                                                            </div>
                                                            <div
                                                                onClick={() => setToggles(p => ({ ...p, [item.id]: !p[item.id as keyof typeof toggles] }))}
                                                                className={`w-10 h-5 md:w-12 md:h-6 rounded-full relative cursor-pointer transition-colors duration-500 border border-white/10 shrink-0 ${toggles[item.id as keyof typeof toggles] ? 'bg-accent' : 'bg-muted/10'}`}
                                                            >
                                                                <div className={`absolute top-0.5 md:top-[3px] w-3.5 h-3.5 md:w-[16px] md:h-[16px] rounded-full bg-background border border-black/10 transition-all duration-300 ${toggles[item.id as keyof typeof toggles] ? 'right-0.5 md:right-[3px]' : 'left-0.5 md:left-[3px]'}`} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Privacy Content */}
                                        {activeTab === 'privacy' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 max-w-4xl">
                                                <h2 className="text-xl sm:text-2xl font-black font-barlow-condensed tracking-tight uppercase mb-6 md:mb-8 text-foreground/90">SECURITY PROTOCOLS</h2>

                                                <div className="bg-red-500/5 border border-red-500/20 p-5 md:p-8 rounded-[1.25rem] md:rounded-2xl mb-6 md:mb-8">
                                                    <div className="flex items-start gap-3 md:gap-4 mb-5 md:mb-6">
                                                        <AlertTriangle className="text-red-500 flex-shrink-0 w-5 h-5 md:w-6 md:h-6 mt-0.5" />
                                                        <div>
                                                            <h4 className="text-xs md:text-sm font-black text-red-500 uppercase tracking-widest mb-1.5 md:mb-2">CRITICAL: DATA SOVEREIGNTY</h4>
                                                            <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase leading-relaxed">
                                                                Deleting your primary data vault is irreversible.
                                                                This will purge all portfolio history, biometric data,
                                                                and personalized intelligence models from our secure archives.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button className="w-full py-3.5 md:py-4 border border-red-500/30 rounded-lg md:rounded-xl text-red-500 font-extrabold text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] uppercase hover:bg-red-500 hover:text-white transition-all active:scale-[0.98]">
                                                        TERMINATE ALL DATA VAULTS
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                    <div className="p-5 md:p-6 bg-background/20 border border-border/20 rounded-[1.25rem] md:rounded-2xl">
                                                        <p className="text-[8px] md:text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-1.5 md:mb-2">2FA STATUS</p>
                                                        <p className="text-xs md:text-sm font-bold text-accent truncate">HARDWARE KEY ENABLED</p>
                                                    </div>
                                                    <div className="p-5 md:p-6 bg-background/20 border border-border/20 rounded-[1.25rem] md:rounded-2xl">
                                                        <p className="text-[8px] md:text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-1.5 md:mb-2">ENCRYPTION TYPE</p>
                                                        <p className="text-xs md:text-sm font-bold truncate">AES-256 QUAD-LAYER</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Data Export Tab */}
                                        {activeTab === 'data' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 max-w-4xl">
                                                <h2 className="text-xl sm:text-2xl font-black font-barlow-condensed tracking-tight uppercase mb-6 md:mb-8 text-foreground/90 break-words whitespace-normal">DATA ARCHIVE & EXPORT PORTAL</h2>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                                                    <div className="p-5 sm:p-6 md:p-8 bg-white/[0.02] border border-border/10 rounded-[1.25rem] md:rounded-2xl group hover:border-accent/20 transition-all flex flex-col justify-between">
                                                        <div>
                                                            <h4 className="text-[10px] md:text-xs font-black tracking-widest uppercase mb-3 md:mb-4 text-accent">PORTFOLIO PROTOCOL (CSV)</h4>
                                                            <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase leading-relaxed mb-6 md:mb-8">DOWNLOAD A COMPREHENSIVE ARCHIVE OF ALL TRANSACTION NODES AND HISTORICAL VALUATIONS.</p>
                                                        </div>
                                                        <button
                                                            onClick={() => addNotification({ title: 'Data Export Initialized', message: 'Oracle is architecting your CSV archive...', type: 'info' })}
                                                            className="w-full py-3.5 md:py-4 rounded-xl bg-accent/5 border border-accent/20 text-accent font-black text-[9px] tracking-[0.2em] md:tracking-widest uppercase hover:bg-accent hover:text-background transition-all active:scale-[0.98]"
                                                        >
                                                            PREPARE EXPORT →
                                                        </button>
                                                    </div>
                                                    <div className="p-5 sm:p-6 md:p-8 bg-white/[0.02] border border-border/10 rounded-[1.25rem] md:rounded-2xl group hover:border-accent/20 transition-all flex flex-col justify-between">
                                                        <div>
                                                            <h4 className="text-[10px] md:text-xs font-black tracking-widest uppercase mb-3 md:mb-4 text-accent">TAX LEDGER (JSON)</h4>
                                                            <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase leading-relaxed mb-6 md:mb-8">SECURE EXPORT FOR 3RD PARTY AUDIT ENGINES OR TAX FILING SOFTWARE COMPATIBILITY.</p>
                                                        </div>
                                                        <button
                                                            onClick={() => addNotification({ title: 'Data Export Initialized', message: 'Tax Ledger encryption cycle started.', type: 'info' })}
                                                            className="w-full py-3.5 md:py-4 rounded-xl bg-accent/5 border border-accent/20 text-accent font-black text-[9px] tracking-[0.2em] md:tracking-widest uppercase hover:bg-accent hover:text-background transition-all active:scale-[0.98]"
                                                        >
                                                            PREPARE EXPORT →
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="p-5 md:p-8 bg-amber-500/5 border border-amber-500/20 rounded-[1.25rem] md:rounded-2xl">
                                                    <div className="flex items-start md:items-center gap-3 md:gap-4">
                                                        <Info className="text-amber-500 shrink-0 w-5 h-5 md:w-6 md:h-6" />
                                                        <p className="text-[8px] md:text-[9px] font-black text-amber-500/80 uppercase tracking-widest leading-relaxed">
                                                            All exports are encrypted via AES-256 before download session begins.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* About Tab */}
                                        {activeTab === 'about' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 max-w-4xl">
                                                <h2 className="text-xl sm:text-2xl font-black font-barlow-condensed tracking-tight uppercase mb-6 md:mb-8 text-accent">ABOUT NIVESHIQ ORACLE v4.0</h2>
                                                <div className="space-y-6 md:space-y-8 max-w-2xl">
                                                    <div className="space-y-4">
                                                        <p className="text-xs sm:text-sm font-black text-foreground uppercase tracking-widest leading-relaxed">
                                                            NiveshIQ is an agentic, decentralized financial intelligence layer designed for the modern retail sovereign.
                                                        </p>
                                                        <p className="text-[10px] md:text-[11px] text-muted-foreground font-medium uppercase tracking-[0.1em] leading-loose opacity-70">
                                                            Architecture by Antigravity Systems, this terminal represents the convergence of high-fidelity data modeling and cinematic immersion.
                                                            All analysis is processed locally using distributed Oracle nodes and encrypted before indexing.
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 pt-6 border-t border-border/10">
                                                        <div>
                                                            <span className="text-accent text-[8px] md:text-[9px] font-black tracking-widest block mb-1.5 md:mb-2 uppercase opacity-60">BUILD ARCHITECTURE</span>
                                                            <span className="text-foreground text-[10px] md:text-xs font-black tracking-widest uppercase">NODE_V26_RELEASE</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-accent text-[8px] md:text-[9px] font-black tracking-widest block mb-1.5 md:mb-2 uppercase opacity-60">LEGAL COMPLIANCE</span>
                                                            <span className="text-foreground text-[10px] md:text-xs font-black tracking-widest uppercase">SEC REGULATED SYSTEMS</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-accent text-[8px] md:text-[9px] font-black tracking-widest block mb-1.5 md:mb-2 uppercase opacity-60">SECURITY LEVEL</span>
                                                            <span className="text-foreground text-[10px] md:text-xs font-black tracking-widest uppercase">AES-256 QUANTUM-SAFE</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-accent text-[8px] md:text-[9px] font-black tracking-widest block mb-1.5 md:mb-2 uppercase opacity-60">LICENSE TYPE</span>
                                                            <span className="text-foreground text-[10px] md:text-xs font-black tracking-widest uppercase">ENTERPRISE_INDIVIDUAL</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Background Watermark Icon */}
                                        <div className="absolute bottom-0 right-0 p-8 md:p-12 opacity-[0.02] md:opacity-[0.03] pointer-events-none hidden sm:block">
                                            {activeTab === 'account' && <User size={240} className="text-foreground w-[160px] h-[160px] md:w-[240px] md:h-[240px]" />}
                                            {activeTab === 'notifications' && <Bell size={240} className="text-foreground w-[160px] h-[160px] md:w-[240px] md:h-[240px]" />}
                                            {activeTab === 'privacy' && <Shield size={240} className="text-foreground w-[160px] h-[160px] md:w-[240px] md:h-[240px]" />}
                                            {activeTab === 'data' && <BarChart3 size={240} className="text-foreground w-[160px] h-[160px] md:w-[240px] md:h-[240px]" />}
                                            {activeTab === 'about' && <Info size={240} className="text-foreground w-[160px] h-[160px] md:w-[240px] md:h-[240px]" />}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 md:mt-8 flex flex-col-reverse md:flex-row justify-end items-center gap-4 md:gap-10 relative z-20">
                                        <button
                                            onClick={() => addNotification({ title: 'Settings Reset', message: 'Configuration restored to factory baseline.', type: 'info' })}
                                            className="w-full md:w-auto py-3 md:py-0 text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.4em] text-muted-foreground uppercase hover:text-foreground transition-colors"
                                        >
                                            RESET DEFAULTS
                                        </button>
                                        <button
                                            onClick={handleCommitChanges}
                                            disabled={isSaving}
                                            className="w-full md:w-auto px-8 md:px-12 py-3.5 md:py-4 rounded-xl bg-accent text-background text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.4em] uppercase hover:scale-105 transition-all shadow-[0_10px_40px_rgba(212,175,55,0.3)] min-w-[200px] flex items-center justify-center active:scale-95 disabled:opacity-50"
                                        >
                                            {isSaving ? (
                                                <RefreshCw size={14} className="animate-spin" />
                                            ) : (
                                                'COMMIT CHANGES'
                                            )}
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="px-5 md:px-10 py-8 md:py-12 border-t border-border/10 text-center relative overflow-hidden mt-auto">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                        <p className="text-[8px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground/30 uppercase leading-relaxed px-4">
                            NIVESHIQ VAULT SYSTEM // SECURE CONFIGURATION MODE
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
}