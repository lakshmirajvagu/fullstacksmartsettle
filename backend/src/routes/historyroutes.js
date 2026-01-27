import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { getGroupHistory } from "../controllers/historycontrollers.js";

const router = express.Router();

router.get("/", authMiddleware, getGroupHistory);

export default router;
