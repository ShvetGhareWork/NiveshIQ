'use client';

import React, { useState, useEffect } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer
} from 'recharts';

interface XirrvsBenchmarkLineProps {
    data: any[];
}

export const XirrvsBenchmarkLine = ({ data }: XirrvsBenchmarkLineProps) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-full h-[400px]" />;

    return (
        <div className="w-full h-[400px] font-barlow-condensed group">
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                        </linearGradient>
                        <filter id="lineGlow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <CartesianGrid 
                        strokeDasharray="8 8" 
                        vertical={false} 
                        stroke="rgba(255, 255, 255, 0.03)" 
                    />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '900', letterSpacing: '0.15em' }} 
                        padding={{ left: 20, right: 20 }}
                        dy={15}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: '900', letterSpacing: '0.1em' }} 
                        width={45}
                        tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip 
                        cursor={{ stroke: 'rgba(245, 158, 11, 0.2)', strokeWidth: 1 }} 
                        content={<CustomTooltip />}
                        wrapperStyle={{ outline: 'none' }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="benchmark" 
                        stroke="rgba(255, 255, 255, 0.2)" 
                        strokeWidth={2} 
                        strokeDasharray="5 5"
                        fill="url(#colorBenchmark)" 
                        dot={false}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="portfolio" 
                        stroke="#F59E0B" 
                        strokeWidth={4} 
                        fill="url(#colorPortfolio)" 
                        filter="url(#lineGlow)"
                        dot={false}
                        activeDot={{ r: 8, fill: '#F59E0B', stroke: '#000', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0A0F1E]/95 border border-white/10 rounded-2xl p-5 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-amber-500/30 min-w-[180px]">
                <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase mb-4 opacity-50">
                    Temporal Benchmark Analysis
                </p>
                
                <div className="space-y-4">
                    {/* Portfolio */}
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[9px] font-black text-amber-500 uppercase tracking-widest">
                            <span>Orbital Alpha (XIRR)</span>
                        </div>
                        <div className="text-xl font-black text-white tracking-tighter">
                            {payload[1].value.toFixed(2)}%
                        </div>
                    </div>

                    {/* Benchmark */}
                    <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
                        <div className="flex justify-between items-center text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                            <span>S&P BSE SENSEX</span>
                        </div>
                        <div className="text-lg font-black text-white/60 tracking-tighter">
                            {payload[0].value.toFixed(2)}%
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Absolute Outperformance Detected
                </div>
            </div>
        );
    }
    return null;
};

