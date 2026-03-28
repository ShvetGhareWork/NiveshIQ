import { computeTax } from "../taxEngine";
import type { TaxInput } from "@niveshiq/types";

describe("Fiscal Engine (Budget 2024-25)", () => {
    
    const baseInput: TaxInput = {
        fy: "2024-25",
        grossSalary: 0,
        basicSalary: 0,
        hra_received: 0,
        rent_paid_monthly: 0,
        city_metro: false,
        lta_received: 0,
        lta_claimed: 0,
        sec80C: 0,
        sec80D_self: 0,
        sec80D_parents: 0,
        sec80CCD1B: 0,
        sec80TTA: 0,
        homeLoanInterest: 0,
        homeLoanPrincipal: 0,
        otherDeductions: 0,
        age: "below60"
    };

    test("Scenario: Zero Income should result in Zero Tax", () => {
        const input = { ...baseInput, grossSalary: 0 };
        const result = computeTax(input);
        expect(result.old.totalTax).toBe(0);
        expect(result.new.totalTax).toBe(0);
    });

    test("Scenario: ₹7,00,000 Income (New Regime) should be Tax-Free (87A Rebate)", () => {
        const input = { ...baseInput, grossSalary: 775000 }; // 7.75L - 75K Std Ded = 7L taxable
        const result = computeTax(input);
        expect(result.new.totalTax).toBe(0);
    });

    test("Scenario: ₹18,00,000 High-Deduction (Old Regime is likely winner)", () => {
        const input: TaxInput = {
            ...baseInput,
            grossSalary: 1800000,
            basicSalary: 720000,
            hra_received: 360000,
            rent_paid_monthly: 30000,
            city_metro: true,
            sec80C: 150000,
            sec80CCD1B: 50000,
            sec80D_self: 25000,
            sec80D_parents: 50000
        };
        const result = computeTax(input);
        
        // With approx 7L in deductions, old regime should be quite low
        expect(result.old.totalTax).toBeLessThan(result.new.totalTax);
        expect(result.verdict).toBe("old");
    });

    test("HRA Calculation Accuracy", () => {
        const input: TaxInput = {
            ...baseInput,
            basicSalary: 1000000,
            hra_received: 500000,
            rent_paid_monthly: 40000, // 4.8L annual rent
            city_metro: true // 50% of basic = 5L
        };
        const result = computeTax(input);
        
        // HRA Exemption = Min(Actual HRA (5L), 50% of Basic (5L), Rent - 10% of Basic (4.8L - 1L = 3.8L))
        // Expect 3,80,000 + 50,000 (Standard Deduction)
        expect(result.old.totalDeductions).toBe(380000 + 50000);
    });

});
