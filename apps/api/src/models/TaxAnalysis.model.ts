import mongoose from 'mongoose';

const TaxAnalysisSchema = new mongoose.Schema({
  userId: String,
  form16Data: Object,
  regime: String,
  deductionsFound: Array,
  taxLiability: Number,
  generatedAt: Date
}, { strict: false, timestamps: true });

export const TaxAnalysis = mongoose.model('TaxAnalysis', TaxAnalysisSchema);