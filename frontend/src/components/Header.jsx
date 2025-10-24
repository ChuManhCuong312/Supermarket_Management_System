import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
  const linkStyle = ({ isActive }) => ({
    padding: "8px 16px",
    textDecoration: "none",
    color: isActive ? "#1976d2" : "#333",
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
      backgroundColor: "#fff"
    }}>
      <h1 style={{ margin: 0, fontSize: 20, color: "#1976d2" }}>
        Supermarket Management
      </h1>
      
      <nav style={{ display: "flex", gap: "8px" }}>
        <NavLink to="/dashboard" style={linkStyle}>
          Trang chủ
        </NavLink>
        <NavLink to="/customers" style={linkStyle}>
          Khách hàng
        </NavLink>
        <NavLink to="/employees" style={linkStyle}>
          Nhân Viên
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
      </nav>
    </header>
  );
}

export default Header;
