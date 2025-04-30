import mongoose from "mongoose";
const querySchema = new mongoose.Schema({
  sessionId: String,
  question: String,
  intent: String,
  response: String,
  createdAt: { type: Date, default: Date.now },
});

const Query = mongoose.model("Query", querySchema);
export default Query;
