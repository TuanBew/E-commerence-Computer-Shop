// frontend/src/pages/Home.js

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts, fetchNewProducts, fetchBestSellers } from '../redux/thunks/productThunks';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ProductCard from '../components/products/ProductCard';
import CategoryCard from '../components/products/CategoryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BannerSlider from '../components/home/BannerSlider';

const Home = () => {
  const dispatch = useDispatch();
  const { newProducts, bestSellers, featuredProducts, loading } = useSelector(state => state.products);
  
  useEffect(() => {
    dispatch(fetchNewProducts());
    dispatch(fetchBestSellers());
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);
  
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        }
      },
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
  
  // Main categories data
  const categories = [
    { id: 1, name: 'Laptops', image: '/images/categories/laptops.jpg', slug: 'laptops' },
    { id: 2, name: 'Desktop PCs', image: '/images/categories/desktops.jpg', slug: 'desktops' },
    { id: 3, name: 'Components', image: '/images/categories/components.jpg', slug: 'components' },
    { id: 4, name: 'Monitors', image: '/images/categories/monitors.jpg', slug: 'monitors' },
    { id: 5, name: 'Peripherals', image: '/images/categories/peripherals.jpg', slug: 'peripherals' },
  ];
  
  return (
    <div className="min-h-screen">
      {/* Banner Slider */}
      <BannerSlider />
      
      {/* Categories Section */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
      
      {/* New Products Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">New Products</h2>
            <Link to="/products/new" className="text-blue-600 hover:underline">View All</Link>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Slider {...sliderSettings}>
              {newProducts.map(product => (
                <div key={product._id} className="px-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </section>
      
      {/* Best Sellers Section */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Best Sellers</h2>
            <Link to="/products/best-sellers" className="text-blue-600 hover:underline">View All</Link>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Slider {...sliderSettings}>
              {bestSellers.map(product => (
                <div key={product._id} className="px-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products/featured" className="text-blue-600 hover:underline">View All</Link>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {featuredProducts.slice(0, 10).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Marketing Features */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Genuine Products</h3>
                <p className="text-gray-600">100% authentic products with manufacturer warranty</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Fast Delivery</h3>
                <p className="text-gray-600">Quick nationwide shipping for all orders</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Secure Payment</h3>
                <p className="text-gray-600">Multiple secure payment methods available</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;