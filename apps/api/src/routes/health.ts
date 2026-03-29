import { Router } from "express";
import { HealthScore } from "../models/HealthScore.model";

const router = Router();

// Save a new health diagnostic
router.post("/", async (req: any, res) => {
    try {
        const { quizAnswers, scores, totalScore } = req.body;
        
        const newScore = new HealthScore({
            userId: req.user?.id,
            quizAnswers,
            scores,
            totalScore,
            generatedAt: new Date()
        });

        await newScore.save();
        res.json({ success: true, data: newScore });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get all health diagnostics for the user
router.get("/all", async (req: any, res) => {
  try {
    const results = await HealthScore.find({ userId: req.user?.id }).sort({ createdAt: -1 });
        res.json({ success: true, data: results });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get a specific diagnostic by ID
router.get("/:id", async (req: any, res) => {
    try {
        const result = await HealthScore.findById(req.params.id);
        res.json({ success: true, data: result });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete a specific diagnostic
router.delete("/:id", async (req, res) => {
    try {
        await HealthScore.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Node Purged Successfully" });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
