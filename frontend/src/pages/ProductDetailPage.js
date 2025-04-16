// frontend/src/pages/ProductDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaCheck } from 'react-icons/fa';
import { fetchProductDetails } from '../redux/thunks/productThunks';
import { addToCart } from '../redux/slices/cartSlice';
import { formatCurrency } from '../utils/formatters';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import LoadingSpinner from '../components/common/LoadingSpinner';
import ReviewSection from '../components/products/ReviewSection';
import ProductCard from '../components/products/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { product, relatedProducts, loading, error } = useSelector(state => state.products);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);
  
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    dispatch(addToCart({
      productId: product._id,
      variantId: selectedVariant._id,
      name: product.name,
      price: selectedVariant.price || product.price,
      image: product.images[0],
      attributes: selectedVariant.attributes,
      quantity: quantity
    }));
    
    // Open cart dropdown or navigate to cart page
    navigate('/cart');
  };
  
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };
  
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  if (!product) return <div className="container mx-auto px-4 py-8 text-center">Product not found</div>;
  
  return (
    // frontend/src/pages/ProductDetailPage.js (continued)

    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <div className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-blue-600">Home</a> &gt; 
        <a href={`/category/${product.category.slug}`} className="hover:text-blue-600 mx-1">{product.category.name}</a> &gt; 
        <span className="text-gray-700 ml-1">{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Product images */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg overflow-hidden mb-4">
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-80 object-contain p-4"
            />
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((image, index) => (
              <div 
                key={index}
                className={`border rounded cursor-pointer ${activeImage === index ? 'border-blue-500' : 'border-gray-200'}`}
                onClick={() => setActiveImage(index)}
              >
                <img 
                  src={image} 
                  alt={`${product.name} - view ${index + 1}`} 
                  className="w-full h-16 object-contain p-1"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product info */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={index < Math.round(product.avgRating) ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-blue-600 underline cursor-pointer">
              {product.totalReviews} reviews
            </span>
            <span className="mx-2">|</span>
            <span className="text-green-600 flex items-center">
              <FaCheck className="mr-1" /> In stock
            </span>
          </div>
          
          <div className="text-2xl font-bold text-red-600 mb-4">
            {selectedVariant ? formatCurrency(selectedVariant.price) : formatCurrency(product.price)}
            
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-lg line-through ml-2">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="text-sm text-gray-500 mb-2">SKU: {selectedVariant ? selectedVariant.sku : product.sku}</div>
            <div className="text-sm text-gray-500 mb-2">Brand: <span className="text-blue-600">{product.brand}</span></div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
          
          {/* Variants selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Available Options</h3>
              
              {/* Group variants by attribute type */}
              {Object.entries(product.variantAttributes || {}).map(([attrName, values]) => (
                <div key={attrName} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {attrName}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {values.map(value => {
                      const isSelected = selectedVariant && 
                        selectedVariant.attributes && 
                        selectedVariant.attributes[attrName] === value;
                      
                      return (
                        <button
                          key={value}
                          className={`px-4 py-2 border rounded-md ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50 text-blue-600' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => {
                            // Find variant with this attribute value
                            const newVariant = product.variants.find(v => 
                              v.attributes && v.attributes[attrName] === value
                            );
                            if (newVariant) handleVariantChange(newVariant);
                          }}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Quantity and Add to cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="w-full sm:w-32">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity:
              </label>
              <div className="flex">
                <button 
                  className="bg-gray-200 px-3 py-2 rounded-l-md"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full text-center border-t border-b border-gray-300 py-2"
                />
                <button 
                  className="bg-gray-200 px-3 py-2 rounded-r-md"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors duration-300 disabled:bg-gray-400"
              >
                <FaShoppingCart className="mr-2" />
                {selectedVariant && selectedVariant.stock <= 0 
                  ? 'Out of Stock' 
                  : 'Add to Cart'
                }
              </button>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-4 mb-6">
            <button className="flex items-center text-gray-600 hover:text-red-500">
              <FaHeart className="mr-1" /> Wishlist
            </button>
            <button className="flex items-center text-gray-600 hover:text-blue-500">
              <FaShare className="mr-1" /> Share
            </button>
          </div>
        </div>
      </div>
      
      {/* Product tabs: Description, Specifications, Reviews */}
      <div className="mb-10">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button className="text-blue-600 border-b-2 border-blue-600 py-4 px-6 font-medium">
              Description
            </button>
            <button className="text-gray-500 hover:text-gray-700 py-4 px-6 font-medium">
              Specifications
            </button>
            <button className="text-gray-500 hover:text-gray-700 py-4 px-6 font-medium">
              Reviews ({product.totalReviews})
            </button>
          </nav>
        </div>
        
        <div className="py-6">
          <h3 className="text-xl font-semibold mb-4">Product Description</h3>
          
          <div className="prose max-w-none text-gray-700">
            <p className="mb-4">{product.description}</p>
            
            {/* Additional description details would go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="text-lg font-medium mb-2">Key Features</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.features && product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-2">Package Includes</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>1 x {product.name}</li>
                  <li>User Manual</li>
                  <li>Warranty Card</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related products */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <Slider {...sliderSettings}>
          {relatedProducts.map(product => (
            <div key={product._id} className="px-2">
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>
      </div>
      
      {/* Reviews section */}
      <ReviewSection productId={product._id} />
    </div>
  );
};

export default ProductDetailPage;