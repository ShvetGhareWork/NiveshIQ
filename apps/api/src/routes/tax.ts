import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import { computeTax } from "../services/taxEngine";
import { TaxAssessment } from "../models/TaxAssessment";
import { extractTaxDataFromForm16 } from "../services/taxExtractor";

const router = Router();
const upload = multer({ dest: "uploads/" });

import * as XLSX from "xlsx";

// 1. UPLOAD FORM 16 (The Automation Layer)
router.post("/upload-form16", upload.single("file"), async (req: any, res) => {
  try {
    if (!req.file) throw new Error("No file uploaded");

    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let fullText = "";

    if (fileExt === ".pdf") {
      console.log("📄 Initializing Form 16 PDF Deep Scan...");
      const standardFontDataUrl = `node_modules/pdfjs-dist/standard_fonts/`;
      
      // @ts-ignore
      const loadingTask = pdfjsLib.getDocument({
        url: req.file.path,
        password: req.body.password || "",
        standardFontDataUrl
      });

      const pdfDocument = await loadingTask.promise;

      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        // @ts-ignore
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += `\n--- Page ${i} ---\n${pageText}`;
      }
    } else if (['.xlsx', '.xls', '.csv'].includes(fileExt)) {
      console.log("📊 Parsing Spreadsheet for Tax Artifacts...");
      const workbook = XLSX.readFile(req.file.path);
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        fullText += `\n--- Sheet: ${sheetName} ---\n`;
        fullText += sheetData.map((row: any) => Array.isArray(row) ? row.join("\t") : "").join("\n");
      });
    } else {
      throw new Error("Unsupported file format. Please upload PDF, CSV or Excel.");
    }

    console.log("🧠 Sending fiscal artifacts to AI for extraction...");
    const extractedData = await extractTaxDataFromForm16(fullText);

    // Cleanup
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    if (!extractedData) {
      throw new Error("AI failed to extract tax data from the provided artifact.");
    }

    res.json({
      success: true,
      data: extractedData
    });

  } catch (err: any) {
    console.error("❌ Form 16 Processing Error:", err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. CALCULATE & SAVE
router.post("/calculate", async (req: any, res) => {
  try {
    const result = computeTax(req.body);
    const doc = await TaxAssessment.create({
      userId: req.user?.id,
      fy: result.input.fy,
      result,
    });
    res.json({ ...result, _id: doc._id });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/history", async (req: any, res) => {
  const docs = await TaxAssessment.find({ userId: req.user?.id })
                                  .sort({ createdAt: -1 })
                                  .limit(10);
  res.json(docs);
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await TaxAssessment.findById(req.params.id);
    res.json({ success: true, data: doc });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  await TaxAssessment.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;