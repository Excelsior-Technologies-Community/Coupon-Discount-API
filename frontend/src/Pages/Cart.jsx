import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to view cart');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/api/Cart/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    const token = localStorage.getItem('token');
    
    try {
      setUpdating(prev => ({ ...prev, [productId]: true }));
      await axios.put('http://localhost:8000/api/Cart/', 
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Cart updated!');
      fetchCart(); // Refresh cart
      window.dispatchEvent(new CustomEvent('cartUpdated')); // Update navbar
    } catch (err) {
      toast.error('Failed to update cart');
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId) => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.delete(`http://localhost:8000/api/Cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Item removed!');
      fetchCart();
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };




  const handleCheckout = () => {
    if (!cart?.items?.length) {
      toast.error('Cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-xl text-gray-600">
            {totalItems === 0 ? 'No items' : `${totalItems} item${totalItems !== 1 ? 's' : ''}`}
          </p>
        </div>

        {totalItems === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-xl border-4 border-dashed border-gray-200">
            <div className="text-7xl mb-8 mx-auto w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-lg">
              🛒
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-xl text-gray-600 mb-8">Looks like you haven't added anything yet</p>
            <button 
              onClick={() => navigate('/products')}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Start Shopping →
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="grid gap-6 mb-12">
              {cart.items.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition-all duration-200 hover:-translate-y-1">
                  <div className="grid grid-cols-12 items-center gap-6">
                    {/* Product Image */}
                    <div className="col-span-3">
                      <img 
                        src={`http://localhost:8000${item.product?.images?.[0] || '/images/default.jpg'}`} 
                        alt={item.product?.name}
                        className="w-full h-32 object-cover rounded-2xl shadow-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="col-span-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.product?.name}</h3>
                      <p className="text-2xl font-bold text-indigo-600">{item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-xl">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={updating[item.productId] || item.quantity <= 1}
                          className="w-10 h-10 rounded-lg bg-white shadow flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-lg px-4">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={updating[item.productId]}
                          className="w-10 h-10 rounded-lg bg-white shadow flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-1 text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => removeItem(item.productId)}
                        disabled={updating[item.productId]}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50"
                        title="Remove item"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 max-w-md mx-auto lg:ml-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-lg">
                  <span>Items ({totalItems}):</span>
                  <span>${cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total:</span>
                  <span>${cart.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-200"
                >
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
