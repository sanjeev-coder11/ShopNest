const User = require("../model/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {sendEmail} = require("../utils/sendEmail")

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}


//Register a new user 
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exist " });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await User.create({ name, email, password: hashedPassword });

        if (user) {
            //const otp = Math.floor(100000 + Math.random() * 900000).toString();
            //const message = `welcome to our patform,your OTP for registation is :${otp}`;

            //await sendEmail(email, 'welcome to ShopNest -Your OTP for registration ', message);

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" })
    }
}

//Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                role: user.role,
                token: generateToken(user._id)
            })
        } else {
            res.status(400).json({ message: "Invaid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
}

//Get user
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password")
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
}
module.exports = { registerUser, loginUser, getUsers };