const express = require("express");
const {
  addReview,
  getReviewsByProduct,
  deleteReview
} = require("../../controllers/Product/reviewController.js");
const { protect } = require("../../middleware/auth.js");

const router = express.Router({ mergeParams: true });

router.post('/', protect, addReview);
router.get('/', getReviewsByProduct);
router.delete('/:id', protect, deleteReview);

module.exports = router;
