import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import FeatureCard from '../components/FeatureCard.jsx';

function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    { icon: '🧱', title: 'Quản lý Sản phẩm', description: 'Quản lý danh sách sản phẩm, thêm mới, chỉnh sửa thông tin, xóa sản phẩm', route: '/products' },
    { icon: '🧑‍💼', title: 'Quản lý Khách hàng', description: 'Quản lý danh sách khách hàng, thêm mới, chỉnh sửa thông tin, xóa khách hàng', route: '/customers' },
    { icon: '💼', title: 'Quản lý Nhà cung cấp', description: 'Quản lý danh sách nhà cung cấp, thêm mới, chỉnh sửa thông tin, xóa nhà cung cấp', route: '/suppliers' },
    { icon: '🏬', title: 'Quản lý Nhập kho', description: 'Quản lý danh sách nhập kho, thêm mới, chỉnh sửa thông tin, xóa nhập kho', route: '/imports' },
    { icon: '👥', title: 'Quản lý Nhân viên', description: 'Quản lý danh sách nhân viên, thêm mới, chỉnh sửa thông tin, xóa nhân viên', route: '/employees' },
    { icon: '📦', title: 'Quản lý Đơn hàng', description: 'Quản lý danh sách đơn hàng, thêm mới, chỉnh sửa thông tin, xóa đơn hàng', route: '/orders' },
    { icon: '🧾', title: 'Quản lý Chi tiết đơn hàng', description: 'Quản lý danh sách đơn hàng, thêm mới, chỉnh sửa thông tin, xóa chi tiết đơn hàng', route: '/order-details' }
  ];

  return (
    <div className="dashboard-container">
      {/* Hero full width */}
      <div className="hero-wrapper">
        <Hero onPrimaryClick={() => {}} onSecondaryClick={() => {}} />
      </div>

      {/* Grid card trung tâm */}
      <div className="card-grid">
        {cards.map((c, idx) => (
          <div
            key={idx}
            className="card-item"
            onClick={() => navigate(c.route)}
            role="button"
            aria-label={c.title}
          >
            <FeatureCard icon={c.icon} title={c.title} description={c.description} />
          </div>
        ))}
      </div>

      {/* Inline CSS */}
      <style>{`
        .dashboard-container {
          background-color: #f8f9fa;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Hero full width */
        .hero-wrapper {
          width: 100%;
          background: #f1f8e9;
          padding: 2rem 0;
          display: flex;
          justify-content: center;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 2rem;
          justify-content: center;
          align-content: start;
          margin-top: 2rem;
          width: 100%;
          max-width: 1200px;
          padding: 0 2rem;
          box-sizing: border-box;
        }

        .card-item {
          display: flex;
          justify-content: center;
          cursor: pointer;
        }

        .feature-card {
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          padding: 1.5rem;
          text-align: center;
          width: 100%;
          max-width: 260px;
          transition: all 0.25s ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        }

        .feature-card-icon {
          font-size: 2.2rem;
        }

        .feature-card-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #00cc99;
          margin-top: 0.5rem;
        }

        .feature-card-desc {
          font-size: 0.95rem;
          color: #555;
          margin: 0.75rem 0 1rem 0;
        }

        .btn.btn-ghost {
          background: transparent;
          color: #009973;
          border: 1px solid #00cc99;
          border-radius: 8px;
          padding: 0.4rem 1rem;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .btn.btn-ghost:hover {
          background: #00cc99;
          color: white;
        }

        @media (max-width: 1024px) {
          .card-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 1.5rem;
          }
        }

        @media (max-width: 600px) {
          .card-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
