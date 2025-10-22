import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "10px 12px",
    textDecoration: "none",
    color: isActive ? "#1976d2" : "#333",
    fontWeight: isActive ? 600 : 400,
  });

  return (
    <aside style={{ width: 220, borderRight: "1px solid #eee", padding: 12 }}>
      <nav>
        <NavLink to="/dashboard" style={linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/reports" style={linkStyle}>
          Reports
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
