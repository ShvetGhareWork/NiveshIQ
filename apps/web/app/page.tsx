"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Ticker data ────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  { label: "AXIS BLUECHIP", value: "-0.8%", positive: false },
  { label: "SBI SMALL CAP", value: "+24.1%", positive: true },
  { label: "ICICI PRUDENTIAL BLUECHIP", value: "+10.2%", positive: true },
  { label: "MIRAE ASSET LARGE CAP", value: "+12.4%", positive: true },
  { label: "HDFC TOP 100", value: "+8.7%", positive: true },
  { label: "PARAG PARIKH FLEXI CAP", value: "+18.3%", positive: true },
  { label: "KOTAK EMERGING EQUITY", value: "-2.1%", positive: false },
  { label: "NIPPON INDIA SMALL CAP", value: "+31.2%", positive: true },
];

// ─── Nav links ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "INTELLIGENCE", href: "/xray" },
  { label: "LIFE EVENTS", href: "/life-event" },
  { label: "STRATEGY", href: "/tax" },
  { label: "PRICING", href: "#" }
];

// ─── How it works steps ──────────────────────────────────────────────────────
const STEPS = [
  {
    phase: "PHASE ONE: INGESTION",
    title: "Upload CAMS PDF",
    desc: "Securely ingest your consolidated account statement. Our zero-knowledge protocol ensures your data remains yours alone.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    align: "left",
  },
  {
    phase: "PHASE TWO: PERFORMANCE",
    title: "We calculate your XIRR",
    desc: "Forget simple returns. We compute time-weighted internal rates of return across all assets to reveal actual wealth generation.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    align: "right",
  },
  {
    phase: "PHASE THREE: EXPOSURE",
    title: "We map fund overlap",
    desc: "Identify hidden risks. We cross-reference the top 100 holdings of every fund to see if you're over-exposed to the same stocks.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    align: "left",
  },
  {
    phase: "PHASE FOUR: INTELLIGENCE",
    title: "AI gives you actions",
    desc: "Receive a prioritized list of rebalancing maneuvers. Optimized for tax efficiency and long-term geometric growth.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    align: "right",
  },
];

// ─── Animated orb (pure CSS/SVG, no external deps) ──────────────────────────
function GoldenOrb() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 rounded-xl overflow-hidden bg-[#0d1117]">
        {/* Layered glow rings */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ animation: "orbPulse 4s ease-in-out infinite" }}
        >
          {[280, 220, 160, 110, 70].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-amber-500/20"
              style={{
                width: size,
                height: size,
                animationDelay: `${i * 0.4}s`,
                boxShadow: i === 2 ? "0 0 40px 8px rgba(212,175,55,0.15)" : undefined,
              }}
            />
          ))}
          {/* Core orb */}
          <div
            className="relative rounded-full"
            style={{
              width: 90,
              height: 90,
              background:
                "radial-gradient(circle at 35% 35%, #f5c842 0%, #D4AF37 40%, #8B6914 80%, #3a2800 100%)",
              boxShadow:
                "0 0 60px 20px rgba(212,175,55,0.4), 0 0 120px 40px rgba(212,175,55,0.15)",
              animation: "orbCore 3s ease-in-out infinite alternate",
            }}
          />
        </div>
        {/* Spiral traces */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          viewBox="0 0 400 400"
          style={{ animation: "orbSpin 20s linear infinite" }}
        >
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, i) => (
            <ellipse
              key={i}
              cx="200"
              cy="200"
              rx={60 + i * 14}
              ry={20 + i * 4}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.5"
              transform={`rotate(${deg} 200 200)`}
              opacity={0.4 - i * 0.03}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

// ─── Noise grain overlay ─────────────────────────────────────────────────────
function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  );
}

