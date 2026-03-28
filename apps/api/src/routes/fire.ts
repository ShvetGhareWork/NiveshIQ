import { Router } from "express";
import { FirePlan } from "../models/FirePlan.model";

const router = Router();

// Save a new FIRE plan
router.post("/", async (req: any, res) => {
    try {
        const { inputs, results } = req.body;
        
        const newPlan = new FirePlan({
            userId: req.user?.id,
            inputs,
            results,
            generatedAt: new Date()
        });

        await newPlan.save();
        res.json({ success: true, data: newPlan });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get all plans for the user
router.get("/all", async (req: any, res) => {
  try {
    const results = await FirePlan.find({ userId: req.user?.id }).sort({ createdAt: -1 });
        res.json({ success: true, data: results });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete a specific plan
router.delete("/:id", async (req, res) => {
    try {
        await FirePlan.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Plan Archive Purged" });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
