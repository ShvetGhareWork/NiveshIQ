'use client';

import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

interface PortfolioTreemapProps {
    data: any[];
}

export const PortfolioTreemap = ({ data }: PortfolioTreemapProps) => {
    return (
        // 1. Adaptive Height: Scales from 300px on mobile to 500px on desktop
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] font-barlow-condensed group relative">
            <ResponsiveContainer width="100%" height="100%">
                <Treemap
                    data={data}
                    dataKey="size"
                    nameKey="name"
                    stroke="transparent" // Removed default black stroke for a cleaner look
                    content={(props) => <CustomContent {...props} />}
                >
                    {/* 2. Custom Tooltip: Essential for mobile when boxes are too small for labels */}
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 }} />
                </Treemap>
            </ResponsiveContainer>
        </div>
    );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[#141B2D]/95 border border-white/10 rounded-2xl p-4 backdrop-blur-xl shadow-2xl pointer-events-none">
                <p className="text-[10px] sm:text-xs font-black tracking-[0.2em] text-muted-foreground uppercase mb-1">
                    {data.name.replace('Sector: ', '')}
                </p>
                <p className="text-xl sm:text-2xl font-black font-barlow-condensed text-amber-500 tracking-tighter">
                    {/* Assuming data.size is a percentage or value. Format as needed. */}
                    {data.size}
                </p>
            </div>
        );
    }
    return null;
};

const CustomContent = (props: any) => {
    const { x, y, width, height, name, depth } = props;

    // Only render the top-level categories (skip root if depth is 0, or deeply nested items)
    if (depth !== 1) return null;

    // Cinematic colors matching your dark/amber theme
    const colors = [
        'rgba(245, 158, 11, 0.15)',
        'rgba(245, 158, 11, 0.08)',
        'rgba(245, 158, 11, 0.04)',
        'rgba(255, 255, 255, 0.03)',
    ];
    const fill = colors[props.index % colors.length];

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={fill}
                stroke="white"
                strokeOpacity={0.05}
                strokeWidth={1}
                rx={8} // Slightly reduced border-radius for cleaner packing on mobile
                ry={8}
                className="transition-all duration-300 hover:fill-[#F59E0B]/30 cursor-pointer"
            />

            {/* 3. Lowered threshold slightly so more labels appear on mobile */}
            {width > 60 && height > 35 && (
                // pointerEvents: 'none' ensures the text doesn't block the Tooltip hover/tap triggers
                <foreignObject x={x} y={y} width={width} height={height} style={{ pointerEvents: 'none' }}>
                    <div className="w-full h-full flex items-center justify-center p-1.5 sm:p-2 text-center overflow-hidden">
                        {/* Added line-clamp-2 to prevent text from overflowing the box vertically */}
                        <span className="text-[9px] sm:text-xs font-black text-white/80 uppercase tracking-widest leading-tight line-clamp-2">
                            {name.replace('Sector: ', '')}
                        </span>
                    </div>
                </foreignObject>
            )}
        </g>
    );
};