import  Product from '../model/Product.js';
import UserModel from '../model/User.js';


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
const createProduct = async (req, res) => {
  
 
  try { 
     console.log(" booking data : ",req.body)
    console.log("requesting user id : ", req.user.id)
    
    const userId=req.user.id;
    const { customerName, description, status, service} = req.body;
    const product = new Product( { customerName, description, status, service,userId } );
    await product.save();
   res.status(201).json({ message: 'booking created sucessfully ', product });

  } catch (err) {
     console.log(err)
    res.status(500).json({ error: 'Server Error',message:err });
  }
};

// Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'username email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get Product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update Product
 const updateProduct = async (req, res) => {
  try { console.log("update data in data")
    const userId = req.user.id;
    const bookingId = req.params.id;
    const oldBooking = await Product.findById(bookingId);
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(
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

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({ message: 'Booking updated successfully ', product });
  } catch (err) {
     console.log("eror in adding",err)
    res.status(500).json({ error: 'Server Error' });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

const getBookingHistory = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Product.findById(bookingId)
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

export {createProduct,getProductById,getProducts,updateProduct,deleteProduct,getBookingHistory}