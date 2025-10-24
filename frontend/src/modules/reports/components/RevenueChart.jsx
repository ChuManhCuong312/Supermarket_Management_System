import React, { useState, useEffect } from 'react';

export default function RevenueChart({ dateRange }) {
  const [revenueData, setRevenueData] = useState({
    daily: [],
    monthly: [],
    yearly: []
  });
  const [viewType, setViewType] = useState('daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, [dateRange, viewType]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockData = {
        daily: [
          { date: '2024-01-01', revenue: 2500000, orders: 45 },
          { date: '2024-01-02', revenue: 3200000, orders: 58 },
          { date: '2024-01-03', revenue: 2800000, orders: 52 },
          { date: '2024-01-04', revenue: 4100000, orders: 67 },
          { date: '2024-01-05', revenue: 3500000, orders: 61 },
          { date: '2024-01-06', revenue: 2900000, orders: 48 },
          { date: '2024-01-07', revenue: 3800000, orders: 63 }
        ],
        monthly: [
          { month: '2024-01', revenue: 45000000, orders: 850 },
          { month: '2024-02', revenue: 52000000, orders: 920 },
          { month: '2024-03', revenue: 48000000, orders: 880 },
          { month: '2024-04', revenue: 61000000, orders: 1050 }
        ],
        yearly: [
          { year: '2022', revenue: 450000000, orders: 8500 },
          { year: '2023', revenue: 520000000, orders: 9200 },
          { year: '2024', revenue: 480000000, orders: 8800 }
        ]
      };
      
      setRevenueData(mockData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
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

  const getCurrentData = () => {
    switch (viewType) {
      case 'daily': return revenueData.daily;
      case 'monthly': return revenueData.monthly;
      case 'yearly': return revenueData.yearly;
      default: return revenueData.daily;
    }
  };

  const getMaxRevenue = (data) => {
    return Math.max(...data.map(item => item.revenue));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu doanh thu...</p>
      </div>
    );
  }

  const currentData = getCurrentData();
  const maxRevenue = getMaxRevenue(currentData);

  return (
    <div className="revenue-chart">
      <div className="chart-header">
        <h3>Báo Cáo Doanh Thu</h3>
        <div className="view-controls">
          <button 
            className={`view-btn ${viewType === 'daily' ? 'active' : ''}`}
            onClick={() => setViewType('daily')}
          >
            Theo Ngày
          </button>
          <button 
            className={`view-btn ${viewType === 'monthly' ? 'active' : ''}`}
            onClick={() => setViewType('monthly')}
          >
            Theo Tháng
          </button>
          <button 
            className={`view-btn ${viewType === 'yearly' ? 'active' : ''}`}
            onClick={() => setViewType('yearly')}
          >
            Theo Năm
          </button>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-bars">
          {currentData.map((item, index) => (
            <div key={index} className="chart-bar">
              <div 
                className="bar-fill" 
                style={{ 
                  height: `${(item.revenue / maxRevenue) * 100}%` 
                }}
              ></div>
              <div className="bar-info">
                <div className="bar-label">
                  {viewType === 'daily' ? item.date.split('-')[2] : 
                   viewType === 'monthly' ? item.month.split('-')[1] : 
                   item.year}
                </div>
                <div className="bar-value">{formatCurrency(item.revenue)}</div>
                <div className="bar-orders">{item.orders} đơn</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">Tổng doanh thu:</span>
          <span className="summary-value">
            {formatCurrency(currentData.reduce((sum, item) => sum + item.revenue, 0))}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Tổng đơn hàng:</span>
          <span className="summary-value">
            {currentData.reduce((sum, item) => sum + item.orders, 0).toLocaleString()}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Trung bình/đơn:</span>
          <span className="summary-value">
            {formatCurrency(
              currentData.reduce((sum, item) => sum + item.revenue, 0) / 
              currentData.reduce((sum, item) => sum + item.orders, 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
