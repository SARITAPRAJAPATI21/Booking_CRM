import  BookingModel from '../model/BookingModel.js';
import UserModel from '../model/User.js';
import { getIO } from "../socket/socket.js";


function getChanges(oldData, newData) {
  const changes = {};
  for (let key in newData) {
    if (oldData[key] !== newData[key]) {
      changes[key] = {
        from: oldData[key],
        to: newData[key],
      };
    }
  }
  return changes;
}

// Create Product
const createBooking = async (req, res) => {
  
 
  try { 
     console.log(" booking data : ",req.body)
    console.log("requesting user id : ", req.user.id)
    
    const userId=req.user.id;
    const { customerName, description, status, service} = req.body;
    const booking = new BookingModel( { customerName, description, status, service,userId } );
    await booking.save();
  const io = getIO();

io.to("admin-room").emit("notification-booking", {
  message: "🆕 New Booking Created",
  booking
});

   res.status(201).json({ message: 'booking created sucessfully ', booking });

  } catch (err) {
     console.log(err)
    res.status(500).json({ error: 'Server Error',message:err });
  }}

// Get All Products
const getBooking = async (req, res) => {
  try {
    const bookings = await BookingModel.find().populate('createdBy', 'username email');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get Product by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await BookingModel.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Product not found' });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update Product
 const updateBooking = async (req, res) => {
  try { console.log("update data in data")
    const userId = req.user.id;
    const bookingId = req.params.id;
    const oldBooking = await BookingModel.findById(bookingId);
    const updates = req.body;

    const booking = await BookingModel.findByIdAndUpdate(
      bookingId,
      {
      ...updates,
      updatedBy: userId,
      $push: {
        history: {
          updatedAt: new Date(),
          updatedBy: userId,
          changes: getChanges(oldBooking.toObject(), updates),
        },
      },
    },{ new: true }
    );

    if (!booking) return res.status(404).json({ error: 'Product not found' });

    res.json({ message: 'Booking updated successfully ', booking });
  } catch (err) {
     console.log("eror in adding",err)
    res.status(500).json({ error: 'Server Error' });
  }
};

// Delete Product
const deleteBooking = async (req, res) => {
  try {
    const booking = await BookingModel.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Product not found' });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const getBookingHistory = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await BookingModel.findById(bookingId)
      .populate("history.updatedBy", "name email") // populate user info
      .select("history"); // only return the history

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      bookingId: bookingId,
      history: booking.history,
    });
  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {createBooking,getBooking,getBookingById,getBookingHistory,updateBooking,deleteBooking}