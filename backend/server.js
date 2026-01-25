import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";
import userRoutes from "./src/routes/userroutes.js";
import authMiddleware from "./src/middleware/authmiddleware.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
connectDb();
app.use("/api/users", userRoutes);
app.use("/api/test",authMiddleware, (req, res) => {
  res.json({ message: "Protected route accessed", userId: req.userId });
});
app.get("/", (req, res) => {
  res.send("SmartSettle API running...");
  
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
