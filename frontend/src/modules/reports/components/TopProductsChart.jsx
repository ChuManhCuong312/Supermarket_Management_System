import React, { useState, useEffect } from 'react';

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
      // Mock data - replace with actual API calls
      const mockData = {
        topSelling: [
          { id: 1, name: 'Coca Cola 330ml', sold: 1250, revenue: 6250000, stock: 150 },
          { id: 2, name: 'Bánh mì sandwich', sold: 980, revenue: 4900000, stock: 45 },
          { id: 3, name: 'Sữa tươi Vinamilk', sold: 850, revenue: 4250000, stock: 120 },
          { id: 4, name: 'Nước suối Aquafina', sold: 720, revenue: 3600000, stock: 200 },
          { id: 5, name: 'Kẹo cao su Mentos', sold: 650, revenue: 3250000, stock: 80 }
        ],
        lowStock: [
          { id: 6, name: 'Bánh Oreo', sold: 320, revenue: 1600000, stock: 5 },
          { id: 7, name: 'Kẹo dẻo Haribo', sold: 280, revenue: 1400000, stock: 8 },
          { id: 8, name: 'Bánh quy bơ', sold: 450, revenue: 2250000, stock: 12 },
          { id: 9, name: 'Nước cam tươi', sold: 380, revenue: 1900000, stock: 15 },
          { id: 10, name: 'Socola KitKat', sold: 290, revenue: 1450000, stock: 3 }
        ],
        categories: [
          { name: 'Đồ uống', products: 45, revenue: 25000000 },
          { name: 'Bánh kẹo', products: 38, revenue: 18000000 },
          { name: 'Thực phẩm', products: 52, revenue: 32000000 },
          { name: 'Vệ sinh', products: 21, revenue: 15000000 }
        ]
      };
      
      setProductsData(mockData);
    } catch (error) {
      console.error('Error fetching products data:', error);
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
            Tồn Kho Thấp
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
                <span className="stat-label">Sản phẩm sắp hết:</span>
                <span className="stat-value warning">
                  {currentData.filter(item => item.stock < 20).length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
