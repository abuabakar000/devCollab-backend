import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getCurrentUser, toggleFollow, updateUser, getUserById, searchUsers, getFollowers, getFollowing } from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/me", protect, getCurrentUser);
router.get("/search", protect, searchUsers);
router.put("/follow/:id", protect, toggleFollow);
router.put("/update", protect, upload.single("profilePic"), updateUser);
router.put("/profile", protect, updateUser);
router.get("/:id", protect, getUserById);
router.get("/:id/followers", protect, getFollowers);
router.get("/:id/following", protect, getFollowing);

export default router;
