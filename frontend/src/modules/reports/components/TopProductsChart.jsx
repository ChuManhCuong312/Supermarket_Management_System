import React, { useState, useEffect } from 'react';
import revenueService from '../revenueService';

export default function TopProductsChart({ dateRange }) {
  const [productsData, setProductsData] = useState({
    topSelling: [],
    lowStock: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('selling');

  useEffect(() => {
    fetchProductsData();
  }, [dateRange]);

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      // Fetch từ API thật
      const [topByRevenueResponse, topByQuantityResponse, categoriesResponse] = await Promise.all([
        revenueService.getTopProductsByRevenue(dateRange.startDate, dateRange.endDate, 10),
        revenueService.getTopProductsByQuantity(dateRange.startDate, dateRange.endDate, 10),
        revenueService.getRevenueByCategory(dateRange.startDate, dateRange.endDate)
      ]);

      const topSelling = (topByRevenueResponse.data || []).map(item => ({
        id: item.productId,
        name: item.productName,
        sold: item.quantitySold || 0,
        revenue: parseFloat(item.revenue) || 0,
        category: item.category
      }));

      const topByQuantity = (topByQuantityResponse.data || []).map(item => ({
        id: item.productId,
        name: item.productName,
        sold: item.quantitySold || 0,
        revenue: parseFloat(item.revenue) || 0,
        category: item.category
      }));

      const categories = (categoriesResponse.data || []).map(item => ({
        name: item.category,
        products: 0, // Không có trong API
        revenue: parseFloat(item.revenue) || 0,
        quantitySold: item.quantitySold || 0
      }));
      
      setProductsData({
        topSelling,
        lowStock: topByQuantity, // Dùng topByQuantity cho lowStock tab
        categories
      });
    } catch (error) {
      console.error('Error fetching products data:', error);
      setProductsData({ topSelling: [], lowStock: [], categories: [] });
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu sản phẩm...</p>
      </div>
    );
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'selling': return productsData.topSelling;
      case 'stock': return productsData.lowStock;
      case 'categories': return productsData.categories;
      default: return productsData.topSelling;
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="products-chart">
      <div className="chart-header">
        <h3>Báo Cáo Sản Phẩm</h3>
        <div className="view-controls">
          <button 
            className={`view-btn ${activeTab === 'selling' ? 'active' : ''}`}
            onClick={() => setActiveTab('selling')}
          >
            Bán Chạy
          </button>
          <button 
            className={`view-btn ${activeTab === 'stock' ? 'active' : ''}`}
            onClick={() => setActiveTab('stock')}
          >
            Theo Số Lượng
          </button>
          <button 
            className={`view-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Theo Danh Mục
          </button>
        </div>
      </div>

      <div className="products-list">
        {currentData.map((item, index) => (
          <div key={item.id || index} className="product-item">
            <div className="product-rank">#{index + 1}</div>
            <div className="product-info">
              <div className="product-name">{item.name}</div>
              <div className="product-details">
                <span className="detail-item">
                  <strong>Đã bán:</strong> {item.sold?.toLocaleString() || item.products} 
                  {item.sold ? ' sản phẩm' : ' sản phẩm'}
                </span>
                <span className="detail-item">
                  <strong>Doanh thu:</strong> {formatCurrency(item.revenue)}
                </span>
                {item.stock && (
                  <span className={`detail-item ${item.stock < 20 ? 'low-stock' : ''}`}>
                    <strong>Tồn kho:</strong> {item.stock} sản phẩm
                  </span>
                )}
              </div>
            </div>
            <div className="product-chart">
              <div className="mini-chart">
                <div 
                  className="chart-bar-mini" 
                  style={{ 
                    height: `${((item.sold || item.products) / Math.max(...currentData.map(p => p.sold || p.products))) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="products-summary">
        <div className="summary-card">
          <h4>Tổng Quan</h4>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Tổng sản phẩm:</span>
              <span className="stat-value">
                {activeTab === 'categories' 
                  ? currentData.reduce((sum, item) => sum + item.products, 0)
                  : currentData.length
                }
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tổng doanh thu:</span>
              <span className="stat-value">
                {formatCurrency(currentData.reduce((sum, item) => sum + item.revenue, 0))}
              </span>
            </div>
            {activeTab === 'stock' && (
              <div className="stat-item">
                <span className="stat-label">Tổng số lượng bán:</span>
                <span className="stat-value">
                  {currentData.reduce((sum, item) => sum + (item.sold || 0), 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
