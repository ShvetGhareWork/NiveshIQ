'use client';

import { Sparkles } from 'lucide-react';

interface AIBadgeProps {
    text?: string;
}

export function AIBadge({ text = 'AI Nudges' }: AIBadgeProps) {
    return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 shadow-[0_0_10px_rgba(212,175,55,0.1)] animate-pulse hover:animate-none transition-all cursor-default">
            <Sparkles size={12} className="text-accent" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest font-barlow-condensed">{text}</span>
        </div>
    );
}
