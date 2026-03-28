// apps/api/src/services/taxEngine.ts
import type { TaxInput, RegimeResult, GapItem, ShieldStrategy, TaxResult } from "@niveshiq/types";

// ── Slab tables ──────────────────────────────────────────────────────────────

const OLD_SLABS = [
  { upto: 250000,  rate: 0 },
  { upto: 500000,  rate: 0.05 },
  { upto: 1000000, rate: 0.20 },
  { upto: Infinity, rate: 0.30 },
];

const OLD_SLABS_SENIOR = [        // 60–80 yrs
  { upto: 300000,  rate: 0 },
  { upto: 500000,  rate: 0.05 },
  { upto: 1000000, rate: 0.20 },
  { upto: Infinity, rate: 0.30 },
];

const OLD_SLABS_SUPER_SENIOR = [  // 80+ yrs
  { upto: 500000,  rate: 0 },
  { upto: 1000000, rate: 0.20 },
  { upto: Infinity, rate: 0.30 },
];

// Budget 2024-25 New Regime slabs (effective FY 2024-25)
const NEW_SLABS = [
  { upto: 300000,  rate: 0 },
  { upto: 700000,  rate: 0.05 },
  { upto: 1000000, rate: 0.10 },
  { upto: 1200000, rate: 0.15 },
  { upto: 1500000, rate: 0.20 },
  { upto: Infinity, rate: 0.30 },
];

function applySlabs(income: number, slabs: typeof OLD_SLABS): number {
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (income <= prev) break;
    const taxable = Math.min(income, slab.upto) - prev;
    tax += taxable * slab.rate;
    prev = slab.upto;
  }
  return Math.round(tax);
}

// ── HRA Exemption ─────────────────────────────────────────────────────────────
function calcHRAExemption(i: TaxInput): number {
  if (i.rent_paid_monthly === 0) return 0;
  const annualRent = i.rent_paid_monthly * 12;
  const metroPercent = i.city_metro ? 0.5 : 0.4;
  const exemption = Math.min(
    i.hra_received,
    i.basicSalary * metroPercent,
    annualRent - i.basicSalary * 0.1
  );
  return Math.max(0, Math.round(exemption));
}

// ── Surcharge ─────────────────────────────────────────────────────────────────
// ── Surcharge ─────────────────────────────────────────────────────────────────
function calcSurcharge(taxableIncome: number, tax: number, regime: "old" | "new"): number {
  if (taxableIncome > 50000000) return tax * (regime === "new" ? 0.25 : 0.37);
  if (taxableIncome > 20000000) return tax * 0.25;
  if (taxableIncome > 10000000) return tax * 0.15;
  if (taxableIncome > 5000000)  return tax * 0.10;
  return 0;
}

// ── Old Regime ────────────────────────────────────────────────────────────────
function calcOldRegime(i: TaxInput): RegimeResult {
  const isSenior = i.age === "60to80" || i.age === "above80";
  const slabs = i.age === "above80" ? OLD_SLABS_SUPER_SENIOR
              : i.age === "60to80"  ? OLD_SLABS_SENIOR
              : OLD_SLABS;

  const hraExemption   = calcHRAExemption(i);
  const ltaExemption   = Math.min(i.lta_received, i.lta_claimed);
  const standardDed    = 50000;  // Old regime standard deduction

  // 80C bucket: PF, ELSS, LIC, PPF, home loan principal (capped at 1.5L)
  const sec80C_total   = Math.min(i.sec80C + i.homeLoanPrincipal, 150000);
  
  // 80D: Self (25k/50k) + Parents (25k/50k)
  const selfLimit      = isSenior ? 50000 : 25000;
  const parentLimit    = 50000; // Assuming senior parents by default for safety, or cap at 50k
  
  const sec80D         = Math.min(i.sec80D_self, selfLimit) +
                         Math.min(i.sec80D_parents, parentLimit);
                         
  const nps            = Math.min(i.sec80CCD1B, 50000);
  const homeLoan       = Math.min(i.homeLoanInterest, 200000);
  const sec80TTA       = Math.min(i.sec80TTA, isSenior ? 50000 : 10000); // 80TTB for seniors

  const totalDeductions = standardDed + hraExemption + ltaExemption +
                          sec80C_total + sec80D + nps + homeLoan +
                          sec80TTA + i.otherDeductions;

  const taxableIncome  = Math.max(0, i.grossSalary - totalDeductions);
  const taxBefore      = applySlabs(taxableIncome, slabs);
  
  // 87A rebate: if taxable ≤ 5L, tax = 0 (old regime)
  const afterRebate    = taxableIncome <= 500000 ? 0 : taxBefore;
  
  const surcharge      = calcSurcharge(taxableIncome, afterRebate, "old");
  const cess           = Math.round((afterRebate + surcharge) * 0.04);
  const totalTax       = afterRebate + surcharge + cess;

  return {
    regime: "old",
    grossIncome: i.grossSalary,
    totalDeductions,
    taxableIncome,
    taxBeforeCess: afterRebate,
    cess,
    surcharge,
    totalTax,
    effectiveRate: +((totalTax / i.grossSalary) * 100).toFixed(2),
    monthlyInHand: Math.round((i.grossSalary - totalTax) / 12),
  };
}

