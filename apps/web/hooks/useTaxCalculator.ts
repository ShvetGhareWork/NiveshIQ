import { useState } from "react";
import type { TaxInput, TaxResult } from "@niveshiq/types";

export function useTaxCalculator() {
  const [result, setResult] = useState<TaxResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function calculate(input: TaxInput) {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('oracle_token');
    try {
      const res  = await fetch("/api/tax/calculate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, calculate };
}

// ---

// ### Phase 6 — Frontend page structure (`apps/web/app/dashboard/tax-wizard/`)

// Three files replace your current shell:
// ```
// tax-wizard/
// ├── page.tsx           ← orchestrator — step state + useTaxCalculator
// ├── WizardForm.tsx     ← the zero-jargon input form (Step 1)
// └── TaxVerdict.tsx     ← results panel with regime cards, gaps, shield CTAs (Step 2)