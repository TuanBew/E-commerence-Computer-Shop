// frontend/src/pages/admin/OrderManagementPage.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaEye, 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt,
  FaSortAmountDown,
  FaSortAmountUpAlt
} from 'react-icons/fa';
import { 
  fetchAdminOrders
} from '../../redux/thunks/adminThunks';
import { formatCurrency } from '../../utils/formatters';

import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import OrderDetailModal from '../../components/admin/OrderDetailModal';

const OrderManagementPage = () => {
  const dispatch = useDispatch();
  const { orders, totalOrders, loading, error } = useSelector(state => state.admin);
  
  // Local state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateRange: 'all', // 'today', 'yesterday', 'week', 'month', 'custom'
    startDate: null,
    endDate: null
  });
  const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  
  // Load orders
  useEffect(() => {
    const queryParams = {
      page,
      limit,
      search: searchTerm,
      sort: `${sort.field}_${sort.order}`,
      ...filters
    };
    
    dispatch(fetchAdminOrders(queryParams));
  }, [dispatch, page, limit, searchTerm, sort, filters]);
  
  // Handle view order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };
  
  // Handle filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'dateRange') {
      // Set date range based on selection
      const now = new Date();
      let startDate = null;
      let endDate = null;
      
      switch (value) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          endDate = new Date();
          break;
          
        case 'yesterday':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          
          endDate = new Date(now);
          endDate.setDate(endDate.getDate() - 1);
          endDate.setHours(23, 59, 59, 999);
          break;
          
        case 'week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
          break;
          
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 1);
          break;
          
        case 'custom':
          // Keep existing custom dates
          startDate = filters.startDate;
          endDate = filters.endDate;
          break;
          
        default:
          // 'all' - clear date filters
          startDate = null;
          endDate = null;
      }
      
      setFilters(prev => ({
        ...prev,
        dateRange: value,
        startDate,
        endDate
      }));
    } else if (name === 'startDate' || name === 'endDate') {
      // Handle custom date inputs
      setFilters(prev => ({
        ...prev,
        dateRange: 'custom',
        [name]: value ? new Date(value) : null
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
    
    setPage(1); // Reset to first page on filter change
  };
  
  // Handle sorting
  const handleSort = (field) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
    setPage(1); // Reset to first page on sort change
  };
  
  // Format date for input fields
  const formatDateForInput = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };
  
  return (
    <div className="flex">
      <AdminSidebar />
      
      <div className="flex-1 bg-gray-100 min-h-screen p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by order number or customer..."
                  className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
                >
                  <FaSearch />
                </button>
              </form>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <FaFilter className="text-gray-500 mr-2" />
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <select
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              {filters.dateRange === 'custom' && (
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    name="startDate"
                    value={formatDateForInput(filters.startDate)}
                    onChange={(e) => handleFilterChange(e)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    name="endDate"
                    value={formatDateForInput(filters.endDate)}
                    onChange={(e) => handleFilterChange(e)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('orderNumber')}
                    >
                      <div className="flex items-center">
                        Order Number
                        {sort.field === 'orderNumber' && (
                          sort.order === 'asc' 
                            ? <FaSortAmountUpAlt className="ml-1" />
                            : <FaSortAmountDown className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center">
                        Date
                        {sort.field === 'createdAt' && (
                          sort.order === 'asc' 
                            ? <FaSortAmountUpAlt className="ml-1" />
                            : <FaSortAmountDown className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('total')}
                    >
                      <div className="flex items-center">
                        Total
                        {sort.field === 'total' && (
                          sort.order === 'asc' 
                            ? <FaSortAmountUpAlt className="ml-1" />
                            : <FaSortAmountDown className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.shippingAddress.fullName}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                        <div className="text-xs">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : 
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                        >
                          <FaEye className="mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {orders.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-4 sm:mb-0">
                  <span className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(page * limit, totalOrders)}
                    </span>{' '}
                    of <span className="font-medium">{totalOrders}</span> orders
                  </span>
                </div>
                <Pagination
                  currentPage={page}
                  totalItems={totalOrders}
                  itemsPerPage={limit}
                  onPageChange={setPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Order Detail Modal */}
      {isModalOpen && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default OrderManagementPage;