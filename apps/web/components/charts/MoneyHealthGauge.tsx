'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MoneyHealthGaugeProps {
    score: number;
}

export const MoneyHealthGauge = ({ score }: MoneyHealthGaugeProps) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="h-[250px]" />;

    const data = [
        { value: score },
        { value: 100 - score }
    ];

    const COLORS = ['#D4AF37', 'rgba(212, 175, 55, 0.05)'];

    return (
        <div className="relative w-full h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius="75%"
                        outerRadius="100%"
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pt-8">
                <span className="text-6xl font-black font-barlow-condensed tracking-tighter text-foreground leading-none">
                    {score}
                </span>
                <span className="block text-[8px] font-black tracking-[0.4em] text-muted-foreground uppercase mt-2">
                    MONEY HEALTH
                </span>
            </div>
        </div>
    );
};
