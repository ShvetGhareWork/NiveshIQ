import express from "express";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const router = express.Router();

// Initialize Groq Model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.2, // Lower temperature for more objective analysis
});

router.post("/stock-analysis", async (req, res) => {
  try {
    const { 
      symbol, price, pe_ratio, market_cap, 
      change_percent, week_52_high, week_52_low,
      sector, description 
    } = req.body;

    const systemPrompt = `
      You are NiveshIQ's stock analysis AI for Indian retail investors.
      Analyse the given stock data and provide:
      1. A one-line verdict (Bullish/Bearish/Neutral) with a single clear reason.
      2. Three key strengths of this stock right now. Use bullet points.
      3. Three key risks to be aware of. Use bullet points.
      4. A direct answer to 'Should I add this to my portfolio?' based on typical retail investor risk profile.

      STOCK DATA:
      - Symbol: ${symbol}
      - Sector: ${sector}
      - Price: ₹${price} (${change_percent}%)
      - P/E: ${pe_ratio}
      - Market Cap: ₹${market_cap}
      - 52W High/Low: ₹${week_52_high} / ₹${week_52_low}
      - Description: ${description}

      RULES:
      - Be direct, specific, and use Indian financial context.
      - Avoid generic advice.
      - Keep total response under 200 words.
      - End with: "This analysis is for educational purposes only and not SEBI-registered investment advice."
    `;

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const stream = await model.stream([
      new SystemMessage(systemPrompt),
      new HumanMessage(`Analyse ${symbol} now.`),
    ]);

    for await (const chunk of stream) {
      if (chunk.content) {
          res.write(chunk.content);
      }
    }

    res.end();

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "Failed to generate AI analysis." });
  }
});

export default router;
