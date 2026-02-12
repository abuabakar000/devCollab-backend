import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getCurrentUser, toggleFollow, updateUser, getUserById, searchUsers } from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/me", protect, getCurrentUser);
router.get("/search", protect, searchUsers);
router.put("/follow/:id", protect, toggleFollow);
router.put("/update", protect, upload.single("profilePic"), updateUser);
router.get("/:id", protect, getUserById);

export default router;
