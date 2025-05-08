import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: String,
  benefits: String,
  applyLink: String,
  type: { type: String, enum: ['central', 'state'], required: true },
  state: { type: String, default: null }, // Only for state schemes
  createdAt: { type: Date, default: Date.now }
});

const Scheme = mongoose.model('Scheme', schemeSchema);
export default Scheme;