import express from "express";
import {
  deleteQueryById,
  deleteUserQueries,
  getUserQueries,
  saveQuery,
} from "../controllers/queryController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.delete("/", protectRoute, deleteUserQueries);
router.delete("/:id", protectRoute, deleteQueryById);
router.post("/save", protectRoute, saveQuery);
router.get("/user",protectRoute,getUserQueries);
export default router;
