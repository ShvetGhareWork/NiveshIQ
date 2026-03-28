// packages/types/src/tax.ts

export interface TaxInput {
  fy: "2024-25";
  grossSalary: number;           // CTC before anything
  basicSalary: number;           // needed for HRA calculation
  hra_received: number;          // actual HRA component in salary
  rent_paid_monthly: number;     // user's actual rent
  city_metro: boolean;           // Delhi/Mumbai/Chennai/Kolkata = true
  lta_received: number;
  lta_claimed: number;
  // Section 80 deductions
  sec80C: number;                // PF + ELSS + LIC + PPF (max 1,50,000)
  sec80D_self: number;           // health insurance self+family
  sec80D_parents: number;        // parents insurance (extra 25k/50k)
  sec80CCD1B: number;            // NPS additional (max 50,000)
  sec80TTA: number;              // savings interest (max 10,000)
  homeLoanInterest: number;      // Sec 24(b) — max 2,00,000
  homeLoanPrincipal: number;     // goes into 80C bucket
  otherDeductions: number;
  // Meta
  age: "below60" | "60to80" | "above80";
}

export interface RegimeResult {
  regime: "old" | "new";
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeCess: number;
  cess: number;                  // 4% health & education cess
  surcharge: number;
  totalTax: number;
  effectiveRate: number;         // percentage
  monthlyInHand: number;         // (grossSalary - totalTax) / 12
}

export interface GapItem {
  section: string;               // "80C", "NPS", etc.
  currentInvested: number;
  maxAllowed: number;
  gap: number;
  taxSaving: number;             // exact rupees saved if gap filled
}

export interface ShieldStrategy {
  action: string;                // "Invest ₹50,000 in NPS"
  investment: number;
  taxSaved: number;
  regimeAfter: "old" | "new";
}

export interface TaxResult {
  input: TaxInput;
  old: RegimeResult;
  new: RegimeResult;
  verdict: "old" | "new" | "equal";
  deltaMonthlyInHand: number;    // positive = old regime gives more
  deltaTax: number;
  gaps: GapItem[];
  shieldStrategies: ShieldStrategy[];
  computedAt: string;
}