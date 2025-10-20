import React from "react";

function Hero({ onPrimaryClick, onSecondaryClick }) {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-icon">🛒</div>
        <h1>Chào mừng đến với hệ thống ÉliteMart</h1>
        <p>
          Hệ thống quản lý siêu thị toàn diện, giúp bạn quản lý sản phẩm, khách
          hàng và đơn hàng hiệu quả
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onPrimaryClick}>
            Quản lý sản phẩm
          </button>
          <button className="btn" onClick={onSecondaryClick}>
            Đơn hàng
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
