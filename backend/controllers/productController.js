const Product = require("../model/Product")
const cloudinary = require("../config/cloudinary")

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
}

//Get Single Product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: "Product not found" })
        }
    } catch (error) {
        console.log(error);
    }
}

//create product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        let imageUrl = " ";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            //console.log(result)
            imageUrl = result.secure_url;
        }

        const product = new Product({ name, description, price, category, stock, imageUrl })

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({
            message: "Product creation failed",
            error: error.message
        })
    }
}

//UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path)
                console.log(result);
                product.imageUrl = result.secure_url;
            }
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }
        else {
            res.status(404).json({ message: "Product not found" })
        }

    }
    catch (error) {
        res.status(500).json({
            message: "Product update failed",
            error: error.message
        })
    }
}

//Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: "Product deleted successfully" })
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "server error" })
    }
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };