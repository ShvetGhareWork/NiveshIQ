'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ExpenseDragProps {
    data: { year: string; direct: number; regular: number }[];
}

export const ExpenseRatioDragChart = ({ data }: ExpenseDragProps) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-full h-[250px] sm:h-[300px] md:h-[350px]" />;

    // Calculate final metrics from the last data point
    const lastPoint = data[data.length - 1];
    const projectedDrag = lastPoint ? lastPoint.regular : 9361;
    const switchAdvantage = "~42% COMPOUNDED";

    // Formatter to prevent long Y-axis numbers from clipping on mobile
    const formatYAxis = (value: number) => {
        if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
        return value.toString();
    };

    return (
        <div className="w-full flex flex-col font-barlow-condensed group">
            {/* 1. Responsive Chart Wrapper: Adjusts height based on screen size */}
            <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="4 4"
                            vertical={false}
                            stroke="rgba(255, 255, 255, 0.05)"
                        />
                        <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '900', letterSpacing: '0.05em' }}
                            dy={15}
                            // Add minTickGap to prevent x-axis labels from overlapping on small screens
                            minTickGap={20}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '900', letterSpacing: '0.05em' }}
                            width={40}
                            tickFormatter={formatYAxis}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(20, 20, 20, 0.95)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                backdropFilter: 'blur(30px)',
                                padding: '12px md:padding-16px', // Slightly tighter padding on mobile
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}
                            wrapperStyle={{ outline: 'none' }}
                        />
                        {/* Higher curve (Regular) */}
                        <Area
                            type="monotone"
                            dataKey="regular"
                            stroke="#334155"
                            strokeWidth={3}
                            fill="transparent"
                            dot={false}
                            activeDot={{ r: 4, stroke: "#334155", strokeWidth: 2, fill: "#0f172a" }}
                        />
                        {/* Lower curve (Direct) */}
                        <Area
                            type="monotone"
                            dataKey="direct"
                            stroke="#F59E0B"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorDirect)"
                            dot={false}
                            activeDot={{ r: 6, stroke: "#F59E0B", strokeWidth: 2, fill: "#0f172a" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* 2. Responsive Grid: Stacks on mobile (cols-1), side-by-side on sm+ screens */}
            <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pb-2">
                <div className="bg-[#141B2D] border border-white/5 rounded-[1.25rem] md:rounded-3xl p-5 md:p-8 hover:bg-[#1A2235] transition-all group/card shadow-2xl">
                    <p className="text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase mb-2 md:mb-3 opacity-60">
                        PROJECTED DRAG (20YR)
                    </p>
                    {/* 3. Responsive Typography: Scales fluidly from small to large screens */}
                    <p className="text-2xl sm:text-3xl md:text-4xl font-black font-barlow-condensed text-rose-500 tracking-tighter">
                        ₹{projectedDrag.toLocaleString('en-IN')}
                    </p>
                </div>
                <div className="bg-[#141B2D] border border-white/5 rounded-[1.25rem] md:rounded-3xl p-5 md:p-8 hover:bg-[#1A2235] transition-all group/card shadow-2xl">
                    <p className="text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase mb-2 md:mb-3 opacity-60">
                        SWITCH ADVANTAGE
                    </p>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-black font-barlow-condensed text-emerald-500 tracking-tighter">
                        {switchAdvantage}
                    </p>
                </div>
            </div>
        </div>
    );
};