'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-card/50 border border-white/5 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl overflow-hidden shadow-black/50"
                    >
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                                    <AlertCircle size={24} />
                                </div>
                                <h3 className="text-2xl font-black font-barlow-condensed tracking-tight uppercase leading-tight">
                                    {title}
                                </h3>
                            </div>

                            <p className="text-muted-foreground text-xs font-black tracking-widest uppercase mb-10 leading-relaxed opacity-70">
                                {message}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 py-4 bg-accent text-background rounded-xl font-black text-[10px] tracking-[0.2em] uppercase hover:scale-[1.02] transition-all active:scale-95 shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
                                >
                                    Erase Node
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-white/5 border border-white/10 text-foreground rounded-xl font-black text-[10px] tracking-[0.2em] uppercase hover:bg-white/10 transition-all active:scale-95"
                                >
                                    Abort
                                </button>
                            </div>
                        </div>

                        {/* Decoration */}
                        <div className="absolute bottom-4 right-4 opacity-5 pointer-events-none select-none">
                            <p className="text-[8px] font-black tracking-[0.5em] uppercase">SYSTEM.CMD.ERASE</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
