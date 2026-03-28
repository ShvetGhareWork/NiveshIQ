'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calculator, Building2, Landmark, HeartPulse,
    PiggyBank, ShieldPlus, ChevronRight, Info,
    FileUp, CheckCircle2, AlertTriangle
} from 'lucide-react';
import type { TaxInput } from '@niveshiq/types';
import { API_BASE_URL } from '@/lib/api';

interface WizardFormProps {
    onCalculate: (input: TaxInput) => void;
    loading: boolean;
}

export const WizardForm = ({ onCalculate, loading }: WizardFormProps) => {
    const [formData, setFormData] = useState<TaxInput>({
        fy: "2024-25",
        grossSalary: 1800000,
        basicSalary: 720000,
        hra_received: 360000,
        rent_paid_monthly: 25000,
        city_metro: true,
        lta_received: 0,
        lta_claimed: 0,
        sec80C: 150000,
        sec80D_self: 15000,
        sec80D_parents: 0,
        sec80CCD1B: 0,
        sec80TTA: 5000,
        homeLoanInterest: 0,
        homeLoanPrincipal: 0,
        otherDeductions: 0,
        age: "below60"
    });

    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadStatus('idle');
        const token = localStorage.getItem('oracle_token');

        const formDataPayload = new FormData();
        formDataPayload.append('file', file);

        try {
            const res = await fetch(`${API_BASE_URL}/api/tax/upload-form16`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formDataPayload
            });

            const data = await res.json();
            if (data.success && data.data) {
                const extracted = data.data;
                setFormData(prev => ({
                    ...prev,
                    grossSalary: extracted.grossSalary || prev.grossSalary,
                    sec80C: extracted.deductions?.section80C || prev.sec80C,
                    sec80D_self: extracted.deductions?.section80D || prev.sec80D_self,
                    hra_received: extracted.deductions?.hraExemption || prev.hra_received,
                    sec80TTA: extracted.deductions?.section80TTA || prev.sec80TTA,
                    sec80CCD1B: extracted.deductions?.nps80CCD1B || prev.sec80CCD1B,
                    otherDeductions: extracted.deductions?.otherDeductions || prev.otherDeductions,
                }));
                setUploadStatus('success');
            } else {
                setUploadStatus('error');
            }
        } catch (err) {
            console.error("Upload Error:", err);
            setUploadStatus('error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = (field: keyof TaxInput, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const sections = [
        {
            title: "Salary Architecture",
            icon: Building2,
            fields: [
                { key: 'grossSalary', label: 'Annual Gross CTC', type: 'number', placeholder: 'e.g. 1800000' },
                { key: 'basicSalary', label: 'Annual Basic Salary', type: 'number', placeholder: 'Check your payslip' },
                { key: 'hra_received', label: 'HRA Component', type: 'number' },
            ]
        },
        {
            title: "Deduction Shield (80C & Others)",
            icon: PiggyBank,
            fields: [
                { key: 'sec80C', label: '80C Investments (EPF/ELSS/PPF)', type: 'number', max: 150000 },
                { key: 'sec80CCD1B', label: 'Additional NPS', type: 'number', max: 50000 },
                { key: 'homeLoanInterest', label: 'Home Loan Interest (Sec 24)', type: 'number' },
            ]
        },
        {
            title: "Health & Rent",
            icon: HeartPulse,
            fields: [
                { key: 'rent_paid_monthly', label: 'Monthly Rent Paid', type: 'number' },
                { key: 'sec80D_self', label: 'Self Health Insurance', type: 'number' },
                { key: 'city_metro', label: 'Living in Metro?', type: 'boolean' },
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Form 16 Ingestion Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/40 backdrop-blur-xl border border-accent/20 rounded-3xl p-8 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <FileUp size={120} />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                            <FileUp className="text-background w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black font-barlow-condensed tracking-tight uppercase">AI Form 16 Extraction</h3>
                            <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase opacity-60 mt-1">
                                {isUploading ? "ORACLE IS SCANNING FISCAL ARTIFACTS..." : "AUTOMATE DATA ENTRY. UPLOAD PDF, CSV OR EXCEL."}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {uploadStatus === 'success' && (
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-widest bg-emerald-400/10 px-4 py-2 rounded-lg">
                                <CheckCircle2 size={14} /> IDENTIFIED
                            </div>
                        )}
                        {uploadStatus === 'error' && (
                            <div className="flex items-center gap-2 text-red-400 font-bold text-[10px] uppercase tracking-widest bg-red-400/10 px-4 py-2 rounded-lg">
                                <AlertTriangle size={14} /> SCAN FAILED
                            </div>
                        )}

                        <label className={`cursor-pointer px-8 py-3 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all ${isUploading
                                ? 'bg-secondary/40 text-muted-foreground pointer-events-none'
                                : 'bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-accent/40'
                            }`}>
                            {isUploading ? 'SCANNING...' : 'UPLOAD FILE'}
                            <input type="file" className="hidden" accept=".pdf,.csv,.xlsx" onChange={handleFileUpload} disabled={isUploading} />
                        </label>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                                <section.icon size={16} />
                            </div>
                            <h3 className="text-[10px] font-black tracking-[.2em] text-muted-foreground uppercase">{section.title}</h3>
                        </div>

                        <div className="space-y-5">
                            {section.fields.map(field => (
                                <div key={field.key}>
                                    <label className="block text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-2 opacity-60">
                                        {field.label}
                                    </label>
                                    {field.type === 'boolean' ? (
                                        <div className="flex gap-2">
                                            {[true, false].map((val) => (
                                                <button
                                                    key={val.toString()}
                                                    onClick={() => handleChange(field.key as any, val)}
                                                    className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase border transition-all ${formData[field.key as keyof TaxInput] === val
                                                            ? 'bg-accent/10 border-accent/40 text-accent'
                                                            : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/20'
                                                        }`}
                                                >
                                                    {val ? 'YES' : 'NO'}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                value={(formData[field.key as keyof TaxInput] as any) ?? 0}
                                                onChange={(e) => handleChange(field.key as any, Number(e.target.value))}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-accent/40 focus:ring-0 transition-all outline-none"
                                            />
                                            {field.max && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${(formData[field.key as keyof TaxInput] as number) > field.max
                                                            ? 'bg-red-500/20 text-red-400'
                                                            : 'bg-accent/10 text-accent'
                                                        }`}>
                                                        MAX {field.max / 1000}K
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="md:col-span-1 bg-accent/5 border border-accent/20 rounded-3xl p-8 flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Calculator className="text-accent" size={24} />
                            <h3 className="text-xl font-black font-barlow-condensed tracking-tight uppercase">Ready for Analysis?</h3>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase opacity-60 leading-relaxed mb-8">
                            ORACLE WILL SIMULATE 42 DIFFERENT TAX SCENARIOS ACROSS DUAL REGIMES TO FIND THE OPTIMAL FINANCIAL SHIELD FOR YOUR INCOME.
                        </p>
                    </div>

                    <button
                        onClick={() => onCalculate(formData)}
                        disabled={loading}
                        className="w-full py-5 bg-accent text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        {loading ? 'CALCULATING...' : 'GENERATE TAX VERDICT'}
                        {!loading && <ChevronRight size={16} />}
                    </button>
                </motion.div>
            </div>
        </div>
    );
};
