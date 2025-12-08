// models/Coupon/couponModel.js
const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

const couponSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [3, 'Code must be at least 3 characters'],
    maxlength: [10, 'Code cannot exceed 10 characters']
  },
  discountPercent: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: [1, 'Discount must be at least 1%'],
    max: [90, 'Discount cannot exceed 90%']
  },
  minAmount: {
    type: Number,
    required: [true, 'Minimum order amount is required'],
    min: [0, 'Minimum amount cannot be negative']
  },
  maxDiscountAmount: {
    type: Number,
    min: [0, 'Max discount cannot be negative'],
    default: null
  },
  usageLimit: {
    type: Number,
    min: [1, 'Usage limit must be at least 1'],
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

couponSchema.pre('save', async function() {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'couponId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.seq;
  }
});

module.exports = mongoose.model('Coupon', couponSchema);
