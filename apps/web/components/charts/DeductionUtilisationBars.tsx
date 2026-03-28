'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DeductionProps {
    data: any[];
}

export const DeductionUtilisationBars = ({ data }: DeductionProps) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-full h-[320px]" />;

    return (
        <div className="w-full h-[320px] font-barlow-condensed group">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ left: 0, right: 40, top: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#F59E0B" stopOpacity={1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="8 8" horizontal={false} stroke="rgba(255, 255, 255, 0.03)" />
                    <XAxis
                        type="number"
                        hide
                        domain={[0, 100]}
                    />
                    <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '900', letterSpacing: '0.15em' }}
                        width={60}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                        content={<CustomTooltip />}
                        wrapperStyle={{ outline: 'none' }}
                    />
                    {/* Background Bar (Track) */}
                    <Bar
                        dataKey={() => 100}
                        fill="rgba(255, 255, 255, 0.03)"
                        radius={[8, 8, 8, 8]}
                        barSize={24}
                        xAxisId={0}
                    />
                    {/* Actual Value Bar */}
                    <Bar
                        dataKey="used"
                        radius={[8, 8, 8, 8]}
                        barSize={24}
                        label={{
                            position: 'right',
                            fill: 'rgba(245, 158, 11, 0.8)',
                            fontSize: 10,
                            fontWeight: '900',
                            formatter: (val: number) => `${Math.round(val)}%`,
                            dx: 15
                        }}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill="url(#progressGradient)"
                                className="transition-all duration-500 hover:brightness-125 cursor-pointer"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const entry = payload[0].payload;
        const formatCurrency = (val: number) => 
            new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

        return (
            <div className="bg-[#0A0F1E]/95 border border-white/10 rounded-2xl p-5 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-amber-500/30">
                <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase mb-2 opacity-50">
                    Section {label} Protocol
                </p>
                <div className="space-y-3">
                    <div className="flex justify-between items-baseline gap-8">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Utilized</span>
                        <span className="text-xl font-black text-white tracking-tighter">
                            {formatCurrency(entry.amount)}
                        </span>
                    </div>
                    <div className="flex justify-between items-baseline gap-8">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Limit</span>
                        <span className="text-sm font-black text-muted-foreground tracking-tight opacity-60">
                            {formatCurrency(entry.limit)}
                        </span>
                    </div>
                </div>
                {entry.used < 100 && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <p className="text-[9px] font-black text-rose-500/80 uppercase tracking-widest">
                            {formatCurrency(entry.limit - entry.amount)} Gap Identified
                        </p>
                    </div>
                )}
            </div>
        );
    }
    return null;
};


