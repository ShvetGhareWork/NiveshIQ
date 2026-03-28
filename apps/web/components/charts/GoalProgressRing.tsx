'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GoalRingProps {
    progress: number;
    label: string;
}

export const GoalProgressRing = ({ progress, label }: GoalRingProps) => {
    const data = [
        { value: progress },
        { value: 100 - progress }
    ];

    const COLORS = ['#D4AF37', 'rgba(255, 255, 255, 0.05)'];

    return (
        <div className="relative w-full h-[180px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="90%"
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={-270}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-3xl font-black font-barlow-condensed tracking-tighter text-foreground leading-none">
                    {progress}%
                </span>
                <span className="block text-[7px] font-black tracking-[0.3em] text-muted-foreground uppercase mt-1">
                    {label}
                </span>
            </div>
        </div>
    );
};
