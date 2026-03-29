import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  password: { type: String },
  googleId: { type: String },
  settings: {
    market: { type: Boolean, default: true },
    rebalance: { type: Boolean, default: true },
    tax: { type: Boolean, default: false },
    news: { type: Boolean, default: true },
    stealth: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
});


export const User = mongoose.model("User", userSchema);
