import Query from "../models/Query.js";

export const saveQuery = async (req, res) => {
  try {
    // You should have user info in req.user if authenticated
    const user = req.user; // e.g., set by JWT middleware

    if (!user) {
      return res
        .status(401)
        .json({ message: "Only logged-in users' queries are saved" });
    }
    //console.log(req.user);

    const newQuery = new Query({
      user: req.user.id,
      question: req.body.question,
      intent: req.body.intent,
      response: req.body.response,
    });

    await newQuery.save();
    res.status(201).json(newQuery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE a specific query by ID (only if it belongs to the logged-in user)
export const deleteQueryById = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log(userId);
    const queryId = req.params.id;

    const query = await Query.findById(queryId);

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    if (query.user?.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this query" });
    }

    await query.deleteOne();

    res.status(200).json({ message: "Query deleted successfully" });
  } catch (error) {
    console.error("Error deleting query:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE all queries for the logged-in user
export const deleteUserQueries = async (req, res) => {
  try {
    const userId = req.user.id; // comes from auth middleware
    const result = await Query.deleteMany({ user: userId });

    res
      .status(200)
      .json({
        message: "All user queries deleted",
        deleted: result.deletedCount,
      });
  } catch (error) {
    console.error("Error deleting user queries:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/queryController.js

export const getUserQueries = async (req, res) => {
  try {
    const userId = req.user.id;
    const queries = await Query.find({ user: userId }).sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user queries" });
  }
};