// ── New Regime ────────────────────────────────────────────────────────────────
function calcNewRegime(i: TaxInput): RegimeResult {
  const standardDed   = 75000;  // Budget 2024-25
  const totalDeductions = standardDed;
  const taxableIncome = Math.max(0, i.grossSalary - totalDeductions);
  const taxBefore     = applySlabs(taxableIncome, NEW_SLABS);
  
  // 87A rebate & Marginal Relief (Budget 2024-25 New Regime)
  // If taxable <= 7L, tax = 0.
  // If taxable > 7L, the tax cannot exceed (taxableIncome - 7L).
  let afterRebate = 0;
  if (taxableIncome <= 700000) {
    afterRebate = 0;
  } else {
    const taxPotential = taxBefore;
    const excessOver7L = taxableIncome - 700000;
    // Marginal relief kicks in if tax liability > excess income over threshold
    afterRebate = Math.min(taxPotential, excessOver7L);
  }

  const surcharge     = calcSurcharge(taxableIncome, afterRebate, "new");
  const cess          = Math.round((afterRebate + surcharge) * 0.04);
  const totalTax      = afterRebate + surcharge + cess;

  return {
    regime: "new",
    grossIncome: i.grossSalary,
    totalDeductions,
    taxableIncome,
    taxBeforeCess: afterRebate,
    cess,
    surcharge,
    totalTax,
    effectiveRate: +((totalTax / i.grossSalary) * 100).toFixed(2),
    monthlyInHand: Math.round((i.grossSalary - totalTax) / 12),
  };
}

// ── Gap Analysis ──────────────────────────────────────────────────────────────
function calcGaps(i: TaxInput, marginalRate: number): GapItem[] {
  const gaps: GapItem[] = [];

  const sec80C_used = Math.min(i.sec80C + i.homeLoanPrincipal, 150000);
  if (sec80C_used < 150000) {
    const gap = 150000 - sec80C_used;
    gaps.push({ section: "80C (ELSS/PPF/LIC)", currentInvested: sec80C_used,
      maxAllowed: 150000, gap, taxSaving: Math.round(gap * marginalRate * 1.04) });
  }

  if (i.sec80CCD1B < 50000) {
    const gap = 50000 - i.sec80CCD1B;
    gaps.push({ section: "NPS (80CCD1B)", currentInvested: i.sec80CCD1B,
      maxAllowed: 50000, gap, taxSaving: Math.round(gap * marginalRate * 1.04) });
  }

  const sec80D_used = i.sec80D_self + i.sec80D_parents;
  const sec80D_max  = 25000 + (i.age !== "below60" ? 50000 : 25000);
  if (sec80D_used < sec80D_max) {
    const gap = sec80D_max - sec80D_used;
    gaps.push({ section: "80D (Health Insurance)", currentInvested: sec80D_used,
      maxAllowed: sec80D_max, gap, taxSaving: Math.round(gap * marginalRate * 1.04) });
  }

  return gaps.filter(g => g.gap > 0);
}

// ── Shield Strategies ─────────────────────────────────────────────────────────
function calcShieldStrategies(i: TaxInput, gaps: GapItem[], old: RegimeResult, newR: RegimeResult): ShieldStrategy[] {
  const strategies: ShieldStrategy[] = [];

  // If new regime is currently better, simulate what filling 80C+NPS does to old
  if (newR.totalTax <= old.totalTax) {
    const maxAdditional80C  = Math.max(0, 150000 - Math.min(i.sec80C + i.homeLoanPrincipal, 150000));
    const maxAdditionalNPS  = Math.max(0, 50000 - i.sec80CCD1B);
    const totalPotentialDed = maxAdditional80C + maxAdditionalNPS;

    if (totalPotentialDed > 0) {
      const simulatedInput = { ...i, sec80C: i.sec80C + maxAdditional80C, sec80CCD1B: 50000 };
      const simulatedOld   = calcOldRegime(simulatedInput);
      if (simulatedOld.totalTax < newR.totalTax) {
        strategies.push({
          action: `Invest ₹${(totalPotentialDed).toLocaleString("en-IN")} in 80C + NPS`,
          investment: totalPotentialDed,
          taxSaved: newR.totalTax - simulatedOld.totalTax,
          regimeAfter: "old",
        });
      }
    }
  }

  // Top gap as quick win
  if (gaps.length > 0) {
    const top = gaps.sort((a, b) => b.taxSaving - a.taxSaving)[0];
    strategies.push({
      action: `Fill ${top.section} gap of ₹${top.gap.toLocaleString("en-IN")}`,
      investment: top.gap,
      taxSaved: top.taxSaving,
      regimeAfter: old.totalTax <= newR.totalTax ? "old" : "new",
    });
  }

  return strategies;
}

// ── Main export ───────────────────────────────────────────────────────────────
export function computeTax(input: TaxInput): TaxResult {
  const old  = calcOldRegime(input);
  const newR = calcNewRegime(input);

  const verdict: "old" | "new" | "equal" =
    old.totalTax < newR.totalTax  ? "old" :
    newR.totalTax < old.totalTax  ? "new" : "equal";

  // Marginal rate for gap calculations (old regime, since gaps only help there)
  const marginalRate = old.taxableIncome > 1000000 ? 0.30
                     : old.taxableIncome > 500000  ? 0.20
                     : 0.05;

  const gaps = calcGaps(input, marginalRate);

  return {
    input,
    old,
    new: newR,
    verdict,
    deltaMonthlyInHand: old.monthlyInHand - newR.monthlyInHand,
    deltaTax: newR.totalTax - old.totalTax,
    gaps,
    shieldStrategies: calcShieldStrategies(input, gaps, old, newR),
    computedAt: new Date().toISOString(),
  };
}