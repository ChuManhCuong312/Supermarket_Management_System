import React from 'react';
import Hero from '../components/Hero.jsx';
import FeatureCard from '../components/FeatureCard.jsx';

function Dashboard() {
  const cards = [
    { icon: '🧱', title: 'Quản lý Sản phẩm', description: 'Quản lý danh sách sản phẩm, thêm mới, chỉnh sửa thông tin, xóa sản phẩm' },
    { icon: '🧑‍💼', title: 'Quản lý Khách hàng', description: 'Quản lý danh sách khách hàng, thêm mới, chỉnh sửa thông tin, xóa khách hàng' },
    { icon: '💼', title: 'Quản lý Nhà cung cấp', description: 'Quản lý danh sách nhà cung cấp, thêm mới, chỉnh sửa thông tin, xóa nhà cung cấp' },
    { icon: '🏬', title: 'Quản lý Nhập kho', description: 'Quản lý danh sách nhập kho, thêm mới, chỉnh sửa thông tin, xóa nhập kho' },
    { icon: '👥', title: 'Quản lý Nhân viên', description: 'Quản lý danh sách nhân viên, thêm mới, chỉnh sửa thông tin, xóa nhân viên' },
    { icon: '📦', title: 'Quản lý Đơn hàng', description: 'Quản lý danh sách đơn hàng, thêm mới, chỉnh sửa thông tin, xóa đơn hàng' },
    { icon: '🧾', title: 'Quản lý Chi tiết đơn hàng', description: 'Quản lý danh sách đơn hàng, thêm mới, chỉnh sửa thông tin, xóa chi tiết đơn hàng' }
  ];

  return (
    <div className="page">
      <Hero onPrimaryClick={() => {}} onSecondaryClick={() => {}} />

      <div className="card-grid">
        {cards.map((c, idx) => (
          <FeatureCard key={idx} icon={c.icon} title={c.title} description={c.description} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;


