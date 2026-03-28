import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import portfolioRoutes from "./routes/portfolio";
import chatRoutes from "./routes/chat";
import healthRoutes from "./routes/health";
import taxRoutes from "./routes/tax";
import authRoutes from "./routes/auth";
import fireRoutes from "./routes/fire";
import lifePlannerRoutes from "./routes/life-planner";
import marketRoutes from "./routes/market";
import aiRoutes from "./routes/ai";
import { protect } from "./middleware/auth";

// 1. Robust Env Loading
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));
app.use(express.json());

// Routes
app.get("/api/status", (req, res) => {
  res.json({ 
    status: "ok", 
    dbState: mongoose.connection.readyState === 1 ? "connected" : "disconnected" 
  });
});

app.use("/api/auth", authRoutes);

// Protected Routes - Require valid JWT
app.use("/api/portfolio", protect, portfolioRoutes);
app.use("/api/chat", protect, chatRoutes);
app.use("/api/health", protect, healthRoutes);
app.use("/api/tax", protect, taxRoutes);
app.use("/api/fire", protect, fireRoutes);
app.use("/api/life-planner", protect, lifePlannerRoutes);
app.use("/api/market", protect, marketRoutes);
app.use("/api/ai", protect, aiRoutes);

// 2. The "Database First" Startup Logic
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is missing in .env");
    }

    // Connect with strict timeout settings so it doesn't hang forever
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Fail fast if IP is blocked (5 seconds)
    });
    
    console.log("🟢 MongoDB Connected Successfully");

    // Only start listening AFTER DB is ready
    app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
    });

  } catch (err: any) {
    console.error("🔴 FATAL: Could not connect to MongoDB.");
    console.error("   Reason:", err.message);
    console.log("👉 Fix: Check IP Whitelist in Atlas or your Password.");
    process.exit(1); // Kill the process so you know it failed
  }
};

startServer();
