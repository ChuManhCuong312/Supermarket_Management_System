import React from "react";
import { NavLink } from "react-router-dom";

function TopNav() {
  const linkClass = ({ isActive }) =>
    "topnav-link" + (isActive ? " active" : "");

  return (
    <div className="topnav">
      <div className="topnav-inner">
        <div className="brand">
          <span className="brand-icon">🛒</span>
          <span className="brand-name">ÉliteMart</span>
        </div>
        <nav className="menu">
          <NavLink to="/products" className={linkClass}>
            Sản phẩm
          </NavLink>
          <NavLink to="/customers" className={linkClass}>
            Khách hàng
          </NavLink>
          <NavLink to="/suppliers" className={linkClass}>
            Nhà cung cấp
          </NavLink>
          <NavLink to="/employees" className={linkClass}>
            Nhân viên
          </NavLink>
          <NavLink to="/orders" className={linkClass}>
            Đơn hàng
          </NavLink>
          <NavLink to="/order-details" className={linkClass}>
            Chi tiết đơn
          </NavLink>
          <NavLink to="/imports" className={linkClass}>
            Nhập kho
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default TopNav;
