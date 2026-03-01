// models/User.js
import mongoose from 'mongoose';
//import { bookingSchema } from './BookingModel.js';


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate emails
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin','developer'],
    default: 'user'
  },
   //bookings: [productSchema]
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
