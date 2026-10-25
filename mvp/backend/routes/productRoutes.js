const express=require('express');
const router=express.Router();
const {auth}=require('../middlewares/Authentication');
const {productsList,createProduct,getProduct,updateProduct,adjustProductStock,deleteProduct}=require('../controllers/productControllers');

router.get('/products',auth,productsList);
router.post('/products',auth,createProduct);
router.get('/products/:id',auth,getProduct);
router.put('/products/:id/edit',auth,updateProduct);
router.post('/products/:id/adjust',auth,adjustProductStock);
router.delete('/products/:id',auth,deleteProduct);

module.exports=router;