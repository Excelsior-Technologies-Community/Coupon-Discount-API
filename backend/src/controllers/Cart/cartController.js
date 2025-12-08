const Cart = require('../../models/Cart/cartModel');
const Product = require('../../models/Product/productModel');
const Auth = require('../../models/User/userModel');

// Get or create cart for authenticated user
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
        totalAmount: 0
      });
    }

    // Populate product details using numeric id
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findOne({ id: item.productId });
        return {
          ...item.toObject(),
          product: product ? {
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images
          } : null
        };
      })
    );

    const cartWithProducts = {
      ...cart.toObject(),
      items: populatedItems
    };

    res.status(200).json({
      success: true,
      data: cartWithProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;  // ✅ Numeric productId

    // ✅ Find by numeric id
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
        totalAmount: 0
      });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(item =>
      item.productId === productId  // ✅ Numeric comparison
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: productId,  // ✅ Store numeric id
        quantity,
        price: product.price
      });
    }

    cart.totalAmount = cart.items.reduce((sum, item) =>
      sum + (item.quantity * item.price), 0
    );

    await cart.save();

    res.status(201).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;  // ✅ Numeric productId

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item =>
      item.productId === productId  // ✅ Numeric comparison
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.totalAmount = cart.items.reduce((sum, item) =>
      sum + (item.quantity * item.price), 0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;  // ✅ Numeric productId

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item =>
      item.productId != productId  // ✅ Numeric comparison
    );

    cart.totalAmount = cart.items.reduce((sum, item) =>
      sum + (item.quantity * item.price), 0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Empty the cart
    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared successfully", data: cart, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};



module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
