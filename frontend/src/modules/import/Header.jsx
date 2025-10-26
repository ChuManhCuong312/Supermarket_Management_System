import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return (
        <div className="header">
            <div className="header-left">
                <span className="header-icon">📥</span>
                <h2 className="header-title">Quản lý nhập kho</h2>
            </div>
        </div>
    );
}