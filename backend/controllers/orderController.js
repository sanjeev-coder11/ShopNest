const Order = require("../model/Order");
const {sendEmail} = require("../utils/sendEmail");

//1)create a new order 
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentId } = req.body;
        if (!items || items.length === 0 || !totalAmount || !address) {
            return res.status(400).json({ message: "Invalid Order Data" })
        }
        else {
            const order = new Order({
                user: req.user._id,
                items,
                totalAmount,
                address,
                paymentId
            })
            await order.save();
            // Send Order Confirmation Email
            const message = `Dear ${req.user.name}, \n\nThank you for your order! your order  has been successfully 
            created with the folowing details:\n\nOrder Id:${order._id}\nTotal Amount:${totalAmount}
            \nshipping Address:${address}\n\n We will notify you order is shipped.\n\nBest regards,\nshopNest Team`

            await sendEmail(req.user.email, "Order created",  message);
            res.status(201).json({ message: "order created successfully", order })
        }
    } catch (error) {
        res.status(500).json({
            message: "Order creation failed",
            error: error.message
        });

    }
}


// 2)GET MY ORDERS - LOGGED-IN USER
const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("items.productId", "name price")
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get orders",
            error: error.message
        })
    }
}

// 3) GET ALL ORDERS - ADMIN
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get orders",
            error: error.message
        });
    }
};

//4)// UPDATE ORDER STATUS - ADMIN
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id)
        if (order) {
            order.status = status;
            await order.save();
            res.json({ message: "Order staus updated", order })
        } else {
            res.status(404).json({ message: "Order not found" })
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update order status",
            error: error.message
        });
    }
}

module.exports = { createOrder, myOrders, getOrders, updateOrderStatus };
