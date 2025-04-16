// frontend/src/pages/ProductsPage.js

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, fetchBrands } from '../redux/thunks/productThunks';
import { FaFilter, FaSort, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

import ProductCard from '../components/products/ProductCard';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PriceRangeSlider from '../components/products/PriceRangeSlider';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { products, categories, brands, totalProducts, loading } = useSelector(state => state.products);
  
  // Local state for filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState('createdAt_desc');
  const [filters, setFilters] = useState({
    category: '',
    brand: [],
    price: { min: 0, max: 100000000 }, // Set a very high max price initially
    rating: 0
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
    rating: true
  });
  
  // Parse query params on load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const queryPage = parseInt(searchParams.get('page')) || 1;
    const queryLimit = parseInt(searchParams.get('limit')) || 20;
    const querySort = searchParams.get('sort') || 'createdAt_desc';
    const queryCategory = searchParams.get('category') || '';
    const queryBrands = searchParams.get('brand') ? searchParams.get('brand').split(',') : [];
    const queryMinPrice = parseFloat(searchParams.get('minPrice')) || 0;
    const queryMaxPrice = parseFloat(searchParams.get('maxPrice')) || 100000000;
    const queryRating = parseInt(searchParams.get('rating')) || 0;
    
    setPage(queryPage);
    setLimit(queryLimit);
    setSort(querySort);
    setFilters({
      category: queryCategory,
      brand: queryBrands,
      price: { min: queryMinPrice, max: queryMaxPrice },
      rating: queryRating
    });
    
    // Load initial data
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch, location.search]);
  
  // Fetch products whenever filters change
  useEffect(() => {
    const fetchData = () => {
      const queryParams = {
        page,
        limit,
        sort,
        ...filters.category && { category: filters.category },
        ...filters.brand.length > 0 && { brand: filters.brand.join(',') },
        ...filters.price && { minPrice: filters.price.min, maxPrice: filters.price.max },
        ...filters.rating > 0 && { rating: filters.rating }
      };
      
      dispatch(fetchProducts(queryParams));
      
      // Update URL with current filters
      const searchParams = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          searchParams.set(key, value);
        }
      });
      
      navigate({
        pathname: location.pathname,
        search: searchParams.toString()
      }, { replace: true });
    };
    
    fetchData();
  }, [dispatch, page, limit, sort, filters, navigate, location.pathname]);
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1); // Reset to first page when sort changes
  };
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
    setPage(1); // Reset to first page when filters change
  };
  
  const handleBrandToggle = (brand) => {
    setFilters(prevFilters => {
      const newBrands = [...prevFilters.brand];
      if (newBrands.includes(brand)) {
        // Remove brand if already selected
        return {
          ...prevFilters,
          brand: newBrands.filter(b => b !== brand)
        };
      } else {
        // Add brand if not selected
        return {
          ...prevFilters,
          brand: [...newBrands, brand]
        };
      }
    });
    setPage(1); // Reset to first page when filters change
  };
  
  const clearAllFilters = () => {
    setFilters({
      category: '',
      brand: [],
      price: { min: 0, max: 100000000 },
      rating: 0
    });
    setPage(1);
  };
  
  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Count active filters
  const activeFilterCount = 
    (filters.category ? 1 : 0) + 
    filters.brand.length + 
    (filters.price.min > 0 || filters.price.max < 100000000 ? 1 : 0) + 
    (filters.rating > 0 ? 1 : 0);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {filters.category 
              ? `${categories.find(c => c._id === filters.category)?.name || 'Products'}`
              : 'All Products'
            }
          </h1>
          <p className="text-gray-500 mt-1">
            Showing {products.length} of {totalProducts} products
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
          {/* Filter button - mobile only */}
          <button
            className="md:hidden flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded"
            onClick={toggleFilterVisibility}
          >
            <FaFilter className="mr-2" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
          
          {/* Sort dropdown */}
          <div className="relative w-full sm:w-60">
            <select
              value={sort}
              onChange={handleSortChange}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="createdAt_desc">Newest First</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaSort />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className={`md:block md:w-1/4 lg:w-1/5 bg-white rounded-lg shadow-md p-4 overflow-hidden transition-all duration-300 ${isFilterVisible ? 'block' : 'hidden'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            {activeFilterCount > 0 && (
              <button 
                onClick={clearAllFilters}
                className="text-blue-600 text-sm hover:underline"
              >
                Clear All
              </button>
            )}
          </div>
          
          {/* Categories filter */}
          <div className="mb-6 border-b pb-4">
            <div 
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleSection('categories')}
            >
              <h3 className="font-medium">Categories</h3>
              {expandedSections.categories ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSections.categories && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="category-all"
                    name="category"
                    checked={filters.category === ''}
                    onChange={() => handleFilterChange('category', '')}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="category-all" className="ml-2 text-gray-700">
                    All Categories
                  </label>
                </div>
                
                {categories.map(category => (
                  <div key={category._id} className="flex items-center">
                    <input
                      type="radio"
                      id={`category-${category._id}`}
                      name="category"
                      checked={filters.category === category._id}
                      onChange={() => handleFilterChange('category', category._id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`category-${category._id}`} className="ml-2 text-gray-700">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Brands filter */}
          <div className="mb-6 border-b pb-4">
            <div 
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleSection('brands')}
            >
              <h3 className="font-medium">Brands</h3>
              {expandedSections.brands ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSections.brands && (
              <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
                {brands.map(brand => (
                  <div key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`brand-${brand}`}
                      checked={filters.brand.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`brand-${brand}`} className="ml-2 text-gray-700">
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Price range filter */}
          <div className="mb-6 border-b pb-4">
            <div 
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleSection('price')}
            >
              <h3 className="font-medium">Price Range</h3>
              {expandedSections.price ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSections.price && (
              <div className="mt-4">
                <PriceRangeSlider
                  min={0}
                  max={100000000}
                  value={filters.price}
                  onChange={(value) => handleFilterChange('price', value)}
                />
              </div>
            )}
          </div>
          
          {/* Rating filter */}
          <div className="mb-4">
            <div 
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleSection('rating')}
            >
              <h3 className="font-medium">Rating</h3>
              {expandedSections.rating ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSections.rating && (
              <div className="mt-2 space-y-1">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="radio"
                      id={`rating-${rating}`}
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => handleFilterChange('rating', rating)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`rating-${rating}`} className="ml-2 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < rating ? "text-yellow-400" : "text-gray-300"} 
                          size={16}
                        />
                      ))}
                      <span className="ml-1 text-gray-700">& Up</span>
                    </label>
                  </div>
                ))}
                
                <div className="flex items-center mt-1">
                  <input
                    type="radio"
                    id="rating-0"
                    name="rating"
                    checked={filters.rating === 0}
                    onChange={() => handleFilterChange('rating', 0)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="rating-0" className="ml-2 text-gray-700">
                    All Ratings
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Product grid */}
        <div className="flex-1">
          {/* Active filters */}
          {activeFilterCount > 0 && (
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <span className="text-gray-700 font-medium">Active Filters:</span>
              
              {filters.category && (
                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                  Category: {categories.find(c => c._id === filters.category)?.name}
                  <button 
                    onClick={() => handleFilterChange('category', '')}
                    className="ml-1 text-blue-800 hover:text-blue-900"
                  >
                    <FaTimes />
                  </button>
                </span>
              )}
              
              {filters.brand.map(brand => (
                <span key={brand} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                  Brand: {brand}
                  <button 
                    onClick={() => handleBrandToggle(brand)}
                    className="ml-1 text-blue-800 hover:text-blue-900"
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
              
              {(filters.price.min > 0 || filters.price.max < 100000000) && (
                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                  Price: {filters.price.min.toLocaleString()} - {filters.price.max.toLocaleString()}
                  <button 
                    onClick={() => handleFilterChange('price', { min: 0, max: 100000000 })}
                    className="ml-1 text-blue-800 hover:text-blue-900"
                  >
                    <FaTimes />
                  </button>
                </span>
              )}
              
              {filters.rating > 0 && (
                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                  Rating: {filters.rating}+ Stars
                  <button 
                    onClick={() => handleFilterChange('rating', 0)}
                    className="ml-1 text-blue-800 hover:text-blue-900"
                  >
                    <FaTimes />
                  </button>
                </span>
              )}
              
              <button 
                onClick={clearAllFilters}
                className="text-red-600 text-sm hover:underline ml-auto"
              >
                Clear All
              </button>
            </div>
          )}
          
          {loading ? (
            <LoadingSpinner />
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalItems={totalProducts}
                  itemsPerPage={limit}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <p className="text-gray-500 mb-4">Try adjusting your filters to find what you're looking for.</p>
              <button
                onClick={clearAllFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;