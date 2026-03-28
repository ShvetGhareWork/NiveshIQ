import express from "express";
import multer from "multer";
import fs from "fs";
// @ts-ignore - generic import to avoid type mismatch with worker
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import { Portfolio } from "../models/Portfolio";
import { extractPortfolioData } from "../services/extractor";
import { analyzePortfolio } from "../utils/analytics";
import { enrichWithLiveData } from "../services/marketData";
import { extractFromSpreadsheet } from "../utils/spreadsheetExtractor";
import path from "path";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req: any, res) => {
  try {
    if (!req.file) throw new Error("No file uploaded");
    
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let structuredData: any = null;

    if (fileExt === '.pdf') {
      // --- STEP 1: PDF PARSING (The Eyes) ---
      console.log(`📄 Parsing PDF Statement (Password length: ${req.body.password?.length || 0})...`);
      const standardFontDataUrl = `node_modules/pdfjs-dist/standard_fonts/`;
      // @ts-ignore
      const loadingTask = pdfjsLib.getDocument({
        url: req.file.path,
        password: req.body.password || "", // Native Password Support
        standardFontDataUrl
      });

      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;
      let fullText = "";

      // Extract Text Page by Page
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        // @ts-ignore
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += `\n--- Page ${i} ---\n${pageText}`;
      }

      // --- STEP 2: AI EXTRACTION (The Brain) ---
      console.log("🧠 Sending text to Groq Llama 3 for extraction...");
      structuredData = await extractPortfolioData(fullText);
      
      // Cleanup temp file
      fs.unlinkSync(req.file.path);

      if (!structuredData) {
        throw new Error("AI failed to extract meaningful data from the PDF.");
      }
    } else if (['.xlsx', '.xls', '.csv'].includes(fileExt)) {
      // --- ALTERNATIVE: SPREADSHEET PARSING ---
      console.log("📊 Parsing Spreadsheet Statement...");
      const spreadsheetHoldings = extractFromSpreadsheet(req.file.path);
      
      structuredData = {
        holdings: spreadsheetHoldings,
        summary: {
          totalValue: spreadsheetHoldings.reduce((sum, h) => sum + h.currentValue, 0),
          statementDate: new Date().toISOString()
        }
      };

      // Cleanup temp file
      fs.unlinkSync(req.file.path);

      if (spreadsheetHoldings.length === 0) {
        throw new Error("Could not find any valid holdings in the spreadsheet. Check columns.");
      }
    } else {
      throw new Error("Unsupported file format. Please upload PDF, Excel or CSV.");
    }

    // --- NEW STEP: MARKET ENRICHMENT ---
    console.log("📡 Fetching Real-Time Market Data...");
    const liveHoldings = await enrichWithLiveData(structuredData.holdings);

    // --- STEP 3: RUN ANALYTICS ---
    console.log("📊 Running Financial Analytics...");
    const insights = analyzePortfolio(liveHoldings);

    // --- STEP 4: DATABASE SAVE (The Memory) ---
    console.log("💾 Saving to MongoDB...");
    const newPortfolio = await Portfolio.create({
      userId: req.user?.id,
      holdings: liveHoldings,
      summary: {
        totalValue: insights.metrics.totalValue
      },
      insights: insights,
      statementDate: new Date()
    });

    // --- STEP 5: RESPONSE ---
    res.json({ 
      success: true, 
      portfolioId: newPortfolio._id,
      holdingsCount: liveHoldings.length,
      data: {
        ...structuredData,
        holdings: liveHoldings,
        insights: insights
      } 
    });

  } catch (error: any) {
    console.error("Processing Error:", error);
    
    // Cleanup file if it still exists and error occurred before deletion
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: error.message,
      hint: "Check if the password (PAN) is correct or if the AI service is active." 
    });
  }
});

router.get("/all", async (req: any, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user?.id }).sort({ statementDate: -1 });
    res.json({
      success: true,
      data: portfolios.map(p => ({
        id: p._id,
        date: p.statementDate,
        totalValue: p.summary.totalValue,
        holdingsCount: p.holdings.length,
        riskScore: p.insights?.metrics?.riskScore || 0,
        xirr: p.insights?.metrics?.xirr || 0,
        overlapCount: p.insights?.metrics?.overlapCount || 0
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    res.json({ success: true, message: "Portfolio deleted permanently" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    res.json({ success: true, data: portfolio });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req: any, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user?.id }).sort({ statementDate: -1 });
    if (!portfolios || portfolios.length === 0) {
      return res.json({ success: true, data: null });
    }
    
    // Return the latest analysis
    const latest = portfolios[0];
    res.json({
      success: true,
      data: {
        holdings: latest.holdings,
        summary: latest.summary,
        insights: latest.insights,
        id: latest._id
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
