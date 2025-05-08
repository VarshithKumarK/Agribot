import Scheme from "../models/Scheme.js";

// Fetch all state schemes by state name
export const getStateSchemes = async (req, res) => {
  try {
    const { state } = req.query;
    if (!state) return res.status(400).json({ error: "State is required" });

    const schemes = await Scheme.find({ type: "state", state });
    res.status(200).json(schemes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching state schemes" });
  }
};

// Fetch all central schemes
export const getCentralSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find({ type: "central" });
    res.status(200).json(schemes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching central schemes" });
  }
};

// Create a new scheme
export const createScheme = async (req, res) => {
  try {
    const scheme = new Scheme(req.body);
    await scheme.save();
    res.status(201).json(scheme);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create scheme" });
  }
};

// Delete a scheme
export const deleteScheme = async (req, res) => {
  try {
    const { id } = req.params;
    await Scheme.findByIdAndDelete(id);
    res.status(200).json({ message: "Scheme deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete scheme" });
  }
};
