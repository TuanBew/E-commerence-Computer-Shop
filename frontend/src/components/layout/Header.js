// frontend/src/components/layout/Header.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart, FaBars } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <header className="bg-white shadow-md">
      {/* Top header with contact info */}
      <div className="bg-gray-800 text-white py-2">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="text-sm">
            <span className="mr-4">Hotline: 1800-1234</span>
            <span>Email: support@techstore.com</span>
          </div>
          <div className="text-sm">
            {user ? (
              <Link to="/profile" className="hover:text-blue-300">My Account</Link>
            ) : (
              <div>
                <Link to="/login" className="hover:text-blue-300 mr-3">Login</Link>
                <Link to="/register" className="hover:text-blue-300">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main header with logo, search, and cart */}
      <div className="container mx-auto py-4 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <Link to="/" className="mb-4 md:mb-0">
            <img src={logo} alt="TechStore" className="h-12" />
          </Link>
          
          {/* Search bar */}
          <form 
            onSubmit={handleSearch} 
            className="w-full md:w-2/5 flex mb-4 md:mb-0"
          >
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-l focus:outline-none"
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
            >
              <FaSearch />
            </button>
          </form>
          
          {/* User and Cart */}
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <Link to={user ? "/profile" : "/login"} className="flex items-center">
                <FaUser className="text-gray-700 text-xl mr-2" />
                <div className="hidden md:block">
                  <div className="text-xs text-gray-500">Account</div>
                  <div className="text-sm font-semibold">
                    {user ? user.fullName.split(' ')[0] : 'Login'}
                  </div>
                </div>
              </Link>
              
              {user && (
                <div className="absolute z-10 hidden group-hover:block w-48 bg-white shadow-lg rounded-md mt-2 right-0 py-2">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                  <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                  <hr className="my-1" />
                  <button 
                    onClick={() => {/* handle logout */}} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            
            <Link to="/cart" className="flex items-center">
              <div className="relative">
                <FaShoppingCart className="text-gray-700 text-2xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden md:block ml-2">
                <div className="text-xs text-gray-500">Cart</div>
                <div className="text-sm font-semibold">
                  {cartItems.length > 0 ? `${totalItems} item(s)` : 'Empty'}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Navigation bar */}
      <nav className="bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Categories dropdown */}
            <div className="relative group py-3">
              <button 
                className="flex items-center space-x-2 font-medium"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <FaBars />
                <span>All Categories</span>
              </button>
              
              {/* Dropdown menu */}
              <div 
                className={`absolute z-10 w-64 bg-white shadow-lg rounded-b-md text-gray-800 ${isMenuOpen ? 'block' : 'hidden group-hover:block'}`}
              >
                <Link to="/products/category/laptops" className="block px-4 py-3 hover:bg-gray-100 border-b">Laptops</Link>
                <Link to="/products/category/desktops" className="block px-4 py-3 hover:bg-gray-100 border-b">Desktop PCs</Link>
                <Link to="/products/category/components" className="block px-4 py-3 hover:bg-gray-100 border-b">Components</Link>
                <Link to="/products/category/monitors" className="block px-4 py-3 hover:bg-gray-100 border-b">Monitors</Link>
                <Link to="/products/category/peripherals" className="block px-4 py-3 hover:bg-gray-100">Peripherals</Link>
              </div>
            </div>
            
            {/* Main navigation links */}
            <div className="hidden md:flex space-x-8 py-3">
              <Link to="/" className="hover:text-blue-200">Home</Link>
              <Link to="/products/new" className="hover:text-blue-200">New Products</Link>
              <Link to="/products/best-sellers" className="hover:text-blue-200">Best Sellers</Link>
              <Link to="/promotions" className="hover:text-blue-200">Promotions</Link>
              <Link to="/contact" className="hover:text-blue-200">Contact</Link>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-3 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FaBars />
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div className={`md:hidden bg-gray-100 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-2">
          <Link to="/" className="block py-2 hover:text-blue-600">Home</Link>
          <Link to="/products/new" className="block py-2 hover:text-blue-600">New Products</Link>
          <Link to="/products/best-sellers" className="block py-2 hover:text-blue-600">Best Sellers</Link>
          <Link to="/promotions" className="block py-2 hover:text-blue-600">Promotions</Link>
          <Link to="/contact" className="block py-2 hover:text-blue-600">Contact</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;