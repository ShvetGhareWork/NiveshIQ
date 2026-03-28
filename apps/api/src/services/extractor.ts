import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// FORCE LOAD .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const extractPortfolioData = async (rawText: string) => {
  // 1. Validation
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("❌ CRITICAL: GROQ_API_KEY is missing.");
    return null;
  }

  if (!rawText || rawText.length < 50) {
    console.error("❌ CRITICAL: PDF text is empty.");
    return null;
  }

  // 2. Initialize Groq with the NEW Model
  const model = new ChatGroq({
    apiKey: apiKey,
    model: "llama-3.3-70b-versatile", // <--- CHANGED THIS LINE
    temperature: 0, 
  });

  const prompt = `
    Role: Financial Data Extractor.
    Task: Extract mutual fund holdings from the text below.
    
    Output Format: STRICT JSON ONLY. Do not write "Here is the JSON".
    Structure:
    {
      "holdings": [
        { "schemeName": "string", "units": number, "currentValue": number, "category": "EQUITY"|"DEBT" }
      ],
      "summary": { "totalValue": number }
    }

    Input Text:
    ${rawText.substring(0, 15000)}
  `;

  try {
    console.log("🤖 Sending to Groq (Llama 3.3)...");
    const response = await model.invoke(prompt);
    const content = response.content.toString();

    // 3. Parse Logic
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error("❌ AI Response did not contain JSON:", content);
      return null;
    }

    const cleanJson = jsonMatch[0];
    const data = JSON.parse(cleanJson);
    
    console.log("✅ Extraction Success:", data.holdings.length, "holdings found.");
    return data;

  } catch (error) {
    console.error("❌ EXTRACTION CRASHED:", error);
    return null;
  }
};
