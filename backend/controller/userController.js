
import UserModel from '../model/User.js';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
const JWT_SECRET = 'your_jwt_secret_key';


// UPDATE PASSWORD USING EMAIL
const updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // 1️⃣ Validate input
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // 2️⃣ Check user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Hash new password
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4️⃣ Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
const register = async (req, res) => {
    console.log("Regisetr user ",req.body)
    const { username, email, password, role } = req.body;

    try {
        // Check if email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create UserModel
        const newUserModel = new UserModel({
            username,
            email,
            password: hashedPassword,
            role // optional: will default to 'UserModel' if not provided
        });

        await newUserModel.save();
        console.log("user register sucesfully ")
        res.status(201).json({ message: 'UserModel registered successfully', UserModel: { username, email, role } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}


const login = async (req, res) => {
    const { email, password } = req.body;


    try {
        // Check if UserModel exists
        const existingUser = await UserModel.findOne({ email });
        console.log("User in database", existingUser)
        if (!existingUser) return res.status(401).json({ message: 'Invalid email or password' });

        // Compare password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        // Generate JWT token
        const token = jwt.sign(
            { id: existingUser._id, role: existingUser.role },
            JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            UserModel: {
                id: existingUser._id,
                name: existingUser.username,
                email: existingUser.email,
                role: existingUser.role,
                token: token
            }
        });
        console.log("login successfull")

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

const AllUser =async(req,res)=>{

    try {
          const existingUser = await UserModel.find();
          //console.log(existingUser)
          res.status(201).json({users:existingUser,message:"all user register"})

        
    } catch (error) {
        console.log(error)
        res.status(500).json("Server Error")
    }

}

const findUser =async(req,res)=>{

    try {
           console.log(userEmail)
          const existingUser = await UserModel.findOne({userEmail});
          console.log("User details through token ", existingUser)
          res.status(201).json({users:existingUser,message:"User information"})

        
    } catch (error) {
        console.log(error)
        res.status(500).json("Server Error")
    }

}

const deleteUser = async (req,res)=>{
    console.log("remove user")
  const { id } = req.params;
  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
}




const updateUser= async (req, res) => {
  const { id } = req.params;
   
  const {username, email, role,password } = req.body.formData;
   console.log("edit user",id, "data", username)

  try {
    
    // 1. Update the user
    await UserModel.findByIdAndUpdate(id,{username, email, role,password } );

    // 2. Fetch the updated user
    const updatedUser = await UserModel.findById(id);

    console.log("Updated user in DB:", updatedUser);

    res.status(200).json({ message: "User updated successfully", data: updatedUser });
     
     //console.log(req.body , id)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Error updating user', error: err.message });
  }
};
export { register, login,AllUser ,findUser,deleteUser,updateUser,updatePassword};