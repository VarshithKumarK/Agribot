import axios from "axios";

export const recommendCrop = async (req, res) => {
  const { soil, ph, irrigation } = req.body;

  const prompt = `
You are an expert agricultural assistant. A farmer provides the following details:
- Soil Type: ${soil}
- Soil pH: ${ph}
- Irrigation Available: ${irrigation}

Based on this, suggest the best crops for them to grow. Respond with a short list of crops and a sentence explaining why they are suitable.
`;

  try {
    const ollamaRes = await axios.post("http://localhost:11434/api/generate", {
      model: "sike_aditya/AgriLlama", // or the model you installed
      prompt,
      stream: false,
    });

    const result = ollamaRes.data.response;
    res.json(result);
  } catch (err) {
    console.error("Ollama error:", err.message);
    res.status(500).json({ error: "Failed to get response from model." });
  }
};
