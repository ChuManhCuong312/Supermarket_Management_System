import React from "react";

function FeatureCard({
  icon,
  title,
  description,
  onClick,
  ctaLabel = "Xem chi tiết",
}) {
  return (
    <div className="feature-card">
      <div className="feature-card-header">
        <div className="feature-card-icon" aria-hidden>
          {icon}
        </div>
        <div className="feature-card-title">{title}</div>
      </div>
      <p className="feature-card-desc">{description}</p>
      <button className="btn btn-ghost" onClick={onClick}>
        → {ctaLabel}
      </button>
    </div>
  );
}

export default FeatureCard;
