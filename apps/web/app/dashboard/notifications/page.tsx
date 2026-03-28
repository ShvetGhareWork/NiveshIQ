'use client';

import React from 'react';
import { 
    Bell, 
    CheckCheck, 
    Trash2, 
    ChevronRight, 
    Info, 
    CheckCircle2, 
    AlertTriangle, 
    AlertCircle,
    Inbox
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { DashboardSidebar } from '@/components/navigation/DashboardSidebar';
import { TopNav } from '@/components/navigation/TopNav';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function NotificationsPage() {
    const { user } = useAuth();
    const { notifications, markAsRead, deleteNotification, markAllAsRead, clearAllNotifications } = useNotifications();

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 size={18} className="text-emerald-400" />;
            case 'warning': return <AlertTriangle size={18} className="text-amber-400" />;
            case 'error': return <AlertCircle size={18} className="text-rose-400" />;
            default: return <Info size={18} className="text-blue-400" />;
        }
    };

    return (
        <div className="flex h-screen bg-[#0A0F1E] text-white overflow-hidden">
            <DashboardSidebar />
            
            <div className="flex-1 flex flex-col min-w-0">
                <TopNav 
                    userName={user?.name || 'Operator'}
                    customLinks={[
                        { label: 'INTEL FEED', href: '/dashboard/notifications', icon: <Bell size={12} /> },
                    ]}
                />
                
                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <div className="max-w-4xl mx-auto space-y-10">
                        
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20">
                                        <Bell className="text-accent" size={24} />
                                    </div>
                                    <h1 className="text-4xl font-black font-barlow-condensed tracking-normal uppercase italic">Intelligence Feed</h1>
                                </div>
                                <p className="text-[10px] font-black text-muted-foreground tracking-[0.5em] uppercase opacity-60">Centralized Oracle Event Repository</p>
                            </div>

                            {notifications.length > 0 && (
                                <div className="flex gap-4">
                                    <button 
                                        onClick={markAllAsRead}
                                        className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] tracking-widest text-white hover:bg-accent/10 hover:border-accent/30 transition-all hover:text-accent"
                                    >
                                        <CheckCheck size={16} />
                                        MUTE ALL NODES
                                    </button>
                                    <button 
                                        onClick={clearAllNotifications}
                                        className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl font-black text-[10px] tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                    >
                                        <Trash2 size={16} />
                                        PURGE ALL INTEL
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="space-y-4">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div 
                                        key={n.id}
                                        className={`group relative bg-[#111827] border rounded-[2rem] p-6 transition-all duration-300 ${!n.read ? 'border-accent/30 bg-accent/[0.02]' : 'border-white/5 opacity-80'}`}
                                    >
                                        <div className="flex items-start gap-5">
                                            <div className="shrink-0 mt-1">
                                                {getTypeIcon(n.type)}
                                            </div>
                                            
                                            <div className="flex-1 space-y-2 min-w-0">
                                                <div className="flex items-center justify-between gap-4">
                                                    <h3 className="text-lg font-black font-barlow-condensed tracking-normal uppercase leading-none truncate">
                                                        {n.title}
                                                    </h3>
                                                    <span className="text-[9px] font-black text-white/20 uppercase whitespace-nowrap">
                                                        {new Date(n.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                                
                                                <p className="text-[11px] md:text-sm font-bold text-muted-foreground leading-relaxed italic uppercase tracking-normal">
                                                    {n.message}
                                                </p>

                                                {n.link && (
                                                    <Link 
                                                        href={n.link}
                                                        className="inline-flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest hover:translate-x-1 transition-transform pt-2"
                                                    >
                                                        Access Node <ChevronRight size={12} />
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2 shrink-0">
                                                {!n.read && (
                                                    <button 
                                                        onClick={() => markAsRead(n.id)}
                                                        className="p-2 bg-accent/10 text-accent rounded-xl border border-accent/20 hover:bg-accent hover:text-background transition-all"
                                                        title="Mark as Read"
                                                    >
                                                        <CheckCheck size={16} />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => deleteNotification(n.id)}
                                                    className="p-2 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                    title="Purge Intelligence"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-[#111827] border border-dashed border-white/5 rounded-[3rem] p-20 flex flex-col items-center justify-center gap-6 text-center">
                                    <div className="p-6 bg-white/5 rounded-full">
                                        <Inbox size={48} className="text-muted-foreground/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black font-barlow-condensed tracking-normal uppercase text-white/40">Oracle Feed Empty</h3>
                                        <p className="text-[10px] font-black text-muted-foreground/20 tracking-[0.5em] uppercase">No intelligence nodes active at this time</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
