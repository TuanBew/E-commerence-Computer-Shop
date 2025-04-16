// frontend/src/components/products/ProductCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { addToCart } from '../../redux/slices/cartSlice';
import { formatCurrency } from '../../utils/formatters';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If product has variants, redirect to product detail page
    if (product.hasVariants) {
      window.location.href = `/product/${product._id}`;
      return;
    }
    
    dispatch(addToCart({
      productId: product._id,
      variantId: product.defaultVariantId,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    }));
  };
  
  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Product badge (New or Best Seller) */}
      {product.isNewProduct && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
          New
        </div>
      )}
      {product.isBestSeller && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
          Best Seller
        </div>
      )}
      
      {/* Product image */}
      <Link to={`/product/${product._id}`} className="block relative h-48 overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="object-contain w-full h-full p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      
      {/* Product info */}
      <div className="p-4">
        <Link to={`/product/${product._id}`} className="block">
          <h3 className="text-gray-900 font-semibold text-sm mb-1 h-10 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Ratings */}
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={index < Math.round(product.avgRating) ? "text-yellow-400" : "text-gray-300"}
                  size={14}
                />
              ))}
            </div>
            <span className="text-gray-500 text-xs ml-1">({product.totalReviews})</span>
          </div>
          
          {/* Price */}
          <div className="mb-3">
            <span className="text-blue-600 font-bold text-lg">{formatCurrency(product.price)}</span>
            
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-sm line-through ml-2">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </Link>
        
        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center transition-colors duration-300"
        >
          <FaShoppingCart className="mr-2" />
          {product.hasVariants ? 'View Options' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;