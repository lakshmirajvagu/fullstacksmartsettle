import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import connectDb from "./src/config/db.js";
import userRoutes from "./src/routes/userroutes.js";
import authMiddleware from "./src/middleware/authmiddleware.js";
import groupRoutes from "./src/routes/grouproutes.js";
import invitationRoutes from "./src/routes/Invitationroutes.js";
import transactionRoutes from "./src/routes/transactionroutes.js";
import historyRoutes from "./src/routes/historyroutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------- MIDDLEWARE -------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  /\.vercel\.app$/
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.some(o =>
        typeof o === "string" ? o === origin : o.test(origin)
      )
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

/* -------------------- ROOT ROUTE -------------------- */
app.get("/", (req, res) => {
  res.send("SmartSettle API running 🚀");
});

/* -------------------- DB -------------------- */
connectDb();

/* -------------------- ROUTES -------------------- */
app.use("/api/users", userRoutes);

app.use("/api/test", authMiddleware, (req, res) => {
  res.json({ message: "Protected route accessed", userId: req.userId });
});

app.use("/api/groups", groupRoutes);
app.use("/api/invitation", invitationRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/history", historyRoutes);

/* -------------------- SERVER + SOCKET -------------------- */
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        origin.includes("localhost") ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});



io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
  });
});

/* -------------------- LISTEN -------------------- */
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
