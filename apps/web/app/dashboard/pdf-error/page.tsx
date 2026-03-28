'use client';

import { TopNav } from '@/components/navigation/TopNav';
import { Lock, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function PDFError() {
    const { user } = useAuth();
    return (
        <div className="flex min-h-screen bg-primary">
            <div className="flex-1 flex flex-col">
                <TopNav userName={user?.name || 'Operator'} />

                <main className="flex-1 overflow-y-auto flex items-center justify-center">
                    <div className="text-center max-w-lg px-6">
                        <div className="mb-8 flex justify-center">
                            <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                                <rect x="35" y="20" width="30" height="45" rx="2" stroke="#f5e6d3" strokeWidth="2" />
                                <path d="M 50 32 L 50 42" stroke="#f5e6d3" strokeWidth="2" />
                            </svg>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-accent mb-4">
                            We couldn&apos;t read this PDF
                        </h1>

                        <div className="space-y-4 mb-8 text-left">
                            <div className="bg-secondary/30 border border-border rounded-lg p-4 flex gap-3">
                                <Lock className="text-accent flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="font-semibold text-foreground text-sm">Password-protected PDF</p>
                                    <p className="text-xs text-muted-foreground mt-1">Fix: Remove the password before uploading.</p>
                                </div>
                            </div>

                            <div className="bg-secondary/30 border border-border rounded-lg p-4 flex gap-3">
                                <FileText className="text-accent flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="font-semibold text-foreground text-sm">Not a CAMS/KARVY statement</p>
                                    <p className="text-xs text-muted-foreground mt-1">Fix: Upload a valid CAS PDF from CAMS or Karvy.</p>
                                </div>
                            </div>

                            <div className="bg-secondary/30 border border-border rounded-lg p-4 flex gap-3">
                                <AlertCircle className="text-accent flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <p className="font-semibold text-foreground text-sm">File may be corrupted</p>
                                    <p className="text-xs text-muted-foreground mt-1">Fix: Check if the file opens on your device.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary/30 border border-border rounded-lg p-4 mb-8">
                            <p className="text-xs text-muted-foreground">
                                <span className="font-semibold">TIP:</span> Download your CAMS statement fresh from{' '}
                                <a href="#" className="text-accent hover:underline">
                                    CAMSONLINE.COM
                                </a>
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full px-6 py-3 rounded-lg bg-accent text-primary font-semibold hover:bg-accent/90 transition">
                                TRY ANOTHER FILE
                            </button>
                            <button className="w-full px-6 py-3 rounded-lg border border-accent text-accent font-semibold hover:bg-accent/10 transition">
                                CONTACT SUPPORT
                            </button>
                        </div>
                    </div>
                </main>

                <footer className="px-6 md:px-8 py-8 border-t border-border text-center text-xs text-muted-foreground">
                    <p>© 2024 NIVESHIQ. CINEMATIC INTELLIGENCE FOR THE MODERN INVESTOR.</p>
                </footer>
            </div>
        </div>
    );
}
