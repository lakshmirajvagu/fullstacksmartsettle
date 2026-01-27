import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { createGroup, getUserGroups } from "../controllers/Groupcontroller.js";

const router = express.Router();

router.post("/", authMiddleware, createGroup);
router.get("/", authMiddleware, getUserGroups);

export default router;
