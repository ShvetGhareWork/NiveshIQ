import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  agentName: String,
  inputHash: String,
  decision: String,
  timestamp: Date,
  userId: String
}, { strict: false, timestamps: true });

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);