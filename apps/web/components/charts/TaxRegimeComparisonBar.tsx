'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Rectangle } from 'recharts';

interface TaxComparisonProps {
    data: any[];
}

export const TaxRegimeComparisonBar = ({ data }: TaxComparisonProps) => {
    const isOldBetter = data[0].tax < data[1].tax;

    return (
        <div className="w-full h-[320px] flex flex-col font-barlow-condensed group">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 30, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="optimalGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#F59E0B" stopOpacity={1} />
                            <stop offset="100%" stopColor="#D97706" stopOpacity={0.8} />
                        </linearGradient>
                        <filter id="glow">
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
                        dy={15}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: '900', letterSpacing: '0.1em' }} 
                        width={45}
                        tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}K` : val}
                    />
                    <Tooltip 
                        cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} 
                        content={<CustomTooltip />}
                        wrapperStyle={{ outline: 'none' }}
                    />
                    <Bar 
                        dataKey="tax" 
                        barSize={64}
                        radius={[16, 16, 0, 0]}
                        shape={(props: any) => {
                            const { x, y, width, height, index } = props;
                            const isCheaper = (index === 0 && isOldBetter) || (index === 1 && !isOldBetter);
                            
                            return (
                                <g>
                                    <Rectangle 
                                        {...props} 
                                        fill={isCheaper ? 'url(#optimalGradient)' : 'rgba(255, 255, 255, 0.05)'} 
                                        stroke={isCheaper ? 'transparent' : 'rgba(255, 255, 255, 0.1)'}
                                        radius={[16, 16, 2, 2]} 
                                        filter={isCheaper ? 'url(#glow)' : 'none'}
                                        className="transition-all duration-500 hover:opacity-90"
                                    />
                                    {isCheaper && (
                                        <text
                                            x={x + width / 2}
                                            y={y - 15}
                                            textAnchor="middle"
                                            fill="#F59E0B"
                                            fontSize={10}
                                            fontWeight="900"
                                            letterSpacing="0.2em"
                                            className="uppercase animate-pulse"
                                        >
                                            Optimal
                                        </text>
                                    )}
                                </g>
                            );
                        }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const val = payload[0].value;
        const formatted = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);

        return (
            <div className="bg-[#0A0F1E]/95 border border-white/10 rounded-2xl p-5 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-amber-500/30">
                <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase mb-2 opacity-50">
                    {label} Track
                </p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white tracking-tighter">
                        {formatted}
                    </span>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                        /YR
                    </span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <p className="text-[9px] font-black text-amber-500/80 uppercase tracking-widest">
                        Fiscal Liability Detected
                    </p>
                </div>
            </div>
        );
    }
    return null;
};


