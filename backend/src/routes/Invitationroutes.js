import express from "express";
import { inviteUser,getMyInvitations,acceptInvitation,rejectInvitation } from "../controllers/invitationController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, inviteUser);
router.get("/", authMiddleware, getMyInvitations);
router.post("/accept", authMiddleware, acceptInvitation);
router.post("/reject", authMiddleware, rejectInvitation);

export default router;
