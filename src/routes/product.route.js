// productRoutes.js

import express from 'express';
const router = express.Router();
import * as productController from '../controllers/product.controller.js';
import { upload } from "../middlewares/multer.middleware.js"


// Routes for products
// router.post('/products', upload.single("product-image"), productController.createProduct);
router.post('/products', upload.array('product-image', 5), productController.createProduct);

router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

export default router;