// ─── Infinite ticker ─────────────────────────────────────────────────────────
function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden border-t border-b border-white/5 py-3 bg-[#080c14]">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{ animation: "tickerScroll 28s linear infinite" }}
      >
        {items.map((item, i) => (
          <span key={i} className="text-xs tracking-widest font-mono shrink-0">
            <span className="text-white/30">{item.label} </span>
            <span className={item.positive ? "text-emerald-400" : "text-rose-400"}>
              {item.value}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Mobile menu ─────────────────────────────────────────────────────────────
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#0A0F1E]/95 backdrop-blur-md flex flex-col items-center justify-center gap-8">
      <button onClick={onClose} className="absolute top-5 right-5 text-white/50 hover:text-white text-3xl">×</button>
      {NAV_LINKS.map((l) => (
        <Link key={l.label} href={l.href} className="text-white/70 hover:text-[#D4AF37] tracking-widest text-sm font-mono transition-colors">
          {l.label}
        </Link>
      ))}
      <Link href="/auth/login" className="mt-4 px-8 py-3 bg-[#D4AF37] text-[#0A0F1E] text-sm font-bold tracking-widest rounded-sm inline-block">
        GET STARTED
      </Link>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function NiveshIQLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      className="min-h-screen text-white"
      style={{ background: "#0A0F1E" }}
    >
      <GrainOverlay />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "nav-sticky" : "nav-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="text-[#D4AF37] font-bold text-lg tracking-tight">
            NiveshIQ
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l, i) => (
              <Link
                key={l.label}
                href={l.href}
                className={`nav-link text-xs tracking-widest font-mono transition-colors ${i === 0 ? "active text-[#D4AF37]" : "text-white/50 hover:text-white"
                  }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hidden md:block px-5 py-2 border border-[#D4AF37]/60 text-[#D4AF37] text-xs tracking-widest font-mono hover:bg-[#D4AF37]/10 transition-colors rounded-sm">
              GET STARTED
            </Link>
            <button
              className="md:hidden text-white/60 hover:text-white"
              onClick={() => setMenuOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center pt-14 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0e1422 0%, #0A0F1E 60%, #080c14 100%)" }}
      >
        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-56px)] py-20">

            {/* Left: copy */}
            <div className="fade-up" style={{ animationDelay: "0.1s" }}>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-8 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-xs tracking-[0.25em] font-mono uppercase">
                  Portfolio Intelligence
                </span>
              </div>

              {/* Headline */}
              <h1 className="hero-title font-black uppercase mb-8" style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}>
                <span className="block text-white/90">Your</span>
                <span className="block text-white/90">Money</span>
                <span className="block text-white/90">Deserves</span>
                <span className="block">
                  <span className="text-white/90">an </span>
                  <span className="gold-text">X-Ray</span>
                </span>
              </h1>

              {/* Body */}
              <p className="text-white/50 mb-10 max-w-md leading-relaxed font-light">
                Stop guessing. Start seeing. Deep-tissue portfolio analytics powered by
                cinematic intelligence to uncover every hidden risk and opportunity.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link href="/auth/login" className="btn-primary flex items-center gap-2 px-6 py-3 text-sm tracking-widest font-mono text-white rounded-sm">
                  <span>Analyse My Portfolio</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="9" y1="7" x2="15" y2="7" /><line x1="9" y1="11" x2="15" y2="11" /><line x1="9" y1="15" x2="12" y2="15" />
                  </svg>
                </Link>
                <Link href="/auth/login" className="btn-ghost px-6 py-3 text-sm tracking-widest font-mono text-white/70 rounded-sm">
                  Check Money Health
                </Link>
              </div>
            </div>

            {/* Right: orb visual */}
            <div
              className="fade-up hidden lg:block"
              style={{ animationDelay: "0.3s", height: 380 }}
            >
              <GoldenOrb />
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-xs tracking-widest font-mono text-white">SCROLL</span>
          <div
            className="w-px h-8 bg-white/40 animate-scroll-hint"
          />
        </div>
      </section>

      {/* ── STAT CARDS ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-10" style={{ background: "#080c14" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                    <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                ),
                value: "₹0 advisor fees",
                label: "CONFLICT-FREE INTELLIGENCE",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                ),
                value: "10 seconds",
                label: "TO TOTAL PORTFOLIO CLARITY",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                  </svg>
                ),
                value: "XIRR not guesswork",
                label: "PRECISION YIELD TRACKING",
              },
            ].map((card, i) => (
              <div key={i} className="stat-card rounded-sm p-8">
                <div className="mb-5 w-10 h-10 rounded flex items-center justify-center bg-[#D4AF37]/10">
                  {card.icon}
                </div>
                <p
                  className="text-white font-bold mb-2 text-2xl leading-tight"
                >
                  {card.value}
                </p>
                <p className="text-white/30 text-xs tracking-widest font-mono">{card.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ─────────────────────────────────────────────────────────── */}
      <Ticker />

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-24 px-6 lg:px-10"
        style={{ background: "linear-gradient(180deg, #080c14 0%, #0A0F1E 100%)" }}
      >
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs tracking-[0.25em] font-mono uppercase">Process</span>
            </div>
            <h2
              className="font-black uppercase mb-4 text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.95] -tracking-[0.02em]"
            >
              How NiveshIQ
              <br />
              <span className="gold-text">Works</span>
            </h2>
            <div className="h-px w-full bg-[#D4AF37]/30 mb-6" />
            <p className="text-white/40 max-w-md font-light">
              Demystifying your portfolio with neural-grade analysis. Four steps from noise to absolute clarity.
            </p>
          </div>

          {/* Desktop timeline (hidden on mobile) */}
          <div className="hidden md:block relative mt-20">
            <div className="timeline-line" />

            <div className="flex flex-col gap-16">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`relative flex items-start gap-8 ${step.align === "right" ? "flex-row-reverse" : "flex-row"
                    }`}
                >
                  {/* Phase label + dot */}
                  <div
                    className={`absolute top-4 flex items-center gap-3 ${step.align === "right"
                        ? "right-[calc(50%+20px)] flex-row-reverse"
                        : "left-[calc(50%+20px)]"
                      }`}
                  >
                    <span className="text-[#D4AF37]/60 text-xs tracking-widest font-mono">{step.phase}</span>
                  </div>
                  <div className="absolute left-1/2 top-4 -translate-x-1/2 timeline-dot z-10" />

                  {/* Card (takes up ~40% width, offset from center) */}
                  <div className={`w-[44%] ${step.align === "right" ? "mr-auto ml-0" : "ml-auto mr-0"} mt-12`}>
                    <div className="step-card rounded-sm p-6">
                      <div className="w-9 h-9 rounded flex items-center justify-center bg-[#D4AF37]/10 mb-4 text-[#D4AF37]">
                        {step.icon}
                      </div>
                      <h3 className="text-[#D4AF37] font-bold mb-3 text-xl">
                        {step.title}
                      </h3>
                      <p className="text-white/40 text-sm leading-relaxed font-light">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Spacer side */}
                  <div className="w-[44%]" />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile steps (stacked) */}
          <div className="md:hidden mt-12 flex flex-col gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="step-card rounded-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded flex items-center justify-center bg-[#D4AF37]/10 text-[#D4AF37]">
                    {step.icon}
                  </div>
                  <span className="text-[#D4AF37]/50 text-xs tracking-widest font-mono">{step.phase}</span>
                </div>
                <h3 className="text-[#D4AF37] font-bold mb-2 text-xl">
                  {step.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-10 pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="cta-section rounded-t-sm px-10 py-14 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2
                className="font-black text-[#0A0F1E] uppercase mb-3 text-[clamp(2.2rem,5vw,3.8rem)] leading-none -tracking-[0.02em]"
              >
                Ready to see<br />the truth?
              </h2>
              <p className="text-[#0A0F1E]/60 text-sm font-normal">
                Your intelligence report is waiting. Upload your first statement now.
              </p>
            </div>
            <Link href="/auth/login" className="cta-btn shrink-0 flex items-center gap-3 px-8 py-4 rounded-sm text-sm tracking-widest font-mono font-bold">
              UPLOAD
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#060a12] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div>
            <p className="text-[#D4AF37] font-bold text-base tracking-tight mb-1">
              NiveshIQ
            </p>
            <p className="text-white/20 text-xs font-mono">
              © 2024 NiveshIQ. Cinematic Intelligence for the Modern Investor.
            </p>
          </div>

          {/* Footer links */}
          <div className="flex flex-wrap gap-6">
            {["PRIVACY POLICY", "TERMS OF SERVICE", "API DOCUMENTATION", "CONTACT SUPPORT"].map((l) => (
              <a key={l} href="#" className="text-white/25 hover:text-white/60 text-xs tracking-widest font-mono transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>

        {/* SEBI Disclaimer */}
        <div className="border-t border-white/5 px-6 lg:px-10 py-4">
          <p className="text-white/15 text-xs font-mono max-w-4xl">
            DISCLAIMER: This is not SEBI-registered investment advice. NiveshIQ provides educational analysis only.
            Past performance does not guarantee future results. Consult a SEBI-registered advisor before making investment decisions.
          </p>
        </div>
      </footer>
    </main>
  );
}