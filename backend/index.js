import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


import connectDB from './db/database.js';
import user from './routes/user.js';
import BookingRoute from './routes/BookingRoute.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// ✅ CORS middleware (ONLY ONCE)

app.use(cors());
app.use(express.json());




// Routes
app.use('/user', user);
app.use('/booking', BookingRoute);

// MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
