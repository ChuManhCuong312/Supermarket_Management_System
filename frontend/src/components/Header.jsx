import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
  const linkStyle = ({ isActive }) => ({
    padding: "8px 16px",
    textDecoration: "none",
    color: isActive ? "#66bb6a" : "#fff",
    textShadow: isActive ? "0 0 8px #66bb6a" : "none",
    borderBottom: isActive ? "3px solid #66bb6a" : "none",
    fontWeight: isActive ? 600 : 400,
    borderRadius: "4px",
    margin: "0 4px",
    transition: "all 0.2s",
  });

  return (
    <header style={{ 
      padding: "12px 20px", 
      borderBottom: "1px solid #eee",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#2d6b3d"
    }}>
      <h1 style={{ margin: 0, fontSize: 20, color: "#fff" }}>
        🏪 Supermarket Management
      </h1>
      
      <nav style={{ display: "flex", gap: "8px" }}>
        <NavLink to="/dashboard" style={linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/products" style={linkStyle}>
          Sản phẩm
        </NavLink>
        <NavLink to="/customers" style={linkStyle}>
          Khách hàng
        </NavLink>
        <NavLink to="/employees" style={linkStyle}>
          Nhân viên
        </NavLink>
        <NavLink to="/suppliers" style={linkStyle}>
          Nhà cung cấp
        </NavLink>
        <NavLink to="/imports" style={linkStyle}>
          Nhập kho
        </NavLink>
        <NavLink to="/orders" style={linkStyle}>
          Đơn hàng
        </NavLink>
        <NavLink to="/order-details" style={linkStyle}>
          Chi tiết đơn hàng
        </NavLink>
        <NavLink to="/reports" style={linkStyle}>
          Báo cáo
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
