const express=require('express');
const router=express.Router();
const userController=require('../controllers/userControllers');

router.post('/auth/signup',userController.signup);
router.post('/auth/login',userController.login);

module.exports=router;