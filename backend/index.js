// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/database.js';
import user from './routes/user.js';
import productRoute from './routes/productRoute.js';
import { createServer } from "http"; // ✅ use HTTP
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Create HTTPS server with Express app
const server = createServer(app); // ✅ create HTTP server

// Setup WebSocket (socket.io) server
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Hello</h1>
    <p>parara</p>
    <img src='https://cdn-imgix.headout.com/media/images/c9db3cea62133b6a6bb70597326b4a34-388-dubai-img-worlds-of-adventure-tickets-01.jpg?auto=format&w=1222.4&h=687.6&q=90&fit=crop&ar=16%3A9&crop=faces'/>
    <a href='https://cdn-imgix.headout.com/media/images/c9db3cea62133b6a6bb70597326b4a34-388-dubai-img-worlds-of-adventure-tickets-01.jpg?auto=format&w=1222.4&h=687.6&q=90&fit=crop&ar=16%3A9&crop=faces'>click me</a>
  `);
});

app.use('/user', user);
app.use('/booking', productRoute);

// ✅ Start the server (IMPORTANT: use `server.listen`, not `app.listen`)
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// ✅ WebSocket logic
io.on('connection', (socket) => {
  console.log("🔌 New WebSocket client connected:", socket.id);

  // handle client events
  socket.on("add-booking", (message) => {
    console.log("🆕 Booking received:", message);
    io.emit("notification-booking", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});
