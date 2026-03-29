import { Router } from "express";
import { LifeEventPlan } from "../models/LifeEventPlan.model";

const router = Router();

// Save a new life event plan
router.post("/", async (req: any, res) => {
    try {
        const { eventType, inputData, goals, sipAllocation, growthData, milestones } = req.body;
        
        // Remove existing for same event type to keep it simple, or keep history
        // Let's keep history for the vault, but track latest separately if needed
        const newPlan = new LifeEventPlan({
            userId: req.user?.id,
            eventType,
            inputData,
            goals,
            sipAllocation,
            growthData,
            milestones,
            createdAt: new Date()
        });

        await newPlan.save();
        res.json({ success: true, data: newPlan });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get latest life event plan for the user
router.get("/latest", async (req: any, res) => {
    try {
        const latest = await LifeEventPlan.findOne({ userId: req.user?.id }).sort({ createdAt: -1 });
        res.json({ success: true, data: latest });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get all plans for history/vault
router.get("/all", async (req: any, res) => {
    try {
        const results = await LifeEventPlan.find({ userId: req.user?.id }).sort({ createdAt: -1 });
        res.json({ success: true, data: results });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get a specific plan by ID
router.get("/:id", async (req: any, res) => {
    try {
        const plan = await LifeEventPlan.findById(req.params.id);
        res.json({ success: true, data: plan });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete a specific plan
router.delete("/:id", async (req: any, res) => {
    try {
        const result = await LifeEventPlan.deleteOne({ _id: req.params.id, userId: req.user?.id });
        res.json({ success: result.deletedCount > 0 });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
