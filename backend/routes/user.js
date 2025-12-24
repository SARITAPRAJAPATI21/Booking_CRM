import expres from 'express'
import {register,login,AllUser,findUser,deleteUser, updateUser} from '../controller/userController.js';
import { authMiddleware,allowRoles } from '../middleware/auth.js';

const user= expres.Router();

user.post('/register',authMiddleware, allowRoles('admin'),register)

user.post('/login',login)

user.post('/findUser',authMiddleware,findUser)

user.get('/allUser',AllUser)

user.delete('/remove/:id',deleteUser)

user.put('/edit/:id',updateUser )






export default  user;
