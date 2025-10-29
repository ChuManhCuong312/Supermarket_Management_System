import React, { useState, useEffect } from 'react';
import revenueService from '../revenueService';

export default function DashboardStats({ dateRange }) {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    dailyRevenue: [],
    topCategories: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [dateRange]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch từ API thật
      const [revenueResponse, categoriesResponse, dailyResponse] = await Promise.all([
        revenueService.getTotalRevenue(dateRange.startDate, dateRange.endDate),
        revenueService.getRevenueByCategory(dateRange.startDate, dateRange.endDate),
        revenueService.getDailyRevenue(dateRange.startDate, dateRange.endDate)
      ]);

      const totalRevenue = revenueResponse.data.totalRevenue || 0;
      const totalOrders = revenueResponse.data.totalOrders || 0;
      
      // Calculate categories percentage
      const topCategoriesData = categoriesResponse.data || [];
      const totalCatRevenue = topCategoriesData.reduce((sum, cat) => sum + (parseFloat(cat.revenue) || 0), 0);
      const topCategories = topCategoriesData.map(cat => ({
        name: cat.category,
        revenue: parseFloat(cat.revenue) || 0,
        percentage: totalCatRevenue > 0 ? Math.round((cat.revenue / totalCatRevenue) * 100) : 0
      }));

      // Prepare daily revenue data
      const dailyRevenue = (dailyResponse.data || []).map(item => ({
        date: item.date,
        revenue: parseFloat(item.revenue) || 0
      }));
      
      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers: 0, // Không có trong API
        totalProducts: 0, // Không có trong API
        dailyRevenue,
        topCategories
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to empty data on error
      setStats({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        dailyRevenue: [],
        topCategories: []
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    // Handle BigDecimal from backend
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(num || 0);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-stats">
      {/* Key Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Tổng Doanh Thu</h3>
          </div>
          <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
          <div className="stat-change positive">+12.5% so với tháng trước</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Tổng Đơn Hàng</h3>
          </div>
          <div className="stat-value">{stats.totalOrders.toLocaleString()}</div>
          <div className="stat-change positive">+8.3% so với tháng trước</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Khách Hàng</h3>
          </div>
          <div className="stat-value">{stats.totalCustomers.toLocaleString()}</div>
          <div className="stat-change positive">+15.2% so với tháng trước</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Sản Phẩm</h3>
          </div>
          <div className="stat-value">{stats.totalProducts.toLocaleString()}</div>
          <div className="stat-change neutral">Không đổi</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-container">
          <h3>Doanh Thu Theo Ngày</h3>
          <div className="simple-chart">
            {stats.dailyRevenue.map((item, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar-fill" 
                  style={{ 
                    height: `${(item.revenue / Math.max(...stats.dailyRevenue.map(d => d.revenue))) * 100}%` 
                  }}
                ></div>
                <div className="bar-label">{item.date.split('-')[2]}</div>
                <div className="bar-value">{formatCurrency(item.revenue)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>Doanh Thu Theo Danh Mục</h3>
          <div className="category-chart">
            {stats.topCategories.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-info">
                  <span className="category-name">{category.name}</span>
                  <span className="category-percentage">{category.percentage}%</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-fill" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <div className="category-value">{formatCurrency(category.revenue)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
