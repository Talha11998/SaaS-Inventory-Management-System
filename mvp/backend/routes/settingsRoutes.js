const express=require('express');
const router=express.Router();
const {auth}=require('../middlewares/Authentication');
const settingsController=require('../controllers/settingsControllers');


router.get('/settings',auth,settingsController.getSettings);
router.put('/settings',auth,settingsController.updateSettings);

module.exports=router;