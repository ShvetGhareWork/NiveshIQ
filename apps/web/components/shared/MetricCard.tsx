'use client';

import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Shield } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string | number | ReactNode;
    icon?: ReactNode;
    trend?: 'up' | 'down' | null;
    trendValue?: string;
    description?: string;
    isHighlight?: boolean;
    children?: ReactNode;
}

export function MetricCard({
    label,
    value,
    icon,
    trend,
    trendValue,
    description,
    isHighlight = false,
    children,
}: MetricCardProps) {
    return (
        <div className={`
            relative overflow-hidden group p-8 rounded-[2rem] border transition-all duration-700
            ${isHighlight 
                ? 'bg-accent/10 border-accent/30 shadow-[0_0_50px_rgba(245,158,11,0.1)]' 
                : 'bg-card/30 backdrop-blur-2xl border-white/5 hover:border-white/20 shadow-2xl'}
        `}>
            {/* 1. Matrix/Scanline Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-scan" />

            {/* 2. Glass Shine Effect */}
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shine transition-all duration-1000" />

            {/* 3. Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20 rounded-tl-[2rem]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20 rounded-br-[2rem]" />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black tracking-[0.4em] text-muted-foreground uppercase opacity-60">
                                {label}
                            </span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] font-black text-emerald-500 tracking-widest uppercase">Verified</span>
                            </div>
                        </div>
                        {icon && (
                            <div className="text-accent/60 group-hover:text-accent transition-colors duration-500 group-hover:scale-125 transform transition-all group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                                {icon}
                            </div>
                        )}
                    </div>

                    <div className="flex items-baseline gap-2 mb-4">
                        <h2 className="text-4xl font-black font-barlow-condensed tracking-tighter text-white group-hover:scale-[1.02] transition-transform origin-left duration-500">
                            {value}
                        </h2>
                    </div>
                </div>

                <div className="space-y-4">
                    {trend && trendValue && (
                        <div className={`
                            inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border
                            ${trend === 'up' 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}
                        `}>
                            {trend === 'up' ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{trendValue} Velocity</span>
                        </div>
                    )}

                    {description && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-bold uppercase tracking-wide opacity-50 group-hover:opacity-80 transition-opacity">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {children && <div className="mt-8 relative z-10">{children}</div>}
        </div>
    );
}
