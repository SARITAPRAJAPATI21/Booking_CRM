// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/database.js';
import user from './routes/user.js';
import BookingRoute from './routes/BookingRoute.js';
import { createServer } from "http"; // ✅ use HTTP

import { initSocket } from "./socket/socket.js";





dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Create HTTPS server with Express app
const server = createServer(app); // ✅ create HTTP server
const io = initSocket(server); // 👈 yaha se initialize

<<<<<<< HEAD
=======
// Setup WebSocket (socket.io) server
const io = new Server(server, {
  cors: { origin: ["http://localhost:5173","https://booking-crm-front.vercel.app/login","https://booking-crm-front.vercel.app"], methods: ["GET", "POST"] }
});
>>>>>>> 04a0ebbe6b9cecf230808c6b621038732c469ded

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: "https://booking-crm-front.vercel.app",
  credentials: true
}));

app.use(express.json());

//Route api endpoint

app.use('/user', user);
app.use('/booking', BookingRoute);

// ✅ Start the server (IMPORTANT: use `server.listen`, not `app.listen`)
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// ✅ WebSocket logic

io.on('connection', (socket) => {
  console.log("🔌 New WebSocket client connected:", socket.id);

  // Admin join karega is event se
  socket.on("join-admin-room", () => {
    socket.join("admin-room");
    console.log("👑 Admin joined admin-room");
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

<<<<<<< HEAD

=======
>>>>>>> 04a0ebbe6b9cecf230808c6b621038732c469ded


