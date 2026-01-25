import express from "express";
import { signup } from "../controllers/usercontroller.js";
import { login } from "../controllers/usercontroller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
