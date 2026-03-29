import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User";
import { protect } from "../middleware/auth";


const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "niveshiq_oracle_secret_2025_vault";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "not_configured";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "IDENTITY_TAKEN: Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword
    });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber }
    });

  } catch (err: any) {
    res.status(500).json({ success: false, message: "AUTH_FAILURE: " + err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "IDENTITY_NOT_FOUND: Invalid credentials" });
    }

    // Check password
    if (!user.password) {
      return res.status(401).json({ success: false, message: "AUTHENTICATION_DENIED: Please login via Google" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "AUTHENTICATION_DENIED: Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber }
    });

  } catch (err: any) {
    res.status(500).json({ success: false, message: "AUTH_FAILURE: " + err.message });
  }
});

// GET PROFILE
router.get("/profile", protect, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "IDENTITY_NOT_FOUND" });
    }

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber, settings: user.settings }
    });

  } catch (err: any) {
    res.status(500).json({ success: false, message: "AUTH_FAILURE: " + err.message });
  }
});

// UPDATE PROFILE
router.put("/profile", protect, async (req: any, res) => {
  try {
    const { name, phoneNumber, settings } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "IDENTITY_NOT_FOUND" });
    }

    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (settings) {
      user.settings = { ...user.settings, ...settings };
    }

    await user.save();

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber, settings: user.settings }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "AUTH_FAILURE: " + err.message });
  }
});

// GOOGLE AUTH
router.post("/google", async (req, res) => {
  try {
    const { credential, accessToken } = req.body;
    let email, name, googleId;

    if (credential) {
        // Verify Google ID Token
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) throw new Error("Invalid ID Token");
        email = payload.email;
        name = payload.name;
        googleId = payload.sub;
    } else if (accessToken) {
        // Fetch profile using Access Token
        const axios = require('axios');
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
        const payload = response.data;
        if (!payload || !payload.email) throw new Error("Invalid Access Token");
        email = payload.email;
        name = payload.name;
        googleId = payload.sub;
    } else {
        return res.status(400).json({ success: false, message: "AUTH_FAILURE: No token provided" });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user (OAuth signup)
      user = await User.create({
        name,
        email,
        googleId,
        // phoneNumber and password are left undefined
      });
    } else if (!user.googleId) {
      // Update existing user with Google ID if they didn't have it
      user.googleId = googleId;
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phoneNumber: user.phoneNumber,
        settings: user.settings
      }
    });

  } catch (err: any) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ success: false, message: "AUTH_FAILURE: " + err.message });
  }
});


export default router;

