package com.supermarket.management.dto;

import java.math.BigDecimal;

/**
 * DTO cho doanh thu theo tháng
 */
public class MonthlyRevenueDTO {
    private String month;
    private Integer year;
    private Integer monthNumber;
    private BigDecimal revenue;
    private Long orderCount;

    public MonthlyRevenueDTO() {
    }

    public MonthlyRevenueDTO(String month, Integer year, Integer monthNumber, 
                             BigDecimal revenue, Long orderCount) {
        this.month = month;
        this.year = year;
        this.monthNumber = monthNumber;
        this.revenue = revenue;
        this.orderCount = orderCount;
    }

    // Getters and Setters
    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonthNumber() {
        return monthNumber;
    }

    public void setMonthNumber(Integer monthNumber) {
        this.monthNumber = monthNumber;
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

