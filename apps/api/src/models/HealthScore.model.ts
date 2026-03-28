import mongoose from 'mongoose';

const HealthScoreSchema = new mongoose.Schema({
  userId: String,
  quizAnswers: Object,
  scores: Object,
  totalScore: Number,
  generatedAt: Date
}, { strict: false, timestamps: true });

export const HealthScore = mongoose.model('HealthScore', HealthScoreSchema);