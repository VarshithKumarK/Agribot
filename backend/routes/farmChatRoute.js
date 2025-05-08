import express from 'express';
import { createPost, getAllPosts, addResponse, deletePost, deleteResponse } from '../controllers/farmChatController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protectRoute, createPost);            // Add new opinion
router.get('/', protectRoute, getAllPosts);            // Fetch all posts
router.post('/:postId/response', protectRoute, addResponse); // Add response to a post
router.delete("/:postId",protectRoute,deletePost);
router.delete("/:postId/response/:responseId",protectRoute,deleteResponse);


export default router;
