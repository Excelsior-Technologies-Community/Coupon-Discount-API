import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (product.status === false) {
      toast.error('Product is out of stock');
      return;
    }

    setAddingToCart(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        return;
      }

      await axios.post(
        'http://localhost:8000/api/Cart/',
        { productId: product.id, quantity: cartQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Added to cart!');
      // Optionally update cart count globally via context or event
      window.dispatchEvent(new CustomEvent('cartUpdated')); // we'll use in Navbar

    } catch (err) {
      toast.error('Failed to add to cart');
    }
    setAddingToCart(false);
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/Product/${id}`);
      if (res.data.success) {
        setProduct(res.data.data);
      }
    } catch (err) {
      console.error('Product fetch error:', err);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/${id}/Review`);
      if (res.data.success) {
        setReviews(res.data.data || []);
      }
    } catch (err) {
      console.error('Reviews fetch error:', err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newRating || !newComment.trim()) {
      toast.error('Please provide rating and comment');
      return;
    }

    try {
      setSubmitting(true);

      // ✅ Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      await axios.post(
        `http://localhost:8000/api/${id}/Review/`,  // ✅ Fixed path (trailing slash)
        { rating: newRating, comment: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`  // ✅ Bearer token header
          }
        }
      );

      toast.success('Review added successfully!');
      setShowReviewForm(false);
      setNewRating(0);
      setNewComment('');
      fetchProduct();
      fetchReviews();
    } catch (err) {
      console.error('Add review error:', err);
      const msg = err?.response?.data?.message || 'Failed to add review';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-8 mx-auto w-32 h-32 bg-gray-200 rounded-3xl flex items-center justify-center">
            📦
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h3>
          <Link
            to="/"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-300 font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ⭐ Show EXACT number of stars (1–5)
  const renderStarsExact = (rating) => {
    const count = Number(rating) || 0;
    return (
      <span className="text-yellow-400 text-xl">
        {'⭐'.repeat(count)}
      </span>
    );
  };

  const overallRating =
    reviews.length > 0
      ? Math.round(
        reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
      )
      : 0;

  const totalRatings = reviews.length;

  const renderStarsFull = (rating) => {
    const value = Number(rating) || 0;
    const rounded = Math.round(value);

    return Array.from({ length: rounded }).map((_, index) => (
      <span key={index} className="text-yellow-400 text-2xl">
        ⭐
      </span>
    ));
  };


  const starRating = Math.round(overallRating);


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/home" className="text-gray-400 hover:text-gray-500">🏠 Home</Link>
              </li>
              <li>
                <span className="text-gray-400"> / </span>
                <Link to="/home" className="text-gray-500 hover:text-gray-700">Products</Link>
              </li>
              <li>
                <span className="text-gray-400"> / </span>
                <span className="text-gray-900 font-medium">{product.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Product Image */}
          <div className="lg:sticky lg:top-24 lg:h-screen lg:overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-100">
              {product.images?.length > 0 ? (
                <img
                  src={`http://localhost:8000${product.images[0]}`}
                  alt={product.name}
                  className="w-full h-96 lg:h-[500px] object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-96 lg:h-[500px] bg-gray-200 flex items-center justify-center text-5xl">📦</div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{product.name}</h1>

            <div className="flex items-start justify-between mt-4">
              <div className="text-5xl font-extrabold text-indigo-600">${product.price}</div>

              <div className="mt-6 flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  value={cartQuantity}
                  onChange={e => setCartQuantity(Number(e.target.value))}
                  className="w-20 px-3 py-2 border rounded"
                />
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-1">
                  {renderStarsFull(product.averageRating)}
                  <span className="ml-2 text-lg font-semibold">
                    {product.averageRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{product.numReviews} reviews</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold">Description</h3>
              <p className="text-gray-700 mt-2">{product.description}</p>
            </div>

            <div className="flex items-center mt-4 space-x-2">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${product.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {product.status ? 'In Stock' : 'Out of Stock'}
              </div>
              <span className="text-sm text-gray-500">ID: #{product.id}</span>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Customer Reviews</h2>
            <div className="text-right">
              <div>{renderStarsFull(product.averageRating)}</div>
              <p className="text-xl font-bold">{product.averageRating.toFixed(1)} average</p>
              <p className="text-gray-500">{product.numReviews} reviews</p>
            </div>
          </div>

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white p-8 rounded-2xl shadow-lg border">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-xl">
                      {review.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold">{review.user?.name || "Anonymous"}</h4>
                      <div className="flex items-center text-sm">
                        {renderStarsExact(review.rating)}
                        <span className="ml-2 text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl shadow-lg border mb-12">
              <div className="text-7xl">💬</div>
              <h3 className="text-3xl font-bold mt-4">No Reviews Yet</h3>
              <p className="text-xl text-gray-600">Be the first to share!</p>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm ? (
            <form onSubmit={handleSubmitReview} className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border">
              <h3 className="text-2xl font-bold mb-6">Write a Review</h3>

              <label className="block mb-2 font-semibold">Rating</label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-full p-4 border-2 rounded-xl mb-6"
              >
                <option value={0}>Select Rating</option>
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>
                ))}
              </select>

              <label className="block mb-2 font-semibold">Your Review</label>
              <textarea
                rows={5}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-4 border-2 rounded-xl mb-8"
                placeholder="Share your experience..."
              />

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-200 rounded-xl"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-12 py-5 bg-indigo-600 text-white rounded-3xl font-bold"
              >
                ✍️ Write a Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
