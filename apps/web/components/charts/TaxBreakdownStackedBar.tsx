'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TaxBreakdownProps {
    data: any[];
}

export const TaxBreakdownStackedBar = ({ data }: TaxBreakdownProps) => {
    return (
        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis 
                        type="number" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '900', letterSpacing: '0.1em' }} 
                    />
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '900', letterSpacing: '0.1em' }} 
                        width={60}
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
                    <Legend 
                        verticalAlign="top" 
                        align="right" 
                        wrapperStyle={{ fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: 20 }}
                    />
                    <Bar dataKey="LTCG" stackId="a" fill="#D4AF37" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="STCG" stackId="a" fill="rgba(212, 175, 55, 0.4)" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Income" stackId="a" fill="rgba(255, 255, 255, 0.1)" radius={[0, 8, 8, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
