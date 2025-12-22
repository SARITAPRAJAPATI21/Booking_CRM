import  mongoose from 'mongoose';

 export const productSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },

  service: {
    type: String,
    required: true,
    trim: true
  },
    description: {
    type: String,
    required: true,
    trim: true
  },
    status: {
    type: String,
    required: true,
    trim: true
  },
  userId :{
       type: String,
    required: true,
    trim: true
  },
 

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // links product to a user/admin
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  history: [
    {
      updatedAt: Date,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      changes: Object, // store what changed
    },
  ],
}, { timestamps: true });

const ProductModel =mongoose.model('Product', productSchema);

export default ProductModel;
