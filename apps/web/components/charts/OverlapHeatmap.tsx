'use client';

import React, { useMemo, useState } from 'react';

interface OverlapHeatmapProps {
    data: { fundA: string; fundB: string; overlap: number }[];
}

export const OverlapHeatmap = ({ data }: OverlapHeatmapProps) => {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [hoveredCol, setHoveredCol] = useState<number | null>(null);

    const funds = useMemo(() => {
        const uniqueFunds = new Set<string>();
        data.forEach(item => {
            uniqueFunds.add(item.fundA);
            uniqueFunds.add(item.fundB);
        });
        return Array.from(uniqueFunds);
    }, [data]);

    const overlapMap = useMemo(() => {
        const map: Record<string, number> = {};
        data.forEach(item => {
            map[`${item.fundA}-${item.fundB}`] = item.overlap;
            map[`${item.fundB}-${item.fundA}`] = item.overlap;
        });
        return map;
    }, [data]);

    const getCellStyles = (overlap: number | undefined, isDiagonal: boolean, isFocused: boolean) => {
        if (isDiagonal) return { 
            bg: 'bg-white/5 opacity-10', 
            text: 'text-white/20', 
            glow: 'none' 
        };
        if (overlap === undefined) return { 
            bg: 'bg-white/[0.02]', 
            text: 'text-white/10', 
            glow: 'none' 
        };

        if (overlap < 30) return { 
            bg: 'bg-emerald-500/10 border-emerald-500/20', 
            text: 'text-emerald-400',
            glow: isFocused ? 'shadow-[0_0_20px_rgba(52,211,153,0.3)]' : 'none'
        };
        if (overlap < 60) return { 
            bg: 'bg-amber-500/10 border-amber-500/20', 
            text: 'text-amber-400',
            glow: isFocused ? 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'none'
        };
        return { 
            bg: 'bg-rose-500/10 border-rose-500/20', 
            text: 'text-rose-400',
            glow: isFocused ? 'shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'none'
        };
    };

    return (
        <div className="w-full flex flex-col font-barlow-condensed group">
            <div className="relative overflow-x-auto pb-8 scrollbar-hide">
                <table className="border-separate border-spacing-3 mx-auto">
                    <thead>
                        <tr>
                            <th className="w-40 min-w-[160px]"></th>
                            {funds.map((fund, i) => (
                                <th key={i} className="h-40 align-bottom pb-8 relative group/th">
                                    <div className={`
                                        rotate-[-45deg] origin-bottom-left text-[10px] font-black tracking-widest uppercase transition-all duration-300
                                        ${hoveredCol === i ? 'text-accent scale-110' : 'text-muted-foreground opacity-60'}
                                    `}>
                                        {fund}
                                    </div>
                                    {hoveredCol === i && (
                                        <div className="absolute inset-x-0 bottom-0 top-[160px] bg-white/[0.02] -z-10 rounded-t-2xl border-x border-t border-white/5" />
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody onMouseLeave={() => { setHoveredRow(null); setHoveredCol(null); }}>
                        {funds.map((fundA, rowIndex) => (
                            <tr key={rowIndex} onMouseEnter={() => setHoveredRow(rowIndex)}>
                                <td className={`
                                    text-right pr-10 py-4 text-[11px] font-black tracking-widest uppercase whitespace-nowrap transition-all duration-300 relative
                                    ${hoveredRow === rowIndex ? 'text-accent scale-105' : 'text-muted-foreground opacity-60'}
                                `}>
                                    {fundA}
                                    {hoveredRow === rowIndex && (
                                        <div className="absolute inset-y-0 right-0 left-[-1000px] bg-white/[0.02] -z-10 rounded-l-2xl border-y border-l border-white/5" />
                                    )}
                                </td>
                                {funds.map((fundB, colIndex) => {
                                    const isDiagonal = rowIndex === colIndex;
                                    const overlap = overlapMap[`${fundA}-${fundB}`];
                                    const isFocused = hoveredRow === rowIndex && hoveredCol === colIndex;
                                    const styles = getCellStyles(overlap, isDiagonal, isFocused);

                                    return (
                                        <td
                                            key={colIndex}
                                            onMouseEnter={() => setHoveredCol(colIndex)}
                                            className={`
                                                w-24 h-20 rounded-2xl transition-all duration-500 cursor-crosshair relative border backdrop-blur-3xl overflow-hidden
                                                ${styles.bg} ${styles.glow}
                                                ${isFocused ? 'scale-110 z-20 border-white/30' : 'border-white/5 opacity-80'}
                                                ${hoveredRow === rowIndex || hoveredCol === colIndex ? 'opacity-100' : 'opacity-40 grayscale-[0.5]'}
                                            `}
                                        >
                                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                                            
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <span className={`text-lg font-black tracking-tighter ${styles.text}`}>
                                                    {isDiagonal ? '—' : `${Math.round(overlap || 0)}%`}
                                                </span>
                                                {!isDiagonal && isFocused && (
                                                    <span className="text-[8px] font-black tracking-[0.2em] text-white/40 uppercase absolute bottom-2">Correlation</span>
                                                )}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Scale & Analysis HUD */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-end px-4">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black tracking-[0.4em] text-muted-foreground uppercase opacity-60">Correlation Topology Spectrum</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-[9px] font-black tracking-[0.2em] text-rose-500 uppercase">Concentration Risk Active</span>
                        </div>
                    </div>
                    <div className="h-4 w-full rounded-full bg-white/5 p-1 flex">
                        <div className="h-full w-[33%] rounded-l-full bg-emerald-500/40 border-r border-white/10" />
                        <div className="h-full w-[33%] bg-amber-500/40 border-r border-white/10" />
                        <div className="h-full w-[34%] rounded-r-full bg-rose-500/40" />
                        <div className="absolute inset-y-0 w-full flex justify-between px-4 pointer-events-none">
                            <span className="text-[8px] font-black text-white/40 leading-2 pt-0.5">SAFE</span>
                            <span className="text-[8px] font-black text-white/40 leading-2 pt-0.5">MODERATE</span>
                            <span className="text-[8px] font-black text-white/40 leading-2 pt-0.5">CRITICAL</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.03] border-l-4 border-amber-500/40 p-6 rounded-r-3xl backdrop-blur-2xl">
                    <p className="text-[11px] font-bold tracking-wide leading-relaxed text-muted-foreground uppercase opacity-80">
                        <span className="text-white">Heuristic Analysis:</span> Multi-fund correlation identified in Top 5 holdings. Portfolio redundancy currently reducing alpha efficiency by ~400bps. Deployment of unique strategic assets recommended.
                    </p>
                </div>
            </div>
        </div>
    );
};
