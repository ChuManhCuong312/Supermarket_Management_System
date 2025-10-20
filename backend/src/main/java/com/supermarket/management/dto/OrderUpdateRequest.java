package com.supermarket.management.dto;

import java.math.BigDecimal;

public class OrderUpdateRequest {
    private BigDecimal totalAmount;
    private BigDecimal discount;

    // Getters and Setters
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }
}
