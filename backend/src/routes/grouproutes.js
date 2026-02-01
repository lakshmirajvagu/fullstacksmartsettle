import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { createGroup, getUserGroups,removeMember,exitGroup} from "../controllers/GroupController.js";

const router = express.Router();

router.post("/", authMiddleware, createGroup);
router.get("/", authMiddleware, getUserGroups);
router.put("/:groupId/remove-member", removeMember);
router.put("/:groupId/exit", authMiddleware, exitGroup);

export default router;
