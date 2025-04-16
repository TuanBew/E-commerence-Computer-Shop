// frontend/src/components/layout/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import logo from '../../assets/images/logo-white.png';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img src={logo} alt="TechStore" className="h-10 mb-4" />
            <p className="text-gray-400 mb-4">
              Your trusted destination for high-quality computer components and tech products.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaInstagram size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          
          {/* Product Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/products/category/laptops" className="text-gray-400 hover:text-white">Laptops</Link></li>
              <li><Link to="/products/category/desktops" className="text-gray-400 hover:text-white">Desktop PCs</Link></li>
              <li><Link to="/products/category/components" className="text-gray-400 hover:text-white">Components</Link></li>
              <li><Link to="/products/category/monitors" className="text-gray-400 hover:text-white">Monitors</Link></li>
              <li><Link to="/products/category/peripherals" className="text-gray-400 hover:text-white">Peripherals</Link></li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-gray-400 mt-1 mr-3" />
                <span className="text-gray-400">123 Tech Street, Digital City, Vietnam</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="text-gray-400 mr-3" />
                <span className="text-gray-400">Hotline: 1800-1234</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-3" />
                <span className="text-gray-400">support@techstore.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-700 my-6" />
        
        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} TechStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;