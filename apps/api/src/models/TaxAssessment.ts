import mongoose from "mongoose";

const TaxAssessmentSchema = new mongoose.Schema({
  userId:    { type: String, index: true },
  fy:        { type: String, default: "2024-25" },
  result:    { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export const TaxAssessment = mongoose.model("TaxAssessment", TaxAssessmentSchema);