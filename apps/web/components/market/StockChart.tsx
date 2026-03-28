'use client';

import React, { useState, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';

interface HistoryPoint {
    date: string;
    close: number;
    open: number;
    high: number;
    low: number;
}

interface StockChartProps {
    data: HistoryPoint[];
    period: string;
    onPeriodChange: (p: string) => void;
    loading?: boolean;
}

export function StockChart({ data, period, onPeriodChange, loading }: StockChartProps) {
    const isUp = useMemo(() => {
        if (!data || data.length < 2 || !data[0] || !data[data.length - 1]) return true;
        return (data[data.length - 1].close || 0) >= (data[0].close || 0);
    }, [data]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div className="bg-[#111827] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                        {new Date(label).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <div className="space-y-1">
                        <div className="flex justify-between gap-8">
                            <span className="text-[10px] font-bold text-white/40 uppercase">Close</span>
                            <span className="text-sm font-black text-white">{formatCurrency(d.close)}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                            <span className="text-[10px] font-bold text-white/40 uppercase">Open</span>
                            <span className="text-[10px] font-bold text-white/60">{formatCurrency(d.open)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const periods = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'];

    return (
        <div className="bg-[#111827] border border-white/5 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group">
            {/* Background Grain */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black font-barlow-condensed tracking-tight text-white uppercase italic">Performance Vector</h3>
                    <p className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase opacity-60">
                        {period} Intel Handshake
                    </p>
                </div>

                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/5">
                    {periods.map((p) => (
                        <button
                            key={p}
                            onClick={() => onPeriodChange(p.toLowerCase())}
                            className={`
                                px-4 py-2 rounded-xl text-[10px] font-black transition-all duration-300 tracking-widest
                                ${period === p.toLowerCase() 
                                    ? 'bg-accent text-background shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-105' 
                                    : 'text-muted-foreground hover:text-white hover:bg-white/5'}
                            `}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[400px] w-full relative group/chart">
                {loading && (
                    <div className="absolute inset-0 z-20 bg-background/20 backdrop-blur-sm flex items-center justify-center rounded-[2rem]">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                            <span className="text-[8px] font-black text-accent tracking-[0.5em] uppercase">Recalculating...</span>
                        </div>
                    </div>
                )}
                
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={Array.isArray(data) ? data : []}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isUp ? '#10B981' : '#F43F5E'} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={isUp ? '#10B981' : '#F43F5E'} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            hide 
                        />
                        <YAxis 
                            domain={['auto', 'auto']}
                            orientation="right"
                            tick={{ fontSize: 10, fontWeight: 900, fill: 'rgba(255,255,255,0.2)' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(val) => `₹${val > 1000 ? (val/1000).toFixed(1)+'k' : val}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="close" 
                            stroke={isUp ? '#10B981' : '#F43F5E'} 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorPrice)" 
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] relative z-10">
                <div className="flex items-center gap-4">
                    <span>Precision Scale</span>
                    <div className="w-8 h-[1px] bg-white/10" />
                    <span>Real-Time Node</span>
                </div>
                <span>NiveshIQ Global Stream</span>
            </div>
        </div>
    );
}
