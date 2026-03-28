import express from "express";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const router = express.Router();

// Initialize Groq once
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.7, // Slightly creative for advice
});

router.post("/", async (req: any, res) => {
  try {
    const { question, portfolioData } = req.body;

    if (!question || !portfolioData) {
      return res.status(400).json({ error: "Missing question or data" });
    }

    // 1. Construct the Context
    // We feed the AI the exact JSON we extracted earlier
    const context = JSON.stringify(portfolioData.holdings);
    const stats = JSON.stringify(portfolioData.insights);

    const systemPrompt = `
      You are NiveshIQ, an elite financial advisor.
      
      USER PORTFOLIO CONTEXT:
      - Holdings: ${context}
      - Analytics: ${stats}

      RULES:
      1. Answer based strictly on the provided portfolio data.
      2. Be concise, professional, and direct.
      3. If the user asks about "High Risk", cite their Equity exposure.
      4. Output Markdown (bold key numbers).
      5. Do not give generic disclaimer "I am an AI", just answer the finance question.
    `;

    // 2. Get the Answer
    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(question),
    ]);

    res.json({ answer: response.content });

  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Failed to generate advice." });
  }
});

export default router;
