import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { addTransaction } from "../controllers/transactioncontroller.js";

const router = express.Router();

router.post("/", authMiddleware, addTransaction);

export default router;
