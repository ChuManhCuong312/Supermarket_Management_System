import React, { useState, useEffect } from 'react';

export default function EmployeeOrdersChart({ dateRange }) {
  const [employeesData, setEmployeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('revenue');

  useEffect(() => {
    fetchEmployeesData();
  }, [dateRange]);

  const fetchEmployeesData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockData = [
        {
          id: 1,
          name: 'Nguyễn Văn A',
          position: 'Thu ngân',
          orders: 245,
          revenue: 12500000,
          commission: 625000,
          shift: 'Ca sáng',
          performance: 95
        },
        {
          id: 2,
          name: 'Trần Thị B',
          position: 'Bán hàng',
          orders: 198,
          revenue: 9800000,
          commission: 490000,
          shift: 'Ca chiều',
          performance: 88
        },
        {
          id: 3,
          name: 'Lê Văn C',
          position: 'Thu ngân',
          orders: 156,
          revenue: 7800000,
          commission: 390000,
          shift: 'Ca tối',
          performance: 82
        },
        {
          id: 4,
          name: 'Phạm Thị D',
          position: 'Bán hàng',
          orders: 134,
          revenue: 6700000,
          commission: 335000,
          shift: 'Ca sáng',
          performance: 75
        },
        {
          id: 5,
          name: 'Hoàng Văn E',
          position: 'Thu ngân',
          orders: 112,
          revenue: 5600000,
          commission: 280000,
          shift: 'Ca chiều',
          performance: 68
        }
      ];
      
      setEmployeesData(mockData);
    } catch (error) {
      console.error('Error fetching employees data:', error);
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

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return 'excellent';
    if (performance >= 80) return 'good';
    if (performance >= 70) return 'average';
    return 'poor';
  };

  const getPerformanceLabel = (performance) => {
    if (performance >= 90) return 'Xuất sắc';
    if (performance >= 80) return 'Tốt';
    if (performance >= 70) return 'Trung bình';
    return 'Cần cải thiện';
  };

  const sortData = (data, sortBy) => {
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.revenue - a.revenue;
        case 'orders':
          return b.orders - a.orders;
        case 'performance':
          return b.performance - a.performance;
        default:
          return b.revenue - a.revenue;
      }
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu nhân viên...</p>
      </div>
    );
  }

  const sortedData = sortData(employeesData, sortBy);
  const maxRevenue = Math.max(...employeesData.map(emp => emp.revenue));
  const maxOrders = Math.max(...employeesData.map(emp => emp.orders));

  return (
    <div className="employees-chart">
      <div className="chart-header">
        <h3>Báo Cáo Nhân Viên</h3>
        <div className="sort-controls">
          <label>Sắp xếp theo:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="revenue">Doanh thu</option>
            <option value="orders">Số đơn hàng</option>
            <option value="performance">Hiệu suất</option>
          </select>
        </div>
      </div>

      <div className="employees-list">
        {sortedData.map((employee, index) => (
          <div key={employee.id} className="employee-item">
            <div className="employee-rank">#{index + 1}</div>
            <div className="employee-info">
              <div className="employee-name">{employee.name}</div>
              <div className="employee-position">{employee.position} - {employee.shift}</div>
              <div className="employee-stats">
                <div className="stat-row">
                  <span className="stat-label">Đơn hàng:</span>
                  <span className="stat-value">{employee.orders}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Doanh thu:</span>
                  <span className="stat-value">{formatCurrency(employee.revenue)}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Hoa hồng:</span>
                  <span className="stat-value">{formatCurrency(employee.commission)}</span>
                </div>
              </div>
            </div>
            <div className="employee-performance">
              <div className="performance-bar">
                <div 
                  className="performance-fill" 
                  style={{ width: `${employee.performance}%` }}
                ></div>
              </div>
              <div className={`performance-label ${getPerformanceColor(employee.performance)}`}>
                {employee.performance}% - {getPerformanceLabel(employee.performance)}
              </div>
            </div>
            <div className="employee-chart">
              <div className="mini-chart">
                <div 
                  className="chart-bar-mini" 
                  style={{ 
                    height: `${(employee.revenue / maxRevenue) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="employees-summary">
        <div className="summary-card">
          <h4>Thống Kê Tổng Quan</h4>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Tổng nhân viên:</span>
              <span className="stat-value">{employeesData.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tổng đơn hàng:</span>
              <span className="stat-value">{employeesData.reduce((sum, emp) => sum + emp.orders, 0)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tổng doanh thu:</span>
              <span className="stat-value">{formatCurrency(employeesData.reduce((sum, emp) => sum + emp.revenue, 0))}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Trung bình/người:</span>
              <span className="stat-value">{formatCurrency(employeesData.reduce((sum, emp) => sum + emp.revenue, 0) / employeesData.length)}</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <h4>Phân Loại Hiệu Suất</h4>
          <div className="performance-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Xuất sắc (≥90%):</span>
              <span className="breakdown-value">
                {employeesData.filter(emp => emp.performance >= 90).length} người
              </span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Tốt (80-89%):</span>
              <span className="breakdown-value">
                {employeesData.filter(emp => emp.performance >= 80 && emp.performance < 90).length} người
              </span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Trung bình (70-79%):</span>
              <span className="breakdown-value">
                {employeesData.filter(emp => emp.performance >= 70 && emp.performance < 80).length} người
              </span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Cần cải thiện (<70%):</span>
              <span className="breakdown-value">
                {employeesData.filter(emp => emp.performance < 70).length} người
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
