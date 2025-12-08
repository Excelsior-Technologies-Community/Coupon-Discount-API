// routes/Coupon/couponRoutes.js
const express = require('express');
const {
  createCoupon,
  getAllCoupons,
  validateCoupon,
  useCoupon
} = require('../../controllers/Coupon/couponController');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.post('/Validate', validateCoupon);
router.post('/', createCoupon);
router.get('/', getAllCoupons);
router.post('/use',protect, useCoupon);



module.exports = router;
