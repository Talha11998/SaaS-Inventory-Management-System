const express=require('express');
const router=express.Router();
const {auth}=require('../middlewares/Authentication');
const {getDashboard}=require('../controllers/dashboardControllers');

router.get('/dashboard',auth,getDashboard);

module.exports=router;