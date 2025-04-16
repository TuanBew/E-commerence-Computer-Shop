// frontend/src/pages/CheckoutPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FaShoppingBag, FaCreditCard, FaMoneyBillWave, FaUserAlt, FaTruck, FaRegCheckCircle } from 'react-icons/fa';
import { createOrder } from '../redux/thunks/orderThunks';
import { clearCart } from '../redux/slices/cartSlice';
import { formatCurrency } from '../utils/formatters';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems, discountCode, discountAmount } = useSelector(state => state.cart);
  const { user, isAuthenticated, loading: authLoading } = useSelector(state => state.auth);
  const { loading, success, error, order } = useSelector(state => state.orders);
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loyaltyPointsUsed, setLoyaltyPointsUsed] = useState(0);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  // Calculate order totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const shippingFee = subtotal > 2000000 ? 0 : 50000; // Free shipping over 2,000,000 VND
  const loyaltyDiscount = loyaltyPointsUsed * 1000; // 1 point = 1,000 VND
  const total = subtotal + tax + shippingFee - discountAmount - loyaltyDiscount;
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !success) {
      navigate('/cart');
    }
  }, [cartItems, navigate, success]);
  
  // Fetch user's addresses if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // In a real app, you'd fetch this from the API
      // For now, we'll use mock data if the user object has addresses
      if (user.addresses) {
        setAddresses(user.addresses);
        
        // Set default address if available
        if (user.defaultAddressId) {
          setSelectedAddressId(user.defaultAddressId);
          
          // Pre-fill the form with default address
          const defaultAddress = user.addresses.find(addr => addr._id === user.defaultAddressId);
          if (defaultAddress) {
            Object.entries(defaultAddress).forEach(([key, value]) => {
              setValue(key, value);
            });
          }
        }
      }
    }
  }, [isAuthenticated, user, setValue]);
  
  // Handle form submission
  const onSubmit = (data) => {
    if (step === 1) {
      // Move to payment step
      setStep(2);
    } else {
      // Create order
      const orderData = {
        items: cartItems,
        shippingAddress: data,
        paymentMethod,
        subtotal,
        tax,
        shippingFee,
        discountCode,
        discountAmount,
        loyaltyPointsUsed,
        total
      };
      
      dispatch(createOrder(orderData));
    }
  };
  
  // Handle address selection
  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    
    // Fill form with selected address
    const selectedAddress = addresses.find(addr => addr._id === addressId);
    if (selectedAddress) {
      Object.entries(selectedAddress).forEach(([key, value]) => {
        if (key !== '_id') {
          setValue(key, value);
        }
      });
    }
  };
  
  // Handle loyalty points input
  const handleLoyaltyPointsChange = (e) => {
    const value = parseInt(e.target.value);
    
    if (isNaN(value) || value < 0) {
      setLoyaltyPointsUsed(0);
    } else if (user && value > user.loyaltyPoints) {
      setLoyaltyPointsUsed(user.loyaltyPoints);
    } else {
      setLoyaltyPointsUsed(value);
    }
  };
  
  // Handle order success
  useEffect(() => {
    if (success && order) {
      // Clear cart after successful order
      dispatch(clearCart());
      
      // Navigate to order confirmation
      navigate(`/order/confirmation/${order._id}`);
    }
  }, [success, order, dispatch, navigate]);
  
  // If order is successfully placed and we're redirecting
  if (success && order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-lg mx-auto">
          <div className="text-green-500 mb-4">
            <FaRegCheckCircle className="inline-block text-5xl" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Processing Your Order...</h2>
          <p className="text-gray-600">Please wait, you will be redirected shortly.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {/* Checkout progress */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-3xl">
          <div className="flex items-center">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                <FaUserAlt />
              </div>
              <span className="text-sm mt-1">Information</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                <FaTruck />
              </div>
              <span className="text-sm mt-1">Payment</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 3 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                <FaRegCheckCircle />
              </div>
              <span className="text-sm mt-1">Confirmation</span>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checkout form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg">
                {step === 1 ? 'Shipping Information' : 'Payment Method'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              {step === 1 && (
                <>
                  {/* Saved addresses (for logged in users) */}
                  {isAuthenticated && addresses.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select a saved address
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map(address => (
                          <div 
                            key={address._id}
                            className={`border rounded-md p-3 cursor-pointer ${
                              selectedAddressId === address._id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                            }`}
                            onClick={() => handleAddressSelect(address._id)}
                          >
                            <div className="font-medium">{address.fullName}</div>
                            <div className="text-sm text-gray-600">
                              {address.addressLine1}, 
                              {address.addressLine2 && `${address.addressLine2}, `}
                              {address.city}, {address.state} {address.postalCode}
                            </div>
                            <div className="text-sm text-gray-600">
                              {address.phoneNumber}
                            </div>
                            {address._id === user.defaultAddressId && (
                              <div className="text-xs text-blue-600 mt-1">Default Address</div>
                            )}
                          </div>
                        ))}
                        <div 
                          className="border border-dashed border-gray-300 rounded-md p-3 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            setSelectedAddressId(null);
                            setUseDefaultAddress(false);
                            // Clear form fields
                            ['fullName', 'phoneNumber', 'addressLine1', 'addressLine2', 'city', 'state', 'postalCode'].forEach(
                              field => setValue(field, '')
                            );
                          }}
                        >
                          + Add New Address
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Contact Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          {...register('fullName', { required: 'Full name is required' })}
                          className={`w-full border rounded-md px-3 py-2 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.fullName && (
                          <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="text"
                          {...register('phoneNumber', { 
                            required: 'Phone number is required',
                            pattern: {
                              value: /^[0-9]{10,11}$/,
                              message: 'Please enter a valid phone number'
                            }
                          })}
                          className={`w-full border rounded-md px-3 py-2 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.phoneNumber && (
                          <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        {...register('addressLine1', { required: 'Address is required' })}
                        placeholder="Street address, apartment, etc."
                        className={`w-full border rounded-md px-3 py-2 ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.addressLine1 && (
                        <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        {...register('addressLine2')}
                        placeholder="Apartment, suite, unit, etc. (optional)"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          {...register('city', { required: 'City is required' })}
                          className={`w-full border rounded-md px-3 py-2 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province *
                        </label>
                        <input
                          type="text"
                          {...register('state', { required: 'State is required' })}
                          className={`w-full border rounded-md px-3 py-2 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.state && (
                          <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          {...register('postalCode', { required: 'Postal code is required' })}
                          className={`w-full border rounded-md px-3 py-2 ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.postalCode && (
                          <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <input
                      type="hidden"
                      {...register('country')}
                      value="Vietnam"
                    />
                    
                    {isAuthenticated && (
                      <div className="mt-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={useDefaultAddress}
                            onChange={(e) => setUseDefaultAddress(e.target.checked)}
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            Save as default shipping address
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {step === 2 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
                  
                  <div className="space-y-4">
                    <label className={`block border rounded-md p-4 cursor-pointer ${paymentMethod === 'credit_card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={paymentMethod === 'credit_card'}
                          onChange={() => setPaymentMethod('credit_card')}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <span className="flex items-center text-gray-900 font-medium">
                            <FaCreditCard className="mr-2 text-blue-600" /> Credit/Debit Card
                          </span>
                          <span className="text-sm text-gray-500 mt-1">
                            Pay securely with your card
                          </span>
                        </div>
                      </div>
                    </label>
                    
                    <label className={`block border rounded-md p-4 cursor-pointer ${paymentMethod === 'bank_transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank_transfer"
                          checked={paymentMethod === 'bank_transfer'}
                          onChange={() => setPaymentMethod('bank_transfer')}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <span className="flex items-center text-gray-900 font-medium">
                            <FaMoneyBillWave className="mr-2 text-green-600" /> Bank Transfer
                          </span>
                          <span className="text-sm text-gray-500 mt-1">
                            Make a direct bank transfer
                          </span>
                        </div>
                      </div>
                    </label>
                    
                    <label className={`block border rounded-md p-4 cursor-pointer ${paymentMethod === 'cash_on_delivery' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash_on_delivery"
                          checked={paymentMethod === 'cash_on_delivery'}
                          onChange={() => setPaymentMethod('cash_on_delivery')}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="ml-3">
                        <span className="flex items-center text-gray-900 font-medium">
                            <FaShoppingBag className="mr-2 text-orange-600" /> Cash on Delivery
                          </span>
                          <span className="text-sm text-gray-500 mt-1">
                            Pay when you receive your order
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  {/* Loyalty points section for logged in users */}
                  {isAuthenticated && user && user.loyaltyPoints > 0 && (
                    <div className="mt-8 border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Use Loyalty Points</h3>
                      <div className="mb-2 text-sm text-gray-600">
                        You have {user.loyaltyPoints} points available ({formatCurrency(user.loyaltyPoints * 1000)})
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="0"
                          max={user.loyaltyPoints}
                          value={loyaltyPointsUsed}
                          onChange={handleLoyaltyPointsChange}
                          className="w-24 border border-gray-300 rounded-l-md px-3 py-2"
                        />
                        <div className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3 py-2 text-gray-700">
                          Points
                        </div>
                        <div className="ml-4 text-green-600">
                          {formatCurrency(loyaltyPointsUsed * 1000)} discount
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md"
                  >
                    Back
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate('/cart')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md"
                  >
                    Return to Cart
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md flex items-center disabled:opacity-50"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {step === 1 ? 'Continue to Payment' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="max-h-80 overflow-y-auto mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex py-3 border-b">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    {item.attributes && Object.entries(item.attributes).length > 0 && (
                      <div className="text-xs text-gray-500">
                        {Object.entries(item.attributes).map(([key, value]) => (
                          <span key={key}>
                            {key}: {value}
                            <span className="mx-1">|</span>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                      <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
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
              
              {loyaltyPointsUsed > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Loyalty Points ({loyaltyPointsUsed})</span>
                  <span>-{formatCurrency(loyaltyPointsUsed * 1000)}</span>
                </div>
              )}
              
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            
            {step === 2 && (
              <div className="text-sm text-gray-500 mt-6">
                <p className="font-medium text-gray-700 mb-2">By completing your purchase, you agree to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Our Terms of Service</li>
                  <li>Our Return Policy</li>
                  <li>Our Privacy Policy</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;