const Review = require("../../models/Product/reviewModel.js");
const Product = require("../../models/Product/productModel.js");
const Auth = require("../../models/User/userModel.js");

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await Auth.findOne({ id: req.user.id });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const existingReview = await Review.findOne({ 
      product: product._id, 
      user: user._id 
    });
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this product' 
      });
    }

    const review = await Review.create({
      product: product._id,
      user: user._id,
      rating,
      comment
    });

    const reviews = await Review.find({ product: product._id });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = totalRating / reviews.length;
    product.numReviews = reviews.length;
    await product.save();

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reviews = await Review.find({ product: product._id })
      .populate('user', 'id name')
      .populate('product', 'id name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findOne({
      id: reviewId,
      user: req.user._id
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or not authorized' });
    }

    await review.deleteOne();

    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product });

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      product.averageRating = totalRating / reviews.length;
      product.numReviews = reviews.length;
    } else {
      product.averageRating = 0;
      product.numReviews = 0;
    }

    await product.save();

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addReview,
  getReviewsByProduct,
  deleteReview
};
