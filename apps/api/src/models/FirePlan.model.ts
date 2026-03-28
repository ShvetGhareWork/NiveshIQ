import mongoose from 'mongoose';

const FirePlanSchema = new mongoose.Schema({
  userId: String,
  inputs: Object,
  roadmap: Object,
  sipAmounts: Object
}, { strict: false, timestamps: true });

export const FirePlan = mongoose.model('FirePlan', FirePlanSchema);