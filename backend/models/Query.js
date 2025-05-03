import mongoose from "mongoose";
const querySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Only set when user is logged in
  },
  sessionId: String,
  question: String,
  intent: String,
  response: String,
  createdAt: { type: Date, default: Date.now },
});

const Query = mongoose.model("Query", querySchema);
export default Query;
