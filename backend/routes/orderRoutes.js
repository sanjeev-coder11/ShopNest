const express=require("express")
const {protect}=require("../middleware/authMiddleware");
const {admin}=require("../middleware/adminMiddeware");
const {createOrder,getOrders,updateOrderStatus, myOrders}=require("../controllers/orderController")

const router=express.Router();
router.route("/").post(protect,createOrder).get(protect,admin,getOrders);
router.route("/myorders").get(protect,myOrders)
router.route("/:id/status").put(protect,admin,updateOrderStatus)

module.exports=router;
