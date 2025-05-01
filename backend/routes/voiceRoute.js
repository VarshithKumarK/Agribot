// backend/routes/voiceRoute.js

import express from "express";
import multer from "multer";
import { transcribeAudioAndQuery } from "../controllers/audioController.js";
import { handleVoiceQuery } from "../controllers/dialogflowController.js";

const router = express.Router();

// Set up multer for handling audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Voice file upload and processing route
router.post("/upload", upload.single("audio"), transcribeAudioAndQuery);

// Optional: Text-based query route (useful for testing)
router.post("/query", handleVoiceQuery);

export default router;
