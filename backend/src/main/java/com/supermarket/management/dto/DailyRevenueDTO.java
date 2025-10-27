package com.supermarket.management.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO cho doanh thu theo ngày
 */
public class DailyRevenueDTO {
    private LocalDate date;
    private BigDecimal revenue;
    private Long orderCount;

    public DailyRevenueDTO() {
    }

    public DailyRevenueDTO(LocalDate date, BigDecimal revenue, Long orderCount) {
        this.date = date;
        this.revenue = revenue;
        this.orderCount = orderCount;
    }

    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public Long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Long orderCount) {
        this.orderCount = orderCount;
    }
}

