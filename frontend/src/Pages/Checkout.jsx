import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/api/Cart/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success && res.data.data.items.length === 0) {
        toast.info('Your cart is empty');
        navigate('/cart');
        return;
      }

      setCart(res.data.data);
    } catch (err) {
      toast.error('Failed to load cart');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter coupon code');
      return;
    }

    setApplyingCoupon(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8000/api/Coupon/Validate', {
        code: couponCode.trim(),
        cartTotal: cart.totalAmount
      });

      if (res.data.success) {
        setCoupon(res.data.data);
        toast.success(`Coupon applied! Save $${res.data.data.discountAmount}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const handlePlaceOrder = async () => {
    if (!address.name || !address.street || !address.city || !address.zipCode || !address.phone) {
      toast.error('Please fill all address fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Here you would call your order creation API
      toast.success('Order placed successfully! 🎉');

      // Clear cart after successful order
      await axios.delete('http://localhost:8000/api/Cart/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/home');
    } catch (err) {
      toast.error('Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-6"></div>
          <p className="text-2xl font-semibold text-gray-700">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center p-12">
          <div className="text-8xl mb-8">🛒</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">No items in cart</h2>
          <button
            onClick={() => navigate('/cart')}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            ← Back to Cart
          </button>
        </div>
      </div>
    );
  }

  const finalTotal = coupon ? coupon.finalAmount : cart.totalAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Order Summary */}
          <div className="lg:order-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 sticky top-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Order Summary</h2>

              {/* Cart Items Summary */}
              <div className="space-y-4 mb-8 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={`http://localhost:8000${item.product?.images?.[0] || '/placeholder.jpg'}`}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{item.product?.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal & Discount */}
              <div className="space-y-4 mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span>${cart.totalAmount.toFixed(2)}</span>
                </div>

                {coupon && (
                  <>
                    <div className="flex justify-between text-lg text-green-600 font-semibold">
                      <span>Discount ({coupon.discountPercent}%):</span>
                      <span>-${coupon.discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                      <span className="font-bold text-xl text-green-800">Coupon: {couponCode}</span>
                      <button
                        onClick={removeCoupon}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-2xl font-bold text-gray-900">
                    <span>Total:</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Input */}
              {!coupon && (
                <div className="mb-8">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={applyingCoupon || !couponCode.trim()}
                      className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {applyingCoupon ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="lg:order-1">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Shipping Address</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  className="p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 w-full"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 w-full"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="md:col-span-2 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 w-full"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 w-full"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 w-full"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  className="p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 w-full"
                />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h3>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <label className="flex items-center p-4 border-2 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-200 group">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-5 h-5 text-indigo-600"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">💳 Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Safe and secure</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-200 group">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 w-5 h-5 text-indigo-600"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">📦 Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when you receive</div>
                  </div>
                </label>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={!address.name || !address.street || !address.city || !address.zipCode || !address.phone}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-5 px-8 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                <span>🛒</span>
                <span>Place Order - ${finalTotal.toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
