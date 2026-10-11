const express=require("express");
const { createOrder, verifyPayment } = require('../controllers/paymentController');




const router=express.Router();
router.post("/order",);
router.post("/verify",verifyPayment);

module.exports=router;
