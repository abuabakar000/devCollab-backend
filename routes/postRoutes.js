import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  createPost,
  getPosts,
  deletePost,
  updatePost,
  toggleLike,
  addComment,
  deleteComment,
  getFeedPosts,
  getUserPosts,
  getPostById,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", protect, upload.array("images", 5), createPost);
router.get("/", protect, getPosts);
router.get("/feed", protect, getFeedPosts);
router.get("/user/:id", protect, getUserPosts);
router.get("/:id", protect, getPostById);
router.delete("/:id", protect, deletePost);
router.put("/:id", protect, upload.array("images", 5), updatePost);

router.put("/like/:id", protect, toggleLike);
router.post("/comment/:id", protect, addComment);
router.delete("/comment/:id/:commentId", protect, deleteComment);

export default router;
