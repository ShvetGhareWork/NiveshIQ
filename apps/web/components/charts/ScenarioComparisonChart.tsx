'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ScenarioProps {
    data: any[];
}

export const ScenarioComparisonChart = ({ data }: ScenarioProps) => {
    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis 
                        dataKey="year" 
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
                        contentStyle={{ 
                            backgroundColor: 'rgba(20, 20, 20, 0.8)', 
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(20px)',
                            padding: '12px'
                        }} 
                        itemStyle={{ fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    />
                    <Legend 
                        verticalAlign="top" 
                        align="right" 
                        wrapperStyle={{ fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: 20 }}
                    />
                    <Line type="monotone" dataKey="current" stroke="#D4AF37" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="aggressive" stroke="#emerald-400" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    <Line type="monotone" dataKey="conservative" stroke="rgba(255, 255, 255, 0.1)" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
