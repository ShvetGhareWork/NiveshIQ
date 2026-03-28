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
                <div className="bg-[#111827]/95 border border-white/10 p-3 md:p-4 rounded-xl shadow-2xl backdrop-blur-xl">
                    <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                        {new Date(label).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <div className="space-y-1">
                        <div className="flex justify-between gap-6 md:gap-8">
                            <span className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase">Close</span>
                            <span className="text-xs md:text-sm font-black text-white">{formatCurrency(d.close)}</span>
                        </div>
                        <div className="flex justify-between gap-6 md:gap-8">
                            <span className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase">Open</span>
                            <span className="text-[9px] md:text-[10px] font-bold text-white/60">{formatCurrency(d.open)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const periods = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'];

    return (
        <div className="bg-[#111827] border border-white/5 rounded-3xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 relative overflow-hidden group">
            {/* Background Grain */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 relative z-10">
                <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black font-barlow-condensed tracking-tight text-white uppercase italic">Performance Vector</h3>
                    <p className="text-[9px] md:text-[10px] font-black text-muted-foreground tracking-[0.2em] md:tracking-[0.3em] uppercase opacity-60">
                        {period} Intel Handshake
                    </p>
                </div>

                {/* Hide scrollbar with custom CSS logic embedded via Tailwind arbitrary variants, or simple overflow mapping */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl md:rounded-2xl border border-white/5 overflow-x-auto w-full lg:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {periods.map((p) => (
                        <button
                            key={p}
                            onClick={() => onPeriodChange(p.toLowerCase())}
                            className={`
                                flex-1 lg:flex-none px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black transition-all duration-300 tracking-widest
                                ${period === p.toLowerCase()
                                    ? 'bg-accent text-background shadow-[0_0_20px_rgba(212,175,55,0.3)] md:scale-105'
                                    : 'text-muted-foreground hover:text-white hover:bg-white/5'}
                            `}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[250px] sm:h-[300px] md:h-[400px] w-full relative group/chart">
                {loading && (
                    <div className="absolute inset-0 z-20 bg-background/20 backdrop-blur-sm flex items-center justify-center rounded-[1.5rem] md:rounded-[2rem]">
                        <div className="flex flex-col items-center gap-3 md:gap-4">
                            <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                            <span className="text-[7px] md:text-[8px] font-black text-accent tracking-[0.3em] md:tracking-[0.5em] uppercase">Recalculating...</span>
                        </div>
                    </div>
                )}

                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={Array.isArray(data) ? data : []} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isUp ? '#10B981' : '#F43F5E'} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={isUp ? '#10B981' : '#F43F5E'} stopOpacity={0} />
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
                            tick={{ fontSize: 9, fontWeight: 900, fill: 'rgba(255,255,255,0.4)' }}
                            axisLine={false}
                            tickLine={false}
                            width={40} // Explicit width prevents the right axis from clipping or jumping on mobile
                            tickFormatter={(val) => `₹${val > 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
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

            {/* Footer scales and stacks on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 text-[8px] md:text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.15em] md:tracking-[0.2em] relative z-10 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 md:gap-4">
                    <span>Precision Scale</span>
                    <div className="w-4 md:w-8 h-[1px] bg-white/10" />
                    <span>Real-Time Node</span>
                </div>
                <span>NiveshIQ Global Stream</span>
            </div>
        </div>
    );
}