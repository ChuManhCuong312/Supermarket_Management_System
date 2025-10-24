import React, { useState, useEffect } from 'react';

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
      // Mock data - replace with actual API calls
      const mockData = {
        totalRevenue: 125000000,
        totalOrders: 1247,
        totalCustomers: 892,
        totalProducts: 156,
        dailyRevenue: [
          { date: '2024-01-01', revenue: 2500000 },
          { date: '2024-01-02', revenue: 3200000 },
          { date: '2024-01-03', revenue: 2800000 },
          { date: '2024-01-04', revenue: 4100000 },
          { date: '2024-01-05', revenue: 3500000 }
        ],
        topCategories: [
          { name: 'Thực phẩm', revenue: 45000000, percentage: 36 },
          { name: 'Đồ uống', revenue: 32000000, percentage: 25.6 },
          { name: 'Vệ sinh', revenue: 28000000, percentage: 22.4 },
          { name: 'Khác', revenue: 20000000, percentage: 16 }
        ]
      };
      
      setStats(mockData);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
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
