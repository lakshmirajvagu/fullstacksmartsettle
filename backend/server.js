import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";
import userRoutes from "./src/routes/userroutes.js";
import authMiddleware from "./src/middleware/authmiddleware.js";
import groupRoutes from "./src/routes/grouproutes.js";
import invitationRoutes from "./src/routes/Invitationroutes.js";
import transactionRoutes from "./src/routes/transactionroutes.js";
import historyRoutes from "./src/routes/historyroutes.js";
import http from "http";
import { Server} from "socket.io";


dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());
connectDb();
app.use("/api/users", userRoutes);
app.use("/api/test",authMiddleware, (req, res) => {
  res.json({ message: "Protected route accessed", userId: req.userId });
});
app.get("/", (req, res) => {
  res.send("SmartSettle API running...");
  
});
app.use("/api/groups", groupRoutes);
app.use("/api/invitation",invitationRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/history", historyRoutes);
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
  });
});
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
