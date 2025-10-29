import React, { useState, useEffect } from 'react';
import RevenueChart from './components/RevenueChart';
import TopProductsChart from './components/TopProductsChart';
import EmployeeOrdersChart from './components/EmployeeOrdersChart';
import DashboardStats from './components/DashboardStats';
import '../../styles/reports.css';

export default function ReportsList() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard Tổng Quan' },
    { id: 'revenue', label: 'Báo Cáo Doanh Thu' },
    { id: 'products', label: 'Top Sản Phẩm' },
    { id: 'employees', label: 'Báo Cáo Nhân Viên' }
  ];

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats dateRange={dateRange} />;
      case 'revenue':
        return <RevenueChart dateRange={dateRange} />;
      case 'products':
        return <TopProductsChart dateRange={dateRange} />;
      case 'employees':
        return <EmployeeOrdersChart dateRange={dateRange} />;
      default:
        return <DashboardStats dateRange={dateRange} />;
    }
  };

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <h2 className="header-title">Báo Cáo & Thống Kê</h2>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="date-filter">
        <div className="filter-group">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Đến ngày:</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
          />
        </div>
        <button className="btn-primary">Cập Nhật</button>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}
