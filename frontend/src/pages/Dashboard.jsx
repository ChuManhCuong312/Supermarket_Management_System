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
    <div className="page">
      <Hero onPrimaryClick={() => {}} onSecondaryClick={() => {}} />

      <div className="card-grid">
        {cards.map((c, idx) => (
          <div key={idx} style={{ cursor: 'pointer' }} onClick={() => navigate(c.route)} role="button" aria-label={c.title}>
            <FeatureCard icon={c.icon} title={c.title} description={c.description} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
