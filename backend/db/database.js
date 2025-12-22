// db.js
import  mongoose  from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DataBase_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection error pl:',process.env.DataBase_URL, err);
    process.exit(1); // Exit on failure
  }
};

export default connectDB;
