import express from 'express'
import  {createBooking,getBooking,getBookingById,getBookingHistory,updateBooking,deleteBooking} from '../controller/BookingController.js'

import{ authMiddleware, allowRoles } from  '../middleware/auth.js'

const  BookingRoute = express.Router();

// Public routes for viewing (user + admin)
BookingRoute.get('/all', authMiddleware, allowRoles('admin', 'user','developer'), getBooking);
BookingRoute.get('/products/:id', authMiddleware, allowRoles('admin', 'user'),getBookingById);

// Admin-only routes
BookingRoute.post('/add', authMiddleware, allowRoles('admin','user','developer'), createBooking);
BookingRoute.put('/edit/:id', authMiddleware, allowRoles('admin','user'),updateBooking);
BookingRoute.delete('/delete/:id', authMiddleware, allowRoles('admin'),deleteBooking);

BookingRoute.get("/:id/history", getBookingHistory);
export default BookingRoute;