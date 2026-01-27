import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { addTransaction,getGroupTransactions,simplifyTransactions,saveSettlement} from "../controllers/transactioncontroller.js";

const router = express.Router();

router.post("/", authMiddleware, addTransaction);
router.get("/:groupId", authMiddleware, getGroupTransactions);
router.post("/simplify", authMiddleware, simplifyTransactions);
router.post("/save", authMiddleware, saveSettlement);

export default router;
