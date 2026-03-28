import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import path from "path";

// FORCE LOAD .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const extractTaxDataFromForm16 = async (rawText: string) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("❌ CRITICAL: GROQ_API_KEY is missing.");
    return null;
  }

  if (!rawText || rawText.length < 50) {
    console.error("❌ CRITICAL: Form 16 text is empty.");
    return null;
  }

  const model = new ChatGroq({
    apiKey: apiKey,
    model: "llama-3.3-70b-versatile",
    temperature: 0, 
  });

  const prompt = `
    Role: Indian Tax Data Extractor.
    Task: Extract tax-relevant data from the provided Form 16 text.
    
    Instruction: Identify Gross Salary, Standard Deduction, Professional Tax, 80C investments, 80D, 80G, 80TTA, and HRA exemption.
    
    Output Format: STRICT JSON ONLY. Do not write "Here is the JSON".
    Structure:
    {
      "grossSalary": number,
      "deductions": {
        "section80C": number,
        "section80D": number,
        "hraExemption": number,
        "section80G": number,
        "section80TTA": number,
        "nps80CCD1B": number,
        "otherDeductions": number
      },
      "professionalTax": number,
      "standardDeduction": number
    }

    Note: If any value is not found, default to 0. 
    Standard Deduction should be 50000 by default for assessment year 2024-25.

    Input Text:
    ${rawText.substring(0, 15000)}
  `;

  try {
    console.log("🤖 Extracting Tax Data with Groq...");
    const response = await model.invoke(prompt);
    const content = response.content.toString();

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const data = JSON.parse(jsonMatch[0]);
    console.log("✅ Tax Extraction Success for Gross Salary:", data.grossSalary);
    return data;

  } catch (error) {
    console.error("❌ TAX EXTRACTION CRASHED:", error);
    return null;
  }
};
