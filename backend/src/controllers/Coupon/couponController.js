// controllers/Coupon/couponController.js
const Coupon = require('../../models/Coupon/couponModel');

// Admin: Create coupon
const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Admin: Get all coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: Validate & apply coupon
const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    
    if (!code || !cartTotal) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and cart total are required'
      });
    }

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      isActive: true,
      expiryDate: { $gt: new Date() }
    });

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired coupon'
      });
    }

    // Check minimum amount
    if (cartTotal < coupon.minAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount $${coupon.minAmount} required`
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'Coupon usage limit reached'
      });
    }

    // Calculate discount
    let discountAmount = (cartTotal * coupon.discountPercent) / 100;
    
    // Apply max discount limit
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }

    res.status(200).json({
      success: true,
      data: {
        coupon,
        discountPercent: coupon.discountPercent,
        discountAmount: Math.round(discountAmount * 100) / 100, // 2 decimal
        finalAmount: Math.round((cartTotal - discountAmount) * 100) / 100
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update coupon usage (called after successful order)
const useCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    
    const coupon = await Coupon.findOneAndUpdate(
      { code: code.toUpperCase(), isActive: true },
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  validateCoupon,
  useCoupon
};
