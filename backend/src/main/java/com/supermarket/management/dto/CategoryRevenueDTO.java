package com.supermarket.management.dto;

import java.math.BigDecimal;

/**
 * DTO cho doanh thu theo danh mục sản phẩm
 */
public class CategoryRevenueDTO {
    private String category;
    private BigDecimal revenue;
    private Integer quantitySold;
    private Long orderCount;

    public CategoryRevenueDTO() {
    }

    public CategoryRevenueDTO(String category, BigDecimal revenue, Integer quantitySold, Long orderCount) {
        this.category = category;
        this.revenue = revenue;
        this.quantitySold = quantitySold;
        this.orderCount = orderCount;
    }

    // Getters and Setters
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public Integer getQuantitySold() {
        return quantitySold;
    }

    public void setQuantitySold(Integer quantitySold) {
        this.quantitySold = quantitySold;
    }

    public Long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Long orderCount) {
        this.orderCount = orderCount;
    }
}

