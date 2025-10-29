import React, { useState, useEffect } from 'react';
import revenueService from '../revenueService';

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
      // Fetch từ API thật
      const [dailyResponse, monthlyResponse] = await Promise.all([
        revenueService.getDailyRevenue(dateRange.startDate, dateRange.endDate),
        revenueService.getMonthlyRevenue(dateRange.startDate, dateRange.endDate)
      ]);

      const daily = (dailyResponse.data || []).map(item => ({
        date: item.date,
        revenue: parseFloat(item.revenue) || 0,
        orders: item.orderCount || 0
      }));

      const monthly = (monthlyResponse.data || []).map(item => ({
        month: `${item.year}-${String(item.monthNumber).padStart(2, '0')}`,
        revenue: parseFloat(item.revenue) || 0,
        orders: item.orderCount || 0
      }));
      
      setRevenueData({
        daily,
        monthly,
        yearly: [] // Chưa có API theo năm
      });
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      // Fallback to empty data
      setRevenueData({ daily: [], monthly: [], yearly: [] });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(num || 0);
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
