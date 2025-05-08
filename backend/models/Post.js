import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  responses: [responseSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Post', postSchema);
