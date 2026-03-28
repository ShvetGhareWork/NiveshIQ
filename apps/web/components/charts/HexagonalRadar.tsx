'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface HexagonalRadarProps {
    data: any[];
}

export const HexagonalRadar = ({ data }: HexagonalRadarProps) => {
    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="rgba(212, 175, 55, 0.1)" strokeWidth={0.5} />
                    <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 9, fontWeight: '900', letterSpacing: '0.1em' }} 
                    />
                    <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={false} 
                        axisLine={false} 
                    />
                    <Radar
                        name="Portfolio"
                        dataKey="A"
                        stroke="#D4AF37"
                        fill="#D4AF37"
                        fillOpacity={0.2}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
