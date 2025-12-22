import express from 'express'
import  {createProduct,getProductById,getProducts,updateProduct,deleteProduct,getBookingHistory} from '../controller/productController.js'

import{ authMiddleware, allowRoles } from  '../middleware/auth.js'

const  productRoute = express.Router();

// Public routes for viewing (user + admin)
productRoute.get('/all', authMiddleware, allowRoles('admin', 'user','developer'), getProducts);
productRoute.get('/products/:id', authMiddleware, allowRoles('admin', 'user'),getProductById);

// Admin-only routes
productRoute.post('/add', authMiddleware, allowRoles('admin','user','developer'), createProduct);
productRoute.put('/edit/:id', authMiddleware, allowRoles('admin','user'),updateProduct);
productRoute.delete('/delete/:id', authMiddleware, allowRoles('admin'),deleteProduct);

productRoute.get("/:id/history", getBookingHistory);
export default productRoute;