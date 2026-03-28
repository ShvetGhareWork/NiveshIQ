'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface SIPWaterfallProps {
    data: any[];
}

export const SIPWaterfall = ({ data }: SIPWaterfallProps) => {
    return (
        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '900', letterSpacing: '0.1em' }} 
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '900', letterSpacing: '0.1em' }} 
                        width={40}
                    />
                    <Tooltip 
                        cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} 
                        contentStyle={{ 
                            backgroundColor: 'rgba(20, 20, 20, 0.8)', 
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(20px)',
                            padding: '12px'
                        }} 
                        itemStyle={{ fontSize: 10, fontWeight: '900', textTransform: 'uppercase' }}
                    />
                    <Bar 
                        dataKey="amount" 
                        radius={[8, 8, 8, 8]} 
                        barSize={60}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
