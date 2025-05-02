import express from "express";
import { handleVoiceQuery } from "../controllers/dialogflowController.js";

const router = express.Router();
router.post("/query", handleVoiceQuery);

export default router;
