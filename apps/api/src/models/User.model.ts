import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  googleId: String,
  plan: String
}, { strict: false, timestamps: true });

export const User = mongoose.model('User', UserSchema);