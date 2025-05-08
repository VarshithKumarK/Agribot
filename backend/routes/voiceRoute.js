import express from "express";
import { handleVoiceQuery } from "../controllers/dialogflowController.js";
import fetch from "node-fetch";
import { recommendCrop } from "../controllers/OllamaController.js";
const router = express.Router();
//router.post("/query", handleVoiceQuery);
router.post("/recommendCrop",recommendCrop);
router.post("/query", async (req, res) => {
  const { query } = req.body;

  try {
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sike_aditya/AgriLlama", // Or the name of the model you pulled
        prompt: query,
        stream: false, // Set to true if you want to handle streaming responses
      }),
    });
   // console.log(ollamaResponse);
    

    if (!ollamaResponse.ok) {
      console.error(
        `Ollama API error: ${ollamaResponse.status} - ${ollamaResponse.statusText}`
      );
      return res
        .status(500)
        .json({ error: "Failed to get response from Ollama" });
    }

    const data = await ollamaResponse.json();
    console.log("Ollama Response Data:", data); // Log the parsed JSON data
    const responseText = data.response;

    const intent = "General";

    res.json({ response: responseText, intent });
  } catch (error) {
    console.error("Error communicating with Ollama:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
