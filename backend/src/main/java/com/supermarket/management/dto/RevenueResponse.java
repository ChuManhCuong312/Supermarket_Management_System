package com.supermarket.management.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Response DTO cho tổng doanh thu và số đơn hàng
 */
public class RevenueResponse {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private BigDecimal averageOrderValue;
    private LocalDate startDate;
    private LocalDate endDate;

    // Constructors
    public RevenueResponse() {
    }

    public RevenueResponse(BigDecimal totalRevenue, Long totalOrders, BigDecimal averageOrderValue, 
                           LocalDate startDate, LocalDate endDate) {
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders;
        this.averageOrderValue = averageOrderValue;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters and Setters
    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getAverageOrderValue() {
        return averageOrderValue;
    }

    public void setAverageOrderValue(BigDecimal averageOrderValue) {
        this.averageOrderValue = averageOrderValue;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}

