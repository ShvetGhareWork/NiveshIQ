'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
    data: number[];
}

export const Sparkline = ({ data }: SparklineProps) => {
    const chartData = data.map((val, i) => ({ val, i }));
    return (
        <div className="w-16 h-6">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <Line 
                        type="monotone" 
                        dataKey="val" 
                        stroke="#D4AF37" 
                        strokeWidth={2} 
                        dot={false} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
