require("dotenv").config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require("express");
const cors = require("cors");
const path = require('path');
require("dotenv").config();
const userRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes")
const orderRoutes=require("./routes/orderRoutes")
const analyticsRoutes=require("./routes/analyticsRoutes")
const paymentRoutes=require("./routes/paymentRoutes")
const connectDB = require("./config/db")
connectDB();


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
 app.use("/api/orders",orderRoutes)
 app.use("/api/payment", paymentRoutes);

app.use("/api/analytics",analyticsRoutes);

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}
const PORT = process.env.PORT || 6060;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`server is running on port ${PORT}`);
})