import mongoose from 'mongoose';

const LifeEventPlanSchema = new mongoose.Schema({
  userId: String,
  eventType: String,
  inputData: Object,
  actionPlan: Object
}, { strict: false, timestamps: true });

export const LifeEventPlan = mongoose.model('LifeEventPlan', LifeEventPlanSchema);