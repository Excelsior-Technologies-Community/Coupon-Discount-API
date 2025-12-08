const Product = require("../../models/Product/productModel.js");

const addProduct = async (req, res) => {
  try {
    const {name, price, description, status} = req.body;
    const images = req.file ? [`/images/${req.file.filename}`] : []; // ✅ Array
    
    const product = await Product.create({name, price, description, status, images});
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error('Get products error:', error);  // <- check this in terminal
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id, status: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found or inactive' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.images = [`/images/${req.file.filename}`]; // ✅ Use 'images'
    }
    
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error(error); // ✅ Add logging
    res.status(400).json({ success: false, message: error.message });
  }
};


const softDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id});
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found or already inactive' });
    }
    product.status = false;
    await product.save();
    res.status(200).json({ success: true, message: 'Product soft deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  softDeleteProduct
};
