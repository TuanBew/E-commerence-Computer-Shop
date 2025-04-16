// frontend/src/pages/CartPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrashAlt, FaTimes, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { 
  updateCartItemQuantity, 
  removeFromCart, 
  clearCart, 
  applyDiscountCode 
} from '../redux/slices/cartSlice';
import { formatCurrency } from '../utils/formatters';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, discountCode, discountAmount, loading, error } = useSelector(state => state.cart);
  
  const [inputDiscountCode, setInputDiscountCode] = useState('');
  
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartItemQuantity({ id, quantity: newQuantity }));
    }
  };
  
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  const handleApplyDiscount = () => {
    if (inputDiscountCode.trim()) {
      dispatch(applyDiscountCode(inputDiscountCode));
    }
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const shippingFee = subtotal > 2000000 ? 0 : 50000; // Free shipping over 2,000,000 VND
  const total = subtotal + tax + shippingFee - discountAmount;
  
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-gray-400 mb-6">
            <FaShoppingBag className="inline-block text-5xl" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link 
            to="/products" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Cart Items ({cartItems.length})</h2>
                <button 
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {cartItems.map(item => (
                <li key={item.id} className="p-4 flex flex-col sm:flex-row">
                  {/* Product image */}
                  <div className="flex-shrink-0 w-24 h-24 sm:mr-6 mx-auto sm:mx-0 mb-4 sm:mb-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          <Link to={`/product/${item.productId}`} className="hover:text-blue-600">
                            {item.name}
                          </Link>
                        </h3>
                        
                        {/* Show variants if any */}
                        {item.attributes && Object.entries(item.attributes).length > 0 && (
                          <div className="text-sm text-gray-500 mt-1">
                            {Object.entries(item.attributes).map(([key, value]) => (
                              <span key={key}>
                                {key}: {value}
                                <span className="mx-1">|</span>
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-blue-600 font-bold mt-1">
                          {formatCurrency(item.price)}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center mt-4 sm:mt-0">
                        {/* Quantity selector */}
                        <div className="flex border rounded-md mr-4 mb-4 sm:mb-0">
                          <button 
                            className="px-3 py-1 bg-gray-100 border-r"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            className="w-12 text-center py-1 border-none focus:outline-none focus:ring-0"
                          />
                          <button 
                            className="px-3 py-1 bg-gray-100 border-l"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Item total and remove button */}
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-gray-800 mb-1">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 flex items-center text-sm"
                          >
                            <FaTrashAlt className="mr-1" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="p-4 border-t">
              <Link to="/products" className="text-blue-600 hover:underline flex items-center">
                <FaArrowLeft className="mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-800">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 
                    ? <span className="text-green-600">Free</span>
                    : formatCurrency(shippingFee)
                  }
                </span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discountCode})</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            
            {/* Discount code field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Code
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={inputDiscountCode}
                  onChange={(e) => setInputDiscountCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleApplyDiscount}
                  disabled={loading || !inputDiscountCode.trim()}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-r-md disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
              
              {discountCode && (
                <div className="flex items-center mt-2 text-green-600 text-sm">
                  <span className="mr-1">Code "{discountCode}" applied!</span>
                  <button 
                    onClick={() => dispatch({ type: 'cart/removeDiscountCode' })}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors duration-300"
            >
              Proceed to Checkout
            </button>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              By proceeding, you agree to our Terms and Conditions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;