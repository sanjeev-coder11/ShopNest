const express=require("express")
const {protect}=require("../middleware/authMiddleware")
const {admin}=require("../middleware/adminMiddeware");
const { getAdminStats } = require("../controllers/anayticsController");

const router=express.Router();
router.get("/",protect,admin,getAdminStats);

module.exports=router;