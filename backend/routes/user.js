import expres from 'express'
import UserModel from '../model/User.js';
import {register,login,AllUser,findUser,deleteUser, updateUser, updatePassword} from '../controller/userController.js';
import { authMiddleware,allowRoles } from '../middleware/auth.js';
import bcrypt from 'bcrypt'

const user= expres.Router();

user.post('/register',authMiddleware, allowRoles('admin'),register)

user.post('/login',login)

user.post('/findUser',authMiddleware,findUser)

user.get('/allUser',AllUser)

user.delete('/remove/:id',deleteUser)

user.put('/edit/:id',updateUser )

// UPDATE PASSWORD USING EMAIL
user.put("/update-password",updatePassword);







export default  user;
