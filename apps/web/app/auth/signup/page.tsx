'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Left Panel Component - Visual and Branding (Compact)
 */
function SignupLeftPanel() {
    return (
        <div className="hidden lg:flex flex-col items-center justify-center w-full h-full bg-[#080c14] border-r border-white/5 px-8 pt-20 pb-6 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />

            {/* Oracle Sphere Container */}
            <div className="flex-[1.5] flex items-center justify-center w-full max-w-md relative z-10">
                <div className="relative w-[400px] h-[400px]">
                    <div className="absolute inset-0 rounded-full bg-accent/20 blur-[80px]" />
                    <div className="relative w-full h-full rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl p-3 flex items-center justify-center overflow-hidden shadow-2xl">
                        <Image
                            src="/oracle-sphere.png"
                            alt="Oracle Sphere"
                            width={400}
                            height={400}
                            className="w-full h-full object-cover rounded-xl"
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Compact Narrative */}
            <div className="flex-1 flex flex-col items-center justify-start text-center max-w-sm px-2, py-16 relative z-10">
                <h2 className="text-5xl font-black text-white mb-3 font-barlowCondensed uppercase tracking-tight leading-none">
                    Vault-Grade <span className="text-accent underline decoration-accent/30 underline-offset-4">Security</span>.
                </h2>
                <p className="text-[10px] text-white/30 leading-relaxed font-light tracking-[0.15em] uppercase font-mono max-w-[280px]">
                    Your financial data is absolute. Analyzed by AI, owned by you.
                </p>
            </div>
        </div>
    );
}

/**
 * Signup Form Component - Compact View
 */
function SignupForm() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await register(fullName, email, phoneNumber, password);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative z-10 flex flex-col justify-center">
            {/* Tighter Heading */}
            <div className="mb-6">
                <h1 className="text-4xl sm:text-5xl font-black leading-[0.85] mb-2 font-barlowCondensed uppercase tracking-tighter">
                    <span className="text-white/90">START YOUR</span>
                    <br />
                    <span className="text-white/90">FINANCIAL</span>
                    {' '}
                    <span className="text-accent">X-RAY</span>
                </h1>
                <p className="text-[10px] text-white/20 font-mono tracking-[0.2em] uppercase">
                    Initialize Secure Access
                </p>
                {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-mono tracking-widest uppercase rounded">
                        {error}
                    </div>
                )}
            </div>

            {/* Form - Tighter Spacing */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 group">
                    <label htmlFor="fullName" className="block text-[9px] font-bold text-white/30 tracking-[0.3em] font-mono group-focus-within:text-accent">
                        FULL NAME
                    </label>
                    <input
                        id="fullName"
                        type="text"
                        placeholder="ALEXANDER VANCE"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-sm text-white placeholder-white/10 focus:outline-none focus:border-accent/60 transition-all font-mono text-xs"
                        required
                    />
                </div>

                <div className="space-y-1.5 group">
                    <label htmlFor="email" className="block text-[9px] font-bold text-white/30 tracking-[0.3em] font-mono group-focus-within:text-accent">
                        INSTITUTIONAL EMAIL
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="VANCE@ORACLE.INSTITUTION"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-sm text-white placeholder-white/10 focus:outline-none focus:border-accent/60 transition-all font-mono text-xs"
                        required
                    />
                </div>

                <div className="space-y-1.5 group">
                    <label htmlFor="phoneNumber" className="block text-[9px] font-bold text-white/30 tracking-[0.3em] font-mono group-focus-within:text-accent">
                        SECURE PHONE
                    </label>
                    <input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-sm text-white placeholder-white/10 focus:outline-none focus:border-accent/60 transition-all font-mono text-xs"
                        required
                    />
                </div>

                <div className="space-y-1.5 group">
                    <label htmlFor="password" className="block text-[9px] font-bold text-white/30 tracking-[0.3em] font-mono group-focus-within:text-accent">
                        SECURITY CIPHER
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-sm text-white placeholder-white/10 focus:outline-none focus:border-accent/60 transition-all font-mono text-xs"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/10 hover:text-white"
                        >
                            {showPassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.596m16.807 16.807L6.404 6.404m0 0A5.972 5.972 0 006 9m6 6a5.972 5.972 0 01-3 5.5m6-6v6m0 0a5.972 5.972 0 01-3-5.5m0 0V9" /></svg>
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-4 bg-accent text-black font-black text-base rounded-sm hover:shadow-[0_5px_20px_rgba(212,175,55,0.2)] active:translate-y-0 disabled:opacity-70 transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] font-barlowCondensed"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                            <span>PROCESSING...</span>
                        </>
                    ) : (
                        'Initialize Oracle'
                    )}
                </button>
            </form>

            {/* Tight Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-[8px] tracking-[0.4em] font-mono font-bold">
                    <span className="px-3 bg-background text-white/10 uppercase font-bold">OR</span>
                </div>
            </div>

            {/* Compact Connect */}
            <button className="w-full py-3 px-4 border border-white/5 rounded-sm text-white/40 hover:text-white hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2 mb-6 text-[10px] font-mono tracking-widest uppercase">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                CONNECT WITH GOOGLE
            </button>

            {/* Footer */}
            <div className="text-center text-[9px] font-mono tracking-[0.2em] uppercase">
                <p className="text-white/10">
                    Already registered? {' '}
                    <Link href="/auth/login" className="text-accent font-bold hover:underline underline-offset-4">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}

/**
 * Single-View Signup Page Layout
 */
export default function SignupPage() {
    return (
        <main className="h-screen w-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-[#0A0F1E] font-barlow relative selection:bg-accent/30 selection:text-white">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 blur-[120px] -z-10" />

            {/* Visual Side */}
            <SignupLeftPanel />

            {/* Form Side - Center-aligned with no scroll */}
            <div className="flex items-center justify-center p-8 lg:p-12 xl:p-16 h-full w-full overflow-hidden">
                <SignupForm />
            </div>
        </main>
    );
}