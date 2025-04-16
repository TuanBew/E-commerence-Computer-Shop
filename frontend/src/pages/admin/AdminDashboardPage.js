// frontend/src/pages/admin/AdminDashboardPage.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaUsers, 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaBoxOpen, 
  FaChartLine,
  FaChartBar,
  FaCalendarAlt
} from 'react-icons/fa';
import { getDashboardStats } from '../../redux/thunks/adminThunks';
import { formatCurrency } from '../../utils/formatters';

import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/admin/StatCard';
import LineChart from '../../components/admin/charts/LineChart';
import BarChart from '../../components/admin/charts/BarChart';
import PieChart from '../../components/admin/charts/PieChart';
import BestSellingProducts from '../../components/admin/BestSellingProducts';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector(state => state.admin);
  
  const [timeRange, setTimeRange] = useState('year');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1), // Jan 1 of current year
    endDate: new Date()
  });
  
  useEffect(() => {
    dispatch(getDashboardStats({ timeRange, ...dateRange }));
  }, [dispatch, timeRange, dateRange]);
  
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    
    // Update date range based on selected time range
    const now = new Date();
    let startDate;
    
    switch (range) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1); // Jan 1 of current year
        break;
      default:
        startDate = new Date(now.getFullYear(), 0, 1);
    }
    
    setDateRange({ startDate, endDate: now });
  };
  
  const handleDateChange = (e, field) => {
    setDateRange(prev => ({
      ...prev,
      [field]: new Date(e.target.value)
    }));
  };
  
  if (loading && !stats) return <LoadingSpinner />;
  
  return (
    <div className="flex">
      <AdminSidebar />
      
      <div className="flex-1 bg-gray-100 min-h-screen p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Admin</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Time range selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-semibold flex items-center">
                <FaChartLine className="mr-2 text-blue-600" />
                Analytics Overview
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleTimeRangeChange('week')}
                  className={`px-3 py-1 rounded ${timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Week
                </button>
                <button 
                  onClick={() => handleTimeRangeChange('month')}
                  className={`px-3 py-1 rounded ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Month
                </button>
                <button 
                  onClick={() => handleTimeRangeChange('quarter')}
                  className={`px-3 py-1 rounded ${timeRange === 'quarter' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Quarter
                </button>
                <button 
                  onClick={() => handleTimeRangeChange('year')}
                  className={`px-3 py-1 rounded ${timeRange === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Year
                </button>
              </div>
              
              <div className="flex space-x-2 items-center">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-500 mr-2" />
                  <input
                    type="date"
                    value={dateRange.startDate.toISOString().substr(0, 10)}
                    onChange={(e) => handleDateChange(e, 'startDate')}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.endDate.toISOString().substr(0, 10)}
                  onChange={(e) => handleDateChange(e, 'endDate')}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard 
            title="Total Users"
            value={stats?.userStats?.total || 0}
            icon={<FaUsers className="text-blue-600" />}
            change={stats?.userStats?.change || 0}
            changePeriod="vs. previous period"
          />
          
          <StatCard 
            title="Total Orders"
            value={stats?.orderStats?.total || 0}
            icon={<FaShoppingCart className="text-orange-600" />}
            change={stats?.orderStats?.change || 0}
            changePeriod="vs. previous period"
          />
          
          <StatCard 
            title="Total Revenue"
            value={formatCurrency(stats?.revenueStats?.total || 0)}
            icon={<FaMoneyBillWave className="text-green-600" />}
            change={stats?.revenueStats?.change || 0}
            changePeriod="vs. previous period"
          />
          
          <StatCard 
            title="Products Sold"
            value={stats?.productStats?.totalSold || 0}
            icon={<FaBoxOpen className="text-purple-600" />}
            change={stats?.productStats?.change || 0}
            changePeriod="vs. previous period"
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue & Orders Trend */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaChartLine className="mr-2 text-blue-600" />
              Revenue & Orders Trend
            </h3>
            <LineChart 
              data={stats?.revenueOrdersTrend || []}
              xKey="date"
              yKeys={[
                { key: 'revenue', name: 'Revenue', color: '#10B981' },
                { key: 'orders', name: 'Orders', color: '#F59E0B' }
              ]}
            />
          </div>
          
          {/* Product Categories Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaChartBar className="mr-2 text-purple-600" />
              Sales by Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <PieChart 
                  data={stats?.categorySales || []}
                  nameKey="category"
                  dataKey="sales"
                />
              </div>
              <div>
                <div className="space-y-2 mt-4">
                  {stats?.categorySales?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-700">{item.category}</span>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency(item.sales)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sales by Time Period */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaChartBar className="mr-2 text-blue-600" />
              Sales by {timeRange === 'week' ? 'Day' : timeRange === 'month' ? 'Week' : timeRange === 'quarter' ? 'Month' : 'Quarter'}
            </h3>
            <BarChart 
              data={stats?.periodSales || []}
              xKey="period"
              yKey="sales"
              color="#3B82F6"
            />
          </div>
          
          {/* Top Selling Products */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Best Selling Products</h3>
            <BestSellingProducts products={stats?.bestSellingProducts || []} />
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <a href="/admin/orders" className="text-blue-600 hover:underline text-sm">View All</a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats?.recentOrders?.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                      <a href={`/admin/orders/${order._id}`}>{order.orderNumber}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;