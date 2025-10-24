import React from 'react';

function Kpi({ label, value, trend }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {trend ? <div className={`kpi-trend ${trend.startsWith('+') ? 'up' : 'down'}`}>{trend}</div> : null}
    </div>
  );
}

function Reports() {
  return (
    <div className="page">
      <div className="section">
        <h2 className="section-title">Báo cáo</h2>
        <div className="kpi-row">
          <Kpi label="Tổng doanh thu" value="₫ 1,250,000,000" trend="+8.2%" />
          <Kpi label="Số đơn hàng" value="12,540" trend="+3.1%" />
          <Kpi label="Khách hàng mới" value="1,245" trend="+1.4%" />
          <Kpi label="Sản phẩm tồn kho" value="8,430" trend="-2.3%" />
        </div>
      </div>

      <div className="section">
        <div className="card">
          <div className="card-header">
            <h3>Hiệu suất theo danh mục</h3>
          </div>
          <div className="card-body">
            <div className="chart-placeholder">Biểu đồ (placeholder)</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <div className="card-header">
            <h3>Top sản phẩm bán chạy</h3>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Đã bán</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Táo Fuji</td>
                    <td>1,234</td>
                    <td>₫ 86,380,000</td>
                  </tr>
                  <tr>
                    <td>Gạo ST25</td>
                    <td>980</td>
                    <td>₫ 45,120,000</td>
                  </tr>
                  <tr>
                    <td>Sữa tươi</td>
                    <td>865</td>
                    <td>₫ 32,450,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;


